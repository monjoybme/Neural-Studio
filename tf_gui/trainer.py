import re
import base64

import cv2
import pandas as pd
import numpy as np
import tensorflow as tf


from tensorflow import keras
from tensorflow.keras import layers,optimizers,losses,metrics,callbacks
from tensorflow.python.training.tracking.base import no_manual_dependency_tracking_scope

from .builder import build_code

from glob import glob
from concurrent.futures import ThreadPoolExecutor
from typing import List, Any
from json import load,dump
from time import sleep, time
from threading import Thread
from gc import collect


def execute_code(_code:str,logs=lambda log_type,log:None,session_var:dict={})->bool:
    try:
        exec(_code)
        globals().update(locals())
        session_var.update(locals())
        return True
    except ValueError as e:
        print (e)
        logs("error",{ "error":str(e), "code":_code })
        logs("notif",{ "message": "Training stopped", "ended":True })
        return False
    except NameError as e:
        print (e)
        logs("error",{ "error":str(e), "code":_code })
        logs("notif",{ "message": "Training stopped", "ended":True })
        return False
    
class TfGui(keras.callbacks.Callback):
    batch = None 
    epoch = 0
    
    batch_size=8
    batches = 1
    epochs = 1
    
    trainer = None
    halt = False
    output= []
    
    def __repr__(self,):
        return f"""TfGui(\n\tbatch={self.batch},\n\tbatch_size={self.batch_size},\n\tepochs={self.epochs},\m)"""
    
    
    def __init__(self,trainer,):
        self.trainer = trainer
    
    @property
    def status(self,):
        return {
            "epochs":self.epochs,
            "batchs":self.batches
        }

    def stop(self,):
        self.model.stop_training = True
    
    def on_batch_end(self,batch,logs=None):
        self.batch = batch
        self._epoch['log'] = {
            "batch":batch,
            "output":logs
        }
        while self.halt:
            sleep(0.1)
        
    def on_epoch_begin(self,epoch,logs=None):
        self.epoch = epoch
        self._epoch = {
            "epoch":epoch,
            "log":{
                "batch":0,
                "output":None
            },
            "train":{
                "epochs":self.epochs,
                "batches":self.batches
            }
        }
        
        self.trainer.update_log(
            log_type = "epoch",
            log=self._epoch
        )

    def on_epoch_end(self, epoch, logs=None):
        self._epoch['log'] = {
            "batch":self.batch,
            "output":logs
        }   
        while self.halt:
            sleep(1)

    def on_train_end(self, logs):
        self.trainer.update_log(log_type="notif",log={
            "message":"Training Ended",
            "ended":True
        })
        
class Trainer(object):
    
    training = False
    build = False
    
    re_charset =  'a-zA-Z0-9 .\(\)\{\{\[\] \n=\-_\+,\'\:-\<\>#"'
    session_var = {}
    build_config = {}

    logs = []

    _model = False
    _dataset = False
    _model_name = 'Model'
    _dataset_name = 'Dataset'

    def __init__(self,workspace_manager):
        self.workspace_manager = workspace_manager
        globals()['tfgui'] = TfGui(self,)
        self.tfgui = globals()['tfgui']
        self.build_config = {
            "train_config" : {
            "dataset":{
                "value":""
            },
            "optimizer":None,
            "loss":None,
            "callbacks":[],
            
            "model":None,
            "compile":None,
            "train":None
        }
    }

    @property
    def dataset(self,):
        return self._dataset
    
    @property
    def model(self,)->keras.Model:
        return self._model 
        
    @property
    def summary(self, )->List[List[str]]:
        summary = []
        def print_fn(line, *args, **kwargs):
            if not re.match("(_+)|(=+)", line):
                line = re.sub('\n', '', line)
                line  = re.split("   +",line)    
                line += [ '' for i in range( 4 - len(line))]
                summary.append(line)
        self.build_session()
        self.model.summary(line_length=256, print_fn=print_fn)
        return summary
        
    def update_log(self,log_type:str,log:dict):
        self.logs.append({
            "type":log_type,
            "data":log
        })
        
    def build_session(self,):
        build_config,code = build_code(graphdef=self.workspace_manager.active_workspace.var_graphdef,)
        if not build_config:
            self.update_log("error",{ "code":code , "message": code})
            return False
        
        if build_config == self.build_config:
            self.update_log("notif",{"message":"Using current model !"})
            return True
            
        model = build_config['train_config']['model']['id']
        self.update_log("notif",{"message":"Creating new session !"})

        if not build_config:
            self.update_log("notif",{ "message": code })
            self.update_log("notif",{ "message": "Training stopped", "ended":True })
            return False

        self.update_log("notif",{"message":"Copiling Code"})
        self.update_log("notif",{"message":"Performing imports"})
        imports, = re.findall("""#import[a-zA-Z0-9\n .,_\-]+#end-import""",code)
        if not execute_code(imports,self.update_log,self.session_var):
            return False

        if build_config['train_config']['dataset']['value'] != self.build_config['train_config']['dataset']['value']:
            self.update_log("notif",{"message":"Reading Dataset."})
            if not execute_code(build_config['train_config']['dataset']['value'],self.update_log,self.session_var):
                return False

        self.update_log("notif",{"message":"Defining Custom Nodes"})
        for i in range(len(build_config['custom_nodes'])):
            _code, = re.findall(f"""#node_{i}[{self.re_charset}]+#end-node_{i}""",code)
            if not execute_code(_code,logs=self.update_log,session_var=self.session_var):
                return False

        self.update_log("notif",{"message":"Building Model"})
        modeldef, = re.findall(f"""#start-modeldef[{self.re_charset}]+#end-modeldef""", code)
        modeldef = re.sub("\#((start)|(end))-modeldef", "", modeldef)
        for level in build_config['levels']:
            for layer in level:
                _code = re.findall(f"""{layer} =[{self.re_charset}]+#end-{layer}""",modeldef)
                if len(_code):
                    _code, = _code 
                    if not execute_code(_code,self.update_log,session_var=self.session_var):
                        return False
                    
        self.build_config = build_config
        self.code = code
        self._model_name = model
        self._model = self.session_var[model]
    
    def compile_model(self,):
        self.update_log("notif",{"message":"Compiling Model"})
        if self.build_config['train_config']['optimizer']:
            if not execute_code(self.build_config['train_config']['optimizer']['value'],self.update_log,session_var=self.session_var):
                return False

        if self.build_config['train_config']['callbacks']:
            for callback in self.build_config['train_config']['callbacks']:
                if not execute_code(callback['value'],self.update_log,session_var=self.session_var):
                    return False    
        
        if self.build_config['train_config']['loss']:
            if not execute_code(self.build_config['train_config']['loss']['value'],self.update_log,session_var=self.session_var):
                return False

        if self.build_config['train_config']['compile']:
            comp = self.build_config['train_config']['compile']['id']
            if not execute_code(re.findall(f"""{self._model_name}.compile[{self.re_charset}]+#end-{comp}""",self.code)[0],self.update_log,session_var=self.session_var):
                return False

        else:
            self.update_log("notif",{ "message": "Please provide compiler.", "ended":True })
            return False

    def _start_train_thread(self, )->None:
        if self.build_config['train_config']['train']:
            self.tfgui.epochs = int(self.build_config['train_config']['train']['arguments']['epochs']['value'])
            self.tfgui.batch_size = int(self.build_config['train_config']['train']['arguments']['batch_size']['value'])
            try:
                self.tfgui.batches = int(np.ceil(self.session_var[self.build_config['train_config']['dataset']['id']].train_x.__len__() / self.tfgui.batch_size)) - 1
            except KeyError:
                self.update_log("notif",{ "message": "Please configure dataset." })
                self.update_log("notif",{ "message": "Training stopped", "ended":True })
                return False

            train_code, = re.findall(f"""{self._model_name}.fit\([{self.re_charset}]+#end-train_\d+""",self.code)
            if not execute_code(train_code,self.update_log,session_var=self.session_var):
                return False        
            return True
        else:
            self.update_log("notif",{ "message": "Please add Train node" })
            self.update_log("notif",{ "message": "Training stopped", "ended":True })
            return False
    
    def halt(self,state)->None:
        self.tfgui.halt = state
        if state:
            self.update_log("notif",{"message":"Training Paused"})
        else:
            self.update_log("notif",{"message":"Training Resumed"})

    def start(self,)->None:
        self.training = True
        train_thread = Thread(target=self._start_train_thread,)
        train_thread.start()

    def stop(self,):
        self.tfgui.halt = False
        self.tfgui.stop()
        self.update_log("notif",{"message":"Stopped Training"})
    
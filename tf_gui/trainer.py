import re

import pandas as pd
import numpy as np
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers,optimizers,losses,metrics,callbacks,applications

from typing import List
from json import load,dump
from time import sleep, time
from threading import Thread

def execute_code(_code:str)->None:
    try:
        exec(_code)
        globals().update(locals())
    except:
        print (_code)
        pass

class TfGui(keras.callbacks.Callback):
    batch = None 
    epoch = 0
    
    batch_size=8
    batches = 1
    epochs = 1
    
    trainer = None
    halt = False
    
    def __repr__(self,):
        return f"""TfGui(
    batch={self.batch},
    logs={self.logs},
    batch_size={self.batch_size},
    epochs={self.epochs},
)
"""
    
    
    def __init__(self,trainer):
        self.trainer = trainer
    
    @property
    def status(self,):
        return {
            "epochs":self.epochs,
            "batchs":self.batches
        }

    def stop(self,):
        self.model.stop_training = True

    def on_train_begin(self,epoch,logs=None):
        pass
    
    def on_batch_end(self,batch,logs=None):
        self.batch = batch
        self._epoch['log'] = {
            "batch":batch,
            "output":logs
        }
        while self.halt:
            sleep(0.5)
        
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
            sleep(0.5)

    def on_train_end(self, logs):
        self.trainer.update_log(log_type="notif",log={
            "message":"Training Ended",
            "ended":True
        })

class Summary(object):
    def __init__(self):
        pass
    
    
    def get(self,build_config:dict,code:str)->None:
        
        charset = 'a-zA-Z0-9 .\(\)\{\{\[\] \n=\-_\+,\'\"'
        imports, = re.findall("""#import[a-zA-Z\n .,_\-]+#end-import""",code)
        execute_code(imports)
        execute_code(build_config['train_config']['dataset']['value'])
        
        for level in build_config['levels']:
            for layer in level:
                _code = re.findall(f"""{layer} =[{charset}]+#end-{layer}""",code)
                if len(_code):
                    execute_code(_code[0])

        if build_config['train_config']['optimizer']:
            execute_code(build_config['train_config']['optimizer']['value'])

        if build_config['train_config']['callbacks']:
            for callback in build_config['train_config']['callbacks']:
                execute_code(callback['value'])    
        
        if build_config['train_config']['loss']:
            execute_code(build_config['train_config']['loss']['value'])
            
        comp = build_config['train_config']['compile']['id']
        model = build_config['train_config']['model']['id']
        execute_code(re.findall(f"""{model}.compile[{charset}]+#end-{comp}""",code)[0])

        summary = []
        def print_fn(word,*arg,**kwargs):
            summary.append(word,)
            
        model = globals()[model]
        model.summary(line_length=512,print_fn=print_fn)

        return summary[::2]
    
class Trainer(object):
    build_config = {}
    model = keras.Model
    update_id = 0
    
    logs = []

    def __init__(self):
        globals()['tfgui'] = TfGui(self,)
        self.tfgui = globals()['tfgui']
    
    def update_log(self,log_type:str,log):
        self.logs.append({
            "type":log_type,
            "data":log
        })
        
    def _start(self,build_config:dict,code:str)->None:
        
        self.update_log("notif",{"message":"Copiling Code"})
        charset = 'a-zA-Z0-9 .\(\)\{\{\[\] \n=\-_\+,\'\"'
        self.update_log("notif",{"message":"Performing imports"})
        imports, = re.findall("""#import[a-zA-Z\n .,_\-]+#end-import""",code)
        execute_code(imports)
        execute_code(build_config['train_config']['dataset']['value'])
        
        self.update_log("notif",{"message":"Building Model"})
        for level in build_config['levels']:
            for layer in level:
                _code = re.findall(f"""{layer} =[{charset}]+#end-{layer}""",code)
                if len(_code):
                    execute_code(_code[0])

        self.update_log("notif",{"message":"Compiling Model"})

        if build_config['train_config']['optimizer']:
            execute_code(build_config['train_config']['optimizer']['value'])

        if build_config['train_config']['callbacks']:
            for callback in build_config['train_config']['callbacks']:
                execute_code(callback['value'])    
        
        if build_config['train_config']['loss']:
            execute_code(build_config['train_config']['loss']['value'])

        comp = build_config['train_config']['compile']['id']
        model = build_config['train_config']['model']['id']
        execute_code(re.findall(f"""{model}.compile[{charset}]+#end-{comp}""",code)[0])
        
        self.tfgui.epochs = int(build_config['train_config']['train']['arguments']['epochs']['value'])
        self.tfgui.batch_size = int(build_config['train_config']['train']['arguments']['batch_size']['value'])
        self.tfgui.batches = int(np.ceil(globals()[build_config['train_config']['dataset']['id']].train_x.__len__() / self.tfgui.batch_size)) - 1
        
        train_code, = re.findall(f"""{model}.fit\([a-z\n\t =_0-9.,\[\]\)]+#end-train_\d+""",code)
        execute_code(train_code)        
    
    def halt(self,state):
        self.tfgui.halt = state
        if state:
            self.update_log("notif",{"message":"Training Paused"})
        else:
            self.update_log("notif",{"message":"Training Resumed"})

    def start(self,build_config:dict,code:str)->None:
        train_thread = Thread(target=self._start,args=(build_config,code,))
        train_thread.start()
        return 0

    def stop(self,):
        self.tfgui.halt = False
        self.tfgui.stop()
        self.update_log("notif",{"message":"Stopped Training"})
import re
import base64
from threading import Thread

import cv2
import pandas as pd
import numpy as np
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers, callbacks, optimizers, losses, applications

from glob import glob
from gc import collect
from concurrent.futures import ThreadPoolExecutor
from os import path as pathlib
from tqdm.cli import tqdm

from time import sleep
from typing import List, Tuple

from .builder import build_code
from .manage import WorkspaceManager, Workspace
from .graph import GraphDef, LayerMeta


def execute_code(exec_code: str) -> Tuple[dict, str]:
    try:
        _ = exec(exec_code)
        globals().update(locals())
        return locals(), None
    except Exception as e:
        return {}, str(e)


class Dataset:
    """
    Dataset will be used in training 

    The dataset object needs to have following attributes

    train_x : np.ndarray -> Training features
    train_y : np.ndarray -> Training labels 
    test_x : np.ndarray -> Testing features
    test_y : np.ndarray -> Testing labels

    validate : bool -> Weather use validation data or not

    batch_size : int -> Batch size
    epochs : int -> Number of epochs
    batches : int -> Number of batches ( Will be calculated automatically )
    """
    train_x = None
    test_x = None
    train_y = None
    test_y = None

    validate = True

    def __init__(self) -> None:
        """
        Load dataset and set required variables.
        """
        pass


class TfGui(keras.callbacks.Callback):
    batch = None
    epoch = 0

    batch_size = 8
    batches = 1
    epochs = 1

    trainer = None
    halt = False
    output = []

    def __repr__(self,):
        return f"""TfGui(\n\tbatch={self.batch},\n\tbatch_size={self.batch_size},\n\tepochs={self.epochs},\m)"""

    def __init__(self, trainer,):
        self.trainer = trainer

    @property
    def status(self,):
        return {
            "epochs": self.epochs,
            "batchs": self.batches
        }

    def stop(self,):
        self.model.stop_training = True

    def on_batch_end(self, batch, logs=None):
        self.batch = batch
        self._epoch['log'] = {
            "batch": batch,
            "output": logs
        }
        while self.halt:
            sleep(0.1)

    def on_epoch_begin(self, epoch, logs=None):
        self.epoch = epoch
        self._epoch = {
            "epoch": epoch,
            "log": {
                "batch": 0,
                "output": None
            },
            "train": {
                "epochs": self.epochs,
                "batches": self.batches
            }
        }
        self.trainer.update_log(
            log_type="epoch",
            log=self._epoch
        )

    def on_epoch_end(self, epoch, logs=None):
        self._epoch['epochEnd'] = True
        self._epoch['log'] = {
            "batch": self.batch,
            "output": logs
        }
        while self.halt:
            sleep(0.1)

    def on_train_end(self, logs):
        self.trainer.update_log(log_type="notif", log={
            "message": "Training Ended",
            "ended": True
        })
        self.trainer.isTraining = False


class Trainer(object):

    training = False
    build = False

    re_charset = 'a-zA-Z0-9 .\(\)\{\{\[\] \n=\-_\+,\'\:-\<\>#"'
    session_var = {}
    build_config = {}
    isTraining = False

    logs = []

    __model__: keras.Model = False
    __dataset__: Dataset = False
    __model__name__: str = '__model__model__'
    __dataset__name__: str = '__dataset__name__'
    __dataset__code__: str = '__dataset__code__'

    def __init__(self, workspace_manager: WorkspaceManager):
        self.workspace_manager: WorkspaceManager = workspace_manager
        self.session_id = workspace_manager[[
            'active:var_graphdef:train_config:session_id']]
        globals()['tfgui'] = TfGui(self,)
        self.tfgui = globals()['tfgui']

    @property
    def dataset(self,):
        return self.__dataset__

    @property
    def model(self,) -> keras.Model:
        if not self.__model__:
            print(self.build())
        return self.__model__

    @property
    def summary(self, ) -> List[List[str]]:
        summary = []

        def print_fn(line, *args, **kwargs):
            if not re.match("(_+)|(=+)", line):
                line = re.sub('\n', '', line)
                line = re.split("   +", line)
                line += ['' for i in range(4 - len(line))]
                summary.append(line)
        status, error = self.build()
        if status:
            self.model.summary(line_length=256, print_fn=print_fn)
            return summary
        return [[error, '', '', '']]

    def perform_imports(self, import_string: str) -> str:
        pass

    def update_dataset(self, dataset: str = None, idx: str = None, from_workspace: bool = False) -> object:
        if from_workspace:
            dataset = self.workspace_manager[[
                'active:var_graphdef:train_config:dataset:arguments:dataset:value']]
            idx = self.workspace_manager[[
                'active:var_graphdef:train_config:dataset:id']]
        if self.__dataset__code__ == dataset:
            return True, "No update !"
        self.__dataset__code__ = dataset
        exec_var, error = execute_code(self.__dataset__code__)
        if exec_var:
            self.session_var.update(exec_var)
            self.__dataset__name__ = idx
            self.__dataset__ = self.session_var[idx]
            return True, "Dataset updated succesfully"
        return False, error

    def unload_dataset(self, ):
        self.__dataset__code__ = '__dataset__code__'
        self.__dataset__ = False
        self.__dataset__name__ = '__dataset__name__'
        return True, "Removed dataset."

    def update_log(self, log_type: str, log: dict):
        self.logs.append({
            "type": log_type,
            "data": log
        })

    def build(self,):
        self.graph = GraphDef(self.workspace_manager[['active:var_graphdef']])
        build_status, message = self.graph.build()
        if not build_status:
            return build_status, message

        for node in self.graph.__custom__nodes__:
            exec_var, error = execute_code(node[['arguments:code:value']])
            if not exec_var:
                self.update_log("error", {
                    "message": error,
                    "code": node[['arguments:code:value']],
                    "ended": True,
                })
                return False, error
            self.session_var.update(exec_var)

        for level in self.graph.__levels__:
            for layer in level:
                layer = self.graph[layer]
                if layer[['type:object_class']] in ['layers', 'CustomNode']:
                    exec_var, error = execute_code(
                        layer.to_code(self.graph, train=True))
                    if not exec_var:
                        self.update_log("error", {
                            "message": error, 
                            "code": layer.to_code(self.graph, train=True),
                            "ended": True
                        })
                        return False, error
                    self.session_var.update(exec_var)

        exec_var, error = execute_code(
            self.graph.__model__.to_code(self.graph, train=True))
        if not exec_var:
            self.update_log("error", {
                "message": error, 
                "code": self.graph.__model__.to_code(self.graph, train=True),
                "ended": True
            })
            return False, error
        self.session_var.update(exec_var)

        self.__model__name__ = self.graph.__model__.id
        self.__model__ = self.session_var[self.__model__name__]
        return True, "Built successful"

    def compile(self,):
        self.update_log("notif", {"message": "Compiling Model"})
        if not self.graph.__compile__:
            self.update_log(
                "notif", {"message": "Please provide compiler.", "ended": True})
            return False, "Please add compile node."

        if self.graph.__optimizer__:
            exec_var, error = execute_code(
                self.graph.__optimizer__.to_code(self.graph, train=True))
            if not exec_var:
                self.update_log("error", {
                    "message": error,
                    "code": self.graph.__optimizer__.to_code(self.graph, train=True),
                    "ended": True,
                })
                return False, error
            self.session_var.update(exec_var)

        exec_var, error = execute_code(
            self.graph.__compile__.to_code(self.graph, train=True))
        if not exec_var:
            self.update_log("error", {
                "message": error, 
                "code": self.graph.__compile__.to_code(self.graph, train=True),
                "ended": True
            })
            return False, error
        self.session_var.update(exec_var)
        return True, "Model compiled successfully."

    def __train__thread__(self, ) -> None:
        if self.graph.__train__:
            self.isTraining = True
            self.tfgui.epochs = int(
                self.graph.__train__.arguments.epochs.value)
            self.tfgui.batch_size = int(
                self.graph.__train__.arguments.batch_size.value)
            try:
                self.tfgui.batches = int(
                    np.floor(
                        len(self.session_var[self.graph.dataset.id].train_x) / self.tfgui.batch_size)
                )
            except Exception as e:
                self.update_log(
                    "notif", {"message": str(e), "ended": True})
                self.isTraining = False
                return 0

            if self.graph.__callbacks__:
                for callback in self.graph.__callbacks__:
                    exec_var, error = execute_code(
                        callback.to_code(self.graph, train=True),)
                    if not exec_var:
                        self.update_log("error", {
                            "message": error,
                            "code":self.graph.__compile__.to_code(self.graph, train=True), 
                            "ended": True
                        })
                        self.isTraining = False
                        return False, error
                self.session_var.update(exec_var)
            exec_var, error = execute_code(
                self.graph.__train__.to_code(self.graph, train=True),)
            if not exec_var:
                self.update_log("error", {
                    "message": error, 
                    "code": self.graph.__train__.to_code(self.graph, train=True),
                    "ended": True
                })
                self.isTraining = False
                return -1
            self.session_var.update(exec_var)
        else:
            self.update_log(
                "notif", {"message": "Please add Train node", "ended": True})

        return 0

    def halt(self, state) -> None:
        self.tfgui.halt = state
        if state:
            self.update_log("notif", {"message": "Training Paused"})
        else:
            self.update_log("notif", {"message": "Training Resumed"})

    def start(self,) -> None:
        self.train_thread = Thread(target=self.__train__thread__, )
        self.train_thread.start()

    def stop(self,):
        self.tfgui.halt = False
        self.tfgui.stop()
        self.update_log("notif", {"message": "Stopped Training"})

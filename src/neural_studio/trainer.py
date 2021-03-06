import re

import numpy as np

from threading import Thread
from time import sleep
from typing import List, Tuple, Union
from os import path as pathlib

from .manage import WorkspaceManager
from .graph import GraphDef, DatasetDef
from .abc import AbsDataset, AbsOutputVisualizer, AbsTfGui, AbsTrainer, AbsWorkspaceManager

from tensorflow import keras


def execute_code(exec_code: str, gbs: dict = None) -> Tuple[dict, str]:
    try:
        exec(exec_code, gbs or globals())
        globals().update(locals())
        return locals(), None
    except Exception as e:
        return {}, str(e)


output_visualizers = {

}


class OutputVisualizer(AbsOutputVisualizer):
    visualizer: callable

    def __init__( self, problem_type: str = None, *args, **kwargs ):
        super().__init__(*args, **kwargs)

    def on_epoch_end(self, epoch: int, logs: list):
        return

class TfGui(AbsTfGui):
    batch = None
    epoch = 0

    batch_size = 8
    batches = 1
    epochs = 1

    trainer: AbsTrainer = None
    halt = False
    output = []

    def __init__(self, trainer: AbsTrainer):
        self.trainer = trainer

    def __repr__(self,):
        return f"""TfGui(\n\tbatch={self.batch},\n\tbatch_size={self.batch_size},\n\tepochs={self.epochs},\m)"""

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
        self.trainer.model.save(
            pathlib.join(
                self.trainer.workspace_manager.active.path,
                "last_trained.h5"
            )
        )
        while self.halt:
            sleep(0.1)

    def on_train_end(self, logs):
        self.trainer.update_log(log_type="notif", log={
            "message": "Training Ended",
            "ended": True
        })
        self.trainer.is_training = False


class Trainer(AbsTrainer):
    """
    Trainer object 
    """
    training = False
    build = False
    re_charset = 'a-zA-Z0-9 .\(\)\{\{\[\] \n=\-_\+,\'\:-\<\>#"'
    build_config = {}
    is_training = False
    logs = []

    _session_var = { "dataset": False }
    _model: keras.Model = False
    _model_name: str = '_model_model'
    _dataset = None

    def __init__(self, workspace_manager: AbsWorkspaceManager):
        """
        Args:
            workspace_manager: WorkspaceManager object 
        """
        self.workspace_manager: AbsWorkspaceManager = workspace_manager
        self.session_id = workspace_manager[[
            'active:canvas:graph:train_config:session_id']]
        self.tfgui = TfGui(self,)
        self.update_session({
            'tfgui_callback': self.tfgui
        })

    @property
    def dataset(self, ) -> Union[AbsDataset, bool]:
        return self._dataset

    @property
    def model(self,) -> keras.Model:
        if not self._model:
            self.build()
        return self._model

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

    @property
    def session(self,) -> dict:
        return self._session_var

    def update_log(self, log_type: str, log: dict):
        self.logs.append({
            "type": log_type,
            "data": log
        })

    def update_session(self, data: dict) -> None:
        self._session_var.update(data)

    def infer(self, dx: np.ndarray) -> np.ndarray:
        return self.model.predict(dx)

    def build(self,):
        self.graph = GraphDef(self.workspace_manager[['active:canvas:graph']])
        build_status, message = self.graph.build()
        if not build_status:
            return build_status, message

        for node in self.graph.__custom__nodes__:
            exec_var, error = execute_code(
                node[['arguments:code:value']], gbs=self._session_var)
            if not exec_var:
                self.update_log("error", {
                    "message": error,
                    "code": node[['arguments:code:value']],
                    "ended": True,
                })
                return False, error
            self.update_session(exec_var)

        for level in self.graph.__levels__:
            for layer in level:
                layer = self.graph.nodes[layer]
                if layer[['type:object_class']] in ['layers', 'CustomNode', 'applications']:
                    exec_var, error = execute_code(layer.to_code(
                        self.graph, train=True), gbs=self._session_var)
                    if not exec_var:
                        self.update_log("error", {
                            "message": error,
                            "code": layer.to_code(self.graph, train=True),
                            "ended": True
                        })
                        return False, error
                    self.update_session(exec_var)

        exec_var, error = execute_code(self.graph.__model__.to_code(
            self.graph, train=True), gbs=self._session_var)
        if not exec_var:
            self.update_log("error", {
                "message": error,
                "code": self.graph.__model__.to_code(self.graph, train=True),
                "ended": True
            })
            return False, error
        self.update_session(exec_var)
        self._model_name = self.graph.__model__.id
        self._model = self._session_var[self._model_name]
        return True, "Built successful"

    def compile(self,):
        self.update_log("notif", {"message": "Compiling Model"})
        if not self.graph.__compile__:
            self.update_log(
                "notif", {"message": "Please provide compiler.", "ended": True})
            return False, "Please add compile node."

        if self.graph.__optimizer__:
            exec_var, error = execute_code(
                self.graph.__optimizer__.to_code(self.graph, train=True), gbs=self._session_var)
            if not exec_var:
                self.update_log("error", {
                    "message": error,
                    "code": self.graph.__optimizer__.to_code(self.graph, train=True),
                    "ended": True,
                })
                return False, error
            self.update_session(exec_var)

        exec_var, error = execute_code(
            self.graph.__compile__.to_code(self.graph, train=True), gbs=self._session_var)
        if not exec_var:
            self.update_log("error", {
                "message": error,
                "code": self.graph.__compile__.to_code(self.graph, train=True),
                "ended": True
            })
            return False, error
        self.update_session(exec_var)
        return True, "Model compiled successfully."

    def _train_thread(self, ) -> None:
        if self.graph.__train__:
            self.is_training = True
            self.tfgui.epochs = int(
                self.graph.__train__.arguments.epochs.value)
            self.tfgui.batch_size = int(
                self.graph.__train__.arguments.batch_size.value)

            if not self.dataset:
                dataset = DatasetDef(
                    self.workspace_manager.active.dataset.graph)
                status, message = dataset.build()
                if not status:
                    self.update_log(
                        "notif", {"message": message, "ended": True})
                    self.is_training = False
                    return 0
                self._dataset = dataset.dataset
                self.update_session({
                    "dataset": self._dataset
                })

            try:
                self.tfgui.batches = int(
                    np.floor(len(self._session_var.get("dataset").train_x) / self.tfgui.batch_size))
            except Exception as e:
                self.update_log("notif", {"message": str(e), "ended": True})
                self.is_training = False
                return 0

            if self.graph.__callbacks__:
                for callback in self.graph.__callbacks__:
                    exec_var, error = execute_code(callback.to_code(
                        self.graph, train=True), gbs=self._session_var)
                    if not exec_var:
                        self.update_log("error", {
                            "message": error,
                            "code": self.graph.__compile__.to_code(self.graph, train=True),
                            "ended": True
                        })
                        self.is_training = False
                        return False, error
                self.update_session(exec_var)
            exec_var, error = execute_code(
                self.graph.__train__.to_code(self.graph, train=True), gbs=self._session_var)
            if not exec_var:
                self.update_log("error", {
                    "message": error,
                    "code": self.graph.__train__.to_code(self.graph, train=True),
                    "ended": True
                })
                self.is_training = False
                return -1
            self.update_session(exec_var)
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
        self.train_thread = Thread(target=self._train_thread, )
        self.train_thread.start()
        return True, "Training Started"

    def stop(self,):
        self.tfgui.halt = False
        self.tfgui.stop()
        self.update_log("notif", {"message": "Stopped Training"})

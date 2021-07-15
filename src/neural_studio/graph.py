from typing import List, Tuple, Any

from . import datasets
from .structs import DataDict
from .abc import Dataset

CODE_TEMPLATE = (
    """#-*- Code generated by Tensorflow GUI -*-
#import
import pandas as pd
import numpy as np
import cv2
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers,optimizers,losses,metrics,callbacks, applications

from glob import glob
from gc import collect
from concurrent.futures import ThreadPoolExecutor
from os import path as pathlib

#end-import

{dataset}
{custom_nodes}
{layers}
"""
)

TABSPACE = '    '
NEWLINE = '\n'


def set_argument(argument: str, config: dict):
    value = config['value']
    try:
        value = eval(value)
    except:
        pass
    value = (
        (
            None
            if value == 'None'
            else f"'{value}'"
        )
        if config['type'] == 'text'
        else value
    )
    return f"    {argument}={value.__repr__()},"


class LayerMeta(DataDict):
    def __init__(self, config: dict, ):
        self.name: str = "Layer"
        self.id: str = "layer_1"
        self.arguments: dict = DataDict(level=2)
        super().__init__(config)
        self.__name__ = f"Layer {{ {self.name} }}"

    def to_code(self, graphdef: DataDict, train: bool = False) -> str:
        arguments = NEWLINE.join([set_argument(arg, cnf)
                                  for arg, cnf in self['arguments']])
        inbound = (
            (
                (
                    f"""([ {', '.join(self[['connections:inbound']])} ])"""
                    if len(self[['connections:inbound']]) > 1
                    else f"""({self[['connections:inbound']][0]})"""
                )
                if len(self[['connections:inbound']])
                else ''
            )
            if self[['type:name']] != 'Input'
            else ''
        )
        return f"""{self['id']} = {self[['type:object_class']]}.{self[['type:name']]}(\n{arguments}\n){inbound} #end-{self['id']}"""


class ApplicationMeta(DataDict):
    def __init__(self, config: dict, ):
        self.name: str = "Layer"
        self.id: str = "layer_1"
        self.arguments: dict = DataDict(level=2)
        super().__init__(config)
        self.__name__ = f"Layer {{ {self.name} }}"

    def to_code(self, graphdef: DataDict, train: bool = False) -> str:
        arguments = NEWLINE.join([set_argument(arg, cnf)
                                  for arg, cnf in self['arguments']])
        inbound, *_ = self[['connections:inbound']]
        return f"""{self['id']} = applications.{self[['type:name']]}(\n{TABSPACE}input_tensor={inbound},\n{arguments}\n).output #end-{self['id']}"""


class CustomNodeMeta(DataDict):
    def __init__(self, config: dict, ):
        self.name: str = "Layer"
        self.id: str = "layer_1"
        self.arguments: dict = DataDict(level=2)
        super().__init__(config)
        self.__name__ = f"Layer {{ {self.name} }}"

    def to_code(self, graphdef: DataDict, train: bool = False) -> str:
        arguments = NEWLINE.join([set_argument(arg, cnf)
                                  for arg, cnf in self['arguments']])
        inbound = (
            (
                "([" + ", ".join(self[['connections:inbound']]) + "])"
                if len(self[['connections:inbound']]) > 1
                else self[['connections:inbound']][0]
            )
            if len(self[['connections:inbound']])
            else ""
        )
        return f"""{self['id']} = {self[['type:name']]}(\n{TABSPACE}{inbound},\n{arguments}\n) #end-{self['id']}"""


class DatasetMeta(DataDict):
    def __init__(self, dataset: dict):
        self.name: str = "Dataset"
        self.id: str = "dataset"
        self.arguments: dict = DataDict(
            dataset=DataDict(
                value='__dataset__',
                level=3
            ),
            level=2
        )
        super().__init__(dataset)
        self.__name__ = f"Dataset {{ {self.name} }}"

    def to_code(self, grapdef: DataDict = None, train: bool = False) -> str:
        return self.arguments.dataset.value


class ModelMeta(DataDict):
    def __init__(self, config: dict):
        self.name: str = "Model"
        self.id: str = "model"
        self.arguments: dict = DataDict()
        super().__init__(config)
        self.__name__ = f"Model {{ {self.name} }}"

    def to_code(self, graphdef: DataDict, train: bool = False) -> str:
        return f"""{self['id']} = keras.Model(\n{TABSPACE}[ {', '.join(graphdef.__input__)}, ],\n{TABSPACE}[ {', '.join(self[['connections:inbound']])}, ]\n) #end-{self['id']}"""


class CompileMeta(DataDict):
    def __init__(self, config: dict):
        self.name: str = "Compile"
        self.id: str = "compile"
        self.arguments: dict = DataDict(
            loss=DataDict(
                value='None',
                render="text",
                options="loss",
                type='str',
                level=3
            ),
            optimizer=DataDict(
                value='rmsprop',
                render="text",
                options="optimizer",
                type='str',
                level=3
            ),
            metrics=DataDict(
                value=[],
                render="checkbox",
                options="metrics",
                type='str',
                level=3
            ),
            level=2
        )
        super().__init__(config)
        self.__name__ = f"Compile {{ {self.name} }}"

    def to_code(self, graphdef: DataDict, train: bool = False) -> str:
        metrics = self[['arguments:metrics:value']]
        metrics = "[\"" + '", "'.join(metrics) + \
            "\"]" if len(metrics) else 'None'

        optimizer = (
            graphdef.__optimizer__['id']
            if graphdef.__optimizer__
            else f"'{self[['arguments:optmizer:value']]}'"
        )

        optimizer_code = (
            graphdef.__optimizer__.to_code(graphdef) + NEWLINE * 2
            if graphdef.__optimizer__
            else f""
        )

        if train:
            return f"""{graphdef.__model__['id']}.compile(
    optimizer={optimizer},
    loss='{self[['arguments:loss:value']]}',
    metrics={metrics}
) #end-{self['id']}"""

        return f"""{optimizer_code}{graphdef.__model__['id']}.compile(
    optimizer={optimizer},
    loss='{self[['arguments:loss:value']]}',
    metrics={metrics}
) #end-{self['id']}"""


class FitMeta(DataDict):
    def __init__(self, config: dict):
        self.name: str = "Train"
        self.id: str = "train"
        self.arguments: dict = DataDict(
            epochs=DataDict(
                value='8',
                render="text",
                options="epochs",
                type='int',
                level=3
            ),
            batch_size=DataDict(
                value='rmsprop',
                render="text",
                options="optimizer",
                type='str',
                level=3
            ),
            level=2
        )
        super().__init__(config)
        self.__name__ = f"Train {{ {self.name} }}"

    def to_code(self, graphdef: DataDict, train: bool = False) -> str:
        callbacks = (NEWLINE * 2).join([callback.to_code(graphdef)
                                        for callback in graphdef.__callbacks__])
        callback_ids = [callback['id'] for callback in graphdef.__callbacks__]
        if train:
            return f"""{graphdef.__model__['id']}.fit(
    x=dataset.train_x,
    y=dataset.train_y,
    batch_size={self[['arguments:batch_size:value']]},
    epochs={self[['arguments:epochs:value']]},
    validation_data=( dataset.test_x, dataset.test_y ),
    callbacks=[ tfgui_callback, {', '.join(callback_ids)} ],
    verbose=0
) #end-{self['id']}
"""

        return f"""{callbacks}{ NEWLINE * 2 if len(callbacks) else '' }{graphdef.__model__['id']}.fit(
    x=dataset.train_x,
    y=dataset.train_y,
    batch_size={self[['arguments:batch_size:value']]},
    epochs={self[['arguments:epochs:value']]},
    validation_data=( dataset.test_x, dataset.test_y ),
    callbacks=[ tfgui, {', '.join(callback_ids)} ],
    verbose=0
) #end-{self['id']}
"""


class DatasetDef(DataDict):
    _dataset: Dataset = False

    def __init__(self, datasetdef: dict):
        super().__init__(datasetdef)

    def __repr__(self,):
        return f"""DatasetDef(\n\tsession={self[['train_config:session_id']]}\n)"""

    def _abs(self, value: dict) -> Any:
        if value['type'] == "tuple":
            return eval(value['value'])

        return value['value']

    def build(self, ):
        self.__layers__ = []
        for idx, layer in self.nodes:
            if layer[["type:object_class"]] == "dataset":
                instance = getattr(datasets, layer[['type:name']])
                arguments = {
                    key: self._abs(value)
                    for key, value
                    in layer.arguments
                }
                self._dataset = instance(**arguments)
            self.__layers__.append(idx)

        if not self._dataset:
            return False, "Please add dataset !"
        return True, "Build successful"

    def to_code(self, ):
        pass

    @property
    def dataset(self, ):
        return self._dataset


class GraphDef(DataDict):
    __optimizer__ = False

    def __init__(self, graphdef: dict):
        super().__init__(graphdef)

    def __repr__(self,):
        return f"""GraphDef(\n\tsession={self[['train_config:session_id']]}\n)"""

    def build(self, ):
        self.__layers__ = []
        self.__input__ = []
        self.__custom__nodes__ = []
        self.__callbacks__ = []

        for idx, layer in self.nodes:
            if layer[["type:object_class"]] == 'layers':
                self.nodes[idx] = LayerMeta(dict(layer))
                if layer[['type:name']] == 'Input':
                    self.__input__.append(idx)

            elif layer[['type:object_class']] == 'CustomNode':
                self.nodes[idx] = CustomNodeMeta(dict(layer))

            elif layer[['type:object_class']] == 'applications':
                self.nodes[idx] = ApplicationMeta(dict(layer))

            elif layer[["type:object_class"]] == 'callbacks':
                self.nodes[idx] = LayerMeta(dict(layer))
                self.__callbacks__.append(self.nodes[idx])

            elif layer[["type:object_class"]] == 'optimizers':
                self.nodes[idx] = LayerMeta(dict(layer))
                self.__optimizer__ = self.nodes[idx]

            elif layer[["type:object_class"]] == 'build_tools':
                if layer[['type:name']] == 'Model':
                    self.nodes[idx] = ModelMeta(dict(layer))
                    self.__model__ = self.nodes[idx]

                elif layer[['type:name']] == 'Compile':
                    self.nodes[idx] = CompileMeta(dict(layer))
                    self.__compile__ = self.nodes[idx]

                elif layer[['type:name']] == 'Fit':
                    self.nodes[idx] = FitMeta(dict(layer))
                    self.__train__ = self.nodes[idx]
                else:
                    pass

            elif layer[['type:object_class']] == 'custom_def':
                self.__custom__nodes__.append(LayerMeta(dict(layer)))
            else:
                pass
            self.__layers__.append(idx)

        if not len(self.__input__):
            return False, "Please add input node."

        self.__skip__ = []
        self.__levels__ = [set() for _ in self.__layers__]

        def setLevel(node, di=0):
            if node not in self.__skip__:
                self.__levels__[di].add(node)
                self.__skip__.append(node)
            if self[[f'nodes:{node}:connections:outbound']]:
                for next_node in self[[f'nodes:{node}:connections:outbound']]:
                    setLevel(next_node, di+1)

        for node in self.__input__:
            setLevel(node, 0)

        self.__levels__ = [list(level)
                           for level in self.__levels__ if len(level)]
        return True, "Build successful"

    @property
    def dataset(self, ) -> DatasetMeta:
        return self[['train_config:dataset']]

    def to_code(self, ):
        layers = ''
        for level in self.__levels__:
            for layer in level:
                try:
                    layers += self.nodes[layer].to_code(self, )
                    layers += NEWLINE * 2
                except Exception as e:
                    return layer, e
        custom_nodes = [node[['arguments:code:value']]
                        for node in self.__custom__nodes__]
        return CODE_TEMPLATE.format(
            layers=layers,
            dataset="",
            custom_nodes='\n'.join(custom_nodes)
        )
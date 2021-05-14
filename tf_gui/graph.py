from typing import List, Tuple, Any

from .utils import Dict

CODE_TEMPLATE = (
    """#-*- Code generated by Tensorflow GUI -*-
#import
import pandas as pd
import numpy as np
import cv2
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers,optimizers,losses,metrics,callbacks, applications
#end-import

{dataset}
{custom_nodes}
{layers}
"""
)

TABSPACE = '    '
NEWLINE = '\n'

TABSPACE = '    '
NEWLINE = '\n'

def set_argument(argument:str, config:dict):
    value = config['value']
    try: value = eval(value)
    except: pass
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


class LayerMeta(Dict):
    def __init__(self, config: dict, ):
        self.name: str = "Layer"
        self.id: str = "layer_1"
        self.arguments: dict = Dict(level=2)
        super().__init__(config)
        self.__name__ = f"Layer {{ {self.name} }}"

    def to_code(self, graphdef: Dict, train:bool=False) -> str:
        arguments = NEWLINE.join([set_argument(arg, cnf) for arg, cnf in self['arguments']]) 
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

class CustomNodeMeta(Dict):
    def __init__(self, config:dict, ):
        self.name:str = "Layer"
        self.id:str = "layer_1"
        self.arguments:dict = Dict(level=2)
        super().__init__(config)
        self.__name__ = f"Layer {{ {self.name} }}"
        
    def to_code(self, graphdef:Dict)->str:
        arguments = NEWLINE.join([ set_argument(arg,cnf) for arg,cnf in self['arguments'] ])
        inbound =  (
            ( 
                "([" + ", ".join(self[['connections:inbound']]) + "])" 
                    if len(self[['connections:inbound']]) > 1 
                    else "(" + self[['connections:inbound']][0] + ")" 
            ) 
                if len(self[['connections:inbound']]) 
                else ""
        )
        return f"""{self['id']} = {self[['type:name']]}(\n{arguments}\n){inbound} #end-{self['id']}""" 

class DatasetMeta(Dict):
    def __init__(self, dataset: dict):
        self.name: str = "Dataset"
        self.id: str = "dataset"
        self.arguments: dict = Dict(
            dataset=Dict(
                value='__dataset__',
                level=3
            ),
            level=2
        )
        super().__init__(dataset)
        self.__name__ = f"Dataset {{ {self.name} }}"

    def to_code(self, grapdef:Dict=None , train:bool=False) -> str:
        return self.arguments.dataset.value


class ModelMeta(Dict):
    def __init__(self, config: dict):
        self.name: str = "Model"
        self.id: str = "model"
        self.arguments: dict = Dict()
        super().__init__(config)
        self.__name__ = f"Model {{ {self.name} }}"

    def to_code(self, graphdef: Dict, train:bool=False) -> str:
        return f"""{self['id']} = keras.Model(\n{TABSPACE}[ {', '.join(graphdef.__input__)}, ],\n{TABSPACE}[ {', '.join(self[['connections:inbound']])}, ]\n) #end-{self['id']}"""

class CompileMeta(Dict):
    def __init__(self, config: dict):
        self.name: str = "Compile"
        self.id: str = "compile"
        self.arguments: dict = Dict(
            loss=Dict(
                value='None',
                render="text",
                options="loss",
                type='str',
                level=3
            ),
            optimizer=Dict(
                value='rmsprop',
                render="text",
                options="optimizer",
                type='str',
                level=3
            ),
            metrics=Dict(
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

    def to_code(self, graphdef: Dict, train:bool=False) -> str:
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


class TrainMeta(Dict):
    def __init__(self, config: dict):
        self.name: str = "Train"
        self.id: str = "train"
        self.arguments: dict = Dict(
            epochs=Dict(
                value='8',
                render="text",
                options="epochs",
                type='int',
                level=3
            ),
            batch_size=Dict(
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

    def to_code(self, graphdef: Dict, train:bool=False) -> str:
        callbacks = (NEWLINE * 2).join([callback.to_code(graphdef)
                                        for callback in graphdef.__callbacks__])
        callback_ids = [callback['id'] for callback in graphdef.__callbacks__]
        if train:
            return f"""{graphdef.__model__['id']}.fit(
    x={graphdef.dataset['id']}.train_x,
    y={graphdef.dataset['id']}.train_y,
    batch_size={self[['arguments:batch_size:value']]},
    epochs={self[['arguments:epochs:value']]},
    validation_data=( {graphdef.dataset['id']}.test_x, {graphdef.dataset['id']}.test_y ),
    callbacks=[ tfgui, {', '.join(callback_ids)} ],
    verbose=0
) #end-{self['id']}
"""

        return f"""{callbacks}{ NEWLINE * 2 if len(callbacks) else '' }{graphdef.__model__['id']}.fit(
    x={graphdef.dataset['id']}.train_x,
    y={graphdef.dataset['id']}.train_y,
    batch_size={self[['arguments:batch_size:value']]},
    epochs={self[['arguments:epochs:value']]},
    validation_data=( {graphdef.dataset['id']}.test_x, {graphdef.dataset['id']}.test_y ),
    callbacks=[ tfgui, {', '.join(callback_ids)} ],
    verbose=0
) #end-{self['id']}
"""


class GraphDef(Dict):
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
        for idx, layer in self:
            try:
                if layer[["type:object_class"]] == 'layers':
                    self[idx] = LayerMeta(layer.dict)
                    if layer[['type:name']] == 'Input':
                        self.__input__.append(idx)
                elif layer[['type:object_class']] == 'CustomNode':
                    self[idx] = CustomNodeMeta(layer.dict)
                elif layer[["type:object_class"]] == 'callbacks':
                    self[idx] = LayerMeta(layer.dict)
                    self.__callbacks__.append(self[idx])
                elif layer[["type:object_class"]] == 'optimizers':
                    self[idx] = LayerMeta(layer.dict)
                    self.__optimizer__ = self[idx]
                elif layer[['type:name']] == 'Model':
                    self[idx] = ModelMeta(layer.dict)
                    self.__model__ = self[idx]
                elif layer[['type:name']] == 'Compile':
                    self[idx] = CompileMeta(layer.dict)
                    self.__compile__ = self[idx]
                elif layer[['type:name']] == 'Train':
                    self[idx] = TrainMeta(layer.dict)
                    self.__train__ = self[idx]
                elif layer[['type:name']] == 'Custom':
                    self.__custom__nodes__.append(LayerMeta(layer.dict))
                else:
                    pass
                self.__layers__.append(idx)
            except KeyError as e:
                pass

        if not len(self.__input__):
            return False, "Please add input node."

        self.__skip__ = []
        self.__levels__ = [set() for i in self.__layers__]

        def setLevel(node, di=0):
            if node not in self.__skip__:
                self.__levels__[di].add(node)
                self.__skip__.append(node)
            if self[[f'{node}:connections:outbound']]:
                for next_node in self[[f'{node}:connections:outbound']]:
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
        dataset = self[['train_config:dataset:arguments:dataset:value']]
        layers = ''
        for level in self.__levels__:
            for layer in level:
                try:
                    layers += self[layer].to_code(self, )
                    layers += NEWLINE * 2
                except:
                    return layer
        custom_nodes = [node[['arguments:code:value']]
                        for node in self.__custom__nodes__]
        return CODE_TEMPLATE.format(
            layers=layers,
            dataset=self.dataset[['arguments:dataset:value']],
            custom_nodes='\n'.join(custom_nodes)
        )
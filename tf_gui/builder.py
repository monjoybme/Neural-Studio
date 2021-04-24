from typing import Tuple

def build_inbound(inbound:list)->str:
    return ( "([" + ", ".join(inbound) + "])" if len(inbound) > 1 else "(" + inbound[0] + ")" ) if len(inbound) else ""

def set_argument(argument,config):
    value = config['value']
    try:
        value = eval(value)
    except:
        pass
    value = ( None if value == 'None' else f"'{value}'" ) if config['type'] == 'text' else value
    return f"    {argument}={value.__repr__()},"
    
def build_arguments(arguments:dict)->str:
    arguments = '\n'.join([ set_argument(arg,cnf) for arg,cnf in arguments.items() ])
    return arguments

def build_default(layer,build_config,*args,**kwargs)->str:
    arguments =  build_arguments(layer['arguments'])
    inbound = build_inbound(layer['connections']['inbound']) if layer['type']['name'] != 'Input' else '' 
    
    return f"""{layer['id']} = {layer['type']['_class']}.{layer['type']['name']}(
{arguments}
){inbound} #end-{layer['id']}
"""

def build_custom_node(layer,build_config,*args,**kwargs)->str:
    arguments =  build_arguments(layer['arguments'])
    inbound = layer['connections']['inbound'] 
    inbound = "[ " + ", ".join(inbound) + " ]" if len(inbound) > 1 else inbound[0]
                            
    return f"""{layer['id']} = {layer['type']['_class']}(
    inbound={inbound},
{arguments}
) #end-{layer['id']}
"""

def build_application(layer,build_config,*args,**kwargs)->str:
    arguments =  build_arguments(layer['arguments'])
    inbound = build_inbound(layer['connections']['inbound']) if layer['type']['name'] != 'Input' else '' 
    return f"""{layer['id']} = applications.{layer['type']['_class']}(
    input_tensor={layer['connections']['inbound'][0]},
{arguments}
    include_top=False
).output #end-{layer['id']}
"""

def build_model(layer,build_config,*args,**kwargs)->str:
    build_config['train_config']['model'] = layer
    return f"""{layer['id']} = keras.Model(
    [ {', '.join(build_config['input_nodes'])}, ],
    [ {', '.join(layer['connections']['inbound'])}, ]
) #end-{layer['id']}
"""

def build_compile(layer,build_config,*args,**kwargs)->str:
    build_config['train_config']['compile'] = layer
    model,*_ = [node for node in layer['connections']['inbound'] if "model" in node]
    metrics = layer['arguments']['metrics']['value']
    metrics = "[\"" + '", "'.join(metrics) + "\"]" if len(metrics) else 'None'
    
    train_config = build_config['train_config']
    return f"""{train_config['optimizer']['value'] if train_config['optimizer'] else ''}
{model}.compile(
    optimizer={train_config['optimizer']['id'] if train_config['optimizer'] else "'"+layer['arguments']['optmizer']['value']+"'"},
    loss='{layer['arguments']['loss']['value']}',
    metrics={metrics}
) #end-{layer['id']}
"""

def build_train(layer,build_config,*args,**kwargs)->str:
    callbacks = [callback['value'] for callback in build_config['train_config']['callbacks']]
    callback_ids = [callback['id'] for callback in build_config['train_config']['callbacks']]
    build_config['train_config']['train'] = layer
    
    return f"""{"".join(callbacks)}
{build_config['train_config']['model']['id']}.fit(
    x={build_config['train_config']['dataset']['id']}.train_x,
    y={build_config['train_config']['dataset']['id']}.train_y,
    batch_size={layer['arguments']['batch_size']['value']},
    epochs={layer['arguments']['epochs']['value']},
    validation_data=( {build_config['train_config']['dataset']['id']}.test_x, {build_config['train_config']['dataset']['id']}.test_y ),
    callbacks=[ tfgui, {', '.join(callback_ids)} ],
    verbose=0
) #end-{layer['id']}
"""

build_functions = {
    "default":build_default,
    "Model":build_model,
    "Compile":build_compile,
    "Train":build_train,
    "Application":build_application,
    "Node":build_custom_node
}

def build_code(build_config:dict)->Tuple[dict,str]:
    inputs = []
    custom_nodes = []
    train_config = {
        "dataset":None,
        "optimizer":None,
        "loss":None,
        "callbacks":[],
        
        "model":None,
        "compile":None,
        "train":None
    }

    for _id,config in build_config.items():
        if config['type']['name'] == 'Input':
            inputs.append(_id)
            
        elif config['type']['name'] == 'Dataset':
            train_config['dataset'] = _id
                
        elif config['type']['name'] == 'Model':
            train_config['model'] = _id
            
        elif config['type']['name'] == 'Loss':
            train_config['loss'] = _id
        
        elif config['type']['name'] == 'Custom':
            custom_nodes.append(config)

        if config['type']['_class'] == 'optimizers':
            train_config['optimizer'] = _id
            
        elif config['type']['_class'] == 'callbacks':
            train_config['callbacks'].append(_id)
    
    if not len(inputs):
        return False,"Please add Input node."

    node_inject = [  ]
    for i,node in enumerate(custom_nodes):
        node_inject.append(f"""#node_{i}
{node['arguments']['code']['value']}
#end-node_{i}""")

    custom_node_code = "\n".join(node_inject)
        
    build_config['train_config'] = train_config
    build_config['input_nodes'] = inputs
    build_config['custom_nodes'] = custom_nodes
    
    skip = []
    levels = [ set() for i in range(len(build_config))]

    def setLevel(node,config,di=0):
        if node not in skip:
            levels[di].add(node)
            skip.append(node)
        
        if build_config[node]['connections']['outbound']:
            for next_node in build_config[node]['connections']['outbound']: 
                setLevel(next_node,build_config,di+1)

    for inp in inputs:
        setLevel(inp,build_config,0)
        
    levels = [list(level) for level in levels if len(level)]    
    for level in levels:
        for idx,layer in enumerate(level):
            for jdx,conn in enumerate(level[idx+1:]):
                if conn in build_config[layer]['connections']['inbound']:
                    level[jdx+idx+1],level[idx] = layer,conn
                
    build_config['levels'] = levels

    levels = [list(level) for level in levels if len(level)]
    for key,val in train_config.items():
        if val != None:
            if key == 'dataset':
                train_config['dataset'] = {
                    "id":val,
                    "value":build_config[val]['arguments']['dataset']['value']
                }
            elif key == 'optimizer':
                train_config['optimizer'] = {
                    'id':val,
                    'value':build_default(build_config[val],build_config)+'\n'
                }
            elif key == 'callbacks':
                callbacks = []
                for callback in train_config['callbacks']:
                    callbacks.append({
                        "id":callback,
                        "value":build_default(build_config[callback],build_config)
                    })
                train_config['callbacks'] = callbacks
                
    build = ''

    for level in levels:
        for layer in level:
            layer = build_config[layer]
            if layer['type']['name'] in build_functions: 
                build += build_functions[layer['type']['name']](layer,build_config) + '\n\n'
            else:
                build += build_functions['default'](layer,build_config) + '\n\n'
                
    build = build[:-2]

    code = """#-*- Code generated by Tensorflow GUI -*-
#import
import pandas as pd
import numpy as np
import cv2
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers,optimizers,losses,metrics,callbacks, applications

from concurrent.futures import ThreadPoolExecutor
from glob import glob
from gc import collect
#end-import

{dataset}

{custom_node_code}
{build}
""".format(
dataset=train_config['dataset']['value'],
build=build,
custom_node_code=custom_node_code
)
    return build_config,code


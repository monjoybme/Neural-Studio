import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers,optimizers,losses

def build_inbound(inbound:list)->str:
    inbound = [ f"""build_config['train']['{node}']""" for node in inbound ]
    return ( "([" + ", ".join(inbound) + "])" if len(inbound) > 1 else "(" + inbound[0] + ")" ) if len(inbound) else ""

def set_argument(argument,config):
    value = config['value']
    value = ( None if value == 'None' else f"'{value}'" ) if config['type'] == 'text' else value
    return f"    {argument}={value},"
    
def build_arguments(arguments:dict)->str:
    arguments = '\n'.join([ set_argument(arg,cnf) for arg,cnf in arguments.items() ])
    return arguments

def build_input(layer,build_config,*args,**kwargs)->str:
    arguments =  build_arguments(layer['arguments'])
    return eval(f"""layers.Input(
{arguments}
)
""")

def build_dense(layer,build_config,*args,**kwargs)->str:
    arguments =  build_arguments(layer['arguments'])
    inbound = build_inbound(layer['connections']['inbound'])
    
    return eval(f"""layers.{layer['type']}(
{arguments}
){inbound}
""")

def build_conv2d(layer,build_config,*args,**kwargs)->str:
    arguments =  build_arguments(layer['arguments'])
    inbound = build_inbound(layer['connections']['inbound'])
    
    return eval(f"""layers.{layer['type']}(
{arguments}
){inbound}
""")

def build_globalaverage2d(layer,build_config,*args,**kwargs)->str:
    inbound = layer['connections']['inbound']
    inbound = build_inbound(layer['connections']['inbound'])
    
    return eval(f"""layers.{layer['type']}(){inbound}""")

def build_model(layer,build_config,*args,**kwargs)->str:
    in_nodes = [ f"""build_config['train']['{node}']""" for node in build_config['input_nodes']]
    out_nodes = [ f"""build_config['train']['{node}']""" for node in layer['connections']['inbound']]
    return eval(f"""keras.Model(
    [ {', '.join(in_nodes)}, ],
    [ {', '.join(out_nodes)}, ]
)""")

def build_compile(layer,build_config,*args,**kwargs)->str:
    model, = layer['connections']['inbound']
    eval(f"""
build_config['train']['{model}'].compile(
    optimizer='{layer['arguments']['optmizer']['value']}',
    loss='{layer['arguments']['loss']['value']}'
)""")
    return True

def build_train(layer,build_config,*args,**kwargs)->str:
    return ""

build_functions = {
    "Input":build_input,
    "Conv2D":build_conv2d,
    "GlobalAveragePooling2D":build_globalaverage2d,
    "Dense":build_dense,
    "Model":build_model,
    "Compile":build_compile,
    "Train":build_train
}

def build_trainer(build_config)->dict:
    inputs = []
    for _id,config in build_config.items():
        if config['type'] == 'Input':
            inputs.append(_id)
            
    build_config['input_nodes'] = inputs
    levels = [ set() for i in range(len(build_config))]
    def setLevel(node,config,di=0):
        levels[di].add(node)
        if build_config[node]['connections']['outbound']:
            for next_node in build_config[node]['connections']['outbound']: 
                setLevel(next_node,build_config,di+1)

    for inp in inputs:
        setLevel(inp,build_config,0)
        
    build_config['levels'] = levels
    levels = [list(level) for level in levels if len(level)]
    
    build_config['train'] = {
    
    }

    for level in levels:
        for layer in level:
            layer = build_config[layer]
            layer_build = build_functions[layer['type']](layer,build_config) 
            build_config['train'][layer['id']] = layer_build
        
    return build_config
    

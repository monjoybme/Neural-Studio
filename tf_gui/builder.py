def build_model(build_config)->str:
    """
    Build Function

    returns code for the graph
    """
    inputs = []

    for _id,config in build_config.items():
        if config['name'] == 'Input':
            inputs.append(_id)
    
    levels = [ set() for i in range(len(build_config))]

    def set_level(node,config,di=0):
        levels[di].add(node)
        if build_config[node]['connections']['outbound']:
            for next_node in build_config[node]['connections']['outbound']: 
                set_level(next_node,build_config,di+1)
    
    for node in inputs:
        set_level(node,build_config,0)
    levels = [list(level) for level in levels if len(level)]

    model_config = None
    compile_config = None
    train_config = None

    def create_layer(layer_id,layer_config):
        arguments = ",\n".join([ 
            f'\t{arg}={val}' for arg,val in layer_config['arguments'].items()  
        ])
        
        input_layers = layer_config['connections']['inbound']
        input_layers = '[' + ', '.join(input_layers) + ']' if len(input_layers) > 1 else ( input_layers[0] if len(input_layers) else None )
        
        return f"""{layer} = layer.{layer_config['name']}(
{arguments}
){ '(' + input_layers + ')' if input_layers else ''}\n\n"""

    build = ""

    for level in levels:
        for layer in level:
            build += create_layer(layer,build_config[layer]) 
    # model = f"model = keras.Model([{ ', '.join(inputs) },], [{ ', '.join(levels[-1]) },])"
    model = ''
    code = """
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers,optimizers,losses,metrics,models

{build}

{model}
"""
    return code.format(build=build,model=model)
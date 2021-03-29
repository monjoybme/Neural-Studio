const example = {
    "layer_0": {
        "id": "layer_0",
        "name": "Input",
        "pos": {
            "x": 306,
            "y": 12
        },
        "connections": {
            "inbound": [],
            "outbound": [
                "layer_1"
            ]
        },
        "arguments": {
            "shape": "None",
            "batch_size": "None",
            "name": "None",
            "dtype": "None",
            "sparse": "False",
            "tensor": "None",
            "ragged": "False"
        }
    },
    "layer_1": {
        "id": "layer_1",
        "name": "Dense",
        "pos": {
            "x": 297,
            "y": 100
        },
        "connections": {
            "inbound": [
                "layer_0"
            ],
            "outbound": [
                "layer_7"
            ]
        },
        "arguments": {
            "units": "REQUIRED",
            "activation": "None",
            "use_bias": "True",
            "kernel_initializer": "glorot_uniform",
            "bias_initializer": "zeros",
            "kernel_regularizer": "None",
            "bias_regularizer": "None",
            "activity_regularizer": "None",
            "kernel_constraint": "None",
            "bias_constraint": "None"
        }
    },
    "layer_7": {
        "id": "layer_7",
        "name": "Activation",
        "pos": {
            "x": 315,
            "y": 182
        },
        "connections": {
            "inbound": [
                "layer_1"
            ],
            "outbound": [
                "layer_10"
            ]
        },
        "arguments": {}
    },
    "layer_8": {
        "id": "layer_8",
        "name": "Activation",
        "pos": {
            "x": 412,
            "y": 359
        },
        "connections": {
            "inbound": [
                "layer_10"
            ],
            "outbound": [
                "layer_11"
            ]
        },
        "arguments": {}
    },
    "layer_9": {
        "id": "layer_9",
        "name": "Activation",
        "pos": {
            "x": 571,
            "y": 521
        },
        "connections": {
            "inbound": [
                "layer_11"
            ],
            "outbound": []
        },
        "arguments": {}
    },
    "layer_10": {
        "id": "layer_10",
        "name": "Dense",
        "pos": {
            "x": 358,
            "y": 276
        },
        "connections": {
            "inbound": [
                "layer_7"
            ],
            "outbound": [
                "layer_8"
            ]
        },
        "arguments": {
            "units": "REQUIRED",
            "activation": "None",
            "use_bias": "True",
            "kernel_initializer": "glorot_uniform",
            "bias_initializer": "zeros",
            "kernel_regularizer": "None",
            "bias_regularizer": "None",
            "activity_regularizer": "None",
            "kernel_constraint": "None",
            "bias_constraint": "None"
        }
    },
    "layer_11": {
        "id": "layer_11",
        "name": "Dense",
        "pos": {
            "x": 458,
            "y": 445
        },
        "connections": {
            "inbound": [
                "layer_8"
            ],
            "outbound": [
                "layer_9"
            ]
        },
        "arguments": {
            "units": "REQUIRED",
            "activation": "None",
            "use_bias": "True",
            "kernel_initializer": "glorot_uniform",
            "bias_initializer": "zeros",
            "kernel_regularizer": "None",
            "bias_regularizer": "None",
            "activity_regularizer": "None",
            "kernel_constraint": "None",
            "bias_constraint": "None"
        }
    }
}

const activations = [
    { name: "None" },
    { name: "relu"  },
    { name: "sigmoid"  },
    { name: "softmax"  },
    { name: "swish"  },
    { name: "tanh"  },
]

const boolList = [
    { name:"True" },
    { name:"False" },
]

const kernelInitializers = [
    { name : 'glorot_uniform',},
    { name : 'glorot_normal',},
    { name : 'he_normal',},
    { name : 'he_uniform',},
    { name : 'identity',},
    { name : 'lecun_normal',},
    { name : 'lecun_uniform',},
    { name : 'ones',},
    { name : 'orthogonal',},
    { name : 'random_normal',},
    { name : 'random_uniform',},
    { name : 'serialize',},
    { name : 'truncated_normal',},
    { name : 'variance_scaling',},
    { name : 'zeros', }
]

const kernelRegularizer = [
    { name: "None" },
    { name :'l1', },
    { name :'l1_l2', },
    { name :'l2', },
]

const convPaddingList = [
    { name : "valid", },
    { name : "same", },
]

const optimizerList = [   
    {'name': 'adadelta',},
    {'name': 'adagrad',},
    {'name': 'adam',},
    {'name': 'adamax',},
    {'name': 'ftrl',},
    {'name': 'nadam',},
    {'name': 'optimizer',},
    {'name': 'rmsprop',},
    {'name': 'sgd',}
]

const lossList = [
    {'name': 'binary_crossentropy',},
    {'name': 'categorical_crossentropy',},
    {'name': 'categorical_hinge',},
    {'name': 'cosine_similarity',},
    {'name': 'deserialize',},
    {'name': 'hinge',},
    {'name': 'huber',},
    {'name': 'kl_divergence',},
    {'name': 'kld',},
    {'name': 'kullback_leibler_divergence',},
    {'name': 'log_cosh',},
    {'name': 'logcosh',},
    {'name': 'mae',},
    {'name': 'mape',},
    {'name': 'mean_absolute_error',},
    {'name': 'mean_absolute_percentage_error',},
    {'name': 'mean_squared_error',},
    {'name': 'mean_squared_logarithmic_error',},
    {'name': 'mse',},
    {'name': 'msle',},
    {'name': 'poisson',},
    {'name': 'serialize',},
    {'name': 'sparse_categorical_crossentropy',},
    {'name': 'squared_hinge',}
]

const layerGroups = {
    "core-layers": {
        "name": "Core layers",
        "layers": [
            {
                "name": "Input",
                "args": {
                    "shape": {
                        value:"None",
                        type:"tuple",
                        render:"text",
                    },
                    "batch_size": {
                        value:"None",
                        type:"number",
                        render:"text"
                    },
                    "name": {
                        value:"None",
                        type:"text",
                        render:"text"
                    },
                    "dtype": {
                        value:"None",
                        type:"text",
                        render:"text"
                    },
                    "sparse": {
                        value:"False",
                        type:"bool",
                        render:"list",
                        options:boolList
                    },
                    "tensor": {
                        value:"None",
                        type:"text",
                        render:false
                    },
                    "ragged": {
                        value:"False",
                        type:"bool",
                        render:"list",
                        options:boolList
                    },
                }
            },
            {
                "name": "Dense",
                "args": {
                    "units": {
                        value:"REQUIRED",
                        type:"number",
                        render:"text"
                    },
                    "activation": {
                        value:"None",
                        type:"text",
                        render:"list",
                        options:activations
                    },
                    "use_bias": {
                        value:"True",
                        type:"bool",
                        render:"list",
                        options:boolList
                    },
                    "kernel_initializer": {
                        value:"glorot_uniform",
                        type:"text",
                        render:"list",
                        options:kernelInitializers
                    },
                    "bias_initializer": {
                        value:"zeros",
                        type:"text",
                        render:"list",
                        options:kernelInitializers
                    }
                }
            },
            {
                "name": "Activation",
                "args": {
                    "activation":{
                        value:"None",
                        type:"list",
                        render:"list",
                        options:activations
                    },
                }
            }
        ]
    },
    "convolution-layers": {
        "name": "Convolution layers",
        "layers": [
            {
                "name": "Conv2D",
                "args": {
                    "filters": {
                        value:"REQUIRED",
                        type:"number",
                        render:"text",
                    },
                    "kernel_size": {
                        value:"REQUIRED",
                        type:"number",
                        render:"text",
                    },
                    "strides": {
                        value:"1",
                        type:"number",
                        render:"text",
                    },
                    "padding": {
                        value:"valid",
                        type:"text",
                        render:"list",
                        options:convPaddingList
                    },
                    "activation": {
                        value:"None",
                        type:"text",
                        render:"list",
                        options:activations
                    },
                    "use_bias": {
                        value:"True",
                        type:"bool",
                        render:"list",
                        options:boolList
                    },
                    "kernel_initializer": {
                        value:"glorot_uniform",
                        type:"text",
                        render:"list",
                        options:kernelInitializers
                    },
                    "bias_initializer": {
                        value:"zeros",
                        type:"text",
                        render:"list",
                        options:kernelInitializers
                    }
                }
            },
        ]
    },
    "pooling-layers": {
        "name": "Pooling layers",
        "layers": [
            {
                "name": "MaxPooling2D",
                "args": {
                    pool_size:{
                        value:"(2, 2)",
                        type:"text",
                        render:"text",
                    }, 
                    "strides": {
                        value:"None",
                        type:"number",
                        render:"text",
                    }, 
                    "padding": {
                        value:"valid",
                        type:"list",
                        render:"list",
                        options:convPaddingList
                    },
                }
            },
            {
                "name": "GlobalAveragePooling2D",
                "args": {}
            },
        ]
    },
    "build-layers":{
        "name":"Build Tools",
        "layers":[
            {
                "name":"Model",
                "args":{
                    
                }
            },
            {
                "name":"Compile",
                "args":{
                    "optmizer":{
                        value:"rmsprop",
                        type:"list",
                        render:"list",
                        options: optimizerList
                    },
                    "loss":{
                        value:"None",
                        type:"list",
                        render:"list",
                        options: lossList
                    }
                }
            },
            {
                "name":"Train",
                "args":{
                    
                }
            }
        ]
    }
}
export {layerGroups, example};
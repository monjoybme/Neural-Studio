const example = {
    "input_1": {
        "id": "input_1",
        "name": "Input 1",
        "type": "Input",
        "pos": {
            "x": 312,
            "y": 12
        },
        "connections": {
            "inbound": [],
            "outbound": [
                "conv2d_1"
            ]
        },
        "arguments": {
            "shape": {
                "value": "( 28, 28, 1)",
                "type": "tuple",
                "render": "text"
            },
            "batch_size": {
                "value": "None",
                "type": "number",
                "render": "text"
            },
            "name": {
                "value": "None",
                "type": "text",
                "render": "text"
            },
            "dtype": {
                "value": "None",
                "type": "text",
                "render": "text"
            },
            "sparse": {
                "value": "False",
                "type": "bool",
                "render": "list",
                "options": [
                    {
                        "name": "True"
                    },
                    {
                        "name": "False"
                    }
                ]
            },
            "tensor": {
                "value": "None",
                "type": "text",
                "render": false
            },
            "ragged": {
                "value": "False",
                "type": "bool",
                "render": "list",
                "options": [
                    {
                        "name": "True"
                    },
                    {
                        "name": "False"
                    }
                ]
            }
        }
    },
    "conv2d_1": {
        "id": "conv2d_1",
        "name": "Conv2D 1",
        "type": "Conv2D",
        "pos": {
            "x": 391,
            "y": 124
        },
        "connections": {
            "inbound": [
                "input_1"
            ],
            "outbound": [
                "conv2d_2"
            ]
        },
        "arguments": {
            "filters": {
                "value": "32",
                "type": "number",
                "render": "text"
            },
            "kernel_size": {
                "value": "3",
                "type": "number",
                "render": "text"
            },
            "strides": {
                "value": "2",
                "type": "number",
                "render": "text"
            },
            "padding": {
                "value": "same",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "valid"
                    },
                    {
                        "name": "same"
                    }
                ]
            },
            "activation": {
                "value": "relu",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "None"
                    },
                    {
                        "name": "relu"
                    },
                    {
                        "name": "sigmoid"
                    },
                    {
                        "name": "softmax"
                    },
                    {
                        "name": "swish"
                    },
                    {
                        "name": "tanh"
                    }
                ]
            },
            "use_bias": {
                "value": "True",
                "type": "bool",
                "render": "list",
                "options": [
                    {
                        "name": "True"
                    },
                    {
                        "name": "False"
                    }
                ]
            },
            "kernel_initializer": {
                "value": "glorot_uniform",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "glorot_uniform"
                    },
                    {
                        "name": "glorot_normal"
                    },
                    {
                        "name": "he_normal"
                    },
                    {
                        "name": "he_uniform"
                    },
                    {
                        "name": "identity"
                    },
                    {
                        "name": "lecun_normal"
                    },
                    {
                        "name": "lecun_uniform"
                    },
                    {
                        "name": "ones"
                    },
                    {
                        "name": "orthogonal"
                    },
                    {
                        "name": "random_normal"
                    },
                    {
                        "name": "random_uniform"
                    },
                    {
                        "name": "serialize"
                    },
                    {
                        "name": "truncated_normal"
                    },
                    {
                        "name": "variance_scaling"
                    },
                    {
                        "name": "zeros"
                    }
                ]
            },
            "bias_initializer": {
                "value": "zeros",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "glorot_uniform"
                    },
                    {
                        "name": "glorot_normal"
                    },
                    {
                        "name": "he_normal"
                    },
                    {
                        "name": "he_uniform"
                    },
                    {
                        "name": "identity"
                    },
                    {
                        "name": "lecun_normal"
                    },
                    {
                        "name": "lecun_uniform"
                    },
                    {
                        "name": "ones"
                    },
                    {
                        "name": "orthogonal"
                    },
                    {
                        "name": "random_normal"
                    },
                    {
                        "name": "random_uniform"
                    },
                    {
                        "name": "serialize"
                    },
                    {
                        "name": "truncated_normal"
                    },
                    {
                        "name": "variance_scaling"
                    },
                    {
                        "name": "zeros"
                    }
                ]
            }
        }
    },
    "conv2d_2": {
        "id": "conv2d_2",
        "name": "Conv2D 2",
        "type": "Conv2D",
        "pos": {
            "x": 399,
            "y": 233
        },
        "connections": {
            "inbound": [
                "conv2d_1"
            ],
            "outbound": [
                "globalaveragepooling2d_1"
            ]
        },
        "arguments": {
            "filters": {
                "value": "32",
                "type": "number",
                "render": "text"
            },
            "kernel_size": {
                "value": "3",
                "type": "number",
                "render": "text"
            },
            "strides": {
                "value": "2",
                "type": "number",
                "render": "text"
            },
            "padding": {
                "value": "same",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "valid"
                    },
                    {
                        "name": "same"
                    }
                ]
            },
            "activation": {
                "value": "relu",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "None"
                    },
                    {
                        "name": "relu"
                    },
                    {
                        "name": "sigmoid"
                    },
                    {
                        "name": "softmax"
                    },
                    {
                        "name": "swish"
                    },
                    {
                        "name": "tanh"
                    }
                ]
            },
            "use_bias": {
                "value": "True",
                "type": "bool",
                "render": "list",
                "options": [
                    {
                        "name": "True"
                    },
                    {
                        "name": "False"
                    }
                ]
            },
            "kernel_initializer": {
                "value": "glorot_uniform",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "glorot_uniform"
                    },
                    {
                        "name": "glorot_normal"
                    },
                    {
                        "name": "he_normal"
                    },
                    {
                        "name": "he_uniform"
                    },
                    {
                        "name": "identity"
                    },
                    {
                        "name": "lecun_normal"
                    },
                    {
                        "name": "lecun_uniform"
                    },
                    {
                        "name": "ones"
                    },
                    {
                        "name": "orthogonal"
                    },
                    {
                        "name": "random_normal"
                    },
                    {
                        "name": "random_uniform"
                    },
                    {
                        "name": "serialize"
                    },
                    {
                        "name": "truncated_normal"
                    },
                    {
                        "name": "variance_scaling"
                    },
                    {
                        "name": "zeros"
                    }
                ]
            },
            "bias_initializer": {
                "value": "zeros",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "glorot_uniform"
                    },
                    {
                        "name": "glorot_normal"
                    },
                    {
                        "name": "he_normal"
                    },
                    {
                        "name": "he_uniform"
                    },
                    {
                        "name": "identity"
                    },
                    {
                        "name": "lecun_normal"
                    },
                    {
                        "name": "lecun_uniform"
                    },
                    {
                        "name": "ones"
                    },
                    {
                        "name": "orthogonal"
                    },
                    {
                        "name": "random_normal"
                    },
                    {
                        "name": "random_uniform"
                    },
                    {
                        "name": "serialize"
                    },
                    {
                        "name": "truncated_normal"
                    },
                    {
                        "name": "variance_scaling"
                    },
                    {
                        "name": "zeros"
                    }
                ]
            }
        }
    },
    "globalaveragepooling2d_1": {
        "id": "globalaveragepooling2d_1",
        "name": "GlobalAveragePooling2D 1",
        "type": "GlobalAveragePooling2D",
        "pos": {
            "x": 342,
            "y": 345
        },
        "connections": {
            "inbound": [
                "conv2d_2"
            ],
            "outbound": [
                "dense_1"
            ]
        },
        "arguments": {}
    },
    "dense_1": {
        "id": "dense_1",
        "name": "Dense 1",
        "type": "Dense",
        "pos": {
            "x": 422,
            "y": 470
        },
        "connections": {
            "inbound": [
                "globalaveragepooling2d_1"
            ],
            "outbound": [
                "model_1"
            ]
        },
        "arguments": {
            "units": {
                "value": "10",
                "type": "number",
                "render": "text"
            },
            "activation": {
                "value": "softmax",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "None"
                    },
                    {
                        "name": "relu"
                    },
                    {
                        "name": "sigmoid"
                    },
                    {
                        "name": "softmax"
                    },
                    {
                        "name": "swish"
                    },
                    {
                        "name": "tanh"
                    }
                ]
            },
            "use_bias": {
                "value": "False",
                "type": "bool",
                "render": "list",
                "options": [
                    {
                        "name": "True"
                    },
                    {
                        "name": "False"
                    }
                ]
            },
            "kernel_initializer": {
                "value": "glorot_uniform",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "glorot_uniform"
                    },
                    {
                        "name": "glorot_normal"
                    },
                    {
                        "name": "he_normal"
                    },
                    {
                        "name": "he_uniform"
                    },
                    {
                        "name": "identity"
                    },
                    {
                        "name": "lecun_normal"
                    },
                    {
                        "name": "lecun_uniform"
                    },
                    {
                        "name": "ones"
                    },
                    {
                        "name": "orthogonal"
                    },
                    {
                        "name": "random_normal"
                    },
                    {
                        "name": "random_uniform"
                    },
                    {
                        "name": "serialize"
                    },
                    {
                        "name": "truncated_normal"
                    },
                    {
                        "name": "variance_scaling"
                    },
                    {
                        "name": "zeros"
                    }
                ]
            },
            "bias_initializer": {
                "value": "zeros",
                "type": "text",
                "render": "list",
                "options": [
                    {
                        "name": "glorot_uniform"
                    },
                    {
                        "name": "glorot_normal"
                    },
                    {
                        "name": "he_normal"
                    },
                    {
                        "name": "he_uniform"
                    },
                    {
                        "name": "identity"
                    },
                    {
                        "name": "lecun_normal"
                    },
                    {
                        "name": "lecun_uniform"
                    },
                    {
                        "name": "ones"
                    },
                    {
                        "name": "orthogonal"
                    },
                    {
                        "name": "random_normal"
                    },
                    {
                        "name": "random_uniform"
                    },
                    {
                        "name": "serialize"
                    },
                    {
                        "name": "truncated_normal"
                    },
                    {
                        "name": "variance_scaling"
                    },
                    {
                        "name": "zeros"
                    }
                ]
            }
        }
    },
    "model_1": {
        "id": "model_1",
        "name": "Model 1",
        "type": "Model",
        "pos": {
            "x": 420,
            "y": 580
        },
        "connections": {
            "inbound": [
                "dense_1"
            ],
            "outbound": [
                "compile_1"
            ]
        },
        "arguments": {}
    },
    "compile_1": {
        "id": "compile_1",
        "name": "Compile 1",
        "type": "Compile",
        "pos": {
            "x": 426,
            "y": 687
        },
        "connections": {
            "inbound": [
                "model_1"
            ],
            "outbound": [
                "train_1"
            ]
        },
        "arguments": {
            "optmizer": {
                "value": "adam",
                "type": "list",
                "render": "list",
                "options": [
                    {
                        "name": "adadelta"
                    },
                    {
                        "name": "adagrad"
                    },
                    {
                        "name": "adam"
                    },
                    {
                        "name": "adamax"
                    },
                    {
                        "name": "ftrl"
                    },
                    {
                        "name": "nadam"
                    },
                    {
                        "name": "optimizer"
                    },
                    {
                        "name": "rmsprop"
                    },
                    {
                        "name": "sgd"
                    }
                ]
            },
            "loss": {
                "value": "categorical_crossentropy",
                "type": "list",
                "render": "list",
                "options": [
                    {
                        "name": "binary_crossentropy"
                    },
                    {
                        "name": "categorical_crossentropy"
                    },
                    {
                        "name": "categorical_hinge"
                    },
                    {
                        "name": "cosine_similarity"
                    },
                    {
                        "name": "deserialize"
                    },
                    {
                        "name": "hinge"
                    },
                    {
                        "name": "huber"
                    },
                    {
                        "name": "kl_divergence"
                    },
                    {
                        "name": "kld"
                    },
                    {
                        "name": "kullback_leibler_divergence"
                    },
                    {
                        "name": "log_cosh"
                    },
                    {
                        "name": "logcosh"
                    },
                    {
                        "name": "mae"
                    },
                    {
                        "name": "mape"
                    },
                    {
                        "name": "mean_absolute_error"
                    },
                    {
                        "name": "mean_absolute_percentage_error"
                    },
                    {
                        "name": "mean_squared_error"
                    },
                    {
                        "name": "mean_squared_logarithmic_error"
                    },
                    {
                        "name": "mse"
                    },
                    {
                        "name": "msle"
                    },
                    {
                        "name": "poisson"
                    },
                    {
                        "name": "serialize"
                    },
                    {
                        "name": "sparse_categorical_crossentropy"
                    },
                    {
                        "name": "squared_hinge"
                    }
                ]
            }
        }
    },
    "train_1": {
        "id": "train_1",
        "name": "Train 1",
        "type": "Train",
        "pos": {
            "x": 442,
            "y": 794
        },
        "connections": {
            "inbound": [
                "compile_1"
            ],
            "outbound": []
        },
        "arguments": {}
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
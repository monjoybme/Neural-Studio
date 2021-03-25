const layerGroups = {
    "core": {
        "name": "Core layers",
        "layers": [
            {
                "name": "Input",
                "args": {
                    "shape": "None",
                    "batch_size": "None",
                    "name": "None",
                    "dtype": "None",
                    "sparse": "False",
                    "tensor": "None",
                    "ragged": "False"
                }
            },
            {
                "name": "Dense",
                "args": {
                    "units,": "REQUIRED",
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
            {
                "name": "Activation",
                "args": {}
            },
            {
                "name": "Embedding",
                "args": {
                    "input_dim,": "REQUIRED",
                    "output_dim,": "REQUIRED",
                    "embeddings_initializer": "uniform",
                    "embeddings_regularizer": "None",
                    "activity_regularizer": "None",
                    "embeddings_constraint": "None",
                    "mask_zero": "False",
                    "input_length": "None"
                }
            },
            {
                "name": "Masking",
                "args": {}
            },
            {
                "name": "Lambda",
                "args": {}
            }
        ]
    },
    "convolution": {
        "name": "Convolution layers",
        "layers": [
            {
                "name": "Conv1D",
                "args": {
                    "filters,": "REQUIRED",
                    "kernel_size,": "REQUIRED",
                    "strides": "1",
                    "padding": "valid",
                    "data_format": "channels_last",
                    "dilation_rate": "1",
                    "groups": "1",
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
            {
                "name": "Conv2D",
                "args": {
                    "filters,": "REQUIRED",
                    "kernel_size,": "REQUIRED",
                    "strides": "(1 1)",
                    "padding": "valid",
                    "data_format": "None",
                    "dilation_rate": "(1 1)",
                    "groups": "1",
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
            {
                "name": "Conv3D",
                "args": {
                    "filters,": "REQUIRED",
                    "kernel_size,": "REQUIRED",
                    "strides": "(1 1 1)",
                    "padding": "valid",
                    "data_format": "None",
                    "dilation_rate": "(1 1 1)",
                    "groups": "1",
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
            {
                "name": "SeparableConv1D",
                "args": {
                    "filters,": "REQUIRED",
                    "kernel_size,": "REQUIRED",
                    "strides": "1",
                    "padding": "valid",
                    "data_format": "None",
                    "dilation_rate": "1",
                    "depth_multiplier": "1",
                    "activation": "None",
                    "use_bias": "True",
                    "depthwise_initializer": "glorot_uniform",
                    "pointwise_initializer": "glorot_uniform",
                    "bias_initializer": "zeros",
                    "depthwise_regularizer": "None",
                    "pointwise_regularizer": "None",
                    "bias_regularizer": "None",
                    "activity_regularizer": "None",
                    "depthwise_constraint": "None",
                    "pointwise_constraint": "None",
                    "bias_constraint": "None"
                }
            },
            {
                "name": "SeparableConv2D",
                "args": {
                    "filters,": "REQUIRED",
                    "kernel_size,": "REQUIRED",
                    "strides": "(1 1)",
                    "padding": "valid",
                    "data_format": "None",
                    "dilation_rate": "(1 1)",
                    "depth_multiplier": "1",
                    "activation": "None",
                    "use_bias": "True",
                    "depthwise_initializer": "glorot_uniform",
                    "pointwise_initializer": "glorot_uniform",
                    "bias_initializer": "zeros",
                    "depthwise_regularizer": "None",
                    "pointwise_regularizer": "None",
                    "bias_regularizer": "None",
                    "activity_regularizer": "None",
                    "depthwise_constraint": "None",
                    "pointwise_constraint": "None",
                    "bias_constraint": "None"
                }
            },
            {
                "name": "DepthwiseConv2D",
                "args": {
                    "kernel_size,": "REQUIRED",
                    "strides": "(1 1)",
                    "padding": "valid",
                    "depth_multiplier": "1",
                    "data_format": "None",
                    "dilation_rate": "(1 1)",
                    "activation": "None",
                    "use_bias": "True",
                    "depthwise_initializer": "glorot_uniform",
                    "bias_initializer": "zeros",
                    "depthwise_regularizer": "None",
                    "bias_regularizer": "None",
                    "activity_regularizer": "None",
                    "depthwise_constraint": "None",
                    "bias_constraint": "None"
                }
            },
            {
                "name": "Conv2DTranspose",
                "args": {
                    "filters,": "REQUIRED",
                    "kernel_size,": "REQUIRED",
                    "strides": "(1 1)",
                    "padding": "valid",
                    "output_padding": "None",
                    "data_format": "None",
                    "dilation_rate": "(1 1)",
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
            {
                "name": "Conv3DTranspose",
                "args": {
                    "filters,": "REQUIRED",
                    "kernel_size,": "REQUIRED",
                    "strides": "(1 1 1)",
                    "padding": "valid",
                    "output_padding": "None",
                    "data_format": "None",
                    "dilation_rate": "(1 1 1)",
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
        ]
    },
    "pooling": {
        "name": "Pooling layers",
        "layers": [
            {
                "name": "MaxPooling1D",
                "args": {}
            },
            {
                "name": "MaxPooling2D",
                "args": {}
            },
            {
                "name": "MaxPooling3D",
                "args": {}
            },
            {
                "name": "AveragePooling1D",
                "args": {}
            },
            {
                "name": "AveragePooling2D",
                "args": {}
            },
            {
                "name": "AveragePooling3D",
                "args": {}
            },
            {
                "name": "GlobalMaxPooling1D",
                "args": {}
            },
            {
                "name": "GlobalMaxPooling2D",
                "args": {}
            },
            {
                "name": "GlobalMaxPooling3D",
                "args": {}
            },
            {
                "name": "GlobalAveragePooling1D",
                "args": {}
            },
            {
                "name": "GlobalAveragePooling2D",
                "args": {}
            },
            {
                "name": "GlobalAveragePooling3D",
                "args": {}
            }
        ]
    },
    // "recurrent": {
    //     "name": "Recurrent layers",
    //     "layers": [
    //         {
    //             "name": "LSTM",
    //             "args": {
    //                 "units,": "REQUIRED",
    //                 "activation": "tanh",
    //                 "recurrent_activation": "sigmoid",
    //                 "use_bias": "True",
    //                 "kernel_initializer": "glorot_uniform",
    //                 "recurrent_initializer": "orthogonal",
    //                 "bias_initializer": "zeros",
    //                 "unit_forget_bias": "True",
    //                 "kernel_regularizer": "None",
    //                 "recurrent_regularizer": "None",
    //                 "bias_regularizer": "None",
    //                 "activity_regularizer": "None",
    //                 "kernel_constraint": "None",
    //                 "recurrent_constraint": "None",
    //                 "bias_constraint": "None",
    //                 "dropout": "0.0",
    //                 "recurrent_dropout": "0.0",
    //                 "return_sequences": "False",
    //                 "return_state": "False",
    //                 "go_backwards": "False",
    //                 "stateful": "False",
    //                 "time_major": "False",
    //                 "unroll": "False"
    //             }
    //         },
    //         {
    //             "name": "GRU",
    //             "args": {
    //                 "units,": "REQUIRED",
    //                 "activation": "tanh",
    //                 "recurrent_activation": "sigmoid",
    //                 "use_bias": "True",
    //                 "kernel_initializer": "glorot_uniform",
    //                 "recurrent_initializer": "orthogonal",
    //                 "bias_initializer": "zeros",
    //                 "kernel_regularizer": "None",
    //                 "recurrent_regularizer": "None",
    //                 "bias_regularizer": "None",
    //                 "activity_regularizer": "None",
    //                 "kernel_constraint": "None",
    //                 "recurrent_constraint": "None",
    //                 "bias_constraint": "None",
    //                 "dropout": "0.0",
    //                 "recurrent_dropout": "0.0",
    //                 "return_sequences": "False",
    //                 "return_state": "False",
    //                 "go_backwards": "False",
    //                 "stateful": "False",
    //                 "unroll": "False",
    //                 "time_major": "False",
    //                 "reset_after": "True"
    //             }
    //         },
    //         {
    //             "name": "SimpleRNN",
    //             "args": {
    //                 "units,": "REQUIRED",
    //                 "activation": "tanh",
    //                 "use_bias": "True",
    //                 "kernel_initializer": "glorot_uniform",
    //                 "recurrent_initializer": "orthogonal",
    //                 "bias_initializer": "zeros",
    //                 "kernel_regularizer": "None",
    //                 "recurrent_regularizer": "None",
    //                 "bias_regularizer": "None",
    //                 "activity_regularizer": "None",
    //                 "kernel_constraint": "None",
    //                 "recurrent_constraint": "None",
    //                 "bias_constraint": "None",
    //                 "dropout": "0.0",
    //                 "recurrent_dropout": "0.0",
    //                 "return_sequences": "False",
    //                 "return_state": "False",
    //                 "go_backwards": "False",
    //                 "stateful": "False",
    //                 "unroll": "False"
    //             }
    //         },
    //         {
    //             "name": "TimeDistributed",
    //             "args": {}
    //         },
    //         {
    //             "name": "Bidirectional",
    //             "args": {}
    //         },
    //         {
    //             "name": "ConvLSTM2D",
    //             "args": {
    //                 "filters,": "REQUIRED",
    //                 "kernel_size,": "REQUIRED",
    //                 "strides": "(1 1)",
    //                 "padding": "valid",
    //                 "data_format": "None",
    //                 "dilation_rate": "(1 1)",
    //                 "activation": "tanh",
    //                 "recurrent_activation": "hard_sigmoid",
    //                 "use_bias": "True",
    //                 "kernel_initializer": "glorot_uniform",
    //                 "recurrent_initializer": "orthogonal",
    //                 "bias_initializer": "zeros",
    //                 "unit_forget_bias": "True",
    //                 "kernel_regularizer": "None",
    //                 "recurrent_regularizer": "None",
    //                 "bias_regularizer": "None",
    //                 "activity_regularizer": "None",
    //                 "kernel_constraint": "None",
    //                 "recurrent_constraint": "None",
    //                 "bias_constraint": "None",
    //                 "return_sequences": "False",
    //                 "return_state": "False",
    //                 "go_backwards": "False",
    //                 "stateful": "False",
    //                 "dropout": "0.0",
    //                 "recurrent_dropout": "0.0"
    //             }
    //         },
    //         {
    //             "name": "Base RNN",
    //             "args": {
    //                 "cell,": "REQUIRED",
    //                 "return_sequences": "False",
    //                 "return_state": "False",
    //                 "go_backwards": "False",
    //                 "stateful": "False",
    //                 "unroll": "False",
    //                 "time_major": "False"
    //             }
    //         }
    //     ]
    // },
    // "preprocessing": {
    //     "name": "Preprocessing layers",
    //     "layers": [
    //         {
    //             "name": "TextVectorization",
    //             "args": {
    //                 "max_tokens": "None",
    //                 "standardize": "lower_and_strip_punctuation",
    //                 "split": "whitespace",
    //                 "ngrams": "None",
    //                 "output_mode": "int",
    //                 "output_sequence_length": "None",
    //                 "pad_to_max_tokens": "True",
    //                 "vocabulary": "None"
    //             }
    //         },
    //         {
    //             "name": "Normalization",
    //             "args": {}
    //         }
    //     ]
    // },
    // "normalization": {
    //     "name": "Normalization layers",
    //     "layers": [
    //         {
    //             "name": "BatchNormalization",
    //             "args": {
    //                 "axis": "-1",
    //                 "momentum": "0.99",
    //                 "epsilon": "0.001",
    //                 "center": "True",
    //                 "scale": "True",
    //                 "beta_initializer": "zeros",
    //                 "gamma_initializer": "ones",
    //                 "moving_mean_initializer": "zeros",
    //                 "moving_variance_initializer": "ones",
    //                 "beta_regularizer": "None",
    //                 "gamma_regularizer": "None",
    //                 "beta_constraint": "None",
    //                 "gamma_constraint": "None",
    //                 "renorm": "False",
    //                 "renorm_clipping": "None",
    //                 "renorm_momentum": "0.99",
    //                 "fused": "None",
    //                 "trainable": "True",
    //                 "virtual_batch_size": "None",
    //                 "adjustment": "None",
    //                 "name": "None"
    //             }
    //         },
    //         {
    //             "name": "LayerNormalization",
    //             "args": {
    //                 "axis": "-1",
    //                 "epsilon": "0.001",
    //                 "center": "True",
    //                 "scale": "True",
    //                 "beta_initializer": "zeros",
    //                 "gamma_initializer": "ones",
    //                 "beta_regularizer": "None",
    //                 "gamma_regularizer": "None",
    //                 "beta_constraint": "None",
    //                 "gamma_constraint": "None",
    //                 "trainable": "True",
    //                 "name": "None"
    //             }
    //         }
    //     ]
    // },
    // "regularization": {
    //     "name": "Regularization layers",
    //     "layers": [
    //         {
    //             "name": "Dropout",
    //             "args": {}
    //         },
    //         {
    //             "name": "SpatialDropout1D",
    //             "args": {}
    //         },
    //         {
    //             "name": "SpatialDropout2D",
    //             "args": {}
    //         },
    //         {
    //             "name": "SpatialDropout3D",
    //             "args": {}
    //         },
    //         {
    //             "name": "GaussianDropout",
    //             "args": {}
    //         },
    //         {
    //             "name": "GaussianNoise",
    //             "args": {}
    //         },
    //         {
    //             "name": "ActivityRegularization",
    //             "args": {}
    //         },
    //         {
    //             "name": "AlphaDropout",
    //             "args": {}
    //         }
    //     ]
    // },
    // "attention": {
    //     "name": "Attention layers",
    //     "layers": [
    //         {
    //             "name": "MultiHeadAttention",
    //             "args": {
    //                 "num_heads,": "REQUIRED",
    //                 "key_dim,": "REQUIRED",
    //                 "value_dim": "None",
    //                 "dropout": "0.0",
    //                 "use_bias": "True",
    //                 "output_shape": "None",
    //                 "attention_axes": "None",
    //                 "kernel_initializer": "glorot_uniform",
    //                 "bias_initializer": "zeros",
    //                 "kernel_regularizer": "None",
    //                 "bias_regularizer": "None",
    //                 "activity_regularizer": "None",
    //                 "kernel_constraint": "None",
    //                 "bias_constraint": "None"
    //             }
    //         },
    //         {
    //             "name": "Attention",
    //             "args": {}
    //         },
    //         {
    //             "name": "AdditiveAttention",
    //             "args": {}
    //         }
    //     ]
    // },
    // "reshaping": {
    //     "name": "Reshaping layers",
    //     "layers": [
    //         {
    //             "name": "Reshape",
    //             "args": {}
    //         },
    //         {
    //             "name": "Flatten",
    //             "args": {}
    //         },
    //         {
    //             "name": "RepeatVector",
    //             "args": {}
    //         },
    //         {
    //             "name": "Permute",
    //             "args": {}
    //         },
    //         {
    //             "name": "Cropping1D",
    //             "args": {}
    //         },
    //         {
    //             "name": "Cropping2D",
    //             "args": {}
    //         },
    //         {
    //             "name": "Cropping3D",
    //             "args": {}
    //         },
    //         {
    //             "name": "UpSampling1D",
    //             "args": {}
    //         },
    //         {
    //             "name": "UpSampling2D",
    //             "args": {}
    //         },
    //         {
    //             "name": "UpSampling3D",
    //             "args": {}
    //         },
    //         {
    //             "name": "ZeroPadding1D",
    //             "args": {}
    //         },
    //         {
    //             "name": "ZeroPadding2D",
    //             "args": {}
    //         },
    //         {
    //             "name": "ZeroPadding3D",
    //             "args": {}
    //         }
    //     ]
    // },
    // "merging": {
    //     "name": "Merging layers",
    //     "layers": [
    //         {
    //             "name": "Concatenate",
    //             "args": {}
    //         },
    //         {
    //             "name": "Average",
    //             "args": {}
    //         },
    //         {
    //             "name": "Maximum",
    //             "args": {}
    //         },
    //         {
    //             "name": "Minimum",
    //             "args": {}
    //         },
    //         {
    //             "name": "Add",
    //             "args": {}
    //         },
    //         {
    //             "name": "Subtract",
    //             "args": {}
    //         },
    //         {
    //             "name": "Multiply",
    //             "args": {}
    //         },
    //         {
    //             "name": "Dot",
    //             "args": {}
    //         }
    //     ]
    // },
    // "locallyconnected": {
    //     "name": "Locally layers",
    //     "layers": [
    //         {
    //             "name": "LocallyConnected1D",
    //             "args": {
    //                 "filters,": "REQUIRED",
    //                 "kernel_size,": "REQUIRED",
    //                 "strides": "1",
    //                 "padding": "valid",
    //                 "data_format": "None",
    //                 "activation": "None",
    //                 "use_bias": "True",
    //                 "kernel_initializer": "glorot_uniform",
    //                 "bias_initializer": "zeros",
    //                 "kernel_regularizer": "None",
    //                 "bias_regularizer": "None",
    //                 "activity_regularizer": "None",
    //                 "kernel_constraint": "None",
    //                 "bias_constraint": "None",
    //                 "implementation": "1"
    //             }
    //         },
    //         {
    //             "name": "LocallyConnected2D",
    //             "args": {
    //                 "filters,": "REQUIRED",
    //                 "kernel_size,": "REQUIRED",
    //                 "strides": "(1 1)",
    //                 "padding": "valid",
    //                 "data_format": "None",
    //                 "activation": "None",
    //                 "use_bias": "True",
    //                 "kernel_initializer": "glorot_uniform",
    //                 "bias_initializer": "zeros",
    //                 "kernel_regularizer": "None",
    //                 "bias_regularizer": "None",
    //                 "activity_regularizer": "None",
    //                 "kernel_constraint": "None",
    //                 "bias_constraint": "None",
    //                 "implementation": "1"
    //             }
    //         }
    //     ]
    // },
    // "activation": {
    //     "name": "Activation layers",
    //     "layers": [
    //         {
    //             "name": "ReLU",
    //             "args": {}
    //         },
    //         {
    //             "name": "Softmax",
    //             "args": {}
    //         },
    //         {
    //             "name": "LeakyReLU",
    //             "args": {}
    //         },
    //         {
    //             "name": "PReLU",
    //             "args": {
    //                 "alpha_initializer": "zeros",
    //                 "alpha_regularizer": "None",
    //                 "alpha_constraint": "None",
    //                 "shared_axes": "None"
    //             }
    //         },
    //         {
    //             "name": "ELU",
    //             "args": {}
    //         },
    //         {
    //             "name": "ThresholdedReLU",
    //             "args": {}
    //         }
    //     ]
    // }
}

export {layerGroups};
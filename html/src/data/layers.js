import callbacks from "./callbacks";
import datasets from "./datasets";
import optimizers from './optimizers';

const layers = {
  "datasets":datasets,
  "core-layers": {
    name: "Core layers",
    layers: [
      {
        name: "Input",
        type: "Input",
        args: {
          shape: {
            value: "None",
            type: "str",
            render: "text",
            options: "shape",
          },
          batch_size: {
            value: "None",
            type: "str",
            render: "text",
            options: "size",
          },
          name: { value: "None", type: "str", render: "text", options: "name" },
          dtype: {
            value: "None",
            type: "str",
            render: "text",
            options: "dtype",
          },
          sparse: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          tensor: {
            value: "None",
            type: "str",
            render: "text",
            options: "tensor",
          },
          ragged: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
        },
        doc: "https://keras.io/api/layers/core_layers/input",
      },
      {
        name: "Dense",
        type: "Dense",
        args: {
          units: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "units",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc: "https://keras.io/api/layers/core_layers/dense",
      },
      {
        name: "Activation",
        type: "Activation",
        args: {
          activation: {
            value: "REQUIRED",
            type: "str",
            render: "list",
            options: "activation",
          },
        },
        doc: "https://keras.io/api/layers/core_layers/activation",
      },
      {
        name: "Embedding",
        type: "Embedding",
        args: {
          input_dim: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "dim",
          },
          output_dim: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "dim",
          },
          embeddings_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          embeddings_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          mask_zero: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          input_length: {
            value: "None",
            type: "str",
            render: "text",
            options: "length",
          },
        },
        doc: "https://keras.io/api/layers/core_layers/embedding",
      },
      {
        name: "Masking",
        type: "Masking",
        args: {
          mask_value: {
            value: "0.0,",
            type: "str",
            render: "text",
            options: "value",
          },
        },
        doc: "https://keras.io/api/layers/core_layers/masking",
      },
      {
        name: "Lambda",
        type: "Lambda",
        args: {
          function: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "function",
          },
          output_shape: {
            value: "None, mas",
            type: "str",
            render: "text",
            options: "shape",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
          arguments: {
            value: "None,",
            type: "str",
            render: "text",
            options: "arguments",
          },
        },
        doc: "https://keras.io/api/layers/core_layers/lambda",
      },
    ],
    doc: "https://keras.io/api/layers/core_layers/",
  },
  "convolution-layers": {
    name: "Convolution layers",
    layers: [
      {
        name: "Conv1D",
        type: "Conv1D",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "1",
            type: "str",
            render: "text",
            options: "strides",
          },
          dilation_rate: {
            value: "1",
            type: "str",
            render: "text",
            options: "rate",
          },
          groups: {
            value: "1",
            type: "str",
            render: "text",
            options: "groups",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc: "https://keras.io/api/layers/convolution_layers/convolution1d",
      },
      {
        name: "Conv2D",
        type: "Conv2D",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "strides",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          dilation_rate: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "rate",
          },
          groups: {
            value: "1",
            type: "str",
            render: "text",
            options: "groups",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc: "https://keras.io/api/layers/convolution_layers/convolution2d",
      },
      {
        name: "Conv3D",
        type: "Conv3D",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "(1, 1, 1)",
            type: "str",
            render: "text",
            options: "strides",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          dilation_rate: {
            value: "(1, 1, 1)",
            type: "str",
            render: "text",
            options: "rate",
          },
          groups: {
            value: "1",
            type: "str",
            render: "text",
            options: "groups",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc: "https://keras.io/api/layers/convolution_layers/convolution3d",
      },
      {
        name: "SeparableConv1D",
        type: "SeparableConv1D",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "1",
            type: "str",
            render: "text",
            options: "strides",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          dilation_rate: {
            value: "1",
            type: "str",
            render: "text",
            options: "rate",
          },
          depth_multiplier: {
            value: "1",
            type: "str",
            render: "text",
            options: "multiplier",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          depthwise_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          pointwise_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          depthwise_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          pointwise_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc:
          "https://keras.io/api/layers/convolution_layers/separable_convolution1d",
      },
      {
        name: "SeparableConv2D",
        type: "SeparableConv2D",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "strides",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          dilation_rate: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "rate",
          },
          depth_multiplier: {
            value: "1",
            type: "str",
            render: "text",
            options: "multiplier",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          depthwise_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          pointwise_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          depthwise_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          pointwise_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc:
          "https://keras.io/api/layers/convolution_layers/separable_convolution2d",
      },
      {
        name: "DepthwiseConv2D",
        type: "DepthwiseConv2D",
        args: {
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "strides",
          },
          depth_multiplier: {
            value: "1",
            type: "str",
            render: "text",
            options: "multiplier",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          dilation_rate: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "rate",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          depthwise_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          depthwise_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc:
          "https://keras.io/api/layers/convolution_layers/depthwise_convolution2d",
      },
      {
        name: "Conv2DTranspose",
        type: "Conv2DTranspose",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "strides",
          },
          output_padding: {
            value: "None",
            type: "str",
            render: "text",
            options: "padding",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          dilation_rate: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "rate",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc:
          "https://keras.io/api/layers/convolution_layers/convolution2d_transpose",
      },
      {
        name: "Conv3DTranspose",
        type: "Conv3DTranspose",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "(1, 1, 1)",
            type: "str",
            render: "text",
            options: "strides",
          },
          output_padding: {
            value: "None",
            type: "str",
            render: "text",
            options: "padding",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          dilation_rate: {
            value: "(1, 1, 1)",
            type: "str",
            render: "text",
            options: "rate",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc:
          "https://keras.io/api/layers/convolution_layers/convolution3d_transpose",
      },
    ],
    doc: "https://keras.io/api/layers/convolution_layers/",
  },
  "pooling-layers": {
    name: "Pooling layers",
    layers: [
      {
        name: "MaxPooling1D",
        type: "MaxPooling1D",
        args: {
          pool_size: {
            value: "2, stride",
            type: "str",
            render: "text",
            options: "size",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/max_pooling1d",
      },
      {
        name: "MaxPooling2D",
        type: "MaxPooling2D",
        args: {
          pool_size: {
            value: "(2, 2), stride",
            type: "str",
            render: "text",
            options: "size",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/max_pooling2d",
      },
      {
        name: "MaxPooling3D",
        type: "MaxPooling3D",
        args: {
          pool_size: {
            value: "(2, 2, 2), stride",
            type: "str",
            render: "text",
            options: "size",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/max_pooling3d",
      },
      {
        name: "AveragePooling1D",
        type: "AveragePooling1D",
        args: {
          pool_size: {
            value: "2, stride",
            type: "str",
            render: "text",
            options: "size",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/average_pooling1d",
      },
      {
        name: "AveragePooling2D",
        type: "AveragePooling2D",
        args: {
          pool_size: {
            value: "(2, 2), stride",
            type: "str",
            render: "text",
            options: "size",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/average_pooling2d",
      },
      {
        name: "AveragePooling3D",
        type: "AveragePooling3D",
        args: {
          pool_size: {
            value: "(2, 2, 2), stride",
            type: "str",
            render: "text",
            options: "size",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/average_pooling3d",
      },
      {
        name: "GlobalMaxPooling1D",
        type: "GlobalMaxPooling1D",
        args: {},
        doc: "https://keras.io/api/layers/pooling_layers/global_max_pooling1d",
      },
      {
        name: "GlobalMaxPooling2D",
        type: "GlobalMaxPooling2D",
        args: {
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/global_max_pooling2d",
      },
      {
        name: "GlobalMaxPooling3D",
        type: "GlobalMaxPooling3D",
        args: {
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/global_max_pooling3d",
      },
      {
        name: "GlobalAveragePooling1D",
        type: "GlobalAveragePooling1D",
        args: {},
        doc:
          "https://keras.io/api/layers/pooling_layers/global_average_pooling1d",
      },
      {
        name: "GlobalAveragePooling2D",
        type: "GlobalAveragePooling2D",
        args: {
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc:
          "https://keras.io/api/layers/pooling_layers/global_average_pooling2d",
      },
      {
        name: "GlobalAveragePooling3D",
        type: "GlobalAveragePooling3D",
        args: {
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc:
          "https://keras.io/api/layers/pooling_layers/global_average_pooling3d",
      },
    ],
    doc: "https://keras.io/api/layers/pooling_layers/",
  },
  "recurrent-layers": {
    name: "Recurrent layers",
    layers: [
      {
        name: "LSTM",
        type: "LSTM",
        args: {
          units: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "units",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          unit_forget_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          recurrent_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          recurrent_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          dropout: {
            value: "0.0",
            type: "str",
            render: "text",
            options: "dropout",
          },
          recurrent_dropout: {
            value: "0.0",
            type: "str",
            render: "text",
            options: "dropout",
          },
          return_sequences: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          return_state: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          go_backwards: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          stateful: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          time_major: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          unroll: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
        },
        doc: "https://keras.io/api/layers/recurrent_layers/lstm",
      },
      {
        name: "GRU",
        type: "GRU",
        args: {
          units: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "units",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          recurrent_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          recurrent_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          dropout: {
            value: "0.0",
            type: "str",
            render: "text",
            options: "dropout",
          },
          recurrent_dropout: {
            value: "0.0",
            type: "str",
            render: "text",
            options: "dropout",
          },
          return_sequences: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          return_state: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          go_backwards: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          stateful: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          unroll: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          time_major: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          reset_after: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
        },
        doc: "https://keras.io/api/layers/recurrent_layers/gru",
      },
      {
        name: "SimpleRNN",
        type: "SimpleRNN",
        args: {
          units: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "units",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          recurrent_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          recurrent_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          dropout: {
            value: "0.0",
            type: "str",
            render: "text",
            options: "dropout",
          },
          recurrent_dropout: {
            value: "0.0",
            type: "str",
            render: "text",
            options: "dropout",
          },
          return_sequences: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          return_state: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          go_backwards: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          stateful: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          unroll: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
        },
        doc: "https://keras.io/api/layers/recurrent_layers/simple_rnn",
      },
      {
        name: "TimeDistributed",
        type: "TimeDistributed",
        args: {
          layer: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "layer",
          },
        },
        doc: "https://keras.io/api/layers/recurrent_layers/time_distributed",
      },
      {
        name: "Bidirectional",
        type: "Bidirectional",
        args: {
          layer: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "layer",
          },
          weights: {
            value: "None, backwar",
            type: "str",
            render: "text",
            options: "weights",
          },
          _layer: {
            value: "None,",
            type: "str",
            render: "text",
            options: "layer",
          },
        },
        doc: "https://keras.io/api/layers/recurrent_layers/bidirectional",
      },
      {
        name: "ConvLSTM2D",
        type: "ConvLSTM2D",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "strides",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          dilation_rate: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "rate",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          unit_forget_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          recurrent_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          recurrent_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          return_sequences: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          return_state: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          go_backwards: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          stateful: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          dropout: {
            value: "0.0",
            type: "str",
            render: "text",
            options: "dropout",
          },
          recurrent_dropout: {
            value: "0.0",
            type: "str",
            render: "text",
            options: "dropout",
          },
        },
        doc: "https://keras.io/api/layers/recurrent_layers/conv_lstm2d",
      },
      {
        name: "Base RNN",
        type: "Base RNN",
        args: {
          cell: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "cell",
          },
          return_sequences: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          return_state: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          go_backwards: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          stateful: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          unroll: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          time_major: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
        },
        doc: "https://keras.io/api/layers/recurrent_layers/rnn",
      },
    ],
    doc: "https://keras.io/api/layers/recurrent_layers/",
  },
  "preprocessing-layers": {
    name: "Preprocessing layers",
    layers: [
      {
        name: "TextVectorization",
        type: "TextVectorization",
        args: {
          max_tokens: {
            value: "None",
            type: "str",
            render: "text",
            options: "tokens",
          },
          ngrams: {
            value: "None",
            type: "str",
            render: "text",
            options: "ngrams",
          },
          output_sequence_length: {
            value: "None",
            type: "str",
            render: "text",
            options: "length",
          },
          pad_to_max_tokens: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          vocabulary: {
            value: "None",
            type: "str",
            render: "text",
            options: "vocabulary",
          },
        },
        doc:
          "https://keras.io/api/layers/preprocessing_layers/core_preprocessing_layers/text_vectorization",
      },
      {
        name: "Normalization",
        type: "Normalization",
        args: {
          
          dtype: {
            value: "None, mea",
            type: "str",
            render: "text",
            options: "dtype",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
          variance: {
            value: "None,",
            type: "str",
            render: "text",
            options: "variance",
          },
        },
        doc:
          "https://keras.io/api/layers/preprocessing_layers/core_preprocessing_layers/normalization",
      },
    ],
    doc: "https://keras.io/api/layers/preprocessing_layers/",
  },
  "normalization-layers": {
    name: "Normalization layers",
    layers: [
      {
        name: "BatchNormalization",
        type: "BatchNormalization",
        args: {
          
          momentum: {
            value: "0.99",
            type: "str",
            render: "text",
            options: "momentum",
          },
          epsilon: {
            value: "0.001",
            type: "str",
            render: "text",
            options: "epsilon",
          },
          center: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          scale: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          beta_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          gamma_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          beta_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          gamma_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          renorm: {
            value: "False",
            type: "str",
            render: "list",
            options: "bool",
          },
          renorm_clipping: {
            value: "None",
            type: "str",
            render: "text",
            options: "clipping",
          },
          renorm_momentum: {
            value: "0.99",
            type: "str",
            render: "text",
            options: "momentum",
          },
          fused: {
            value: "None",
            type: "str",
            render: "text",
            options: "fused",
          },
          trainable: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          virtual_batch_size: {
            value: "None",
            type: "str",
            render: "text",
            options: "size",
          },
          adjustment: {
            value: "None",
            type: "str",
            render: "text",
            options: "adjustment",
          },
          name: { value: "None", type: "str", render: "text", options: "name" },
        },
        doc:
          "https://keras.io/api/layers/normalization_layers/batch_normalization",
      },
      {
        name: "LayerNormalization",
        type: "LayerNormalization",
        args: {
          
          epsilon: {
            value: "0.001",
            type: "str",
            render: "text",
            options: "epsilon",
          },
          center: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          scale: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          beta_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          gamma_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          beta_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          gamma_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          trainable: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          name: { value: "None", type: "str", render: "text", options: "name" },
        },
        doc:
          "https://keras.io/api/layers/normalization_layers/layer_normalization",
      },
    ],
    doc: "https://keras.io/api/layers/normalization_layers/",
  },
  "regularization-layers": {
    name: "Regularization layers",
    layers: [
      {
        name: "Dropout",
        type: "Dropout",
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
          noise_shape: {
            value: "None, see",
            type: "str",
            render: "text",
            options: "shape",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
        },
        doc: "https://keras.io/api/layers/regularization_layers/dropout",
      },
      {
        name: "SpatialDropout1D",
        type: "SpatialDropout1D",
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
        },
        doc:
          "https://keras.io/api/layers/regularization_layers/spatial_dropout1d",
      },
      {
        name: "SpatialDropout2D",
        type: "SpatialDropout2D",
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc:
          "https://keras.io/api/layers/regularization_layers/spatial_dropout2d",
      },
      {
        name: "SpatialDropout3D",
        type: "SpatialDropout3D",
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc:
          "https://keras.io/api/layers/regularization_layers/spatial_dropout3d",
      },
      {
        name: "GaussianDropout",
        type: "GaussianDropout",
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
        },
        doc:
          "https://keras.io/api/layers/regularization_layers/gaussian_dropout",
      },
      {
        name: "GaussianNoise",
        type: "GaussianNoise",
        args: {
          stddev: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "stddev",
          },
        },
        doc: "https://keras.io/api/layers/regularization_layers/gaussian_noise",
      },
      {
        name: "ActivityRegularization",
        type: "ActivityRegularization",
        args: {
          l1: { value: "0.0, l", type: "str", render: "text", options: "l1" },
        },
        doc:
          "https://keras.io/api/layers/regularization_layers/activity_regularization",
      },
      {
        name: "AlphaDropout",
        type: "AlphaDropout",
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
          noise_shape: {
            value: "None, see",
            type: "str",
            render: "text",
            options: "shape",
          },
          None: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "None",
          },
        },
        doc: "https://keras.io/api/layers/regularization_layers/alpha_dropout",
      },
    ],
    doc: "https://keras.io/api/layers/regularization_layers/",
  },
  "attention-layers": {
    name: "Attention layers",
    layers: [
      {
        name: "MultiHeadAttention",
        type: "MultiHeadAttention",
        args: {
          num_heads: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "heads",
          },
          key_dim: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "dim",
          },
          value_dim: {
            value: "None",
            type: "str",
            render: "text",
            options: "dim",
          },
          dropout: {
            value: "0.0",
            type: "str",
            render: "text",
            options: "dropout",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          output_shape: {
            value: "None",
            type: "str",
            render: "text",
            options: "shape",
          },
          attention_axes: {
            value: "None",
            type: "str",
            render: "text",
            options: "axes",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
        },
        doc:
          "https://keras.io/api/layers/attention_layers/multi_head_attention",
      },
      {
        name: "Attention",
        type: "Attention",
        args: {
          use_scale: {
            value: "False,",
            type: "str",
            render: "text",
            options: "scale",
          },
        },
        doc: "https://keras.io/api/layers/attention_layers/attention",
      },
      {
        name: "AdditiveAttention",
        type: "AdditiveAttention",
        args: {
          use_scale: {
            value: "True,",
            type: "str",
            render: "text",
            options: "scale",
          },
        },
        doc: "https://keras.io/api/layers/attention_layers/additive_attention",
      },
    ],
    doc: "https://keras.io/api/layers/attention_layers/",
  },
  "reshaping-layers": {
    name: "Reshaping layers",
    layers: [
      {
        name: "Reshape",
        type: "Reshape",
        args: {
          target_shape: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "shape",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/reshape",
      },
      {
        name: "Flatten",
        type: "Flatten",
        args: {
          data_format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/flatten",
      },
      {
        name: "RepeatVector",
        type: "RepeatVector",
        args: {
          n: { value: "REQUIRED", type: "str", render: "text", options: "n" },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/repeat_vector",
      },
      {
        name: "Permute",
        type: "Permute",
        args: {
          dims: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "dims",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/permute",
      },
      {
        name: "Cropping1D",
        type: "Cropping1D",
        args: {
          cropping: {
            value: "(1, 1),",
            type: "str",
            render: "text",
            options: "cropping",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/cropping1d",
      },
      {
        name: "Cropping2D",
        type: "Cropping2D",
        args: {
          cropping: {
            value: "((0, 0), (0, 0)), dat",
            type: "str",
            render: "text",
            options: "cropping",
          },
          _format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/cropping2d",
      },
      {
        name: "Cropping3D",
        type: "Cropping3D",
        args: {
          cropping: {
            value: "((1, 1), (1, 1), (1, 1)), dat",
            type: "str",
            render: "text",
            options: "cropping",
          },
          _format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/cropping3d",
      },
      {
        name: "UpSampling1D",
        type: "UpSampling1D",
        args: {
          size: { value: "2,", type: "str", render: "text", options: "size" },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/up_sampling1d",
      },
      {
        name: "UpSampling2D",
        type: "UpSampling2D",
        args: {
          size: {
            value: "(2, 2), dat",
            type: "str",
            render: "text",
            options: "size",
          },
          _format: {
            value: "None, interpolatio",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/up_sampling2d",
      },
      {
        name: "UpSampling3D",
        type: "UpSampling3D",
        args: {
          size: {
            value: "(2, 2, 2), dat",
            type: "str",
            render: "text",
            options: "size",
          },
          _format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/up_sampling3d",
      },
      {
        name: "ZeroPadding1D",
        type: "ZeroPadding1D",
        args: {
          padding: {
            value: "1,",
            type: "str",
            render: "text",
            options: "padding",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/zero_padding1d",
      },
      {
        name: "ZeroPadding2D",
        type: "ZeroPadding2D",
        args: {
          padding: {
            value: "(1, 1), dat",
            type: "str",
            render: "text",
            options: "padding",
          },
          _format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/zero_padding2d",
      },
      {
        name: "ZeroPadding3D",
        type: "ZeroPadding3D",
        args: {
          padding: {
            value: "(1, 1, 1), dat",
            type: "str",
            render: "text",
            options: "padding",
          },
          _format: {
            value: "None,",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/zero_padding3d",
      },
    ],
    doc: "https://keras.io/api/layers/reshaping_layers/",
  },
  "merging-layers": {
    name: "Merging layers",
    layers: [
      {
        name: "Concatenate",
        type: "Concatenate",
        args: {
          
        },
        doc: "https://keras.io/api/layers/merging_layers/concatenate",
      },
      {
        name: "Average",
        type: "Average",
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/average",
      },
      {
        name: "Maximum",
        type: "Maximum",
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/maximum",
      },
      {
        name: "Minimum",
        type: "Minimum",
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/minimum",
      },
      {
        name: "Add",
        type: "Add",
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/add",
      },
      {
        name: "Subtract",
        type: "Subtract",
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/subtract",
      },
      {
        name: "Multiply",
        type: "Multiply",
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/multiply",
      },
      {
        name: "Dot",
        type: "Dot",
        args: {
          axes: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "axes",
          },
          normalize: {
            value: "False,",
            type: "str",
            render: "text",
            options: "normalize",
          },
        },
        doc: "https://keras.io/api/layers/merging_layers/dot",
      },
    ],
    doc: "https://keras.io/api/layers/merging_layers/",
  },
  "locallyconnected-layers": {
    name: "Locally-connected layers",
    layers: [
      {
        name: "LocallyConnected1D",
        type: "LocallyConnected1D",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "1",
            type: "str",
            render: "text",
            options: "strides",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          implementation: {
            value: "1",
            type: "str",
            render: "text",
            options: "implementation",
          },
        },
        doc:
          "https://keras.io/api/layers/locally_connected_layers/locall_connected1d",
      },
      {
        name: "LocallyConnected2D",
        type: "LocallyConnected2D",
        args: {
          filters: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "filters",
          },
          kernel_size: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "(1, 1)",
            type: "str",
            render: "text",
            options: "strides",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
          activation: {
            value: "None",
            type: "str",
            render: "list",
            options: "activation",
          },
          use_bias: {
            value: "True",
            type: "str",
            render: "list",
            options: "bool",
          },
          kernel_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          bias_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          activity_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          kernel_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          bias_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          implementation: {
            value: "1",
            type: "str",
            render: "text",
            options: "implementation",
          },
        },
        doc:
          "https://keras.io/api/layers/locally_connected_layers/locall_connected2d",
      },
    ],
    doc: "https://keras.io/api/layers/locally_connected_layers/",
  },
  "activation-layers": {
    name: "Activation layers",
    layers: [
      {
        name: "ReLU",
        type: "ReLU",
        args: {
          max_value: {
            value: "None, negativ",
            type: "str",
            render: "text",
            options: "value",
          },
          _slope: {
            value: "0, threshol",
            type: "str",
            render: "text",
            options: "slope",
          },
          
        },
        doc: "https://keras.io/api/layers/activation_layers/relu",
      },
      {
        name: "Softmax",
        type: "Softmax",
        args: {
          
        },
        doc: "https://keras.io/api/layers/activation_layers/softmax",
      },
      {
        name: "LeakyReLU",
        type: "LeakyReLU",
        args: {
          alpha: {
            value: "0.3,",
            type: "str",
            render: "text",
            options: "alpha",
          },
        },
        doc: "https://keras.io/api/layers/activation_layers/leaky_relu",
      },
      {
        name: "PReLU",
        type: "PReLU",
        args: {
          alpha_regularizer: {
            value: "None",
            type: "str",
            render: "list",
            options: "regularizer",
          },
          alpha_constraint: {
            value: "None",
            type: "str",
            render: "list",
            options: "constraint",
          },
          shared_axes: {
            value: "None",
            type: "str",
            render: "text",
            options: "axes",
          },
        },
        doc: "https://keras.io/api/layers/activation_layers/prelu",
      },
      {
        name: "ELU",
        type: "ELU",
        args: {
          alpha: {
            value: "1.0,",
            type: "str",
            render: "text",
            options: "alpha",
          },
        },
        doc: "https://keras.io/api/layers/activation_layers/elu",
      },
      {
        name: "ThresholdedReLU",
        type: "ThresholdedReLU",
        args: {
          theta: {
            value: "1.0,",
            type: "str",
            render: "text",
            options: "theta",
          },
        },
        doc: "https://keras.io/api/layers/activation_layers/threshold_relu",
      },
    ],
    doc: "https://keras.io/api/layers/activation_layers/",
  },
  "build-layers": {
    name: "Build Tools",
    layers: [
      { name: "Model", type: "Model", args: {} },
      {
        name: "Compile",
        type: "Compile",
        args: {
          optmizer: {
            value: "rmsprop",
            type: "list",
            render: "list",
            options: "optimizer",
          },
          loss: {
            value: "None",
            type: "list",
            render: "list",
            options: "loss",
          },
        },
      },
      {
        name: "Train",
        type: "Train",
        args: {
          batch_size: {
            value: "8",
            type: "int",
            render: "text",
            options: "batch_size",
          },
          epochs: {
            value: "1",
            type: "int",
            render: "text",
            options: "batch_size",
          },
        },
      },
    ],
  },
  "callbacks":callbacks,
  "optimizers":optimizers
};

export default layers;

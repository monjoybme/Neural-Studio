import datasets from "./datasets";
import optimizers from "./optimizers";
import callbaacks from "./callbacks";

const layers = {
  "datasets":datasets,
  "core-layers": {
    name: "Core layers",
    layers: [
      {
        name: "Input",
        type: { name: "Input", _class: "layers" },
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
        type: { name: "Dense", _class: "layers" },
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
        type: { name: "Activation", _class: "layers" },
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
        type: { name: "Embedding", _class: "layers" },
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
        type: { name: "Masking", _class: "layers" },
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
        type: { name: "Lambda", _class: "layers" },
        args: {
          function: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "function",
          },
          output_shape: {
            value: "None",
            type: "str",
            render: "text",
            options: "shape",
          },
          mask: {
            value: "None",
            type: "str",
            render: "text",
            options: "None",
          },
          arguments: {
            value: "None",
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
        type: { name: "Conv1D", _class: "layers" },
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
        type: { name: "Conv2D", _class: "layers" },
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
        type: { name: "Conv3D", _class: "layers" },
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
        type: { name: "SeparableConv1D", _class: "layers" },
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
        type: { name: "SeparableConv2D", _class: "layers" },
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
        type: { name: "DepthwiseConv2D", _class: "layers" },
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
        type: { name: "Conv2DTranspose", _class: "layers" },
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
        type: { name: "Conv3DTranspose", _class: "layers" },
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
        type: { name: "MaxPooling1D", _class: "layers" },
        args: {
          pool_size: {
            value: "2" ,
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "None",
            type: "str",
            render: "text",
            options: "None",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/max_pooling1d",
      },
      {
        name: "MaxPooling2D",
        type: { name: "MaxPooling2D", _class: "layers" },
        args: {
          pool_size: {
            value: "(2, 2)",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "None",
            type: "str",
            render: "text",
            options: "None",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/max_pooling2d",
      },
      {
        name: "MaxPooling3D",
        type: { name: "MaxPooling3D", _class: "layers" },
        args: {
          pool_size: {
            value: "(2, 2, 2)",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "None",
            type: "str",
            render: "text",
            options: "None",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/max_pooling3d",
      },
      {
        name: "AveragePooling1D",
        type: { name: "AveragePooling1D", _class: "layers" },
        args: {
          pool_size: {
            value: "2",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "None",
            type: "str",
            render: "text",
            options: "None",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/average_pooling1d",
      },
      {
        name: "AveragePooling2D",
        type: { name: "AveragePooling2D", _class: "layers" },
        args: {
          pool_size: {
            value: "(2, 2)",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "None",
            type: "str",
            render: "text",
            options: "None",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/average_pooling2d",
      },
      {
        name: "AveragePooling3D",
        type: { name: "AveragePooling3D", _class: "layers" },
        args: {
          pool_size: {
            value: "(2, 2, 2)",
            type: "str",
            render: "text",
            options: "size",
          },
          strides: {
            value: "None",
            type: "str",
            render: "text",
            options: "None",
          },
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/average_pooling3d",
      },
      {
        name: "GlobalMaxPooling1D",
        type: { name: "GlobalMaxPooling1D", _class: "layers" },
        args: {},
        doc: "https://keras.io/api/layers/pooling_layers/global_max_pooling1d",
      },
      {
        name: "GlobalMaxPooling2D",
        type: { name: "GlobalMaxPooling2D", _class: "layers" },
        args: {
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/global_max_pooling2d",
      },
      {
        name: "GlobalMaxPooling3D",
        type: { name: "GlobalMaxPooling3D", _class: "layers" },
        args: {
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/pooling_layers/global_max_pooling3d",
      },
      {
        name: "GlobalAveragePooling1D",
        type: { name: "GlobalAveragePooling1D", _class: "layers" },
        args: {},
        doc:
          "https://keras.io/api/layers/pooling_layers/global_average_pooling1d",
      },
      {
        name: "GlobalAveragePooling2D",
        type: { name: "GlobalAveragePooling2D", _class: "layers" },
        args: {
          data_format: {
            value: "None",
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
        type: { name: "GlobalAveragePooling3D", _class: "layers" },
        args: {
          data_format: {
            value: "None",
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
        type: { name: "LSTM", _class: "layers" },
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
        type: { name: "GRU", _class: "layers" },
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
        type: { name: "SimpleRNN", _class: "layers" },
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
        type: { name: "TimeDistributed", _class: "layers" },
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
        type: { name: "Bidirectional", _class: "layers" },
        args: {
          layer: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "layer",
          },
          weights: {
            value: "None backwar",
            type: "str",
            render: "text",
            options: "weights",
          },
          _layer: {
            value: "None",
            type: "str",
            render: "text",
            options: "layer",
          },
        },
        doc: "https://keras.io/api/layers/recurrent_layers/bidirectional",
      },
      {
        name: "ConvLSTM2D",
        type: { name: "ConvLSTM2D", _class: "layers" },
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
        type: { name: "Base RNN", _class: "layers" },
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
        type: { name: "TextVectorization", _class: "layers" },
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
        type: { name: "Normalization", _class: "layers" },
        args: {
          
          dtype: {
            value: "None",
            type: "str",
            render: "text",
            options: "dtype",
          },
          mean: {
            value: "None",
            type: "str",
            render: "text",
            options: "None",
          },
          variance: {
            value: "None",
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
        type: { name: "BatchNormalization", _class: "layers" },
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
        type: { name: "LayerNormalization", _class: "layers" },
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
        type: { name: "Dropout", _class: "layers" },
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
          noise_shape: {
            value: "None",
            type: "str",
            render: "text",
            options: "shape",
          },
          seed: {
            value: "None",
            type: "str",
            render: "text",
            options: "None",
          },
        },
        doc: "https://keras.io/api/layers/regularization_layers/dropout",
      },
      {
        name: "SpatialDropout1D",
        type: { name: "SpatialDropout1D", _class: "layers" },
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
        type: { name: "SpatialDropout2D", _class: "layers" },
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
          data_format: {
            value: "None",
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
        type: { name: "SpatialDropout3D", _class: "layers" },
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
          data_format: {
            value: "None",
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
        type: { name: "GaussianDropout", _class: "layers" },
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
        type: { name: "GaussianNoise", _class: "layers" },
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
        type: { name: "ActivityRegularization", _class: "layers" },
        args: {
          l1: { value: "0.0, l", type: "str", render: "text", options: "l1" },
          
        },
        doc:
          "https://keras.io/api/layers/regularization_layers/activity_regularization",
      },
      {
        name: "AlphaDropout",
        type: { name: "AlphaDropout", _class: "layers" },
        args: {
          rate: {
            value: "REQUIRED",
            type: "str",
            render: "text",
            options: "rate",
          },
          noise_shape: {
            value: "None",
            type: "str",
            render: "text",
            options: "shape",
          },
          seed: {
            value: "None",
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
        type: { name: "MultiHeadAttention", _class: "layers" },
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
        type: { name: "Attention", _class: "layers" },
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
        type: { name: "AdditiveAttention", _class: "layers" },
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
        type: { name: "Reshape", _class: "layers" },
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
        type: { name: "Flatten", _class: "layers" },
        args: {
          data_format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/flatten",
      },
      {
        name: "RepeatVector",
        type: { name: "RepeatVector", _class: "layers" },
        args: {
          n: { value: "REQUIRED", type: "str", render: "text", options: "n" },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/repeat_vector",
      },
      {
        name: "Permute",
        type: { name: "Permute", _class: "layers" },
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
        type: { name: "Cropping1D", _class: "layers" },
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
        type: { name: "Cropping2D", _class: "layers" },
        args: {
          cropping: {
            value: "((0, 0), (0, 0)), dat",
            type: "str",
            render: "text",
            options: "cropping",
          },
          _format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/cropping2d",
      },
      {
        name: "Cropping3D",
        type: { name: "Cropping3D", _class: "layers" },
        args: {
          cropping: {
            value: "((1, 1), (1, 1), (1, 1)), dat",
            type: "str",
            render: "text",
            options: "cropping",
          },
          _format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/cropping3d",
      },
      {
        name: "UpSampling1D",
        type: { name: "UpSampling1D", _class: "layers" },
        args: {
          size: { value: "2,", type: "str", render: "text", options: "size" },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/up_sampling1d",
      },
      {
        name: "UpSampling2D",
        type: { name: "UpSampling2D", _class: "layers" },
        args: {
          size: {
            value: "(2, 2), dat",
            type: "str",
            render: "text",
            options: "size",
          },
          _format: {
            value: "None interpolatio",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/up_sampling2d",
      },
      {
        name: "UpSampling3D",
        type: { name: "UpSampling3D", _class: "layers" },
        args: {
          size: {
            value: "(2, 2, 2), dat",
            type: "str",
            render: "text",
            options: "size",
          },
          _format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/up_sampling3d",
      },
      {
        name: "ZeroPadding1D",
        type: { name: "ZeroPadding1D", _class: "layers" },
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
        type: { name: "ZeroPadding2D", _class: "layers" },
        args: {
          padding: {
            value: "(1, 1), dat",
            type: "str",
            render: "text",
            options: "padding",
          },
          _format: {
            value: "None",
            type: "str",
            render: "text",
            options: "format",
          },
        },
        doc: "https://keras.io/api/layers/reshaping_layers/zero_padding2d",
      },
      {
        name: "ZeroPadding3D",
        type: { name: "ZeroPadding3D", _class: "layers" },
        args: {
          padding: {
            value: "(1, 1, 1), dat",
            type: "str",
            render: "text",
            options: "padding",
          },
          _format: {
            value: "None",
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
        type: { name: "Concatenate", _class: "layers" },
        args: {
          
        },
        doc: "https://keras.io/api/layers/merging_layers/concatenate",
      },
      {
        name: "Average",
        type: { name: "Average", _class: "layers" },
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/average",
      },
      {
        name: "Maximum",
        type: { name: "Maximum", _class: "layers" },
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/maximum",
      },
      {
        name: "Minimum",
        type: { name: "Minimum", _class: "layers" },
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/minimum",
      },
      {
        name: "Add",
        type: { name: "Add", _class: "layers" },
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/add",
      },
      {
        name: "Subtract",
        type: { name: "Subtract", _class: "layers" },
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/subtract",
      },
      {
        name: "Multiply",
        type: { name: "Multiply", _class: "layers" },
        args: {},
        doc: "https://keras.io/api/layers/merging_layers/multiply",
      },
      {
        name: "Dot",
        type: { name: "Dot", _class: "layers" },
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
        type: { name: "LocallyConnected1D", _class: "layers" },
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
        type: { name: "LocallyConnected2D", _class: "layers" },
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
        type: { name: "ReLU", _class: "layers" },
        args: {
          max_value: {
            value: "None negativ",
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
        type: { name: "Softmax", _class: "layers" },
        args: {
          
        },
        doc: "https://keras.io/api/layers/activation_layers/softmax",
      },
      {
        name: "LeakyReLU",
        type: { name: "LeakyReLU", _class: "layers" },
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
        type: { name: "PReLU", _class: "layers" },
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
        type: { name: "ELU", _class: "layers" },
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
        type: { name: "ThresholdedReLU", _class: "layers" },
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
      { name: "Model", type: { name: "Model", _class: "models" }, args: {} },
      {
        name: "Compile",
        type: { name: "Compile", _class: "models" },
        args: {
          optmizer: {
            value: "rmsprop",
            type: "str",
            render: "list",
            options: "optimizer",
          },
          loss: { value: "None", type: "str", render: "list", options: "loss" },
          "metrics":{
            "value":[],
            "type":"str",
            "render":"checkbox",
            "options": "metrics"
          }
        },
      },
      {
        name: "Train",
        type: { name: "Train", _class: "models" },
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
  optimizers:optimizers,
  callbaacks:callbaacks
};

export default layers;

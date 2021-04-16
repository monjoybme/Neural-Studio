const applications = {
  name: "Applications",
  layers: [
    {
      name: "DenseNet121",
      type: { name: "Application", _class: "DenseNet121" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "DenseNet169",
      type: { name: "Application", _class: "DenseNet169" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "DenseNet201",
      type: { name: "Application", _class: "DenseNet201" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "EfficientNetB0",
      type: { name: "Application", _class: "EfficientNetB0" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "EfficientNetB1",
      type: { name: "Application", _class: "EfficientNetB1" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "EfficientNetB2",
      type: { name: "Application", _class: "EfficientNetB2" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "EfficientNetB3",
      type: { name: "Application", _class: "EfficientNetB3" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "EfficientNetB4",
      type: { name: "Application", _class: "EfficientNetB4" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "EfficientNetB5",
      type: { name: "Application", _class: "EfficientNetB5" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "EfficientNetB6",
      type: { name: "Application", _class: "EfficientNetB6" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "EfficientNetB7",
      type: { name: "Application", _class: "EfficientNetB7" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "InceptionResNetV2",
      type: { name: "Application", _class: "InceptionResNetV2" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "InceptionV3",
      type: { name: "Application", _class: "InceptionV3" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "MobileNet",
      type: { name: "Application", _class: "MobileNet" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "MobileNetV2",
      type: { name: "Application", _class: "MobileNetV2" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "MobileNetV3Large",
      type: { name: "Application", _class: "MobileNetV3Large" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "MobileNetV3Small",
      type: { name: "Application", _class: "MobileNetV3Small" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "NASNetLarge",
      type: { name: "Application", _class: "NASNetLarge" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "NASNetMobile",
      type: { name: "Application", _class: "NASNetMobile" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "ResNet101",
      type: { name: "Application", _class: "ResNet101" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "ResNet101V2",
      type: { name: "Application", _class: "ResNet101V2" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "ResNet152",
      type: { name: "Application", _class: "ResNet152" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "ResNet152V2",
      type: { name: "Application", _class: "ResNet152V2" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "ResNet50",
      type: { name: "Application", _class: "ResNet50" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "ResNet50V2",
      type: { name: "Application", _class: "ResNet50V2" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "VGG16",
      type: { name: "Application", _class: "VGG16" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "VGG19",
      type: { name: "Application", _class: "VGG19" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
    {
      name: "Xception",
      type: { name: "Application", _class: "Xception" },
      arguments: {
        weights: {
          value: "imagenet",
          type: "str",
          render: "text",
          options: "optimizer",
        },
      },
    },
  ],
};
export default applications;

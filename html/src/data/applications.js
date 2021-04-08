const applications = {
  name: "Applications",
  layers: [
    {
      name: "DenseNet121",
      type: { name: "Application", _class: "DenseNet121" },
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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
      args: {
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

const datasets = {
  image: {
    name: "Image",
    layers: [
      {
        name: "ClassificationFromDirectory",
        type: {
          name: "ImageClassificationDatasetFromDirectory",
          object_class: "dataset",
        },
        arguments: {
          root: {
            value: "required",
            type: "str",
            render: "path",
            options: "root",
          },
          size: {
            value: "required",
            type: "tuple",
            render: "text",
            options: "size",
          },
          train_folder: {
            value: "train",
            type: "str",
            render: "text",
            options: "folder",
          },
          test_folder: {
            value: "test",
            type: "str",
            render: "text",
            options: "folder",
          },
          resize: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
          show_progress: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
        },
      },
      {
        name: "Segmentation",
        type: {
          name: "ImageSegmentationDatasetFromDirectory",
          object_class: "dataset",
        },
        arguments: {
          root: {
            value: "required",
            type: "str",
            render: "path",
            options: "root",
          },
          size: {
            value: "required",
            type: "tuple",
            render: "text",
            options: "size",
          },
          train_images: {
            value: "train_images",
            type: "str",
            render: "text",
            options: "images",
          },
          train_masks: {
            value: "train_masks",
            type: "str",
            render: "text",
            options: "masks",
          },
          test_images: {
            value: "test_images",
            type: "str",
            render: "text",
            options: "images",
          },
          test_masks: {
            value: "test_masks",
            type: "str",
            render: "text",
            options: "masks",
          },
          normalize: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
          binary_mask: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
          resize: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
          show_progress: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
        },
      },
    ],
  },
  text: {
    name: "Text",
    layers: [],
  },
  csv: {
    name: "CSV Datasets",
    layers: [],
  },
  built_in: {
    name: "Built in",
    layers: [
      {
        name: "Mnist",
        type: {
          name: "Mnist",
          object_class: "dataset",
        },
        arguments: {
          size: {
            value: "(28, 28, 1)",
            type: "tuple",
            render: "text",
            options: "size",
          },
          normalize: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
        },
      },
      {
        name: "BostonHousing",
        type: {
          name: "BostonHousing",
          object_class: "dataset",
        },
        arguments: {
          size: {
            value: "(13,)",
            type: "tuple",
            render: "text",
            options: "size",
          },
        },
      },
      {
        name: "Cifar10",
        type: {
          name: "Cifar10",
          object_class: "dataset",
        },
        arguments: {
          size: {
            value: "(32, 32, 3)",
            type: "tuple",
            render: "text",
            options: "size",
          },
          normalize: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
        },
      },
      {
        name: "Cifar100",
        type: {
          name: "Cifar100",
          object_class: "dataset",
        },
        arguments: {
          size: {
            value: "(32, 32, 3)",
            type: "tuple",
            render: "text",
            options: "size",
          },
          normalize: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
        },
      },
      {
        name: "FashionMnist",
        type: {
          name: "FashionMnist",
          object_class: "dataset",
        },
        arguments: {
          size: {
            value: "(28, 28, 1)",
            type: "tuple",
            render: "text",
            options: "size",
          },
          normalize: {
            value: "True",
            type: "bool",
            render: "list",
            options: "bool",
          },
        },
      },
    ],
  },
  cross_validation: {
    name: "Cross Validation",
    layers: [
      {
        name: "Train Test Split",
        type: {
          object_class: "cross_validation",
          name: "train_test_split",
        },
        arguments: {
          test_size: {
            value: "0.25",
            type: "int",
            render: "text",
          },
        },
      },
    ],
  },
  buckets: {
    name: "Data Buckets",
    layers: [
      {
        name: "SimpleBucket",
        type: {
          object_class: "buckets",
          name: "SimpleBucket",
        },
        arguments: {},
      },
    ],
  },
};

export default datasets;

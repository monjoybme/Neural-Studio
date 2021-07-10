const datasets = {
  image: {
    name: "Image",
    layers: [
      {
        name: "From Directory",
        type: {
          name: "ImageClassificationDatasetFromDirectory",
          object_class: "dataset",
        },
        arguments: {
          root: {
            value: "required",
            type: "str",
            render: "text",
            options: "root",
          },
          size: {
            value: "required",
            type: "tuple",
            render: "text",
            options: "size",
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
            value: "(32, 32, 1)",
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
            value: "(32, 32, 1)",
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

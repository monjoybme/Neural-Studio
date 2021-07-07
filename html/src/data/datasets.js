const datasets = {
  datasets: {
    name: "Datasets",
    layers: [
      {
        name: "Dataset",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
         
        },
      },
      {
        name: "Image Dataset From Directory",
        type: {
          object_class: "datasets",
          name: "Dataset",
        },
        arguments: {
          
        },
      },
      {
        name: "MNIST",
        type: {
          object_class: "datasets",
          name: "mnist",
        },
        arguments: {
          
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
  buckets:{
    name: "Data Buckets",
    layers:[
      {
        name: "SimpleBucket",
        type:{
          object_class: "buckets",
          name: "SimpleBucket"
        },
        arguments:{

        }
      }
    ]
  }
};

export default datasets;

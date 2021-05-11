const optimizers = {
  name: "Optimizers",
  layers: [
    {
      name: "SGD",
      type: { name: "SGD", object_class: "optimizers" },
      arguments: {
        learning_rate: {
          value: "0.01",
          type: "float",
          render: "text",
          options: "learning_rate",
        },
        momentum: {
          value: "0.0",
          type: "float",
          render: "text",
          options: "momentum",
        },
        nesterov: {
          value: "False",
          type: "bool",
          render: "list",
          options: "bool",
        },
        name: { value: "SGD", type: "str", render: "text", options: "name" },
      },
    },
    {
      name: "RMSprop",
      type: { name: "RMSprop", object_class: "optimizers" },
      arguments: {
        learning_rate: {
          value: "0.001",
          type: "float",
          render: "text",
          options: "learning_rate",
        },
        rho: { value: "0.9", type: "float", render: "text", options: "rho" },
        momentum: {
          value: "0.0",
          type: "float",
          render: "text",
          options: "momentum",
        },
        epsilon: {
          value: "1e-07",
          type: "float",
          render: "text",
          options: "epsilon",
        },
        centered: {
          value: "False",
          type: "bool",
          render: "list",
          options: "bool",
        },
        name: {
          value: "RMSprop",
          type: "str",
          render: "text",
          options: "name",
        },
      },
    },
    {
      name: "Adam",
      type: { name: "Adam", object_class: "optimizers" },
      arguments: {
        learning_rate: {
          value: "0.001",
          type: "float",
          render: "text",
          options: "learning_rate",
        },
        beta_1: {
          value: "0.9",
          type: "float",
          render: "text",
          options: "beta_1",
        },
        beta_2: {
          value: "0.999",
          type: "float",
          render: "text",
          options: "beta_2",
        },
        epsilon: {
          value: "1e-07",
          type: "float",
          render: "text",
          options: "epsilon",
        },
        amsgrad: {
          value: "False",
          type: "bool",
          render: "list",
          options: "bool",
        },
        name: { value: "Adam", type: "str", render: "text", options: "name" },
      },
    },
    {
      name: "Adadelta",
      type: { name: "Adadelta", object_class: "optimizers" },
      arguments: {
        learning_rate: {
          value: "0.001",
          type: "float",
          render: "text",
          options: "learning_rate",
        },
        rho: { value: "0.95", type: "float", render: "text", options: "rho" },
        epsilon: {
          value: "1e-07",
          type: "float",
          render: "text",
          options: "epsilon",
        },
        name: {
          value: "Adadelta",
          type: "str",
          render: "text",
          options: "name",
        },
      },
    },
    {
      name: "Adagrad",
      type: { name: "Adagrad", object_class: "optimizers" },
      arguments: {
        learning_rate: {
          value: "0.001",
          type: "float",
          render: "text",
          options: "learning_rate",
        },
        initial_accumulator_value: {
          value: "0.1",
          type: "float",
          render: "text",
          options: "initial_accumulator_value",
        },
        epsilon: {
          value: "1e-07",
          type: "float",
          render: "text",
          options: "epsilon",
        },
        name: {
          value: "Adagrad",
          type: "str",
          render: "text",
          options: "name",
        },
      },
    },
    {
      name: "Adamax",
      type: { name: "Adamax", object_class: "optimizers" },
      arguments: {
        learning_rate: {
          value: "0.001",
          type: "float",
          render: "text",
          options: "learning_rate",
        },
        beta_1: {
          value: "0.9",
          type: "float",
          render: "text",
          options: "beta_1",
        },
        beta_2: {
          value: "0.999",
          type: "float",
          render: "text",
          options: "beta_2",
        },
        epsilon: {
          value: "1e-07",
          type: "float",
          render: "text",
          options: "epsilon",
        },
        name: { value: "Adamax", type: "str", render: "text", options: "name" },
      },
    },
    {
      name: "Nadam",
      type: { name: "Nadam", object_class: "optimizers" },
      arguments: {
        learning_rate: {
          value: "0.001",
          type: "float",
          render: "text",
          options: "learning_rate",
        },
        beta_1: {
          value: "0.9",
          type: "float",
          render: "text",
          options: "beta_1",
        },
        beta_2: {
          value: "0.999",
          type: "float",
          render: "text",
          options: "beta_2",
        },
        epsilon: {
          value: "1e-07",
          type: "float",
          render: "text",
          options: "epsilon",
        },
        name: { value: "Nadam", type: "str", render: "text", options: "name" },
      },
    },
    {
      name: "Ftrl",
      type: { name: "Ftrl", object_class: "optimizers" },
      arguments: {
        learning_rate: {
          value: "0.001",
          type: "float",
          render: "text",
          options: "learning_rate",
        },
        learning_rate_power: {
          value: "-0.5",
          type: "float",
          render: "text",
          options: "learning_rate_power",
        },
        initial_accumulator_value: {
          value: "0.1",
          type: "float",
          render: "text",
          options: "initial_accumulator_value",
        },
        l1_regularization_strength: {
          value: "0.0",
          type: "float",
          render: "text",
          options: "l1_regularization_strength",
        },
        l2_regularization_strength: {
          value: "0.0",
          type: "float",
          render: "text",
          options: "l2_regularization_strength",
        },
        name: { value: "Ftrl", type: "str", render: "text", options: "name" },
        l2_shrinkage_regularization_strength: {
          value: "0.0",
          type: "float",
          render: "text",
          options: "l2_shrinkage_regularization_strength",
        },
        beta: { value: "0.0", type: "float", render: "text", options: "beta" },
      },
    },
  ],
};
export default optimizers;

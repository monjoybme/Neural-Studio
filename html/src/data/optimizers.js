const optimizers = {
  name: "Optimizers",
  layers: [
    {
      name: "SGD",
      type: { name: "SGD", _class: "optimizers" },
      args: {
        learning_rate: {
          value: "0.01",
          type: "str",
          render: "text",
          options: "rate",
        },
        momentum: {
          value: "0.0",
          type: "str",
          render: "text",
          options: "momentum",
        },
        nesterov: {
          value: "False",
          type: "str",
          render: "list",
          options: "bool",
        },
        name: { value: "SGD", type: "str", render: "text", options: "name" },
      },
    },
    {
      name: "RMSprop",
      type: { name: "RMSprop", _class: "optimizers" },
      args: {
        learning_rate: {
          value: "0.001",
          type: "str",
          render: "text",
          options: "rate",
        },
        rho: { value: "0.9", type: "str", render: "text", options: "rho" },
        momentum: {
          value: "0.0",
          type: "str",
          render: "text",
          options: "momentum",
        },
        epsilon: {
          value: "1e-07",
          type: "str",
          render: "text",
          options: "epsilon",
        },
        centered: {
          value: "False",
          type: "str",
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
      type: { name: "Adam", _class: "optimizers" },
      args: {
        learning_rate: {
          value: "0.001",
          type: "str",
          render: "text",
          options: "rate",
        },
        beta_1: { value: "0.9", type: "str", render: "text", options: "1" },
        beta_2: { value: "0.999", type: "str", render: "text", options: "2" },
        epsilon: {
          value: "1e-07",
          type: "str",
          render: "text",
          options: "epsilon",
        },
        amsgrad: {
          value: "False",
          type: "str",
          render: "list",
          options: "bool",
        },
        name: { value: "Adam", type: "str", render: "text", options: "name" },
      },
    },
    {
      name: "Adadelta",
      type: { name: "Adadelta", _class: "optimizers" },
      args: {
        learning_rate: {
          value: "0.001",
          type: "str",
          render: "text",
          options: "rate",
        },
        rho: { value: "0.95", type: "str", render: "text", options: "rho" },
        epsilon: {
          value: "1e-07",
          type: "str",
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
      type: { name: "Adagrad", _class: "optimizers" },
      args: {
        learning_rate: {
          value: "0.001",
          type: "str",
          render: "text",
          options: "rate",
        },
        initial_accumulator_value: {
          value: "0.1",
          type: "str",
          render: "text",
          options: "value",
        },
        epsilon: {
          value: "1e-07",
          type: "str",
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
      type: { name: "Adamax", _class: "optimizers" },
      args: {
        learning_rate: {
          value: "0.001",
          type: "str",
          render: "text",
          options: "rate",
        },
        beta_1: { value: "0.9", type: "str", render: "text", options: "1" },
        beta_2: { value: "0.999", type: "str", render: "text", options: "2" },
        epsilon: {
          value: "1e-07",
          type: "str",
          render: "text",
          options: "epsilon",
        },
        name: { value: "Adamax", type: "str", render: "text", options: "name" },
      },
    },
    {
      name: "Nadam",
      type: { name: "Nadam", _class: "optimizers" },
      args: {
        learning_rate: {
          value: "0.001",
          type: "str",
          render: "text",
          options: "rate",
        },
        beta_1: { value: "0.9", type: "str", render: "text", options: "1" },
        beta_2: { value: "0.999", type: "str", render: "text", options: "2" },
        epsilon: {
          value: "1e-07",
          type: "str",
          render: "text",
          options: "epsilon",
        },
        name: { value: "Nadam", type: "str", render: "text", options: "name" },
      },
    },
    {
      name: "Ftrl",
      type: { name: "Ftrl", _class: "optimizers" },
      args: {
        learning_rate: {
          value: "0.001",
          type: "str",
          render: "text",
          options: "rate",
        },
        learning_rate_power: {
          value: "-0.5",
          type: "str",
          render: "text",
          options: "power",
        },
        initial_accumulator_value: {
          value: "0.1",
          type: "str",
          render: "text",
          options: "value",
        },
        l1_regularization_strength: {
          value: "0.0",
          type: "str",
          render: "text",
          options: "strength",
        },
        l2_regularization_strength: {
          value: "0.0",
          type: "str",
          render: "text",
          options: "strength",
        },
        name: { value: "Ftrl", type: "str", render: "text", options: "name" },
        l2_shrinkage_regularization_strength: {
          value: "0.0",
          type: "str",
          render: "text",
          options: "strength",
        },
        beta: { value: "0.0", type: "str", render: "text", options: "beta" },
      },
    },
  ],
};
export default optimizers;

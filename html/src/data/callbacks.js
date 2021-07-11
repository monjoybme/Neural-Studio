const callbacks = {
  name: "Callbacks",
  layers: [
    {
      name: "Callback",
      type: { name: "Callback", object_class: "callbacks" },
      arguments: {},
    },
    {
      name: "OutputVisualizer",
      type: { name: "OutputVisualizer", object_class: "callbacks" },
      arguments: {
        propblem_type:{
          value: "None",
          type: "str",
          render: "list",
          options: "visualizers"
        }
      },
    },
    {
      name: "ModelCheckpoint",
      type: { name: "ModelCheckpoint", object_class: "callbacks" },
      arguments: {
        filepath: {
          value: "required",
          type: "str",
          render: "text",
          options: "filepath",
        },
        monitor: {
          value: "val_loss",
          type: "str",
          render: "text",
          options: "monitor",
        },
        verbose: {
          value: "0",
          type: "int",
          render: "text",
          options: "verbose",
        },
        save_best_only: {
          value: "False",
          type: "bool",
          render: "list",
          options: "bool",
        },
        save_weights_only: {
          value: "False",
          type: "bool",
          render: "list",
          options: "bool",
        },
        mode: { value: "auto", type: "str", render: "text", options: "mode" },
        save_freq: {
          value: "epoch",
          type: "str",
          render: "text",
          options: "save_freq",
        },
        options: {
          value: "None",
          type: "str",
          render: "text",
          options: "options",
        },
      },
    },
    {
      name: "TensorBoard",
      type: { name: "TensorBoard", object_class: "callbacks" },
      arguments: {
        log_dir: {
          value: "logs",
          type: "str",
          render: "text",
          options: "log_dir",
        },
        histogram_freq: {
          value: "0",
          type: "int",
          render: "text",
          options: "histogram_freq",
        },
        write_graph: {
          value: "True",
          type: "bool",
          render: "list",
          options: "bool",
        },
        write_images: {
          value: "False",
          type: "bool",
          render: "list",
          options: "bool",
        },
        update_freq: {
          value: "epoch",
          type: "str",
          render: "text",
          options: "update_freq",
        },
        profile_batch: {
          value: "2",
          type: "int",
          render: "text",
          options: "profile_batch",
        },
        embeddings_freq: {
          value: "0",
          type: "int",
          render: "text",
          options: "embeddings_freq",
        },
        embeddings_metadata: {
          value: "None",
          type: "str",
          render: "text",
          options: "embeddings_metadata",
        },
      },
    },
    {
      name: "EarlyStopping",
      type: { name: "EarlyStopping", object_class: "callbacks" },
      arguments: {
        monitor: {
          value: "val_loss",
          type: "str",
          render: "text",
          options: "monitor",
        },
        min_delta: {
          value: "0",
          type: "int",
          render: "text",
          options: "min_delta",
        },
        patience: {
          value: "0",
          type: "int",
          render: "text",
          options: "patience",
        },
        verbose: {
          value: "0",
          type: "int",
          render: "text",
          options: "verbose",
        },
        mode: { value: "auto", type: "str", render: "text", options: "mode" },
        baseline: {
          value: "None",
          type: "str",
          render: "text",
          options: "baseline",
        },
        restore_best_weights: {
          value: "False",
          type: "bool",
          render: "list",
          options: "bool",
        },
      },
    },
    {
      name: "LearningRateScheduler",
      type: { name: "LearningRateScheduler", object_class: "callbacks" },
      arguments: {
        schedule: {
          value: "required",
          type: "str",
          render: "text",
          options: "schedule",
        },
        verbose: {
          value: "0",
          type: "int",
          render: "text",
          options: "verbose",
        },
      },
    },
    {
      name: "ReduceLROnPlateau",
      type: { name: "ReduceLROnPlateau", object_class: "callbacks" },
      arguments: {
        monitor: {
          value: "val_loss",
          type: "str",
          render: "text",
          options: "monitor",
        },
        factor: { value: "0", type: "int", render: "text", options: "factor" },
        patience: {
          value: "10",
          type: "int",
          render: "text",
          options: "patience",
        },
        verbose: {
          value: "0",
          type: "int",
          render: "text",
          options: "verbose",
        },
        mode: { value: "auto", type: "str", render: "text", options: "mode" },
        min_delta: {
          value: "0",
          type: "int",
          render: "text",
          options: "min_delta",
        },
        "0001": {
          value: "required",
          type: "str",
          render: "text",
          options: "0001",
        },
        cooldown: {
          value: "0",
          type: "int",
          render: "text",
          options: "cooldown",
        },
        min_lr: { value: "0", type: "int", render: "text", options: "min_lr" },
      },
    },
    {
      name: "RemoteMonitor",
      type: { name: "RemoteMonitor", object_class: "callbacks" },
      arguments: {
        root: {
          value: "http://localhost:9000",
          type: "str",
          render: "text",
          options: "root",
        },
        path: {
          value: "/publish/epoch/end/",
          type: "str",
          render: "text",
          options: "path",
        },
        field: { value: "data", type: "str", render: "text", options: "field" },
        headers: {
          value: "None",
          type: "str",
          render: "text",
          options: "headers",
        },
        send_as_json: {
          value: "False",
          type: "bool",
          render: "list",
          options: "bool",
        },
      },
    },
    {
      name: "LambdaCallback",
      type: { name: "LambdaCallback", object_class: "callbacks" },
      arguments: {
        on_epoch_begin: {
          value: "None",
          type: "str",
          render: "text",
          options: "on_epoch_begin",
        },
        on_epoch_end: {
          value: "None",
          type: "str",
          render: "text",
          options: "on_epoch_end",
        },
        on_batch_begin: {
          value: "None",
          type: "str",
          render: "text",
          options: "on_batch_begin",
        },
        on_batch_end: {
          value: "None",
          type: "str",
          render: "text",
          options: "on_batch_end",
        },
        on_train_begin: {
          value: "None",
          type: "str",
          render: "text",
          options: "on_train_begin",
        },
        on_train_end: {
          value: "None",
          type: "str",
          render: "text",
          options: "on_train_end",
        },
      },
    },
    {
      name: "TerminateOnNaN",
      type: { name: "TerminateOnNaN", object_class: "callbacks" },
      arguments: {},
    },
    {
      name: "CSVLogger",
      type: { name: "CSVLogger", object_class: "callbacks" },
      arguments: {
        filename: {
          value: "required",
          type: "str",
          render: "text",
          options: "filename",
        },
        append: {
          value: "False",
          type: "bool",
          render: "list",
          options: "bool",
        },
        separator: {
          value: ",",
          type: "str",
          render: "text",
          options: "filename",
        },
      },
    },
    {
      name: "ProgbarLogger",
      type: { name: "ProgbarLogger", object_class: "callbacks" },
      arguments: {
        count_mode: {
          value: "samples",
          type: "str",
          render: "text",
          options: "count_mode",
        },
        stateful_metrics: {
          value: "None",
          type: "str",
          render: "text",
          options: "stateful_metrics",
        },
      },
    },
  ],
};
export default callbacks;

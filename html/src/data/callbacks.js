const callbacks = {
  name: "Callbacks",
  layers: [
    {
      name: "ModelCheckpoint",
      type: "Callback",
      args: {
        filepath: {
          value: "REQUIRED",
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
          type: "str",
          render: "text",
          options: "verbose",
        },
        save_best_only: {
          value: "False",
          type: "str",
          render: "list",
          options: "bool",
        },
        save_weights_only: {
          value: "False",
          type: "str",
          render: "list",
          options: "bool",
        },
        mode: { value: "auto", type: "str", render: "text", options: "mode" },
        save_freq: {
          value: "epoch",
          type: "str",
          render: "text",
          options: "freq",
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
      type: "Callback",
      args: {
        log_dir: { value: "logs", type: "str", render: "text", options: "dir" },
        histogram_freq: {
          value: "0",
          type: "str",
          render: "text",
          options: "freq",
        },
        write_graph: {
          value: "True",
          type: "str",
          render: "list",
          options: "bool",
        },
        write_images: {
          value: "False",
          type: "str",
          render: "list",
          options: "bool",
        },
        update_freq: {
          value: "epoch",
          type: "str",
          render: "text",
          options: "freq",
        },
        profile_batch: {
          value: "2",
          type: "str",
          render: "text",
          options: "batch",
        },
        embeddings_freq: {
          value: "0",
          type: "str",
          render: "text",
          options: "freq",
        },
        embeddings_metadata: {
          value: "None",
          type: "str",
          render: "text",
          options: "metadata",
        },
      },
    },
    {
      name: "EarlyStopping",
      type: "Callback",
      args: {
        monitor: {
          value: "val_loss",
          type: "str",
          render: "text",
          options: "monitor",
        },
        min_delta: {
          value: "0",
          type: "str",
          render: "text",
          options: "delta",
        },
        patience: {
          value: "0",
          type: "str",
          render: "text",
          options: "patience",
        },
        verbose: {
          value: "0",
          type: "str",
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
          value: "False,",
          type: "str",
          render: "text",
          options: "weights",
        },
      },
    },
    {
      name: "LearningRateScheduler",
      type: "Callback",
      args: {
        schedule: {
          value: "REQUIRED",
          type: "str",
          render: "text",
          options: "schedule",
        },
        verbose: {
          value: "0",
          type: "str",
          render: "text",
          options: "verbose",
        },
      },
    },
    {
      name: "ReduceLROnPlateau",
      type: "Callback",
      args: {
        monitor: {
          value: "val_loss",
          type: "str",
          render: "text",
          options: "monitor",
        },
        factor: { value: "0", type: "str", render: "text", options: "factor" },
      },
    },
    {
      name: "RemoteMonitor",
      type: "Callback",
      args: {
        root: { value: "http:", type: "str", render: "text", options: "root" },
      },
    },
    {
      name: "LambdaCallback",
      type: "Callback",
      args: {
        on_epoch_begin: {
          value: "None",
          type: "str",
          render: "text",
          options: "begin",
        },
        on_epoch_end: {
          value: "None",
          type: "str",
          render: "text",
          options: "end",
        },
        on_batch_begin: {
          value: "None",
          type: "str",
          render: "text",
          options: "begin",
        },
        on_batch_end: {
          value: "None",
          type: "str",
          render: "text",
          options: "end",
        },
        on_train_begin: {
          value: "None",
          type: "str",
          render: "text",
          options: "begin",
        },
        on_train_end: {
          value: "None",
          type: "str",
          render: "text",
          options: "end",
        },
      },
    },
    {
      name: "CSVLogger",
      type: "Callback",
      args: {
        filename: {
          value: "REQUIRED",
          type: "str",
          render: "text",
          options: "filename",
        },
        separator: {
          value: ",",
          type: "str",
          render: "text",
          options: "separator",
        },
        append: {
          value: "False",
          type: "str",
          render: "list",
          options: "bool",
        },
      },
    },
    {
      name: "ProgbarLogger",
      type: "Callback",
      args: {
        count_mode: {
          value: "samples",
          type: "str",
          render: "text",
          options: "mode",
        },
        stateful_metrics: {
          value: "None",
          type: "str",
          render: "text",
          options: "metrics",
        },
      },
    },
  ],
};
export default callbacks;

import React from "react";

import Canvas from "./GraphCanvas";

import "./App.css";
import _lg  from "./data/layers";
import CodeEditor from "./CodeEditor";

window.copy = function(object){
  return JSON.parse(JSON.stringify(object))
}

let cursors = {
  line: "crosshair",
  delete: "no-drop",
  normal: "default",
  layer: "cell",
  move: "move",
};

const App = (props) => {
  let [menu, menuState] = React.useState({
    comp: <div />,
  });

  let [layerGroups, layerGroupsState] = React.useState({
    layerGroups: Object.keys(_lg),
    ...window.copy(_lg),
  });

  let [layers, layersState] = React.useState({"mnist_1": {"id": "mnist_1", "name": "MNIST 1", "type": "Dataset", "pos": {"x": 263, "y": 15}, "connections": {"inbound": [], "outbound": ["input_1"]}, "arguments": {"dataset": {"value": "\"\"\"\nNote : Don't change dataset id.\nAll the required packages have been imported with their standard namespaces.\n\ntensorflow as tf\nkeras as keras\npandas as pd\nnumpy as np\n\nfrom sklearn.model_selection , train_test_split\n\"\"\"\n\n#dataset id=mnist_1\nclass Dataset:\n    \"\"\"\n    Dataset will be used in training \n\n    The dataset object needs to have following attributes\n\n    train_x : np.ndarray -> Training features\n    train_y : np.ndarray -> Training labels \n    test_x : np.ndarray -> Testing features\n    test_y : np.ndarray -> Testing labels\n\n    validate : bool -> Weather use validation data or not\n\n    batch_size : int -> Batch size\n    epochs : int -> Number of epochs\n    batches : int -> Number of batches ( Will be calculated automatically )\n    \"\"\"\n    train_x = None\n    test_x = None\n    train_y = None\n    test_y = None\n\n    validate = True\n\n    def __init__(self) -> None:\n        \"\"\"\n        Load dataset and set required variables.\n        \"\"\"\n\n        (X,Y),(x,y) = keras.datasets.mnist.load_data()\n\n        self.train_x = X.reshape(-1,784) / 255\n        self.train_y = keras.utils.to_categorical(Y)\n        self.test_x = X.reshape(-1,784) / 255\n        self.test_y = keras.utils.to_categorical(Y)\n    \n# Do not change the anything.\nmnist_1 = Dataset()\n#end-dataset id=mnist_1\n                    ", "type": "dataset", "render": "dataset"}}}, "input_1": {"id": "input_1", "name": "Input 1", "type": "Input", "pos": {"x": 307, "y": 118}, "connections": {"inbound": ["mnist_1"], "outbound": ["dense_1"]}, "arguments": {"shape": {"value": "( 784, )", "type": "str", "render": "text", "options": "shape"}, "batch_size": {"value": "None", "type": "str", "render": "text", "options": "size"}, "name": {"value": "None", "type": "str", "render": "text", "options": "name"}, "dtype": {"value": "None", "type": "str", "render": "text", "options": "dtype"}, "sparse": {"value": "False", "type": "str", "render": "list", "options": "bool"}, "tensor": {"value": "None", "type": "str", "render": "text", "options": "tensor"}, "ragged": {"value": "False", "type": "str", "render": "list", "options": "bool"}}}, "dense_1": {"id": "dense_1", "name": "Dense 1", "type": "Dense", "pos": {"x": 313, "y": 219}, "connections": {"inbound": ["input_1"], "outbound": ["batchnormalization_1"]}, "arguments": {"units": {"value": "10", "type": "str", "render": "text", "options": "units"}, "activation": {"value": "None", "type": "str", "render": "list", "options": "activation"}, "use_bias": {"value": "True", "type": "str", "render": "list", "options": "bool"}, "kernel_regularizer": {"value": "None", "type": "str", "render": "list", "options": "regularizer"}, "bias_regularizer": {"value": "None", "type": "str", "render": "list", "options": "regularizer"}, "activity_regularizer": {"value": "None", "type": "str", "render": "list", "options": "regularizer"}, "kernel_constraint": {"value": "None", "type": "str", "render": "list", "options": "constraint"}, "bias_constraint": {"value": "None", "type": "str", "render": "list", "options": "constraint"}}}, "activation_1": {"id": "activation_1", "name": "Activation 1", "type": "Activation", "pos": {"x": 322, "y": 428}, "connections": {"inbound": ["batchnormalization_1"], "outbound": ["model_1"]}, "arguments": {"activation": {"value": "softmax", "type": "str", "render": "list", "options": "activation"}}}, "batchnormalization_1": {"id": "batchnormalization_1", "name": "BatchNormalization 1", "type": "BatchNormalization", "pos": {"x": 273, "y": 323}, "connections": {"inbound": ["dense_1"], "outbound": ["activation_1"]}, "arguments": {"momentum": {"value": "0.99", "type": "str", "render": "text", "options": "momentum"}, "epsilon": {"value": "0.001", "type": "str", "render": "text", "options": "epsilon"}, "center": {"value": "True", "type": "str", "render": "list", "options": "bool"}, "scale": {"value": "True", "type": "str", "render": "list", "options": "bool"}, "beta_regularizer": {"value": "None", "type": "str", "render": "list", "options": "regularizer"}, "gamma_regularizer": {"value": "None", "type": "str", "render": "list", "options": "regularizer"}, "beta_constraint": {"value": "None", "type": "str", "render": "list", "options": "constraint"}, "gamma_constraint": {"value": "None", "type": "str", "render": "list", "options": "constraint"}, "renorm": {"value": "False", "type": "str", "render": "list", "options": "bool"}, "renorm_clipping": {"value": "None", "type": "str", "render": "text", "options": "clipping"}, "renorm_momentum": {"value": "0.99", "type": "str", "render": "text", "options": "momentum"}, "fused": {"value": "None", "type": "str", "render": "text", "options": "fused"}, "trainable": {"value": "True", "type": "str", "render": "list", "options": "bool"}, "virtual_batch_size": {"value": "None", "type": "str", "render": "text", "options": "size"}, "adjustment": {"value": "None", "type": "str", "render": "text", "options": "adjustment"}, "name": {"value": "None", "type": "str", "render": "text", "options": "name"}}}, "adam_1": {"id": "adam_1", "name": "Adam 1", "type": "Optimizer", "pos": {"x": 573, "y": 552}, "connections": {"inbound": [], "outbound": ["compile_1"]}, "arguments": {"learning_rate": {"value": "0.001", "type": "str", "render": "text", "options": "rate"}, "beta_1": {"value": "0.9", "type": "str", "render": "text", "options": "1"}, "beta_2": {"value": "0.999", "type": "str", "render": "text", "options": "2"}, "epsilon": {"value": "1e-07", "type": "str", "render": "text", "options": "epsilon"}, "amsgrad": {"value": "False", "type": "str", "render": "list", "options": "bool"}, "name": {"value": "Adam", "type": "str", "render": "text", "options": "name"}}}, "modelcheckpoint_1": {"id": "modelcheckpoint_1", "name": "ModelCheckpoint 1", "type": "Callback", "pos": {"x": 622, "y": 714}, "connections": {"inbound": [], "outbound": ["train_1"]}, "arguments": {"filepath": {"value": "./temp/model", "type": "str", "render": "text", "options": "filepath"}, "monitor": {"value": "val_loss", "type": "str", "render": "text", "options": "monitor"}, "verbose": {"value": "0", "type": "str", "render": "text", "options": "verbose"}, "save_best_only": {"value": "False", "type": "str", "render": "list", "options": "bool"}, "save_weights_only": {"value": "False", "type": "str", "render": "list", "options": "bool"}, "mode": {"value": "auto", "type": "str", "render": "text", "options": "mode"}, "save_freq": {"value": "epoch", "type": "str", "render": "text", "options": "freq"}, "options": {"value": "None", "type": "str", "render": "text", "options": "options"}}}, "model_1": {"id": "model_1", "name": "Model 1", "type": "Model", "pos": {"x": 326, "y": 537}, "connections": {"inbound": ["activation_1"], "outbound": ["compile_1"]}, "arguments": {}}, "compile_1": {"id": "compile_1", "name": "Compile 1", "type": "Compile", "pos": {"x": 389, "y": 669}, "connections": {"inbound": ["model_1", "adam_1"], "outbound": ["train_1"]}, "arguments": {"optmizer": {"value": "None", "type": "list", "render": "list", "options": "optimizer"}, "loss": {"value": "categorical_crossentropy", "type": "list", "render": "list", "options": "loss"}}}, "train_1": {"id": "train_1", "name": "Train 1", "type": "Train", "pos": {"x": 457, "y": 821}, "connections": {"inbound": ["compile_1", "modelcheckpoint_1"], "outbound": []}, "arguments": {"batch_size": {"value": "32", "type": "int", "render": "text", "options": "batch_size"}, "epochs": {"value": "3", "type": "int", "render": "text", "options": "batch_size"}}}});

  let [trainingStatus, trainingStatusState] = React.useState({
    status: [],
    update_id: 0,
  });

  let [code, codeState] = React.useState({
    data: "",
  });

  function layerIdGenerator(name = "") {
    name = name.toLowerCase();
  
    if (window.__LAYER_COUNT[name]) {
      window.__LAYER_COUNT[name] = window.__LAYER_COUNT[name] + 1;
    } else {
      window.__LAYER_COUNT[name] = 1;
    }
  
    return window.__LAYER_COUNT[name];
  }
  
  // Toolbar Functions
  function downLine(e) {
    e.preventDefault();
    document.getElementById("svg-canvas").innerHTML =
      document.getElementById("svg-canvas").innerHTML +
      `<line 
          id='${"line-" + window.__LINE_COUNTER}' 
          x1="${e.pageX}" y1="${e.pageY}" 
          x2="${e.pageX + 1}" y2="${e.pageY + 1}" 
          stroke="#333" 
          stroke-width="2"
          marker-end="url(#arrow)"
        />`;
    window.__ACTIVE_LINE__ = {
      line: document.getElementById("line-" + window.__LINE_COUNTER),
    };
    window.__LINE_COUNTER++;
  }
  
  function downDelete(e) {
    e.preventDefault();
  }
  
  function downLayer(e) {
    e.preventDefault();
    let name = window.__ACTIVE_LAYER__.name;
    let id = layerIdGenerator(name);
    window.layers[name.toLowerCase() + "_" + id] = {
      id: name.toLowerCase() + "_" + id,
      name: name + " " + id,
      type: window.__ACTIVE_LAYER__.type,
      pos: {
        x: e.pageX - 90,
        y: e.pageY - 30,
      },
      connections: {
        inbound: [],
        outbound: [],
      },
      arguments: { ...window.__ACTIVE_LAYER__.args },
    };
    layersState({
      ...layers,
    });
    window.__LINE_COUNTER++;
    window.__ACTIVE_LAYER__ = undefined;
    setMode("normal");
  }
  
  function moveNode(e) {
    e.preventDefault();
    if (window.__ACTIVE_ELEMENT__) {
      document.getElementById("canvas").style.height =
        Math.max(window.innerHeight, e.pageY + 50) + "px";
      window.__ACTIVE_ELEMENT__.target.style.left = e.pageX - 80 + "px";
      window.__ACTIVE_ELEMENT__.target.style.top = e.pageY - 30 + "px";
      window.__POS__ = {
        x: e.pageX - 80,
        y: e.pageY - 30,
      };
    }
  }
  
  function moveEdgeEnd(e) {
    e.preventDefault();
    if (window.__ACTIVE_LINE__) {
      window.__ACTIVE_LINE__.line.x2.baseVal.value = e.pageX;
      window.__ACTIVE_LINE__.line.y2.baseVal.value = e.pageY;
    }
  }
  
  let modeFunctions = {
    move: function () {
      // console.log("setting move mode")
  
      document.getElementById("canvas").onmousemove = moveNode;
      document.getElementById("canvas").onmousedown = undefined;
    },
    line: function () {
      // console.log("setting line mode")
  
      document.getElementById("canvas").onmousemove = moveEdgeEnd;
      document.getElementById("canvas").onmousedown = downLine;
    },
    delete: function () {
      // console.log("setting delete mode")
  
      document.getElementById("canvas").onmousemove = undefined;
      document.getElementById("canvas").onmousedown = downDelete;
    },
    layer: function () {
      // console.log("setting layer mode")
  
      document.getElementById("canvas").onmousemove = undefined;
      document.getElementById("canvas").onmousedown = downLayer;
    },
    normal: function () {
      // console.log("setting normal mode")
  
      document.getElementById("canvas").onmousemove = undefined;
      document.getElementById("canvas").onmousedown = undefined;
    },
  };
  
  function setMode(mode) {
    if (window.__MODE__ !== mode) {
      window.__MODE__ = mode;
      document.getElementById("canvas").style.cursor = cursors[window.__MODE__];
      if (modeFunctions[mode]) {
        modeFunctions[mode]();
      }
    } else {
      window.__MODE__ = "normal";
      document.getElementById("canvas").style.cursor = "default";
  
      document.getElementById("canvas").onmousemove = undefined;
      document.getElementById("canvas").onmousedown = undefined;
    }
  }
  
  function toolbarHandler(
    data = { mode: undefined, layer: { name: "__LAYER__", args: {} } }
  ) {
    if (data.mode === "layer") {
      if (window.__MODE__ !== "layer") {
        window.__MODE__ = "layer";
        document.getElementById("canvas").style.cursor = cursors[window.__MODE__];
        window.__ACTIVE_LAYER__ = window.copy(data.layer);
        modeFunctions.layer();
      } else {
        if (window.__ACTIVE_LAYER__.name === data.layer.name) {
          window.__MODE__ = "normal";
          document.getElementById("canvas").style.cursor = "default";
          window.__ACTIVE_LAYER__ = undefined ;
        } else {
          window.__ACTIVE_LAYER__ =  window.copy(data.layer);
        }
      }
    } else {
      setMode(data.mode);
    }
  }
  
  function toggleSection(e) {
    layerGroups[e.target.id].visible = ~layerGroups[e.target.id].visible
    layerGroupsState({
      ...layerGroups,
    });
  }
  
  const LayerGroupCollapsed = (props) => {
    return (
      <div className="layers" key={props.i} style={{ height: "45px" }}>
        <div
          className="name"
          id={props.id}
          style={{ height: "45px" }}
          onClick={props.toggleSection}
        >
          {props.layerGroup.name}
        </div>
      </div>
    );
  };
  
  const LayerGroupOpen = (props) => {
    return (
      <div className="layers" key={props.i}>
        <div className="name" id={props.id} onClick={props.toggleSection}>
          {props.layerGroup.name}
        </div>
        <div className="grid">
          {props.layerGroup.layers.map((layer, j) => {
            return (
              <div
                className="btn"
                onClick={(e) => {
                  toolbarHandler({ mode: "layer", layer: { ...layer } });
                }}
                id="btn-del"
                key={j}
              >
                {layer.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  let [comp, compState] = React.useState({
    state: true,
    render: (
      <Canvas
        layers={layers}
        layersState={layersState}
        menu={menu}
        menuState={menuState}
        layerGroups={layerGroups}
        layerGroupsState={layerGroupsState}
      />
    ),
  });

  async function loadCode(e) {
    await fetch("http://localhost/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...window.layers }),
    })
      .then((response) => response.json())
      .then((data) => {
        codeState({
          data:data.code,
        })
        compState({
          state:false
        })
      });
  }

  async function trainModel(e) {
    window.__TRAIN__ = true;
    await fetch(
      "http://localhost/build",
      {
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...window.layers })
      }
    )
    .then(response=>response.json())
    .then(data=>{
      codeState({data:data.code})
      compState({
        state: false,
      });
    })
  }

  async function getStatus() {
    if (window.__TRAIN__) {
      window.__UPDATE_RUNNING__ = true;
      await fetch("http://localhost/status", {
        method: "GET",
      })
        .then((respomse) => respomse.json())
        .then((data) => {
          if (data.update_id !== trainingStatus.update_id) {
            trainingStatusState({
              ...data,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setTimeout(getStatus, 10);
  }

  React.useEffect(() => {
    window.layers = layers;
    window.layersState = layersState;
    window.menu = menu;
    window.menuState = menuState;
    window.layerGroups = layerGroups;
    window.layerGroupsState = layerGroupsState;
    window.comp = comp;
    window.compState = compState;
    window.trainingStatus = trainingStatus;
    window.trainingStatusState = trainingStatusState;


    window.__UPDATE_RUNNING__ = false;
    if (window.__UPDATE_INTERVAL){
      clearTimeout(window.__UPDATE_INTERVAL)
      window.__UPDATE_INTERVAL = undefined;
    }

  }, [
    layers,
    layersState,
    menu,
    menuState,
    layerGroups,
    layerGroupsState,
    trainingStatus,
    trainingStatusState,
    comp,
    compState,
  ]);

  
  return (
    <div
      className="app"
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          e.preventDefault();
        }
      }}
    >
      {menu.comp}
      <div className="nav">
        <div className="title">Tensorflow Builder 1.0.0</div>
        <div className="toolbar">
          <div
            className="btn"
            onClick={(e) => {
              compState({
                state:true
              })
            }}
          >
            Nodes
          </div>
          <div 
            className="btn" 
            onClick={trainModel}
          >
            Code
          </div>
          <div
            className="btn"
            onClick={(e) => {
              loadCode();
            }}
          >
            Clean
          </div>
          <div
            className="btn named"
            onClick={(e) => {
              toolbarHandler({ mode: "delete" });
            }}
            id="btn-del"
          >
            Delete
          </div>
          <div
            className="btn named"
            onClick={(e) => {
              toolbarHandler({ mode: "line" });
            }}
            id="btn-lin"
          >
            Edge
          </div>
          <div
            className="btn named"
            onClick={(e) => {
              toolbarHandler({ mode: "move" });
            }}
            id="btn-del"
          >
            Move
          </div>
          <div
            className="btn named"
            onClick={(e) => {
              toolbarHandler({ mode: "normal" });
            }}
            id="btn-del"
          >
            Normal
          </div>
          
        </div>
        <div className="head">
          Layers 
        </div>
        <div className="layergroups">
          {layerGroups.layerGroups.map((layerGroup, i) => {
            return layerGroups[layerGroup].visible ? (
              <LayerGroupOpen
                key={i}
                i={i}
                id={layerGroup}
                layerGroup={layerGroups[layerGroup]}
                toggleSection={toggleSection}
              />
            ) : (
              <LayerGroupCollapsed
                key={i}
                i={i}
                id={layerGroup}
                layerGroup={layerGroups[layerGroup]}
                toggleSection={toggleSection}
              />
            );
          })}
        </div>
      </div>
      {comp.state ? (
        <Canvas
          layers={layers}
          layersState={layersState}
          menu={menu}
          menuState={menuState}
          layerGroups={layerGroups}
          layerGroupsState={layerGroupsState}
        />
      ) : (
        <CodeEditor 
          code={code} 
          codeState={codeState} 

          layers={layers}
          layersState={layersState}
        />
      )}
    </div>
  );
};

export default App;

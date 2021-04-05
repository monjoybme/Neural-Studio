import React from "react";

import Canvas from "./GraphCanvas";

import "./App.css";
import _lg  from "./data/layers";
import CodeEditor from "./CodeEditor";

window.copy = function(object){
  return JSON.parse(JSON.stringify(object))
}

setInterval(function(){
  window.offsetX = Math.floor(window.innerWidth * 0.1525)
},1000)

let example = {
  "mnist_2": {
    "id": "mnist_2",
    "name": "MNIST 2",
    "type": {
        "_class": "datasets",
        "name": "Dataset"
    },
    "pos": {
        "x": 368,
        "y": 37
    },
    "connections": {
        "inbound": [],
        "outbound": [
            "input_1"
        ]
    },
    "arguments": {
        "dataset": {
            "value": "\"\"\"\nNote : Don't change dataset id.\nAll the required packages have been imported with their standard namespaces.\n\ntensorflow as tf\nkeras as keras\npandas as pd\nnumpy as np\n\nfrom sklearn.model_selection , train_test_split\n\"\"\"\n\n#dataset id=mnist_2\nclass Dataset:\n    \"\"\"\n    Dataset will be used in training \n\n    The dataset object needs to have following attributes\n\n    train_x : np.ndarray -> Training features\n    train_y : np.ndarray -> Training labels \n    test_x : np.ndarray -> Testing features\n    test_y : np.ndarray -> Testing labels\n\n    validate : bool -> Weather use validation data or not\n\n    batch_size : int -> Batch size\n    epochs : int -> Number of epochs\n    batches : int -> Number of batches ( Will be calculated automatically )\n    \"\"\"\n    train_x = None\n    test_x = None\n    train_y = None\n    test_y = None\n\n    validate = True\n\n    def __init__(self) -> None:\n        \"\"\"\n        Load dataset and set required variables.\n        \"\"\"\n\n        (X,Y),(x,y) = keras.datasets.mnist.load_data()\n\n        self.train_x = X.reshape(-1,784) / 255\n        self.train_y = keras.utils.to_categorical(Y)\n        self.test_x = X.reshape(-1,784) / 255\n        self.test_y = keras.utils.to_categorical(Y)\n    \n# Do not change the anything.\nmnist_2 = Dataset()\n#end-dataset id=mnist_2\n                    ",
            "type": "dataset",
            "render": "dataset"
        }
    }
},
"input_1": {
    "id": "input_1",
    "name": "Input 1",
    "type": {
        "name": "Input",
        "_class": "layers"
    },
    "pos": {
        "x": 365,
        "y": 157
    },
    "connections": {
        "inbound": [
            "mnist_2"
        ],
        "outbound": [
            "dense_1"
        ]
    },
    "arguments": {
        "shape": {
            "value": "( 784, )",
            "type": "str",
            "render": "text",
            "options": "shape"
        },
        "batch_size": {
            "value": "None",
            "type": "str",
            "render": "text",
            "options": "size"
        },
        "name": {
            "value": "None",
            "type": "str",
            "render": "text",
            "options": "name"
        },
        "dtype": {
            "value": "None",
            "type": "str",
            "render": "text",
            "options": "dtype"
        },
        "sparse": {
            "value": "False",
            "type": "str",
            "render": "list",
            "options": "bool"
        },
        "tensor": {
            "value": "None",
            "type": "str",
            "render": "text",
            "options": "tensor"
        },
        "ragged": {
            "value": "False",
            "type": "str",
            "render": "list",
            "options": "bool"
        }
    }
},
"dense_1": {
    "id": "dense_1",
    "name": "Dense 1",
    "type": {
        "name": "Dense",
        "_class": "layers"
    },
    "pos": {
        "x": 381,
        "y": 278
    },
    "connections": {
        "inbound": [
            "input_1"
        ],
        "outbound": [
          
        ]
    },
    "arguments": {
        "units": {
            "value": "10",
            "type": "str",
            "render": "text",
            "options": "units"
        },
        "activation": {
            "value": "None",
            "type": "str",
            "render": "list",
            "options": "activation"
        },
        "use_bias": {
            "value": "True",
            "type": "str",
            "render": "list",
            "options": "bool"
        },
        "kernel_regularizer": {
            "value": "None",
            "type": "str",
            "render": "list",
            "options": "regularizer"
        },
        "bias_regularizer": {
            "value": "None",
            "type": "str",
            "render": "list",
            "options": "regularizer"
        },
        "activity_regularizer": {
            "value": "None",
            "type": "str",
            "render": "list",
            "options": "regularizer"
        },
        "kernel_constraint": {
            "value": "None",
            "type": "str",
            "render": "list",
            "options": "constraint"
        },
        "bias_constraint": {
            "value": "None",
            "type": "str",
            "render": "list",
            "options": "constraint"
        }
    }
},
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

  let [layers, layersState] = React.useState({ });

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
    let scroll = document.getElementById("canvasTop");
    let pos = {
      x: e.clientX-window.offsetX + scroll.scrollLeft,
      y:e.clientY + scroll.scrollTop 
    } 
    let id = "line-" + window.__LINE_COUNTER;
    let line = document.getElementById("dummy");
    line.id = id;
    line.style.strokeWidth = 2;
    
    line.x1.baseVal.value = pos.x;
    line.y1.baseVal.value = pos.y;
    line.x2.baseVal.value = pos.x+1;
    line.y2.baseVal.value = pos.y+1;
    
    window.__ACTIVE_LINE__ = {
      line: line,
    };
    window.__LINE_COUNTER++;
  }
  
  function downDelete(e) {
    e.preventDefault();
  }
  
  function downLayer(e) {
    e.preventDefault();
    let name = window.__ACTIVE_LAYER__.name;
    let n =  layerIdGenerator(name);
    let id = name.toLowerCase().replaceAll(" ","_") + "_" + n; 

    layers[id] = {
      id: id,
      name: name + " " + n,
      type: window.__ACTIVE_LAYER__.type,
      pos: {
        x:0,y:0
      },
      connections: {
        inbound: [],
        outbound: [],
      },
      width: 0,
      arguments: { ...window.__ACTIVE_LAYER__.args },
    };

    let scroll = document.getElementById("canvasTop");

    layers[id].width = layers[id].name.length * 12;

    layers[id].pos = {
      x: e.clientX-window.offsetX + scroll.scrollLeft - layers[id].width / 2,
      y:e.clientY + scroll.scrollTop - 20,
      offsetX : layers[id].name.length * 6,
      offsetY : 20
    }

    layersState({
      ...layers,
    });

    window.__LINE_COUNTER++;
    window.__ACTIVE_LAYER__ = undefined;
    
    setMode("normal");
  }

  function moveNode(e) {      
    if (window.__ACTIVE_ELEMENT__){
      let scroll = document.getElementById("canvasTop");
      let pos = layers[window.__ACTIVE_ELEMENT__].pos;
      layers[window.__ACTIVE_ELEMENT__].pos = {
        x: e.clientX-window.offsetX + scroll.scrollLeft - pos.offsetX,
        y:e.clientY + scroll.scrollTop - 20,
        offsetX:pos.offsetX,
        offsetY:pos.offsetY
      }
      layersState({
        ...layers
      })
    }
  }
  
  function moveEdgeEnd(e) {
    e.preventDefault();
    if (window.__ACTIVE_LINE__) {
      let scroll = document.getElementById("canvasTop"); 
      window.__ACTIVE_LINE__.line.x2.baseVal.value = e.clientX-window.offsetX + scroll.scrollLeft;
      window.__ACTIVE_LINE__.line.y2.baseVal.value = e.clientY + scroll.scrollTop;
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

  async function saveGraph(e) {
    let name = prompt("Enter Graph Name : ","graph");
    await fetch(
      "http://localhost/graph/save",
      {
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            graph:{ ...window.layers },
            name:name,
        })
      }
    )
    .then(response=>response.json())
    .then(data=>{
      console.log(data);
    })
  }

  async function loadGraph(e) {
    let input = document.createElement("input");
    input.type = 'file';
    input.onchange = function(e){
      var reader = new FileReader();
      reader.onload = function(){
          layersState({...JSON.parse(reader.result)})
      }
              
      reader.readAsText(e.target.files[0]);
    }
    input.click()
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
            onClick={saveGraph}
          >
            Save
          </div>
          <div
            className="btn"
            onClick={loadGraph}
          >
            Load
          </div>
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
              layersState({})
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
   
      {
        comp.state ? (
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
        )
      }
    </div>
  );
};

export default App;

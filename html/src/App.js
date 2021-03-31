import React from "react";

import Canvas from "./GraphCanvas";
import Training from "./Training";

import "./App.css";
import { layerGroups as _lg, example } from "./data/layers";
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

  let [layers, layersState] = React.useState({});

  let [trainingStatus, trainingStatusState] = React.useState({
    status: [],
    update_id: 0,
  });

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
  
  async function buildModel(e) {
    await fetch("http://localhost/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...window.layers }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.code);
        // let link = document.createElement("a");
        // link.href = `data:text/x-python,${data.code}`;
        // link.download = "train.py";
        // link.click();
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

    if (!window.__UPDATE_RUNNING__) {
      // getStatus();
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
              compState({ state: true });
            }}
          >
            Build
          </div>
          <div 
            className="btn" 
            onClick={trainModel}
          >
            Train
          </div>
          <div
            className="btn"
            onClick={(e) => {
              layersState({ ...example });
            }}
          >
            Load Example
          </div>
          <div
            className="btn"
            onClick={(e) => {
              layersState({  });
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
        <CodeEditor code={code} codeState={codeState} />
      )}
    </div>
  );
};

export default App;

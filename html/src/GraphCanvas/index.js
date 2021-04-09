import React from "react";
import Menu from "./menu";

import _lg from "../data/layers";

import "./canvas.css";

let cursors = {
  line: "crosshair",
  delete: "no-drop",
  normal: "default",
  layer: "cell",
  move: "move",
};

const Node = (props) => {
  let layer = props.layer;
  let width = layer.width;

  function onMouseDown(e) {
    e.preventDefault();
    switch (window.__MODE__) {
      case "move":
        window.__ACTIVE_ELEMENT__ = layer.id;
        break;
      case "line":
        window.__NEW_EDGE__ = { from: layer.id };
        break;
      default:
        break
    }
  }

  function onMouseUp(e) {
    e.preventDefault();
    switch (window.__MODE__) {
      case "move":
        window.__ACTIVE_ELEMENT__ = undefined;
        break;
      case "line":
        window.__NEW_EDGE__.to = layer.id;
        break;
      default:
        break
    }
  }

  function onClick(e) {
    switch (window.__MODE__) {
      case "delete":
        layer.connections.inbound.forEach((lid) => {
          window.layers[lid].connections.outbound.pop(layer.id);
        });
        layer.connections.outbound.forEach((lid) => {
          window.layers[lid].connections.inbound.pop(layer.id);
        });
        delete window.layers[layer.id];
        window.layersState({ ...window.layers });
        break;
      case "normal":
        props.menuState({
          comp: (
            <Menu
              layer={props.layer}
              menu={props.menu}
              menuState={props.menuState}

              layers={window.layers}
              layersState={window.layersState}
            />
          ),
        });
        break;
      default:
        break
    }
  }

  return (
    <g x={layer.pos.x} y={layer.pos.y}>
      <rect
        x={layer.pos.x}
        y={layer.pos.y}
        rx={3}
        ry={3}
        height={40}
        width={width}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
      ></rect>
      <text
        x={layer.pos.x + Math.floor(width / 4.75)}
        y={layer.pos.y + 25}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
      >
        {layer.name}
      </text>
    </g>
  );
};

const Edge = (props) => {
  let pos_out = props.layer.pos;
  return (
    <g>
      {props.layer.connections.outbound.map((layer, i) => {
        let pos_in = window.layers[layer];
        if (pos_in) {
          return (
            <line
              x1={pos_out.x + pos_out.offsetX}
              y1={pos_out.y + 20}
              x2={pos_in.pos.x + pos_in.pos.offsetX}
              y2={pos_in.pos.y + 20}
              markerMid="url(#triangle)"
              stroke="rgba( 100, 100, 100, 0.2)"
              strokeWidth="4"
              key={i}
            />
          );
        }
        return undefined
      })}
      {props.layer.connections.outbound.map((layer, i) => {
        let pos_in = window.layers[layer];
        if (pos_in) {
          return (
            <line
              x1={pos_out.x + pos_out.offsetX}
              y1={pos_out.y + 20}
              x2={pos_in.pos.x + pos_in.pos.offsetX}
              y2={pos_in.pos.y + 20}
              markerMid="url(#triangle)"
              stroke="#222"
              strokeWidth="1"
              key={i}
            />
          );
        }
        return undefined
      })}
    </g>
  );
};

const Toolbar = (props) => {
  let buttons = [
    {
      name: "Normal",
      func: function () {
        props.tools.toolbarHandler({ mode: "normal" });
      },
    },
    {
      name: "Edge",
      func: function () {
        props.tools.toolbarHandler({ mode: "line" });
      },
    },
    {
      name: "Move",
      func: function () {
        props.tools.toolbarHandler({ mode: "move" });
      },
    },
    {
      name: "Delete",
      func: function () {
        props.tools.toolbarHandler({ mode: "delete" });
      },
    },
    {
      name: "Clean",
      func: function () {
        window.layersState({});
      },
    },
  ];

  return (
    <div className="toolbar">
      {buttons.map((button, i) => {
        return (
          <div className="btn" onClick={button.func} key={i}>
            {button.name}
          </div>
        );
      })}
    </div>
  );
};

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
                props.tools.toolbarHandler({
                  mode: "layer",
                  layer: { ...layer },
                });
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

const LayerGroups = (props) => {
  let [layerGroups, layerGroupsState] = React.useState({
    layerGroups: Object.keys(_lg),
    ...window.copy(_lg),
  });

  function toggleSection(e) {
    layerGroups[e.target.id].visible = ~layerGroups[e.target.id].visible;
    layerGroupsState({
      ...layerGroups,
    });
  }

  return (
    <div className="layergroups">
      {layerGroups.layerGroups.map((layerGroup, i) => {
        return layerGroups[layerGroup].visible ? (
          <LayerGroupOpen
            key={i}
            i={i}
            id={layerGroup}
            layerGroup={layerGroups[layerGroup]}
            toggleSection={toggleSection}
            tools={props.tools}
          />
        ) : (
          <LayerGroupCollapsed
            key={i}
            i={i}
            id={layerGroup}
            layerGroup={layerGroups[layerGroup]}
            toggleSection={toggleSection}
            tools={props.tools}
          />
        );
      })}
    </div>
  );
};

const Canvas = (props={layers:{},layersState:undefined}) => {
  let [menu, menuState] = React.useState({
    comp: <div />,
  });

  let { layers, layersState } = props;

  function layerIdGenerator(name = "") {
    name = name.toLowerCase();

    if (window.__LAYER_COUNT[name]) {
      window.__LAYER_COUNT[name] = window.__LAYER_COUNT[name] + 1;
    } else {
      window.__LAYER_COUNT[name] = 1;
    }

    return window.__LAYER_COUNT[name];
  }

  function downLine(e) {
    e.preventDefault();
    let scroll = document.getElementById("canvasTop");
    let pos = {
      x: e.clientX - window.offsetX + scroll.scrollLeft - 5,
      y: e.clientY - window.offsetY + scroll.scrollTop + 10,
    };
    let id = "line-" + window.__LINE_COUNTER;
    let _line = document.getElementById("dummy");
    _line.id = id;
    _line.style.strokeWidth = 2;

    _line.x1.baseVal.value = pos.x;
    _line.y1.baseVal.value = pos.y;
    _line.x2.baseVal.value = pos.x + 1;
    _line.y2.baseVal.value = pos.y + 1;

    window.__ACTIVE_LINE__ = {
      line: _line,
    };
    window.__LINE_COUNTER++;
  }

  function downDelete(e) {
    e.preventDefault();
  }

  function downLayer(e) {
    e.preventDefault();
    let layer = window.copy(window.__ACTIVE_LAYER__);
    let name = layer.name;
    let n = layerIdGenerator(name);
    let id = name.toLowerCase().replaceAll(" ", "_") + "_" + n;

    window.layers[id] = {
      id: id,
      name: name + " " + n,
      type: layer.type,
      pos: {
        x: 0,
        y: 0,
      },
      connections: {
        inbound: [],
        outbound: [],
      },
      width: 0,
      arguments: { ...layer.args },
    };

    let scroll = document.getElementById("canvasTop");
    window.layers[id].width = window.layers[id].name.length * 12;
    window.layers[id].pos = {
      x: e.clientX - window.offsetX + scroll.scrollLeft - window.layers[id].width / 2,
      y: e.clientY - window.offsetY + scroll.scrollTop - 5,
      offsetX: window.layers[id].name.length * 6,
      offsetY: 20,
    };

    window.layersState({
      ...window.layers,
    });

    window.__LINE_COUNTER++;
  }

  function moveNode(e) {
    if (window.__ACTIVE_ELEMENT__) {
      let scroll = document.getElementById("canvasTop");
      let pos = window.layers[window.__ACTIVE_ELEMENT__].pos;
      window.layers[window.__ACTIVE_ELEMENT__].pos = {
        x: e.clientX - window.offsetX + scroll.scrollLeft - pos.offsetX,
        y: e.clientY - window.offsetY + scroll.scrollTop - 20,
        offsetX: pos.offsetX,
        offsetY: pos.offsetY,
      };
      window.layersState({
        ...window.layers,
      });
    }
  }

  function moveEdgeEnd(e) {
    e.preventDefault();
    if (window.__ACTIVE_LINE__) {
      let scroll = document.getElementById("canvasTop");
      window.__ACTIVE_LINE__.line.x2.baseVal.value =
        e.clientX - window.offsetX + scroll.scrollLeft - 5;
      window.__ACTIVE_LINE__.line.y2.baseVal.value =
        e.clientY - window.offsetY + scroll.scrollTop + 10;
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
        document.getElementById("canvas").style.cursor =
          cursors[window.__MODE__];
        window.__ACTIVE_LAYER__ = window.copy(data.layer);
        modeFunctions.layer();
      } else {
        if (window.__ACTIVE_LAYER__.name === data.layer.name) {
          window.__MODE__ = "normal";
          document.getElementById("canvas").style.cursor = "default";
          window.__ACTIVE_LAYER__ = undefined;
        } else {
          window.__ACTIVE_LAYER__ = window.copy(data.layer);
        }
      }
    } else {
      setMode(data.mode);
    }
  }

  function onMouseUp(e) {
    if (window.__ACTIVE_LINE__) {
      if (window.__NEW_EDGE__) {
        let edge = window.__NEW_EDGE__;
        if (edge.from && edge.to && edge.from !== edge.to) {
          if (
            window.layers[edge.from].connections.outbound.lastIndexOf(edge.to) === -1
          ) {
            window.layers[edge.from].connections.outbound.push(edge.to);
          }
          if (
            window.layers[edge.to].connections.inbound.lastIndexOf(edge.from) === -1
          ) {
            window.layers[edge.to].connections.inbound.push(edge.from);
          }
          window.layersState({
            ...window.layers,
          });
        }
      }
      window.__ACTIVE_LINE__.line.style.strokeWidth = 0;
      window.__ACTIVE_LINE__.line.x1.baseVal.value = 0;
      window.__ACTIVE_LINE__.line.y1.baseVal.value = 0;
      window.__ACTIVE_LINE__.line.x2.baseVal.value = 1;
      window.__ACTIVE_LINE__.line.y2.baseVal.value = 1;
      window.__ACTIVE_LINE__.line.id = "dummy";
      window.__NEW_EDGE__ = undefined;
    } else if (window.__ACTIVE_ELEMENT__) {
      if (window.__POS__) {
        let layer = window.__ACTIVE_ELEMENT__.target.id.split("-")[1];
        window.window.layers[layer].pos = window.__POS__;
        window.layersState({
          ...window.layers,
        });
      }
    }

    window.__POS__ = undefined;
    window.__ACTIVE_ELEMENT__ = undefined;
    window.__ACTIVE_LINE__ = undefined;

    menuState({
      comp: <div />,
    });
  }

  let tools = {
    layerIdGenerator: layerIdGenerator,
    downLine: downLine,
    downDelete: downDelete,
    downLayer: downLayer,
    moveNode: moveNode,
    moveEdgeEnd: moveEdgeEnd,
    modeFunctions: modeFunctions,
    setMode: setMode,
    toolbarHandler: toolbarHandler,
    onMouseUp: onMouseUp,
  };

  React.useEffect(()=>{
    window.layers = layers;
    window.layersState = layersState;
  })

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
      <div className="tools">
        <Toolbar tools={tools} />
        <LayerGroups tools={tools} />
      </div>
      <div className="canvas-top" id="canvasTop">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="canvas"
          id="canvas"
          onMouseUp={onMouseUp}
        >
          <marker
            xmlns="http://www.w3.org/2000/svg"
            id="triangle"
            viewBox="0 0 10 10"
            refX="0"
            refY="5"
            markerUnits="strokeWidth"
            markerWidth="4"
            markerHeight="3"
            orient="auto"
            
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <line
            id="dummy"
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="#333"
            strokeWidth="0"
            markerEnd="url(#triangle)"
          />
          {Object.keys(window.layers).map((layer, i) => {
            return <Edge layers={window.layers} layer={window.layers[layer]} key={i} />;
          })}
          {Object.keys(window.layers).map((layer, i) => {
            return (
              <Node
                layer={window.layers[layer]}
                menu={menu}
                menuState={menuState}
                key={i}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default Canvas;

import React from "react";

import Node from "./node";
import Toolbar from "./toolbar";
import LayerGroups from "./layergroups";

import "./canvas.css";

let cursors = {
  line: "crosshair",
  delete: "no-drop",
  normal: "default",
  layer: "cell",
  move: "move",
};

const Canvas = (
  props = {
    graphdef: {},
    graphdefState: undefined,
  }
) => {
  let [menu, menuState] = React.useState({
    comp: <div />,
    render:false
  });
  let { graphdef, graphdefState } = props;
  let { layerGroups, layerGroupsState } = props;

  function layerIdGenerator(name = "") {
    name = name.toLowerCase();
    if (window.canvasConfig.layerCount[name]) {
      window.canvasConfig.layerCount[name] =
        window.canvasConfig.layerCount[name] + 1;
    } else {
      window.canvasConfig.layerCount[name] = 1;
    }

    return window.canvasConfig.layerCount[name];
  }

  function downLine(e) {
    e.preventDefault();
    let scroll = document.getElementById("canvasTop");
    let _line = document.getElementById("dummy");
    let pos = {
      x: e.clientX - window.offsetX + scroll.scrollLeft,
      y: e.clientY - window.offsetY + scroll.scrollTop,
    };

    _line.style.strokeWidth = 2;
    _line.x1.baseVal.value = pos.x;
    _line.y1.baseVal.value = pos.y;
    _line.x2.baseVal.value = pos.x + 1;
    _line.y2.baseVal.value = pos.y + 1;

    window.canvasConfig.activeLine = {
      line: _line,
    };
  }

  function downDelete(e) {
    e.preventDefault();
  }

  function downLayer(e) {
    e.preventDefault();
    if (e.button) {
      
    } else {
      let layer = window.copy(window.canvasConfig.activeLayer);
      let n = layerIdGenerator(layer.name);
      let id = layer.name.toLowerCase().replaceAll(" ", "_") + "_" + n;
      window.graphdef[id] = {
        ...layer,
        name: layer.name + " " + n,
        id: id,
        pos: {
          x: 0,
          y: 0,
        },
        connections: {
          inbound: [],
          outbound: [],
        },
        width: 0,
      };

      let scroll = document.getElementById("canvasTop");
      window.graphdef[id].width = window.graphdef[id].name.length * 10;
      window.graphdef[id].pos = {
        x:
          e.clientX -
          window.offsetX +
          scroll.scrollLeft -
          window.graphdef[id].width / 2.5,
        y: e.clientY - window.offsetY + scroll.scrollTop - 25,
        offsetX: window.graphdef[id].name.length * 5 - 2,
        offsetY: 23,
      };

      switch (window.canvasConfig.activeLayer.name) {
        case "Model":
          window.canvasConfig.activeLayer = window.copy(
            layerGroups["build-layers"].layers[1]
          );
          break;
        case "Compile":
          window.canvasConfig.activeLayer = window.copy(
            layerGroups["build-layers"].layers[2]
          );
          break;
        case "Node":
          window.graphdef[id]._id = "Please Set Node ID";
          break;
        default:
          break;
      }

      window.graphdefState({
        ...window.graphdef,
      });
      window.autosave();
    }
  }

  function moveNode(e) {
    try {
      let scroll = document.getElementById("canvasTop");

      window.canvasConfig.pos = {
        x:
          e.clientX -
          window.offsetX +
          scroll.scrollLeft -
          window.canvasConfig.activeElement.layer.pos.offsetX,
        y:
          e.clientY -
          window.offsetY +
          scroll.scrollTop -
          window.canvasConfig.activeElement.layer.pos.offsetY,
        offsetX: window.canvasConfig.activeElement.layer.pos.offsetX,
        offsetY: window.canvasConfig.activeElement.layer.pos.offsetY,
      };

      window.canvasConfig.activeElement.rect.x.baseVal.value =
        window.canvasConfig.pos.x;
      window.canvasConfig.activeElement.rect.y.baseVal.value =
        window.canvasConfig.pos.y;
      window.canvasConfig.activeElement.text.x.baseVal[0].value =
        window.canvasConfig.pos.x +
        window.canvasConfig.activeElement.layer.width / 6.5;
      window.canvasConfig.activeElement.text.y.baseVal[0].value =
        window.canvasConfig.pos.y + 19;

      window.canvasConfig.activeElement.edges_in.forEach((edge) => {
        edge.x1.baseVal.value =
          window.canvasConfig.pos.x +
          window.canvasConfig.activeElement.layer.width / 2;
        edge.y1.baseVal.value = window.canvasConfig.pos.y + 15;
      });
      window.canvasConfig.activeElement.edges_out.forEach((edge) => {
        edge.x2.baseVal.value =
          window.canvasConfig.pos.x +
          window.canvasConfig.activeElement.layer.width / 2;
        edge.y2.baseVal.value = window.canvasConfig.pos.y + 30;
      });
    } catch (TypeError) {}
  }

  function moveEdgeEnd(e) {
    e.preventDefault();
    if (window.canvasConfig.activeLine) {
      let scroll = document.getElementById("canvasTop");
      window.canvasConfig.activeLine.line.x2.baseVal.value =
        e.clientX - window.offsetX + scroll.scrollLeft - 3;
      window.canvasConfig.activeLine.line.y2.baseVal.value =
        e.clientY - window.offsetY + scroll.scrollTop - 10;
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

  function setMode(mode, name) {
    if (window.canvasConfig.mode !== mode) {
      window.canvasConfig.mode = mode;
      document.getElementById("canvas").style.cursor =
        cursors[window.canvasConfig.mode];
      Array(...document.getElementById("toolbar").children).forEach((child) => {
        if (child.id === name) {
          child.firstChild.className = "icon selected";
        } else {
          child.firstChild.className = "icon";
        }
      });

      if (modeFunctions[mode]) {
        modeFunctions[mode]();
      }
    } else {
      window.canvasConfig.mode = "normal";
      document.getElementById("canvas").style.cursor = "default";
      document.getElementById("canvas").onmousemove = undefined;
      document.getElementById("canvas").onmousedown = undefined;

      Array(...document.getElementById("toolbar").children).forEach((child) => {
        child.firstChild.className = "icon";
      });
    }
  }

  function toolbarHandler(
    data = {
      mode: undefined,
      name: "normal",
      layer: { name: "__LAYER__", args: {} },
    }
  ) {
    if (data.mode === "layer") {
      if (window.canvasConfig.mode !== "layer") {
        window.canvasConfig.mode = "layer";
        document.getElementById("canvas").style.cursor =
          cursors[window.canvasConfig.mode];
        window.canvasConfig.activeLayer = window.copy(data.layer);
        modeFunctions.layer();
      } else {
        if (window.canvasConfig.activeLayer.name === data.layer.name) {
          window.canvasConfig.mode = "normal";
          document.getElementById("canvas").style.cursor = "default";
          window.canvasConfig.activeLayer = undefined;
        } else {
          window.canvasConfig.activeLayer = window.copy(data.layer);
        }
      }
    } else {
      setMode(data.mode, data.name);
    }
  }

  function onMouseUp(e) {
    e.preventDefault();
    if (window.canvasConfig.newEdge) {
      let { from, to } = window.canvasConfig.newEdge;
      if (from && to && from !== to) {
        if (window.graphdef[from].connections.outbound.lastIndexOf(to) === -1) {
          window.graphdef[from].connections.outbound.push(to);
        }
        if (window.graphdef[to].connections.inbound.lastIndexOf(from) === -1) {
          window.graphdef[to].connections.inbound.push(from);
        }
        window.canvasConfig.newEdge = undefined;
        window.canvasConfig.activeLine = undefined;
        window.graphdefState({
          ...window.graphdef,
        });
        window.autosave();
      }

    } else if (window.canvasConfig.activeElement) {
      if (window.canvasConfig.pos) {
        window.graphdef[window.canvasConfig.activeElement.layer.id].pos =
          window.canvasConfig.pos;
        window.graphdefState({
          ...window.graphdef,
        });
        window.autosave();
      }
    }

    window.canvasConfig.pos = undefined;
    window.canvasConfig.activeElement = undefined;
    window.canvasConfig.activeLine = undefined;

    let line = document.getElementById("dummy");
    line.style.strokeWidth = 0;
    line.x1.baseVal.value = 0;
    line.y1.baseVal.value = 0;
    line.x2.baseVal.value = 1;
    line.y2.baseVal.value = 1;

    if (menu.render){
      menuState({
        comp: <div />,
        render:false
      })
    }
  }

  function scroll(e) {
    let canv = e.target;
    let svg = canv.children[0];

    if (canv.scrollTop > canv.scrollHeight - window.innerHeight) {
      svg.height.baseVal.value = Math.max(
        4400,
        Math.floor(svg.height.baseVal.value * 1.01)
      );
      // console.log(svg.height.baseVal.value)
    }
    if (canv.scrollLeft > canv.scrollWidth - window.innerWidth + 230) {
      svg.width.baseVal.value = Math.max(
        4400,
        Math.floor(svg.width.baseVal.value * 1.005)
      );
      // console.log(svg.width.baseVal.value)
    }
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

  React.useEffect(() => {
    window.graphdef = graphdef;
    window.graphdefState = graphdefState;
    window.toolbarHandler = toolbarHandler;


  });

  return (
    <div className="container" id="app">
      {menu.comp}
      <div className="tools">
        <Toolbar tools={tools} />
        <LayerGroups
          tools={tools}
          layerGroups={layerGroups}
          layerGroupsState={layerGroupsState}
        />
      </div>
      <div className="canvas-top" id="canvasTop" onScroll={scroll}>
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
            strokeWidth="0"
            markerEnd="url(#triangle)"
          />
          {Object.keys(graphdef).map((layer, i) => {
            return (
              <Node
                {...graphdef[layer]}
                {...props}
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

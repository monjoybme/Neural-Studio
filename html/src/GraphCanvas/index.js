import React from "react";

import Node from "./node";
import Toolbar from "./toolbar";
import LayerGroups from "./layergroups";

import {
  metaAppFunctions,
  metaGraph,
  metaLayerGroups,
  metaAppData
} from "../Meta";
import { icons } from "../data/icons";
import { POST, pull, push } from "../Utils";

let cursors = {
  edge: "crosshair",
  delete: "no-drop",
  normal: "default",
  layer: "cell",
  move: "move",
  clean: "default",
};

const TriangleMarker = (props) => {
  return (
    <marker
      xmlns="http://www.w3.org/2000/svg"
      id="triangle"
      viewBox="0 0 10 10"
      refX="0"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="4"
      markerHeight="3"
      orient="90deg"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
  );
};

const CircleMarker = (props) => {
  return (
    <marker
      xmlns="http://www.w3.org/2000/svg"
      id="circle"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="4"
      markerHeight="4"
    >
      <circle cx="5" cy="5" r="3" fill="black" />
    </marker>
  );
};

const DefaultLine = (props = { lineref: undefined }) => {
  return (
    <line
      id="dummy"
      x1="0"
      y1="0"
      x2="0"
      y2="0"
      strokeWidth="0"
      markerEnd="url(#triangle)"
      ref={props.lineref}
    />
  );
};

const Tools = (props) => {
  return <div className="tools">{props.children}</div>;
};

const GraphEditor = (
  props = {
    appData: { ...metaAppData },
    appFunctions: metaAppFunctions,
  }
) => {
  let [graph, graphState] = React.useState(metaGraph);
  let [layergroups, layergroupsState] = React.useState(metaLayerGroups);
  let [menu, menuState] = React.useState({ comp: <div />, render: false });
  let [toolbarButtons, toolbarButtonsState] = React.useState([
    {
      name: "edge",
      icon: icons.ArrowRight,
      selected: false,
    },
    {
      name: "move",
      icon: icons.Pan,
      selected: false,
    },
    {
      name: "delete",
      icon: icons.Delete,
      selected: false,
    },
    {
      name: "clean",
      icon: icons.DeleteAll,
      selected: false,
    },
  ]);

  let canvasRef = React.useRef();
  let canvastopRef = React.useRef();
  let dummyLineRef = React.useRef();

  function newLine(e) {
    e.preventDefault();
    let line = document.getElementById("dummy");
    let pos = {
      x: window.canvas.viewBox.x + e.clientX - window.offsetX,
      y: window.canvas.viewBox.y + e.clientY - window.offsetY,
    };

    line.style.strokeWidth = 2;
    line.x1.baseVal.value = pos.x;
    line.y1.baseVal.value = pos.y;
    line.x2.baseVal.value = pos.x;
    line.y2.baseVal.value = pos.y;

    window.canvas.activeLine = {
      line: line,
    };
  }

  function layerIdGenerator(name = "Layer") {
    let idx,
      namex = name.toLowerCase().replaceAll(" ", "_");
    if (window.canvas.layerCount[name]) {
      window.canvas.layerCount[name] = window.canvas.layerCount[name] + 1;
    } else {
      window.canvas.layerCount[name] = 1;
    }
    idx = window.canvas.layerCount[name];
    return {
      name: `${name} ${idx}`,
      id: `${namex}_${idx}`,
    };
  }

  function newLayer(e) {
    e.preventDefault();
    if (e.button) {
    } else {
      let layer = window.copy(window.canvas.activeLayer);
      let { name, id } = layerIdGenerator(layer.name);
      let node = {
        ...layer,
        name: name,
        id: id,
        pos: { x: 0, y: 0 },
        connections: { inbound: [], outbound: [] },
        width: 0,
      };
      node.width = node.name.length * 13;
      node.pos = {
        x:
          window.canvas.viewBox.x +
          e.clientX -
          window.offsetX -
          Math.floor(node.width / 2),
        y: window.canvas.viewBox.y + e.clientY - window.offsetY - 15,
        offsetX: Math.floor(node.width / 2),
        offsetY: 15,
      };

      console.log(window.canvas.activeLayer.type.object_class)
      switch (window.canvas.activeLayer.type.object_class) {
        case "optimizers":
          graph.train_config.optimizer = node;
          graph.nodes[id] = node;
          break;
        case "build_tools":
          let comp = window.canvas.activeLayer.type.name.toLowerCase();
          if (graph.train_config[comp]) {
            props.appFunctions.notify({
              message: `${window.canvas.activeLayer.type.name} node already exists for this graph ! `,
            });
          } else {
            graph.train_config[comp] = node;
            graph.nodes[id] = node;
          }
          break;
        case "datasets":
          node.arguments.dataset.value =
            node.arguments.dataset.value.lastIndexOf("__id__") > 0
              ? node.arguments.dataset.value.replaceAll(/__id__/g, id)
              : node.arguments.dataset.value;
          graph.train_config.dataset = node;
          graph.nodes[id] = node;
          break;
        case "custom_def":
          graph.custom_nodes[id] = {
            definition: node,
            node : undefined
          }
        default:
          graph.nodes[id] = node;
          break;
      }

      graph.train_config.session_id = new Date().toTimeString();
      graphState({
        ...graph,
      });
    }
  }

  function moveEdge(e) {
    e.preventDefault();
    if (window.canvas.activeLine) {
      window.canvas.activeLine.line.x2.baseVal.value =
        window.canvas.viewBox.x + e.clientX - window.offsetX;
      window.canvas.activeLine.line.y2.baseVal.value =
        window.canvas.viewBox.y + e.clientY - window.offsetY;
    }
  }

  function moveNode(e) {
    try {
      window.canvas.pos = {
        x: e.clientX - window.offsetX + window.canvas.activeElement.ref.x,
        y: e.clientY - window.offsetY + window.canvas.activeElement.ref.y,
        offsetX: window.canvas.activeElement.layer.pos.offsetX,
        offsetY: window.canvas.activeElement.layer.pos.offsetY,
      };

      window.canvas.activeElement.rect.x.baseVal.value = window.canvas.pos.x;
      window.canvas.activeElement.rect.y.baseVal.value = window.canvas.pos.y;

      window.canvas.activeElement.text.x.baseVal[0].value =
        window.canvas.pos.x +
        Math.floor(window.canvas.activeElement.layer.width * (1 / 5));
      window.canvas.activeElement.text.y.baseVal[0].value =
        window.canvas.pos.y + 19;

      window.canvas.activeElement.edges_in.forEach((edge) => {
        edge.x1.baseVal.value =
          window.canvas.pos.x + window.canvas.activeElement.layer.width / 2;
        edge.y1.baseVal.value = window.canvas.pos.y - 5;
      });
      window.canvas.activeElement.edges_out.forEach((edge) => {
        edge.x2.baseVal.value =
          window.canvas.pos.x + window.canvas.activeElement.layer.width / 2;
        edge.y2.baseVal.value = window.canvas.pos.y + 30;
      });
    } catch (TypeError) {
      // console.log(TypeError)
    }
  }

  function normalMouseDown() {
    if (window.canvas.mode === "normal") {
      window.canvas.pan = true;
    }
  }

  function moveCanvas(e) {
    e.preventDefault();
    if (window.canvas.pan) {
      if (window.canvas.panLast) {
        window.canvas.viewBox.x -= e.clientX - window.canvas.panLast.x;
        window.canvas.viewBox.y -= e.clientY - window.canvas.panLast.y;
        canvasRef.current.viewBox.baseVal.x = window.canvas.viewBox.x;
        canvasRef.current.viewBox.baseVal.y = window.canvas.viewBox.y;
        canvasRef.current.viewBox.baseVal.width = window.canvas.viewBox.w;
        canvasRef.current.viewBox.baseVal.height = window.canvas.viewBox.h;
        window.canvas.panLast = {
          x: e.clientX,
          y: e.clientY,
        };
      } else {
        window.canvas.panLast = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    }
  }

  function removeNode(activeElement) {
    let { id, connections } = activeElement;
    connections.inbound.forEach((lid) => {
      graph.nodes[lid].connections.outbound.pop(id);
    });
    connections.outbound.forEach((lid) => {
      graph.nodes[lid].connections.inbound.pop(id);
    });
    delete graph.nodes[id];
  }

  function deleteNode(e) {
    let { activeElement } = window.canvas;
    if (activeElement) {
      switch (activeElement.type.object_class) {
        case "layers":
          removeNode(activeElement);
          break;
        case "applications":
          removeNode(activeElement);
          break;
        case "custom_def":
          layergroups.custom_nodes.layers =
            layergroups.custom_nodes.layers.filter((node, i) => {
              return activeElement.name !== node.name;
            });
          window.canvas.customNodes.definitions =
            window.canvas.customNodes.definitions.filter((node, i) => {
              return activeElement.name !== node.name;
            });
          layergroupsState({
            ...layergroups,
          });
          removeNode(activeElement);
          break;
        case "optimizers":
          delete graph.train_config.optimizer;
          break;
        case "build_tools":
          let tool = graph.nodes[activeElement.id].type.name.toLowerCase();
          if (graph.train_config[tool]) {
            delete graph.train_config[tool];
          }
          removeNode(activeElement);
          break;
        case "edge":
          activeElement.inbound.forEach((node) => {
            graph.nodes[node].connections.outbound.pop(activeElement.node);
          });
          graph.nodes[activeElement.node].connections.inbound = [];
          break;
        case "datasets":
          removeNode(activeElement);
          graphState({ ...graph });
          break;
        default:
          props.appFunctions.notify({
            message: `Add delete method for : ${window.canvas.activeElement.type.object_class}`,
          });
          break;
      }
      graphState({ ...graph });
    }
    window.canvas.activeElement = undefined;
  }

  function addEdge(from, to) {
    if (from && to && from !== to) {
      if (graph.nodes[from].connections.outbound.lastIndexOf(to) === -1) {
        graph.nodes[from].connections.outbound.push(to);
      }
      if (graph.nodes[to].connections.inbound.lastIndexOf(from) === -1) {
        graph.nodes[to].connections.inbound.push(from);
      }
      window.canvas.newEdge = undefined;
      window.canvas.activeLine = undefined;
    }
  }

  function onMouseUp(e) {
    if (window.canvas.activeElement) {
      if (window.canvas.pos) {
        graph.nodes[window.canvas.activeElement.layer.id].pos =
          window.canvas.pos;
        graphState({
          ...graph,
        });
      }
    }

    window.canvas.activeElement = undefined;
    window.canvas.pos = undefined;
    window.canvas.pan = false;
    window.canvas.panLast = undefined;

    dummyLineRef.current.style.strokeWidth = 0;
    dummyLineRef.current.x1.baseVal.value = 0;
    dummyLineRef.current.y1.baseVal.value = 0;
    dummyLineRef.current.x2.baseVal.value = 1;
    dummyLineRef.current.y2.baseVal.value = 1;

    if (menu.render) {
      menuState({
        comp: <div />,
        render: false,
      });
    }
  }

  function updateViewBox() {
    window.canvas.viewBox = {
      x: window.canvas.viewBox.x,
      y: window.canvas.viewBox.y,
      w: canvastopRef.current.scrollWidth,
      h: canvastopRef.current.scrollHeight,
    };
    canvasRef.current.viewBox.baseVal.x = window.canvas.viewBox.x;
    canvasRef.current.viewBox.baseVal.y = window.canvas.viewBox.y;
    canvasRef.current.viewBox.baseVal.width = window.canvas.viewBox.w;
    canvasRef.current.viewBox.baseVal.height = window.canvas.viewBox.h;
  }

  function updateViewBoxService() {
    if (canvastopRef.current) {
      if (
        canvastopRef.current.scrollHeight !== window.canvas.viewBox.h ||
        canvastopRef.current.scrollWidth !== window.canvas.viewBox.w
      ) {
        updateViewBox();
      }
      setTimeout(updateViewBoxService, 10);
    } else {
      console.log("Stopped viewbox update.");
    }
  }

  function setToolMode(options = { name: "Mode", layer: { name: "Layer" } }) {
    console.log(`Setting ${options.name} mode`);
    window.canvas.mode = options.name;
    document.getElementById("canvastopRef").style.cursor =
      cursors[options.name];
    switch (options.name) {
      case "normal":
        canvasRef.current.onmousedown = undefined;
        canvasRef.current.onmousemove = undefined;
        canvasRef.current.onmouseup = onMouseUp;
        canvastopRef.current.onmousedown = normalMouseDown;
        canvastopRef.current.onmousemove = moveCanvas;
        break;
      case "edge":
        canvasRef.current.onmousedown = newLine;
        canvasRef.current.onmousemove = moveEdge;
        canvasRef.current.onmouseup = onMouseUp;
        canvastopRef.current.onmousedown = undefined;
        canvastopRef.current.onmousemove = undefined;
        break;
      case "move":
        canvasRef.current.onmousedown = undefined;
        canvasRef.current.onmousemove = moveNode;
        canvasRef.current.onmouseup = onMouseUp;
        canvastopRef.current.onmousedown = undefined;
        canvastopRef.current.onmousemove = undefined;
        break;
      case "delete":
        canvasRef.current.onmousedown = undefined;
        canvasRef.current.onmousemove = undefined;
        canvasRef.current.onmouseup = deleteNode;
        canvastopRef.current.onmousedown = undefined;
        canvastopRef.current.onmousemove = undefined;
        break;
      case "clean":
        canvasRef.current.onmousedown = undefined;
        canvasRef.current.onmousemove = undefined;
        canvasRef.current.onmouseup = onMouseUp;
        canvastopRef.current.onmousedown = undefined;
        canvastopRef.current.onmousemove = undefined;

        // layergroups.custom_nodes.layers = [];
        graphState({ ...metaGraph, fetch: false});
        // layergroupsState({ ...layergroups });
        break;
      case "layer":
        window.canvas.activeLayer = { ...options.layer };
        canvasRef.current.onmousedown = newLayer;
        canvasRef.current.onmousemove = undefined;
        break;
      default:
        break;
    }
    toolbarButtons = toolbarButtons.map((button) => {
      button.selected =
        button.name === options.name && options.name !== "clean";
      return button;
    });
    toolbarButtonsState([...toolbarButtons]);
  }

  let tools = {
    addEdge: addEdge,
  };
  

  React.useEffect(()=>{
    updateViewBox();
    updateViewBoxService();
    setToolMode({name:"normal"});
    window.setToolMode = setToolMode;
  }, [])

  React.useEffect(()=>{
    if ( graph.fetch ){
      pull({
        name: "canvas"
      }).then(response=>{
        let _graph = response.graph;
        delete response.graph;
        window.canvas = response;

        Object.keys(_graph.custom_nodes).map((definition)=>{
          layergroups.custom_nodes.layers.push(_graph.custom_nodes[definition].node);
        })
        
        layergroupsState({...layergroups})
        graphState({..._graph, fetch: false});
      })
    }else{
      console.log("[PUSH] Canvas");
      push({
        name:"canvas",
        data:{
          ...window.canvas,
          graph: {...graph}
        }
      })
    }
  }, [graph])

  return (
    <div className="container graph-canvas">
      {menu.comp}
      <Tools>
        <Toolbar
          toolbarButtons={toolbarButtons}
          toolbarButtonsState={toolbarButtonsState}
          setToolMode={setToolMode}
        />
        <LayerGroups
          layergroups={layergroups}
          layergroupsState={layergroupsState}
          setToolMode={setToolMode}
        />
      </Tools>
      <div className="canvas-top" id="canvastopRef" ref={canvastopRef}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 0 0"
          className="canvas"
          id="canvas"
          onMouseUp={onMouseUp}
          ref={canvasRef}
        >
          <TriangleMarker />
          <CircleMarker />
          <DefaultLine lineref={dummyLineRef} />
          {Object.keys(graph.nodes).map((layer, i) => {
            return (
              <Node
                node={graph.nodes[layer]}
                menu={menu}
                menuState={menuState}
                graph={graph}
                graphState={graphState}
                tools={tools}
                layergroups={layergroups}
                layergroupsState={layergroupsState}
                key={i}
                {...props}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default GraphEditor;

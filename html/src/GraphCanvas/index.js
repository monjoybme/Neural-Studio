import React from "react";

import Node from "./node";
import Toolbar from "./toolbar";
import LayerGroups from "./layergroups";

import { metaAppFunctions, metaGraphdef, metaStore, metaStoreContext } from "../Meta";
import { icons } from "../data/icons";
import { POST } from "../Utils";

let cursors = {
  edge: "crosshair",
  delete: "no-drop",
  normal: "default",
  layer: "cell",
  move: "move",
  clean: "default",
};


const TriangleMarker = (props) =>{
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
}

const CircleMarker = (props) =>{
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
}

const DefaultLine = (props={ lineref:undefined }) =>{
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
  )
}

const Tools = (props) => {
  return <div className="tools">{props.children}</div>;
};

const GraphEditor = (
  props = { store: metaStore , storeContext: metaStoreContext, appFunctions: metaAppFunctions }
) => {
  let { graphDef, graphDefState, canvasConfig, layerGroups, layerGroupsState } = props.store;

  let [menu, menuState] = React.useState({ comp: <div />, render: false });
  let [load, loadState] = React.useState(true);
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

  let canvasref = React.useRef();
  let canvasTop = React.useRef();
  let dummyLine = React.useRef();

  function newLine(e) {
    e.preventDefault();
    let line = document.getElementById("dummy");
    let pos = {
      x: window.canvasConfig.viewBox.x + e.clientX - window.offsetX + 10,
      y: window.canvasConfig.viewBox.y + e.clientY - window.offsetY,
    };

    line.style.strokeWidth = 2;
    line.x1.baseVal.value = pos.x;
    line.y1.baseVal.value = pos.y;
    line.x2.baseVal.value = pos.x;
    line.y2.baseVal.value = pos.y;

    canvasConfig.activeLine = {
      line: line,
    };
  }

  function layerIdGenerator(name = "Layer") {
    let idx,
      namex = name.toLowerCase().replaceAll(" ", "_");
    if (canvasConfig.layerCount[name]) {
      canvasConfig.layerCount[name] = canvasConfig.layerCount[name] + 1;
    } else {
      canvasConfig.layerCount[name] = 1;
    }
    idx = canvasConfig.layerCount[name];
    return {
      name: `${name} ${idx}`,
      id: `${namex}_${idx}`,
    };
  }

  function newLayer(e) {
    e.preventDefault();
    if (e.button) {
    } else {
      let layer = window.copy(canvasConfig.activeLayer);
      let { name, id } = layerIdGenerator(layer.name);

      graphDef[id] = {
        ...layer,
        name: name,
        id: id,
        pos: { x: 0, y: 0 },
        connections: { inbound: [], outbound: [] },
        width: 0,
      };
      graphDef[id].width = graphDef[id].name.length * 13;
      graphDef[id].pos = {
        x:
          window.canvasConfig.viewBox.x +
          e.clientX -
          window.offsetX -
          Math.floor(graphDef[id].width / 2) +
          10,
        y: window.canvasConfig.viewBox.y + e.clientY - window.offsetY - 15,
        offsetX: Math.floor(graphDef[id].width / 2),
        offsetY: 15,
      };

      if (graphDef.train_config === undefined) {
        graphDef.train_config = {
          session_id: new Date().toTimeString(),
        };
      }

      switch (canvasConfig.activeLayer.type.object_class) {
        case "optimizers":
          graphDef.train_config.optimizer = graphDef[id];
          break;
        case "build_tools":
          let comp = canvasConfig.activeLayer.type.name.toLowerCase();
          if (graphDef.train_config[comp]) {
            props.appFunctions.notify({
              message: `${canvasConfig.activeLayer.type.name} node already exists for this graph ! `,
            });
            delete graphDef[id];
          } else {
            graphDef.train_config[comp] = graphDef[id];
          }
          break;
        case "datasets":
          graphDef[id].arguments.dataset.value =
            graphDef[id].arguments.dataset.value.lastIndexOf("__id__") > 0
              ? graphDef[id].arguments.dataset.value.replaceAll(/__id__/g, id)
              : graphDef[id].arguments.dataset.value;
          graphDef.train_config.dataset = graphDef[id];
          break;
        default:
          break;
      }

      graphDefState({
        ...graphDef,
      });
    }
  }

  function moveEdge(e) {
    e.preventDefault();
    if (canvasConfig.activeLine) {
      canvasConfig.activeLine.line.x2.baseVal.value =
        window.canvasConfig.viewBox.x + e.clientX - window.offsetX + 10;
      canvasConfig.activeLine.line.y2.baseVal.value =
        window.canvasConfig.viewBox.y + e.clientY - window.offsetY;
    }
  }

  function moveNode(e) {
    try {
      canvasConfig.pos = {
        x: e.clientX - window.offsetX + canvasConfig.activeElement.ref.x,
        y: e.clientY - window.offsetY + canvasConfig.activeElement.ref.y,
        offsetX: canvasConfig.activeElement.layer.pos.offsetX,
        offsetY: canvasConfig.activeElement.layer.pos.offsetY,
      };

      canvasConfig.activeElement.rect.x.baseVal.value = canvasConfig.pos.x;
      canvasConfig.activeElement.rect.y.baseVal.value = canvasConfig.pos.y;

      canvasConfig.activeElement.text.x.baseVal[0].value =
        canvasConfig.pos.x +
        Math.floor(canvasConfig.activeElement.layer.width * (1 / 5));
      canvasConfig.activeElement.text.y.baseVal[0].value =
        canvasConfig.pos.y + 19;

      canvasConfig.activeElement.edges_in.forEach((edge) => {
        edge.x1.baseVal.value =
          canvasConfig.pos.x + canvasConfig.activeElement.layer.width / 2;
        edge.y1.baseVal.value = canvasConfig.pos.y - 5;
      });
      canvasConfig.activeElement.edges_out.forEach((edge) => {
        edge.x2.baseVal.value =
          canvasConfig.pos.x + canvasConfig.activeElement.layer.width / 2;
        edge.y2.baseVal.value = canvasConfig.pos.y + 30;
      });
    } catch (TypeError) {
      // console.log(TypeError)
    }
  }

  function normalMouseDown() {
    if (window.canvasConfig.mode === "normal") {
      window.canvasConfig.pan = true;
    }
  }

  function moveCanvas(e) {
    e.preventDefault();
    if (window.canvasConfig.pan) {
      if (window.canvasConfig.panLast) {
        window.canvasConfig.viewBox.x -=
          e.clientX - window.canvasConfig.panLast.x;
        window.canvasConfig.viewBox.y -=
          e.clientY - window.canvasConfig.panLast.y;
        canvasref.current.viewBox.baseVal.x = window.canvasConfig.viewBox.x;
        canvasref.current.viewBox.baseVal.y = window.canvasConfig.viewBox.y;
        canvasref.current.viewBox.baseVal.width = window.canvasConfig.viewBox.w;
        canvasref.current.viewBox.baseVal.height =
          window.canvasConfig.viewBox.h;
        window.canvasConfig.panLast = {
          x: e.clientX,
          y: e.clientY,
        };
      } else {
        window.canvasConfig.panLast = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    }
  }

  function removeNode(activeElement) {
    let { id, connections } = activeElement;
    connections.inbound.forEach((lid) => {
      graphDef[lid].connections.outbound.pop(id);
    });
    connections.outbound.forEach((lid) => {
      graphDef[lid].connections.inbound.pop(id);
    });
    delete graphDef[id];
  }

  function deleteNode(e) {
    let { activeElement } = canvasConfig;
    if (activeElement) {
      switch (activeElement.type.object_class) {
        case "layers":
          removeNode(activeElement);
          break;
        case "applications":
          removeNode(activeElement);
          break;
        case "custom_def":
          layerGroups.custom_nodes.layers =
            layerGroups.custom_nodes.layers.filter((node, i) => {
              return activeElement.name !== node.name;
            });
          canvasConfig.customNodes.definitions =
            canvasConfig.customNodes.definitions.filter((node, i) => {
              return activeElement.name !== node.name;
            });
          layerGroupsState({
            ...layerGroups,
          });
          removeNode(activeElement);
          break;
        case "optimizers":
          delete graphDef.train_config.optimizer;
          break;
        case "build_tools":
          let tool = graphDef[activeElement.id].type.name.toLowerCase();
          if (graphDef.train_config[tool]) {
            delete graphDef.train_config[tool];
          }
          removeNode(activeElement);
          break;
        case "edge":
          activeElement.inbound.forEach((node) => {
            graphDef[node].connections.outbound.pop(activeElement.node);
          });
          graphDef[activeElement.node].connections.inbound = [];
          break;
        case "datasets":
          let unload = async function () {
            await POST({
              path: "/dataset/unload",
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status) {
                  props.appFunctions.notify({ message: data.message });
                  removeNode(activeElement);
                  graphDefState({ ...graphDef });
                }
              });
          };
          unload();
          break;
        default:
          props.appFunctions.notify({
            message: `Add delete method for : ${canvasConfig.activeElement.type.object_class}`,
          });
          break;
      }
      graphDefState({ ...graphDef });
    }
    canvasConfig.activeElement = undefined;
  }

  function addEdge(from, to) {
    if (from && to && from !== to) {
      if (graphDef[from].connections.outbound.lastIndexOf(to) === -1) {
        graphDef[from].connections.outbound.push(to);
      }
      if (graphDef[to].connections.inbound.lastIndexOf(from) === -1) {
        graphDef[to].connections.inbound.push(from);
      }
      canvasConfig.newEdge = undefined;
      canvasConfig.activeLine = undefined;
    }
  }

  function onMouseUp(e) {
    if (canvasConfig.activeElement) {
      if (canvasConfig.pos) {
        graphDef[canvasConfig.activeElement.layer.id].pos = canvasConfig.pos;
        graphDefState({
          ...graphDef,
        });
      }
    }

    canvasConfig.activeElement = undefined;
    canvasConfig.pos = undefined;
    canvasConfig.pan = false;
    canvasConfig.panLast = undefined;

    dummyLine.current.style.strokeWidth = 0;
    dummyLine.current.x1.baseVal.value = 0;
    dummyLine.current.y1.baseVal.value = 0;
    dummyLine.current.x2.baseVal.value = 1;
    dummyLine.current.y2.baseVal.value = 1;

    if (menu.render) {
      props.storeContext.graphDef.push();
      menuState({
        comp: <div />,
        render: false,
      });
    }
  }

  function updateViewBox() {
    window.canvasConfig.viewBox = {
      x: window.canvasConfig.viewBox.x,
      y: window.canvasConfig.viewBox.y,
      w: canvasTop.current.scrollWidth,
      h: canvasTop.current.scrollHeight,
    };
    canvasref.current.viewBox.baseVal.x = window.canvasConfig.viewBox.x;
    canvasref.current.viewBox.baseVal.y = window.canvasConfig.viewBox.y;
    canvasref.current.viewBox.baseVal.width = window.canvasConfig.viewBox.w;
    canvasref.current.viewBox.baseVal.height = window.canvasConfig.viewBox.h;
  }

  function setToolMode(options = { name: "Mode", layer: { name: "Layer" } }) {
    console.log(`Setting ${options.name} mode`);
    canvasConfig.mode = options.name;
    document.getElementById("canvasTop").style.cursor = cursors[options.name];
    switch (options.name) {
      case "normal":
        canvasref.current.onmousedown = undefined;
        canvasref.current.onmousemove = undefined;
        canvasref.current.onmouseup = onMouseUp;
        canvasTop.current.onmousedown = normalMouseDown;
        canvasTop.current.onmousemove = moveCanvas;
        break;
      case "edge":
        canvasref.current.onmousedown = newLine;
        canvasref.current.onmousemove = moveEdge;
        canvasref.current.onmouseup = onMouseUp;
        canvasTop.current.onmousedown = undefined;
        canvasTop.current.onmousemove = undefined;
        break;
      case "move":
        canvasref.current.onmousedown = undefined;
        canvasref.current.onmousemove = moveNode;
        canvasref.current.onmouseup = onMouseUp;
        canvasTop.current.onmousedown = undefined;
        canvasTop.current.onmousemove = undefined;
        break;
      case "delete":
        canvasref.current.onmousedown = undefined;
        canvasref.current.onmousemove = undefined;
        canvasref.current.onmouseup = deleteNode;
        canvasTop.current.onmousedown = undefined;
        canvasTop.current.onmousemove = undefined;
        break;
      case "clean":
        canvasref.current.onmousedown = undefined;
        canvasref.current.onmousemove = undefined;
        canvasref.current.onmouseup = onMouseUp;
        canvasTop.current.onmousedown = undefined;
        canvasTop.current.onmousemove = undefined;

        layerGroups.custom_nodes.layers = [];
        graphDefState({ ...metaGraphdef });
        layerGroupsState({ ...layerGroups });
        break;
      case "layer":
        canvasConfig.activeLayer = { ...options.layer };
        canvasref.current.onmousedown = newLayer;
        canvasref.current.onmousemove = undefined;
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

  React.useEffect(() => {
    window.setToolMode = setToolMode;
    if (
      canvasref.current.viewBox.baseVal.height === 0 &&
      canvasref.current.viewBox.baseVal.width === 0
    ) {
      updateViewBox();
    }

    function updateViewBoxService() {
      if (canvasTop.current) {
        if (
          canvasTop.current.scrollHeight !== window.canvasConfig.viewBox.h ||
          canvasTop.current.scrollWidth !== window.canvasConfig.viewBox.w
        ) {
          updateViewBox();
        }
        window.__VIEWBOX__UPDATE__ = setTimeout(updateViewBoxService, 1);
      } else {
      }
    }

    clearTimeout(window.__VIEWBOX__UPDATE__);
    window.__VIEWBOX__UPDATE__ = setTimeout(updateViewBoxService, 1);
    if (load) {
      setToolMode({ name: "normal" });
      loadState(false);
    }
    props.storeContext.graphDef.push();
  }, [setToolMode, load]);

  return (
    <div className="container graph-canvas">
      {menu.comp}
      <Tools>
        <Toolbar
          {...props}
          toolbarButtons={toolbarButtons}
          toolbarButtonsState={toolbarButtonsState}
          setToolMode={setToolMode}
        />
        <LayerGroups {...props} setToolMode={setToolMode} />
      </Tools>
      <div className="canvas-top" id="canvasTop" ref={canvasTop}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 0 0"
          className="canvas"
          id="canvas"
          onMouseUp={onMouseUp}
          ref={canvasref}
        >
          <TriangleMarker />
          <CircleMarker />
          <DefaultLine lineref={dummyLine} />
          {Object.keys(graphDef).map((layer, i) => {
            switch (layer) {
              case "train_config":
                return undefined;
              default:
                return (
                  <Node
                    {...props}
                    {...graphDef[layer]}
                    menu={menu}
                    menuState={menuState}
                    tools={tools}
                    key={i}
                  />
                );
            }
          })}
        </svg>
      </div>
    </div>
  );
};

export default GraphEditor;

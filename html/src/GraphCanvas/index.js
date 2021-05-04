import React from "react";

import Node from "./node";
import Toolbar from "./toolbar";
import LayerGroups from "./layergroups";

import { StoreContext } from "../Store";
import { icons } from "../data/icons";

let cursors = {
  edge: "crosshair",
  delete: "no-drop",
  normal: "default",
  layer: "cell",
  move: "move",
  clean:'default'
};


const GraphEditor = ( props = { store: StoreContext, }) => {
  let [menu, menuState] = React.useState({ comp: <div />, render: false, });
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
  let { graphdef, graphdefState ,canvasConfig, layerGroups } = props.store;
  let canvasref = React.useRef(<svg> </svg>);
  let canvasTop = React.useRef();
  let [ load, loadState ] = React.useState(true);

  
  function newLine(e) {
    e.preventDefault();
    let scroll = document.getElementById("canvasTop");
    let _line = document.getElementById("dummy");
    let pos = {
      x: window.canvasConfig.viewBox.x + e.clientX - window.offsetX + scroll.scrollLeft,
      y: window.canvasConfig.viewBox.y + e.clientY - window.offsetY + scroll.scrollTop,
    };

    _line.style.strokeWidth = 2;
    _line.x1.baseVal.value = pos.x;
    _line.y1.baseVal.value = pos.y;
    _line.x2.baseVal.value = pos.x + 1;
    _line.y2.baseVal.value = pos.y + 1;

    canvasConfig.activeLine = {
      line: _line,
    };
  }
  
  function layerIdGenerator(name = "Layer", ) {
    let _id, _name = name.toLowerCase().replaceAll(" ", "_");
    if (canvasConfig.layerCount[name]) {
      canvasConfig.layerCount[name] = canvasConfig.layerCount[name] + 1;
    } else {
      canvasConfig.layerCount[name] = 1;
    }
    _id = canvasConfig.layerCount[name];

    return {
      name:`${name} ${_id}`,
      id:`${_name}_${_id}`
    }
  }

  function newLayer(e) {
    e.preventDefault();
    if (e.button) {
    } else {
      
      let layer = window.copy(canvasConfig.activeLayer);
      let scroll = document.getElementById("canvasTop");
      let { name, id } = layerIdGenerator(layer.name);

      graphdef[id] = {
        ...layer,
        name: name,
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
      graphdef[id].width = graphdef[id].name.length * 12;
      graphdef[id].pos = {
        x: window.canvasConfig.viewBox.x + e.clientX - window.offsetX + scroll.scrollLeft - graphdef[id].width / 2,
        y: window.canvasConfig.viewBox.y + e.clientY - window.offsetY + scroll.scrollTop - 23,
        offsetX: 0,
        offsetY: 0,
      };

      switch (canvasConfig.activeLayer.type.name) {
        case "Model":
          canvasConfig.activeLayer = window.copy(
            layerGroups["build-layers"].layers[1]
          );
          if ( graphdef.train_config === undefined ){
            graphdef.train_config = { }
          }
          graphdef.train_config.model = graphdef[id]
          break;
        case "Compile":
          canvasConfig.activeLayer = window.copy(
            layerGroups["build-layers"].layers[2]
          );
          if ( graphdef.train_config === undefined ){
            graphdef.train_config = { }
          }
          graphdef.train_config.compile = graphdef[id]
          break;
        case "Train":
          if ( graphdef.train_config === undefined ){
            graphdef.train_config = { }
          }
          graphdef.train_config.train = graphdef[id]
          break
        case "Dataset":
          if ( graphdef.train_config === undefined ){
            graphdef.train_config = { }
          }
          graphdef.train_config.dataset = graphdef[id]
          break
        case "Custom":
          graphdef[id]._id = "Please Set Node ID";
          break;
        default:
          break;
      }

      switch(canvasConfig.activeLayer.type._class){
        case "optimizers":
          if ( graphdef.train_config === undefined ){
            graphdef.train_config = { }
          }
          graphdef.train_config.optimizer = graphdef[id]
          break
        default:
          break
      }

      graphdefState({
        ...graphdef,
      });
    }
  }

  function moveEdge(e) {
    e.preventDefault();
    if (canvasConfig.activeLine) {
      let scroll = document.getElementById("canvasTop");
      canvasConfig.activeLine.line.x2.baseVal.value = window.canvasConfig.viewBox.x + e.clientX - window.offsetX + scroll.scrollLeft - 3;
      canvasConfig.activeLine.line.y2.baseVal.value = window.canvasConfig.viewBox.y + e.clientY - window.offsetY + scroll.scrollTop - 10;
    }
  }

  function moveNode(e) {
    try {
      let scroll = document.getElementById("canvasTop");
      canvasConfig.pos = {
        x: e.clientX  + scroll.scrollLeft - window.offsetX + canvasConfig.activeElement.offset.x, 
        y: e.clientY + scroll.scrollTop - window.offsetY + canvasConfig.activeElement.offset.y,
        offsetX: canvasConfig.activeElement.layer.pos.offsetX,
        offsetY: canvasConfig.activeElement.layer.pos.offsetY,
      };

      canvasConfig.activeElement.rect.x.baseVal.value = canvasConfig.pos.x;
      canvasConfig.activeElement.rect.y.baseVal.value = canvasConfig.pos.y;
      canvasConfig.activeElement.text.x.baseVal[0].value = canvasConfig.pos.x + ( canvasConfig.activeElement.layer.width / 12 ) * 2.5; 
      canvasConfig.activeElement.text.y.baseVal[0].value = canvasConfig.pos.y + 19 ;

      canvasConfig.activeElement.edges_in.forEach((edge) => {
        edge.x1.baseVal.value = canvasConfig.pos.x + canvasConfig.activeElement.layer.width / 2;
        edge.y1.baseVal.value = canvasConfig.pos.y - 5;
      });
      canvasConfig.activeElement.edges_out.forEach((edge) => {
        edge.x2.baseVal.value = canvasConfig.pos.x + canvasConfig.activeElement.layer.width / 2;
        edge.y2.baseVal.value = canvasConfig.pos.y + 30 ;
      });
    } catch (TypeError) {
      // console.log(TypeError)
    }
  }

  function normalMouseDown(){
    if ( window.canvasConfig.mode === 'normal' ){
      window.canvasConfig.pan = true;
    }
  }

  function moveCanvas(e){
    e.preventDefault();
    if (window.canvasConfig.pan){
      if ( window.canvasConfig.panLast ){
        window.canvasConfig.viewBox.x -= ( e.clientX - 
          window.canvasConfig.panLast.x );
        window.canvasConfig.viewBox.y -= ( e.clientY - 
          window.canvasConfig.panLast.y
        )
        canvasref.current.viewBox.baseVal.x = window.canvasConfig.viewBox.x 
        canvasref.current.viewBox.baseVal.y = window.canvasConfig.viewBox.y
        canvasref.current.viewBox.baseVal.width = window.canvasConfig.viewBox.w
        canvasref.current.viewBox.baseVal.height = window.canvasConfig.viewBox.h
        window.canvasConfig.panLast = {
          x:e.clientX, 
          y:e.clientY
        }
      }else{
        window.canvasConfig.panLast = {
          x:e.clientX, 
          y:e.clientY
        }
      }
    }
  }

  function setToolMode(options={ name:"Mode", layer:{ name:"Layer" } }) {
    console.log(`Setting ${options.name} mode`)
    canvasConfig.mode = options.name;
    document.getElementById('canvasTop').style.cursor = cursors[options.name];
    switch(options.name){
      case "normal":
        canvasref.current.onmousedown = undefined;
        canvasref.current.onmousemove = undefined;

        canvasTop.current.onmousedown = normalMouseDown;
        canvasTop.current.onmousemove = moveCanvas;
        break
      case "edge":
        canvasref.current.onmousedown = newLine;
        canvasref.current.onmousemove = moveEdge;

        canvasTop.current.onmousedown = undefined;
        canvasTop.current.onmousemove = undefined;
        break
      case "move":
        canvasref.current.onmousedown = undefined;
        canvasref.current.onmousemove = moveNode;

        canvasTop.current.onmousedown = undefined;
        canvasTop.current.onmousemove = undefined;
        break
      case "delete":
        canvasref.current.onmousedown = undefined;
        canvasref.current.onmousemove = undefined
        ;
        canvasTop.current.onmousedown = undefined;
        canvasTop.current.onmousemove = undefined;
        break
      case "clean":
        canvasref.current.onmousedown = undefined;
        canvasref.current.onmousemove = undefined
        ;
        canvasTop.current.onmousedown = undefined;
        canvasTop.current.onmousemove = undefined;
        graphdefState({ })
        break
      case 'layer':
        canvasConfig.activeLayer = { ...options.layer };
        canvasref.current.onmousedown = newLayer;
        canvasref.current.onmousemove = undefined;
        break
      default:
        break
    }
    toolbarButtons = toolbarButtons.map((button) => {
      button.selected = button.name === options.name && options.name !== "clean";
      return button;
    });
    toolbarButtonsState([...toolbarButtons]);
  }

  function onMouseUp(e) {
    if (canvasConfig.newEdge) {
      let { from, to } = canvasConfig.newEdge;
      if (from && to && from !== to) {
        if (graphdef[from].connections.outbound.lastIndexOf(to) === -1) {
          graphdef[from].connections.outbound.push(to);
        }
        if (graphdef[to].connections.inbound.lastIndexOf(from) === -1) {
          graphdef[to].connections.inbound.push(from);
        }
        canvasConfig.newEdge = undefined;
        canvasConfig.activeLine = undefined;
        graphdefState({
          ...graphdef,
        });
      }
    } 
    
    if (canvasConfig.activeElement) {
      if (canvasConfig.pos) {
        graphdef[canvasConfig.activeElement.layer.id].pos = canvasConfig.pos;
        graphdefState({
          ...graphdef,
        });
      }
    }

    canvasConfig.activeElement = undefined;
    canvasConfig.pos = undefined;
    canvasConfig.activeLine = undefined;

    let line = document.getElementById("dummy");
    line.style.strokeWidth = 0;
    line.x1.baseVal.value = 0;
    line.y1.baseVal.value = 0;
    line.x2.baseVal.value = 1;
    line.y2.baseVal.value = 1;

    window.canvasConfig.pan = false;
    window.canvasConfig.panLast = undefined;

    if (menu.render) {
      menuState({
        comp: <div />,
        render: false,
      });
    }
  }

 
  React.useEffect(() => {
    window.setToolMode = setToolMode;
    window.thumb_export = document.getElementById("canvas");
    window.autosave();

    if ( canvasref.current.viewBox.baseVal.height === 0 && canvasref.current.viewBox.baseVal.width === 0 ){
      if ( window.canvasConfig.viewBox.w === 0 || window.canvasConfig.viewBox.h ){
        window.canvasConfig.viewBox = {
          x:0, 
          y:0,
          w:canvasTop.current.scrollWidth,
          h:canvasTop.current.scrollHeight,
        }
      } 
      canvasref.current.viewBox.baseVal.x = window.canvasConfig.viewBox.x 
      canvasref.current.viewBox.baseVal.y = window.canvasConfig.viewBox.y
      canvasref.current.viewBox.baseVal.width = window.canvasConfig.viewBox.w
      canvasref.current.viewBox.baseVal.height = window.canvasConfig.viewBox.h
    }

    if ( load ){
      setToolMode({"name":"normal"});
      loadState(false);
    }
  });
  

  return (
    <div className="container">
      {menu.comp}
      <div className="tools">
        <Toolbar {...props} toolbarButtons={toolbarButtons} toolbarButtonsState={toolbarButtonsState} setToolMode={setToolMode} />
        <LayerGroups {...props} setToolMode={setToolMode} />
      </div>
      <div className="canvas-top" id="canvasTop" ref={canvasTop} >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox='0 0 0 0' className="canvas" ref={canvasref} id="canvas" onMouseUp={onMouseUp}>
          <marker xmlns="http://www.w3.org/2000/svg" id="triangle" viewBox="0 0 10 10" refX="0" refY="5" markerUnits="strokeWidth" markerWidth="4" markerHeight="3" orient="90deg" >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
          <marker xmlns="http://www.w3.org/2000/svg" id="circle" viewBox="0 0 10 10" refX="5" refY="5" markerUnits="strokeWidth" markerWidth="4" markerHeight="4" >
            <circle cx="5" cy="5" r="3" fill="black"/>
          </marker>
          <line id="dummy"  x1="0" y1="0" x2="0" y2="0" strokeWidth="0" markerEnd="url(#triangle)" />
          {
            Object.keys(graphdef).map((layer, i) => {
              if ( layer === 'train_config' ){
                return undefined;
              }
              return (
                <Node
                  {...graphdef[layer]}
                  {...props}

                  menu={menu}
                  menuState={menuState}
                  key={i}
                />
              );
            })
          }
        </svg>
      </div>
    </div>
  );
};

export default GraphEditor;



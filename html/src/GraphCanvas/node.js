import React from "react";
import { StoreContext } from "../Store";
import Menu from "./menu";

const Node = (props={
  id:"LayerId",
  name:"LayerName",
  arguments:{

  },
  width:0,
  pos:{
    x:0,
    y:0,
    offsetX:0,
    offsetY:0,
  },
  connections:{
    inbound:[],
    outbound:[]
  },
  store:StoreContext
}) => {
  let height = 30;
  let { id, name, pos, connections,width } = props;
  let { graphdef, graphdefState, canvasConfig  } = props.store;
  let nodeRef = React.useRef(<svg />)

  function onMouseDown(e) {
    e.preventDefault();
    switch (canvasConfig.mode) {
      case "move":
        let scroll = document.getElementById("canvasTop");
        canvasConfig.activeElement = {
          layer: props,
          text: document.getElementById(`${id}-text`),
          rect: document.getElementById(`${id}-rect`),
          offset:{ 
            x:pos.x - ( e.clientX - window.offsetX + scroll.scrollLeft ),
            y:pos.y - ( e.clientY - window.offsetY + scroll.scrollTop ),
          },
          edges_in: connections.inbound.map((layer, i) => {
            return document.getElementById(`${layer}-${id}`);
          }),
          edges_out: connections.outbound.map((layer, i) => {
            return document.getElementById(`${id}-${layer}`);
          }),
        };
        break;
      case "edge":
        canvasConfig.newEdge = { from: id };
        break;
      default:
        break;
    }
  }

  function onMouseUp(e) {
    e.preventDefault();
    switch (canvasConfig.mode) {
      case "move":
        break;
      case "edge":
        canvasConfig.newEdge.to = id;
        break;
      default:
        break;
    }
  }

  function onClick(e) {
    switch (canvasConfig.mode) {
      case "delete":
        connections.inbound.forEach((lid) => {
          graphdef[lid].connections.outbound.pop(id);
        });
        connections.outbound.forEach((lid) => {
          graphdef[lid].connections.inbound.pop(id);
        });
        switch(graphdef[id].type._class){
          case "optimizers":
            delete graphdef.train_config.optimizer
            break
          default:
            break
        }
        delete graphdef[id];
        graphdefState({ ...graphdef });
        break;
      case "normal":
        props.menuState({
          comp: (
            <Menu
              {...props}
            />
          ),
          render:true
        });
        break;
      default:
        break;
    }
  }

  return (
    <g x={pos.x} y={pos.y} ref={nodeRef}>
      {connections.inbound.map((layer, i) => {
        let pos_out = graphdef[layer];
        if (pos_out) {
          return (
            <line
              x1 ={ pos.x + pos.offsetX + width / 2}
              y1 ={ pos.y - 5}
              x2 ={ pos_out.pos.x + pos_out.pos.offsetX + pos_out.width / 2 }
              y2 ={ pos_out.pos.y + 30 }
              markerStart="url(#triangle)"
              // markerEnd="url(#triangle)"
              stroke="#333"
              strokeWidth="2"
              key={i}
              id={`${pos_out.id}-${id}`}
            />
          );
        }
        return undefined;
      })}
      <rect
        x={pos.x}
        y={pos.y}
        rx={10}
        ry={10}
        height={height}
        width={width}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
        id={`${id}-rect`}
      ></rect>
      <text
        x={pos.x + ( width / 12 ) * 2.5 }
        y={pos.y + 19 }
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
        id={`${id}-text`}
      >
        {id}
      </text>
    </g>
  );
};

export default Node;

import React from "react";
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
  }
}) => {
  let height = 30;
  let { id, name, pos, connections,width } = props;

  function onMouseDown(e) {
    e.preventDefault();
    switch (window.canvasConfig.mode) {
      case "move":
        window.canvasConfig.activeElement = {
          layer: props,
          text: document.getElementById(`${id}-text`),
          rect: document.getElementById(`${id}-rect`),
          edges_in: connections.inbound.map((layer, i) => {
            return document.getElementById(`${layer}-${id}`);
          }),
          edges_out: connections.outbound.map((layer, i) => {
            return document.getElementById(`${id}-${layer}`);
          }),
        };
        break;
      case "line":
        window.canvasConfig.newEdge = { from: id };
        break;
      default:
        break;
    }
  }

  function onMouseUp(e) {
    e.preventDefault();
    switch (window.canvasConfig.mode) {
      case "move":
        break;
      case "line":
        window.canvasConfig.newEdge.to = id;
        break;
      default:
        break;
    }
  }

  function onClick(e) {
    switch (window.canvasConfig.mode) {
      case "delete":
        connections.inbound.forEach((lid) => {
          window.layers[lid].connections.outbound.pop(id);
        });
        connections.outbound.forEach((lid) => {
          window.layers[lid].connections.inbound.pop(id);
        });
        delete window.layers[id];
        window.layersState({ ...window.layers });
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

  function lineOut(e) {
    e.target.style.strokeWidth = 2;
  }

  function lineOver(e) {
    e.target.style.strokeWidth = 4;
  }

  function lineOnClick(e) {
    switch (window.canvasConfig.mode) {
      case "delete":
        connections.outbound.forEach((layerId, i) => {
          window.layers[layerId].connections.outbound.pop(id);
          window.layers[id].connections.inbound.pop(layerId);
        });
        window.layersState({ ...window.layers });
        break;
      default:
        break
    }
  }

  return (
    <g x={pos.x} y={pos.y}>
      {connections.inbound.map((layer, i) => {
        let pos_out = window.graphdef[layer];
        if (pos_out) {
          return (
            <line
              x1={pos.x + pos.offsetX}
              y1={pos.y + 15}
              x2={pos_out.pos.x + pos_out.pos.offsetX}
              y2={pos_out.pos.y + 31}
              markerMid="url(#triangle)"
              stroke="#555"
              strokeWidth="2"
              key={i}
              onClick={lineOnClick}
              onMouseOver={lineOver}
              onMouseOut={lineOut}
              id={`${pos_out.id}-${id}`}
            />
          );
        }
        return undefined;
      })}
      <rect
        x={pos.x}
        y={pos.y}
        rx={3}
        ry={3}
        height={height}
        width={width}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
        id={`${id}-rect`}
      ></rect>
      <text
        x={pos.x + Math.floor(width * 0.16)}
        y={pos.y + 19}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
        id={`${id}-text`}
      >
        {name}
      </text>
    </g>
  );
};

export default Node;

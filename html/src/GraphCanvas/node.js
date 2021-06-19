import React from "react";
import { metaStore, metaStoreContext, metaAppFunctions } from "../Meta";
import Menu from "./menu";

const propMeta = {
    id: "LayerId",
    name: "LayerName",
    arguments: {},
    width: 0,
    pos: {
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
    },
    connections: {
      inbound: [],
      outbound: [],
    },
  }

const Node = (
  props = {
    node:propMeta,
    menu: undefined,
    menuState: function (_ = { comp: undefined, render: false }) {},
    graph: {},
    graphState: function(){},
    appFunctions: metaAppFunctions,
  }
) => {
  let { id, pos, connections, width, } = props.node;
  let { graph, graphState } = props;
  let nodeRef = React.useRef(<svg />);

  let height = 30;
  
  function onMouseDown(e) {
    e.preventDefault();
    switch (window.canvas.mode) {
      case "move":
        window.canvas.activeElement = {
          layer: props.node,
          text: document.getElementById(`${id}-text`),
          rect: document.getElementById(`${id}-rect`),
          ref: {
            x: pos.x - (e.clientX - window.offsetX),
            y: pos.y - (e.clientY - window.offsetY),
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
        if (e.button) {
          window.canvas.newEdge = {
            longLine: true,
            queue: [{ from: undefined, to: id }],
          };
        } else {
          window.canvas.newEdge = {
            longLine: false,
            from: id,
          };
        }
        break;
      case "delete":
        window.canvas.activeElement = props.node;
        break;
      default:
        break;
    }
  }

  function onMouseOver(e) {
    switch (window.canvas.mode) {
      case "edge":
        if (window.canvas.newEdge) {
          if (window.canvas.newEdge.longLine) {
            let { queue } = window.canvas.newEdge;
            window.canvas.newEdge.queue.push({
              from: queue[queue.length - 1].to,
              to: id,
            });
          }
        }
        break;
      default:
        break;
    }
  }

  function onMouseUp(e) {
    e.preventDefault();
    switch (window.canvas.mode) {
      case "edge":
        if (window.canvas.newEdge.longLine) {
          window.canvas.newEdge.queue.forEach((edge) => {
            let { from, to } = edge;
            props.tools.addEdge(from, to);
          });
        } else {
          let to = id;
          let { from } = window.canvas.newEdge;
          props.tools.addEdge(from, to);
        }
        graphState({
          ...graph,
        });
        window.canvas.newEdge = undefined;
        window.canvas.activeLine = undefined;
        break;
      default:
        break;
    }
  }

  function onClick(e) {
    switch (window.canvas.mode) {
      case "normal":
        props.menuState({
          comp: <Menu {...props.node} graph={ graph } graphState={ graphState } />,
          render: true,
        });
        break;
      default:
        break;
    }
  }

  function edgeOnMouseDown(e) {
    if (window.canvas.mode === "delete") {
      window.canvas.activeElement = {
        type: {
          object_class: "edge",
        },
        inbound: connections.inbound,
        node: id,
      };
    }
  }

  return ( 
    <g x={pos.x} y={pos.y} ref={nodeRef} onMouseEnter={onMouseOver}>
      <rect
        x={pos.x}
        y={pos.y}
        rx={15}
        ry={15}
        height={height}
        width={width}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
        id={`${id}-rect`}
      ></rect>
      <text
        x={pos.x + Math.floor(width * (1 / 5))}
        y={pos.y + 19}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onClick={onClick}
        id={`${id}-text`}
      >
        {id}
      </text>
      {connections.inbound.map((layer, i) => {
        let pos_out = graph.nodes[layer];
        if (pos_out) {
          return (
            <line
              x1={pos.x + pos.offsetX}
              y1={pos.y - 5}
              x2={pos_out.pos.x + pos_out.pos.offsetX}
              y2={pos_out.pos.y + 30}
              markerStart="url(#triangle)"
              markerEnd="url(#circle)"
              stroke="#333"
              strokeWidth="2"
              key={i}
              id={`${pos_out.id}-${id}`}
              onClick={edgeOnMouseDown}
            />
          );
        }
        return undefined;
      })}
    </g>
  );
};

export default Node;

import React from "react";
import { metaAppFunctions } from "../Meta";
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
};

export function calculateEdge(
  cords = {
    x1: Number,
    y1: Number,
    x2: Number,
    y2: Number,
    h1: Number,
    h2: Number,
    w1: Number,
    w2: Number,
  }
) {
  let pstring = "";
  let { x1, y1, x2, y2, w1, w2 } = cords;
  let bcurve = 25;

  if (y1 > y2 - 120) {
    pstring += `M ${x2} ${y2} `;
    pstring += `C 
          ${x2} ${y2 + bcurve}, 
          ${x1} ${y1 - bcurve},
          ${x1} ${y1}
        `;
  } else {
    let midY = Math.abs(Math.floor((y1 - y2) / 2));
    let midX = Math.abs(Math.floor((x1 - x2) / 2));

    if (x1 < x2) {
     pstring += `M ${x2} ${y2} `;
     pstring += `C
      ${x2} ${y2},
      ${x2} ${y2 + 10} 
      ${x2 - 10} ${y2 + 10}
    `;
     pstring += `L ${x2 - Math.floor(w2 / 2) - 5} ${y2 + 10}`;
     pstring += `C
      ${x2 - Math.floor(w2 / 2) - midX - 10} ${y2 + 10}
      ${x1 + Math.floor(w1 / 2) + midY} ${y1 - 10},
      ${x1 + Math.floor(w1 / 2) + 5} ${y1 - 10}
    `;

     pstring += `L ${x1 + Math.floor(w1 / 2) - 5} ${y1 - 10} `;
     pstring += `C 
      ${x1} ${y1 - 10},
      ${x1} ${y1 - 10},
      ${x1} ${y1}
    `; 

    }else{
      pstring += `M ${x2} ${y2} `;
      pstring += `C
      ${x2} ${y2},
      ${x2} ${y2 + 10} 
      ${x2 + 10} ${y2 + 10}
    `;
      pstring += `L ${x2 + Math.floor(w2 / 2) + 5} ${y2 + 10}`;
      pstring += `C
      ${x2 + Math.floor(w2 / 2) + midX - 10} ${y2 + 10}
      ${x1 - Math.floor(w1 / 2) - midY} ${y1 - 10},
      ${x1 - Math.floor(w1 / 2) - 5} ${y1 - 10}
    `;

      pstring += `L ${x1 - Math.floor(w1 / 2) - 5} ${y1 - 10} `;
      pstring += `C 
      ${x1} ${y1 - 10},
      ${x1} ${y1 - 10},
      ${x1} ${y1}
    `;
    }
  }
  return pstring;
}

export const Node = (
  props = {
    node: propMeta,
    menu: undefined,
    menuState: function () {},
    graph: {},
    graphState: function () {},
    appFunctions: metaAppFunctions,
  }
) => {
  let { id, pos, connections, width } = props.node;
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
          handle: document.getElementById(`${id}-handle`),
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
          comp: (
            <Menu
              {...props.node}
              graph={graph}
              graphState={graphState}
              {...props}
            />
          ),
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
          let cords = {
            x1: pos.x + pos.offsetX,
            y1: pos.y,
            h1: 30,
            w1: width,
            x2: pos_out.pos.x + pos_out.pos.offsetX,
            y2: pos_out.pos.y + 30,
            h2: 30,
            w2: pos_out.width,
          };
          return (
            <path
              d={calculateEdge(cords)}
              stroke="#bbb"
              strokeWidth="2"
              fill="none"
              id={`${pos_out.id}-${id}`}
              key={i}
              data-cord={JSON.stringify(cords)}
              markerStart={`url(#circle_marker)`}
              markerEnd="url(#triangle_marker)"
            />
          );
        }
        return undefined;
      })}
      <line
        x1={pos.x}
        y1={pos.y}
        x2={pos.x}
        y2={pos.y + 30}
        id={`${id}-handle`}
        style={{
          stroke: "green",
          strokeWidth: "3",
        }}
      />
    </g>
  );
};

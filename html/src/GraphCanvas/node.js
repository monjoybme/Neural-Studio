import React from "react";
import Menu from "./menu";

let cursors = {
  line: "crosshair",
  delete: "no-drop",
  normal: "default",
  layer: "cell",
  move: "move",
};

const Node = (props) => {
  function dragMouseDown(e) {
    e.target.style.cursor = cursors[window.__MODE__];
    e = e || window.event;
    e.preventDefault();
    if (window.__MODE__ === "line") {
      window.__NEW_EDGE__ = {
        out: e.target.parentElement,
      };
    } else if (window.__MODE__ === "delete") {
      let inbound = window.layers[props.layer.id].connections.inbound;
      let outbound = window.layers[props.layer.id].connections.outbound;

      inbound.forEach((layer) => {
        window.layers[layer].connections.outbound.pop(props.layer.id);
        window.layers[layer].connections.outbound = [
          ...window.layers[layer].connections.outbound,
          ...outbound,
        ];
      });

      outbound.forEach((layer) => {
        window.layers[layer].connections.inbound.pop(props.layer.id);
        window.layers[layer].connections.inbound = [
          ...window.layers[layer].connections.inbound,
          ...inbound,
        ];
      });

      delete window.layers[props.layer.id];
      window.layersState({
        ...window.layers,
      });
    } else {
      window.__ACTIVE_ELEMENT__ = {
        target: e.target.parentElement,
      };
    }
  }

  function mouseUp(e) {
    e.target.style.cursor = cursors[window.__MODE__];
    if (window.__MODE__ === "line" && window.__NEW_EDGE__) {
      window.__NEW_EDGE__["in"] = e.target.parentElement;
    }
  }

  function menuToggle(e) {
    props.menuState({
      comp: <div />,
    });
    props.menuState({
      comp: <Menu layer={props.layer} layers={props.layers} layersState={props.layersState} menu={props.menu} menuState={props.menuState} layerGroups={props.layerGroups}  layerGroupsState={props.layerGroupsState} />,
    });
  }

  let width = Math.max(10 + props.layer.name.length * 11, 150);

  return (
    <div
      id={"node-" + props.layer.id}
      className="node"
      onMouseUp={mouseUp}
      onMouseOver={(e) => {
        e.target.style.cursor = cursors[window.__MODE__];
      }}
      style={{
        top: props.layer.pos.y + "px",
        left: props.layer.pos.x + "px",
        width: `${width}px`,
      }}
      key={props._key}
    >
      <div
        className="name"
        id={"name-" + props.layer.id}
        onMouseDown={dragMouseDown}
        onClick={menuToggle}
        style={{ width: `${width - 10}px` }}
      >
        {props.layer.name}
      </div>
    </div>
  );
};

export default Node;

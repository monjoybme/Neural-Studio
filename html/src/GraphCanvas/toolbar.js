import React from "react";
import { Icon, } from "../data/icons";

const Toolbar = (props={ toolbarButtons:[], toolbarButtonsState:function () { } }) => {
  let { toolbarButtons,  } = props;

  function setMode(name) {
    props.setToolMode({ name: name.toLowerCase() });
  }

  return (
    <div className="toolbar" id="toolbar">
      {toolbarButtons.map((button, i) => {
        return (
          <div
            className={button.selected ? "btn selected" : "btn"}
            onClick={(e) => setMode(button.name)}
            id={button.name}
            key={i}
          >
            <Icon icon={button.icon} style={{ height: "20px" }} />
          </div>
        );
      })}
    </div>
  );
};

export default Toolbar;

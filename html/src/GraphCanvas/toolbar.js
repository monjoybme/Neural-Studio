import React from 'react';
import { Icon, icons } from "../data/icons";

const Toolbar = (props) => {
    let buttons = [
      {
        name: "Edge",
        icon: icons.ArrowRight,
        func: function () {
          props.tools.toolbarHandler({ mode: "line", name: "Edge" });
        },
      },
      {
        name: "Move",
        icon: icons.Pan,
        func: function () {
          props.tools.toolbarHandler({ mode: "move", name: "Move" });
        },
      },
      {
        name: "Delete",
        icon: icons.Delete,
        func: function () {
          props.tools.toolbarHandler({ mode: "delete", name: "Delete" });
        },
      },
      {
        name: "Clean",
        icon: icons.DeleteAll,
        func: function () {
          window.graphdefState({ });
          window.autosave();
        },
      },
    ];
  
    return (
      <div className="toolbar" id="toolbar">
        {buttons.map((button, i) => {
          return (
            <div className="btn" onClick={button.func} id={button.name} key={i}>
              <Icon icon={button.icon} style={{ height: "20px" }} />
            </div>
          );
        })}
      </div>
    );
  };

  
export default Toolbar;
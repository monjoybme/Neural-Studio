import React from 'react';

import { icons } from '../data/icons';
import { metaAppFunctions, metaAppData } from '../Meta';

const SideBar = ( props = { appData: metaAppData }) => {
  let Logo = icons.Logo;
  let { nav, navState, renderState } = props.appData;

  function loadComp(button) {
    nav = nav.map((btn) => {
      btn.selected = btn.name === button.name;
      if (btn.selected) {
        renderState({
          ...btn,
        });
      }
      return btn;
    });
    navState([...nav]);
  }

  return (
    <div className="sidenav">
      <div className="nav">
        <div className="title">
          <Logo />
        </div>
        <div className="navigation">
          {nav.map((button, i) => {
            let Icon = button.icon;
            return (
              <div
                key={i}
                className={button.selected ? "btn selected" : "btn"}
                onClick={(e) => loadComp(button)}
              >
                <Icon
                  fill={button.selected ? "white" : "rgba(255,255,255,0.3)"}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TopBar = (
  props = { appData: metaAppData,  appFunctions : metaAppFunctions }
) => {
  let { app, appState, render } = props.appData;

  return (
    <div className="topbar">
      <div className="title" id="context-title">
        {render.name}
      </div>
      <div className="cmenupar"></div>
      <div
        className="switch"
        onClick={() => {
          if (app.theme === "light") {
            app.theme = "dark";
          } else {
            app.theme = "light";
          }
          appState({...app});
        }}
      >
        <div className="holder">
          <div className="button"></div>
        </div>
      </div>
    </div>
  );
};


export { TopBar, SideBar };
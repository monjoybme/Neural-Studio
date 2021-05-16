import React from 'react';

import { icons } from '../data/icons';
import { StoreContext } from '../Store';

const SideBar = (props = { store: StoreContext }) => {
  let Logo = icons.Logo;
  let { sidenav, sidenavState, renderState } = props.store;

  function loadComp(button) {
    sidenav = sidenav.map((btn) => {
      btn.selected = btn.name === button.name;
      if (btn.selected) {
        renderState({
          ...btn,
        });
      }
      return btn;
    });
    sidenavState([...sidenav]);
  }

  return (
    <div className="nav">
      <div className="title">
        <Logo />
      </div>
      <div className="navigation">
        {sidenav.map((button, i) => {
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
  );
};

const TopBar = (props = { store: StoreContext }) => {
  let { appconfig, appconfigState, render } = props.store;

  return (
    <div className="topbar">
      <div className="title" id="context-title">
        {render.name}
      </div>
      <div className="cmenupar"></div>
      <div
        className="switch"
        onClick={() => {
          if (appconfig.theme === "light") {
            appconfig.theme = "dark";
          } else {
            appconfig.theme = "light";
          }
          appconfigState({ ...appconfig });
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
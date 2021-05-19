import React from 'react';

import { icons } from '../data/icons';
import { metaAppFunctions, metaStore, metaStoreContext } from '../Meta';

const SideBar = ( props = { store: metaStore, storeContext:metaStoreContext }) => {
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
    <div className="sidenav">
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
    </div>
  );
};

const TopBar = (
  props = { store: metaStore, storeContext: metaStoreContext, appFunctions : metaAppFunctions }
) => {
  let { appConfig, appConfigState, render } = props.store;

  return (
    <div className="topbar">
      <div className="title" id="context-title">
        {render.name}
      </div>
      <div className="cmenupar"></div>
      <div
        className="switch"
        onClick={() => {
          if (appConfig.theme === "light") {
            appConfig.theme = "dark";
          } else {
            appConfig.theme = "light";
          }
          props.storeContext.appConfig.set(appConfig);
          props.storeContext.appConfig.push(function(){})
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
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { icons } from '../data/icons';
import { metaAppFunctions, metaAppData } from '../Meta';


const SideBar = ( props = { appData: metaAppData }) => {
  let Logo = icons.Logo;

  return (
    <Router>
      <div className="sidenav">
        <div className="nav">
          <div className="title">
            <Logo />
          </div>
          <div className="navigation">
            {[].map((button, i) => {
            let Icon = button.icon;
            return (
              <div
                key={i}
                className={button.selected ? "btn selected" : "btn"}
                onClick={function(){}}
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
    </Router>
  );
};

const TopBar = (
  props = { appData: metaAppData }
) => {
  let  { app, appState } = props.appData;
  return (
    <div className="topbar">
      <div className="title" id="context-title">
        { app.name }
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
import React from "react";

import Graph from "./GraphCanvas";
import CodeEditor from "./CodeEditor";
import Train from "./Training";
import SummaryViewer from "./SummaryViewer";
import Home from "./Home";

import layerGroupsDefault from "./data/layers";
import { StoreContext } from "./Store";
import { icons } from "./data/icons";
import { appConfig } from "./data/appconfig.js";
import { POST } from "./Utils";

import "./App.css";
import "./home.css";

window.copy = function (object) {
  return JSON.parse(JSON.stringify(object));
};

setInterval(function () {
  window.offsetX =
    appConfig.canvas.toolbar.width + appConfig.geometry.sideBar.width;
  window.offsetY = appConfig.geometry.topBar.height;
}, 1000);


const defaultSideNav = [
  {
    name: "Home",
    path: "/",
    selected: window.location.pathname === "/",
    icon: icons.Home,
    comp: Home,
  },
  {
    name: "Graph",
    path: "/graph",
    selected: window.location.pathname === "/graph",
    icon: icons.Graph,
    comp: Graph,
  },
  {
    name: "Code",
    path: "/code",
    selected: window.location.pathname === "/code",
    icon: icons.Code,
    comp: CodeEditor,
  },
  {
    name: "Summary",
    path: "/summary",
    selected: window.location.pathname === "/summary",
    icon: icons.Summary,
    comp: SummaryViewer,
  },
  {
    name: "Train",
    path: "/train",
    selected: window.location.pathname === "/train",
    icon: icons.Train,
    comp: Train,
  },
];

const defaultRender = { name: "Home", comp: Home };

const defaultTrain = {
  training: false,
  hist: [],
};

const defaultWorkspce = {
  ntbf: true,
  active: {
    config: {
      name: "Workspce",
    },
  },
  recent: [],
  all: [],
};

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
    window.autosave();
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

const App = (props) => {
  let [graphdef, graphdefState] = React.useState({});
  let [layerGroups, layerGroupsState] = React.useState({...layerGroupsDefault, });
  let [sidenav, sidenavState] = React.useState([...defaultSideNav]);
  let [train, trainState] = React.useState({ ...defaultTrain });
  let [popup, popupState] = React.useState(<div className='popup'></div>);
  let [appconfig, appconfigState] = React.useState({ ...appConfig });
  let [workspace, workspaceState] = React.useState({ ...defaultWorkspce });
  let [render, renderState] = React.useState({ ...defaultRender });
  let [ notification, notificationState ] = React.useState("notification bar")
  
  const store = {
    graphdef: graphdef,
    graphdefState: graphdefState,
    layerGroups: layerGroups,
    layerGroupsState: layerGroupsState,
    sidenav: sidenav,
    sidenavState: sidenavState,
    render: render,
    renderState: renderState,
    train: train,
    trainState: trainState,
    popup: popup,
    popupState: popupState,
    appconfig: appconfig,
    appconfigState: appconfigState,
    workspace: workspace,
    workspaceState: workspaceState,
    canvasConfig:window.canvasConfig,
  };

  window.autosave = async function () {
    let data = {
      graphdef: { ...graphdef },
      app_config: { ...appconfig },
      canvas_config: { ...window.canvasConfig },
      config:{ ...workspace.active.config },
      __workspace__: workspace.active.config.name
    };
    try {
      await POST({
        path: "workspace/autosave",
        data: data,
      })
        .then((response) => response.json())
        .then((data) => {
          let time = new Date();
          notificationState(`autosave @ ${ time.toTimeString() }`);
        });
    } catch (TypeError) {
    }
  };

  window.downloadCode = async function (e) {
    POST({
      path:'build',
      data:graphdef
    }).then((response) => response.json())
      .then((data) => {
        let link = document.createElement("a");
        link.href = `data:text/x-python,${encodeURIComponent(data.code)}`;
        link.download = "train.py";
        link.click();
      });
  }

  React.useEffect(function () {
    document.getElementsByTagName("html")[0].onkeydown = function (e) { 
      if (window.__SHORTCUT__) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            window.autosave();
            break;
          case "e":
            break;
          case "o":
            break;
          case "d":
            e.preventDefault();
            window.downloadCode();
            break;
          case "1":
            e.preventDefault();
            window.setToolMode({ mode: "Normal", name:"normal"  });
            break;
          case "2":
            e.preventDefault();
            window.setToolMode({ mode: "Edge", name:"edge"  });
            break;
          case "3":
            e.preventDefault();
            window.setToolMode({ mode: "Move", name:"move"  });
            break;
          case "4":
            e.preventDefault();
            window.setToolMode({ mode: "Delete", name:"delete"  });
            break;
          case "5":
            e.preventDefault();
            graphdefState({});
            break;
          case "Shift":
            window.__SHORTCUT__SHIFT__ = true;
            break;
          default:
            break;
        }
      } else {
        switch (e.key) {
          case "Control":
            window.__SHORTCUT__ = true;
            break;
          case "Escape":
            popupState(<div className='popup'></div>);
            if (render.name === "Graph") {
              window.setToolMode({ name: 'normal'});
            }
            break;
          default:
            break;
        }
      }
    };

    document.getElementsByTagName("html")[0].onkeyup = function (e) {
      window.__SHORTCUT__ = false;
    };

    window.autosave();
  });

  return (
    <div className={`_app ${appconfig.theme}`}>
      {popup}
      <SideBar store={store} />
      <TopBar store={store} />
      <render.comp store={store} />
      <div className="notifications">
        { notification.toLowerCase() } | workspace : { workspace.active.config.name }
      </div>
    </div>
  );
};

export default App;

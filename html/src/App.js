import React from "react";

import { TopBar, SideBar } from "./NavBar";
import { POST, Notification } from "./Utils";
import {
  defaultSideNav,
  defaultGraphdef,
  defaultRender,
  defaultTrain,
  appConfig,
  defaultWorkspce,
} from "./Store";
import deaultLayerGroups from "./data/layers";

import "./style/App.scss";
import "./style/Nav.scss";
import "./style/Home.scss";
import "./style/Canvas.scss";
import "./style/Code.scss";
import "./style/Training.scss";
import "./style/Summary.scss";

const App = (props) => {
  let [graphdef, graphdefState] = React.useState({ ...defaultGraphdef });
  let [layerGroups, layerGroupsState] = React.useState({ ...deaultLayerGroups});
  let [sidenav, sidenavState] = React.useState([...defaultSideNav]);
  let [train, trainState] = React.useState({ ...defaultTrain });
  let [popup, popupState] = React.useState(<div className="popup"></div>);
  let [appconfig, appconfigState] = React.useState({ ...appConfig });
  let [workspace, workspaceState] = React.useState({ ...defaultWorkspce });
  let [render, renderState] = React.useState({ ...defaultRender });
  let [statusbar, statusbarState] = React.useState("notification bar");
  let [notification, notificationState] = React.useState({ comp: undefined });

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
    canvasConfig: window.canvasConfig,
  };

  let storeContext = {
    graphdef:{
      get: function(){
        return graphdef;
      },
      set: function(data){
        graphdefState({...data});
      }
    },
  }

  window.autosave = async function () {
    let data = {
      graphdef: { ...graphdef },
      app_config: { ...appconfig },
      canvas_config: { ...window.canvasConfig },
      config: { ...workspace.active.config },
    };
    try {
      await POST({
        path: "/workspace/autosave",
        data: data,
      })
        .then((response) => response.json())
        .then((data) => {
          let time = new Date();
          statusbarState(`autosave @ ${time.toTimeString()}`);
        });
    } catch (TypeError) {}
  };

  window.downloadCode = async function (e) {
    POST({
      path: "build",
      data: graphdef,
    })
      .then((response) => response.json())
      .then((data) => {
        let link = document.createElement("a");
        link.href = `data:text/x-python,${encodeURIComponent(data.code)}`;
        link.download = "train.py";
        link.click();
      });
  };

  window.updateStatus = function (options = { text: "Notification" }) {
    let { text } = options;
    statusbarState(text);
  };

  window.notify = function (
    options = { name: "test", message: "Hello", timeout: 3000 }
  ) {
    notificationState({ comp: undefined });
    notificationState({
      comp: (
        <Notification
          {...options}
          notificationState={notificationState}
          timeout={options.timeout ? options.timeout : 3000}
        />
      ),
    });
  };

  function keynap(e) {
    switch (window.__SHORTCUT__) {
      case 0:
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
          case "s":
            window.notify({
              message: "HEllo",
            });
            window.autosave();
            break;
          case "1":
            e.preventDefault();
            window.setToolMode({ mode: "Normal", name: "normal" });
            break;
          case "2":
            e.preventDefault();
            window.setToolMode({ mode: "Edge", name: "edge" });
            break;
          case "3":
            e.preventDefault();
            window.setToolMode({ mode: "Move", name: "move" });
            break;
          case "4":
            e.preventDefault();
            window.setToolMode({ mode: "Delete", name: "delete" });
            break;
          case "5":
            e.preventDefault();
            graphdefState({});
            break;
          case "Shift":
            window.__SHORTCUT__ = 2;
            break;
          case "Tab":
            e.preventDefault();
            break;
          default:
            break;
        }
        break;

      case 1:
        break;

      case 2:
        break;

      default:
        switch (e.key) {
          case "Control":
            window.__SHORTCUT__ = 0;
            break;
          case "Shift":
            window.__SHORTCUT__ = 1;
            break;
          case "Alt":
            window.__SHORTCUT__ = 2;
            break;
          case "Escape":
            popupState(<div className="popup"></div>);
            if (render.name === "Graph") {
              window.setToolMode({ name: "normal" });
            }
            break;
          default:
            break;
        }
        break;
    }
  }

  React.useEffect(function () {
    window.onkeydown = keynap;
    window.onkeyup = function (e) {
      window.__SHORTCUT__ = -1;
    };
    if (!workspace.ntbf) {
      window.autosave();
    }
  });

  return (
    <div className={`app ${appconfig.theme}`}>
      {popup}
      {notification.comp}
      <div className="sidenav">
        <SideBar store={store} />
      </div>
      <div className="container-area">
        <TopBar store={store} />
        <render.comp store={store} />
        <div className="statusbar">
          {statusbar.toLowerCase()} | workspace : {workspace.active.config.name}
        </div>
      </div>
    </div>
  );
};

export default App;

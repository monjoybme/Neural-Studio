import React from "react";

import { TopBar, SideBar } from "./NavBar";
import { POST, Notification, GET, Loading } from "./Utils";
import {
  metaSideNav,
  metaGraphdef,
  metaRender,
  metaTrain,
  metaAppConfig,
  metaWorkspce,
  metaStore,
  metaStoreContext
} from "./Meta";
import deaultLayerGroups from "./data/layers";

import "./style/App.scss";
import "./style/Nav.scss";
import "./style/Home.scss";
import "./style/Canvas.scss";
import "./style/Code.scss";
import "./style/Training.scss";
import "./style/Summary.scss";

const PopUp = (
  props = { store: metaStore, storeContext: metaStoreContext }
) => {
  return (
    <>
      { props.store.popup }
    </>
  );
};

const NotificationPop = (props = { store: metaStore, storeContext:metaStoreContext } ) => {
  return (
    <>
      { props.store.notification.comp }
    </>
  );
};

const StatusBar = (props = { store: metaStore, storeContext:metaStoreContext } ) => {
  return (
    <div className="statusbar">
      {props.store.statusbar.toLowerCase()} | workspace :{" "}
      {props.store.appConfig.name}
    </div>
  );
};

const Container = (props = { store: metaStore, storeContext:metaStoreContext } ) => {
  return <div className="container-area">{props.children}</div>;
};

const Main = (props = { store: metaStore, storeContext:metaStoreContext } ) => {
  return (
    <div className={`app ${props.store.appConfig.theme}`}>{props.children}</div>
  );
};

const App = (props) => {
  let [graphDef, graphDefState] = React.useState({ ...metaGraphdef });
  let [workspace, workspaceState] = React.useState({ ...metaWorkspce });
  let [appConfig, appConfigState] = React.useState({ ...metaAppConfig });
  let [layerGroups, layerGroupsState] = React.useState({...deaultLayerGroups});

  let [sidenav, sidenavState] = React.useState([...metaSideNav]);
  let [render, renderState] = React.useState({ ...metaRender });
  let [train, trainState] = React.useState({ ...metaTrain });

  let [popup, popupState] = React.useState(<div className="popup"></div>);
  let [statusbar, statusbarState] = React.useState("status bar");
  let [notification, notificationState] = React.useState({ comp: undefined });
  let [ firstLoad, firstLoadState ] = React.useState( true );

  const store = {
    graphDef: graphDef,
    graphDefState: graphDefState,
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
    appConfig: appConfig,
    appConfigState: appConfigState,
    workspace: workspace,
    workspaceState: workspaceState,
    canvasConfig: window.canvasConfig,
    statusbar: statusbar,
    statusbarState: statusbarState,
    notification: notification,
    notificationState: notificationState,
  };

  const storeContext = {
    graphDef: {
      name: "graphdef",
      get: function () {
        return graphDef;
      },
      set: function (data) {
        graphDefState({ ...data });
      },
      pull: async function () {
        await GET({
          path: `/workspace/active/var/${this.name}`,
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.set(data);
          });
      },
      push: async function () {
        await POST({
          path: `/workspace/active/var/${this.name}`,
          data: graphDef
        }).then( response=> response.json()).then(data=>{
          
        });
      },
    },
    appConfig: {
      name: "app_config",
      get: function () {
        return appConfig;
      },
      set: function (data) {
        appConfigState({ ...data });
      },
      pull: async function () {
        await GET({
          path: `/workspace/active/var/${this.name}`,
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.set(data);
          });
      },
      push: async function () {
        await POST({
          path: `/workspace/active/var/${this.name}`,
          data: appConfig,
        })
          .then((response) => response.json())
          .then((data) => {});
      },
    },
    canvasConfig: {
      name: "canvas_config",
      get: function () {
        return window.canvasConfig;
      },
      set: function (data) {
        window.canvasConfig = data;
      },
      pull: async function () {
        await GET({
          path: `/workspace/active/var/${this.name}`,
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.set(data);
            layerGroupsState({
              ...layerGroups,
              custom_nodes: {
                name: "Custom Node Definitions",
                layers: data.customNodes.definitions,
              },
            });
          });
      },
      push: async function () {
        await POST({
          path: `/workspace/active/var/${this.name}`,
          data: window.canvasConfig,
        })
          .then((response) => response.json())
          .then((data) => {});
      },
    },
  };

  const appFunctions = {
    autosave: async function () {
      await this.pushStore(function(){
        statusbarState(`autosave @ ${ new Date().toTimeString() }`)
      });
    },
    downloadCode: async function (e) {
      await POST({
        path: "/model/code",
        data: graphDef,
      })
        .then((response) => response.json())
        .then((data) => {
          let link = document.createElement("a");
          link.href = `data:text/x-python,${encodeURIComponent(data.code)}`;
          link.download = "train.py";
          link.click();
        });
    },
    updateStatus: function (options = { text: "Notification" }) {
      let { text } = options;
      statusbarState(text);
    },
    notify: function (
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
    },
    pullStore: async function (callback) {
      await Object.entries(storeContext).map(async function ([key, val]) {
        await val.pull();
      });
      if (callback) {
        callback();
      }
    },
    pushStore: async function (callback) {
      await Object.entries(storeContext).map(async function ([key, val]) {
        await val.push();
      });
      if (callback) {
        callback();
      }
    },
  };

  let defaultProps = {
    store:store,
    storeContext:storeContext,
    appFunctions: appFunctions
  }

  function keymap(e) {
    switch (window.__SHORTCUT__) {
      case 0:
        switch (e.key) {
          case "s":
            e.preventDefault();
            appFunctions.autosave();
            break;
          case "e":
            break;
          case "o":
            break;
          case "d":
            e.preventDefault();
            appFunctions.downloadCode();
            break;
          case "s":
            appFunctions.notify({
              message: "HEllo",
            });
            appFunctions.autosave();
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
            graphDefState({});
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
    window.onkeydown = keymap;
    window.onkeyup = function (e) {
      window.__SHORTCUT__ = -1;
    };
    if ( firstLoad ){
      appFunctions.pullStore().then(response=>{
        firstLoadState(false);
      });
    }
  });

  return firstLoad ? (
    <Loading />
  ) : (
    <Main {...defaultProps}>
      <SideBar {...defaultProps} />
      <Container {...defaultProps}>
        <TopBar {...defaultProps} />
        <render.comp {...defaultProps} />
        <StatusBar {...defaultProps} />
      </Container>
      <PopUp {...defaultProps} />
      <NotificationPop {...defaultProps} />
    </Main>
  );
};

export default App;

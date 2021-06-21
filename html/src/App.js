import React from "react";

import { TopBar, SideBar } from "./NavBar";
import { POST, Notification, GET, Loading, pull, push } from "./Utils";
import { metaSideNav, metaApp, metaStore, metaRender } from "./Meta";

import "./style/App.scss";
import "./style/Nav.scss";
import "./style/Home.scss";
import "./style/Dataset.scss";
import "./style/Canvas.scss";
import "./style/Code.scss";
import "./style/Training.scss";
import "./style/Summary.scss";
import "./style/Utils.scss";

const PopUp = (props = { store: metaStore }) => {
  return <>{props.store.popup}</>;
};

const NotificationPop = (props = { store: metaStore }) => {
  return <>{props.store.notification.comp}</>;
};

const StatusBar = (props = { store: metaStore }) => {
  return (
    <div className="statusbar">
      {props.store.statusbar.toLowerCase()} | workspace : {props.store.app.name}
    </div>
  );
};

const Container = (props = { store: metaStore }) => {
  return <div className="container-area">{props.children}</div>;
};

const Main = (props = { store: metaStore }) => {
  return <div className={`app ${props.store.app.theme}`}>{props.children}</div>;
};

const App = (props) => {
  let [app, appState] = React.useState(metaApp);
  let [nav, navState] = React.useState(metaSideNav);
  let [popup, popupState] = React.useState(<></>);
  let [statusbar, statusbarState] = React.useState("status bar");
  let [notification, notificationState] = React.useState(<></>);
  let [render, renderState] = React.useState(metaRender);
  let [load, loadState] = React.useState(true);

  const store = {
    app: app,
    appState: appState,
    nav: nav,
    navState: navState,
    popup: popup,
    popupState: popupState,
    statusbar: statusbar,
    statusbarState: statusbarState,
    notification: notification,
    notificationState: notificationState,
    render: render,
    renderState: renderState,
    load: load,
    loadState: loadState,
  };

  const appFunctions = {
    downloadCode: async function (e) {
      await GET({
        path: "/model/code",
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
    getappconfig: function () {
      return app;
    },
    loadState: loadState,
  };

  let defaultProps = {
    store: store,
    appFunctions: appFunctions,
  };

  const LoadingData = (props) => {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="container loaddata" >
        <Loading />
      </div>
    );
  };

  React.useEffect(function () {
    window.onkeydown = function (e) {
      switch (window.__SHORTCUT__) {
        case 0:
          switch (e.key) {
            case "s":
              e.preventDefault();
              break;
            case "e":
              break;
            case "o":
              break;
            case "d":
              e.preventDefault();
              appFunctions.downloadCode();
              break;
            case "Escape":
              e.preventDefault();
              window.setToolMode({ mode: "Normal", name: "normal" });
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
              window.setToolMode({ mode: "clean", name: "clean" });
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
              console.log(render.name);
              if (render.name === "Graph") {
                window.setToolMode({ name: "normal" });
              }
              break;
            default:
              break;
          }
          break;
      }
    };
    window.onkeyup = function (e) {
      window.__SHORTCUT__ = -1;
    };
  });

  React.useEffect(
    function () {
      if (app.fetch) {
        pull({ name: "app" }).then((app_data) => {
          appState({
            ...app_data,
            fetch: false,
          });
        });
      } else {
        console.log("[PUSH] app");
        push({
          name: "app",
          data: app,
        }).then((response) => {
          loadState(false);
        });
      }
    },
    [app]
  );

  return (
    <Main {...defaultProps}>
      <SideBar {...defaultProps} />
      <Container {...defaultProps}>
        <TopBar {...defaultProps} />
        {load ? <LoadingData /> : <render.comp {...defaultProps} />}
        <StatusBar {...defaultProps} />
      </Container>
      <PopUp {...defaultProps} />
      <NotificationPop {...defaultProps} />
    </Main>
  );
};

export default App;

import React from "react";

import { TopBar, SideBar } from "./NavBar";
import { Notification, get, Loading, pull, push } from "./Utils";
import { metaSideNav, metaApp, metaAppData, metaRender } from "./Meta";

import "./style/App.scss";
import "./style/Nav.scss";
import "./style/Home.scss";
import "./style/Dataset.scss";
import "./style/Canvas.scss";
import "./style/Code.scss";
import "./style/Training.scss";
import "./style/Summary.scss";
import "./style/Utils.scss";

/**
 * It creates pop up overlays for custom pop up components.
 *
 * @param {object} props
 * @returns
 */
const PopUp = (props = { appData: metaAppData }) => {
  return <>{props.appData.popup}</>;
};

/**
 * Creates a pop up notification.
 *
 * @param {*} props
 * @returns
 */
const NotificationPop = (props = { appData: metaAppData }) => {
  return <>{props.appData.notification.comp}</>;
};

/**
 * Displays active workspace status.
 *
 * @param {*} props
 * @returns
 */
const StatusBar = (props = { appData: metaAppData }) => {
  return (
    <div className="statusbar">
      {props.appData.statusbar.toLowerCase()} | workspace :{" "}
      {props.appData.app.name}
    </div>
  );
};

/**
 * Wrapper for app container area.
 *
 * @param {*} props
 * @returns
 */
const Container = (props = { appData: metaAppData }) => {
  return <div className="container-area">{props.children}</div>;
};

/**
 * Wrapper for main area.
 *
 * @param {*} props
 * @returns
 */
const Main = (props = { appData: metaAppData }) => {
  return (
    <div className={`app ${props.appData.app.theme}`}>{props.children}</div>
  );
};

const App = (props) => {
  let [app, appState] = React.useState(metaApp); // contains global app data.
  let [nav, navState] = React.useState(metaSideNav); //  contains navbar and active work area information.
  let [popup, popupState] = React.useState(<></>);
  let [statusbar, statusbarState] = React.useState("status bar");
  let [notification, notificationState] = React.useState(<></>);
  let [render, renderState] = React.useState(metaRender);
  let [load, loadState] = React.useState(true);

  const appData = {
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
      await get({
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

  let appProps = {
    appData: appData,
    appFunctions: appFunctions,
  };

  const LoadingData = (props) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="container loaddata"
      >
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

  React.useEffect(function () {
      if (app.fetch) {
        console.log("Hello");
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
    <Main {...appProps}>
      <SideBar {...appProps} />
      <Container {...appProps}>
        <TopBar {...appProps} />
        {load ? <LoadingData /> : <render.comp {...appProps} />}
        <StatusBar {...appProps} />
      </Container>
      <PopUp {...appProps} />
      <NotificationPop {...appProps} />
    </Main>
  );
};

export default App;

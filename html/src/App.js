import React from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { TopBar, SideBar } from "./NavBar";
import { Notification, get, Loading, pull, push, WSSR } from "./Utils";
import { metaSideNav, metaApp, metaAppData, metaRender } from "./Meta";
import { icons } from "./data/icons";

import "./style/_app.scss";
import "./style/_nav.scss";
import "./style/_home.scss";
import "./style/_dataset.scss";
import "./style/_canvas.scss";
import "./style/_code.scss";
import "./style/_training.scss";
import "./style/_summary.scss";
import "./style/_utils.scss";
import "./style/_inference.scss";

const Logo = icons.Logo;

const LoadingOverlay = (props) => {
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

const StatusBar = (props = { appData: metaAppData }) => {
  let [time, timeState] = React.useState({ data: "time", _init: false });
  let [usage, usageState] = React.useState({ data: "usage", _init: false });
  let initRef = React.useRef();

  React.useState(() => {
    console.log("[status] status init");
    if (!usage._init) {
      let socket = new WebSocket(`${WSSR}/sys/utilization`);

      socket.onopen = function (event) {
        console.log("utils socket");
        socket.send("$");
      };

      socket.onmessage = function (event) {
        let data = JSON.parse(event.data);
        let d = new Date();
        usageState({ data: data.usage_string, _init: true });
        timeState({
          data: d.toTimeString(),
          _init: true,
        });
        if (initRef.current) {
          socket.send("$");
        }
      };

      socket.onclose = function (event) {
        console.log("[socket] Connection died");
      };

      socket.onerror = function (error) {
        console.log(`[socket] ${error.message}`);
      };

      usageState({ data: "connecting...", _init: true });
    }
  }, [time, usage]);

  return (
    <div className="statusbar" ref={initRef}>
      {time.data} | {usage.data}
    </div>
  );
};

const App = (props) => {
  let [app, appState] = React.useState(metaApp);
  let [navbar, navbarState] = React.useState(metaSideNav);
  let [popUp, popUpState] = React.useState(undefined);
  let [notification, notificationState] = React.useState(undefined);

  const appData = {
    app: app,
    appState: appState,
    popUpState: popUpState,
    notify: function (
      options = { name: "test", message: "Hello", timeout: 3000, type: "info" }
    ) {
      notificationState(undefined);
      notificationState(
        <Notification
          {...options}
          notificationState={notificationState}
          timeout={options.timeout ? options.timeout : 3000}
          type={options.type ? options.type : "info"}
        />
      );
    },
  };

  const updateNav = (button) => {
    navbar = metaSideNav.map((comp) => {
      comp.selected = comp.name === button;
      return comp;
    });
    navbarState(navbar);
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
              // appFunctions.downloadCode();
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
              popUpState(<div className="popup"></div>);
              if (
                window.location.pathname === "/graph" ||
                window.location.pathname === "/dataset"
              ) {
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
        push({
          name: "app",
          data: app,
        }).then((response) => {});
      }
    },
    [app]
  );

  return (
    <div className={`app ${app.theme}`}>
      <Router>
        <div className="sidenav">
          <div className="nav">
            <div className="title">
              <Logo />
            </div>
            <div className="navigation">
              {navbar.map((button, i) => {
                let Icon = button.icon;
                return (
                  <div
                    key={i}
                    className={button.selected ? "btn selected" : "btn"}
                  >
                    <Link
                      to={button.path}
                      onClick={(e) => updateNav(button.name)}
                    >
                      <Icon
                        fill={
                          button.selected ? "white" : "rgba(255,255,255,0.3)"
                        }
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="container-area">
          <TopBar appData={appData} />
          {metaSideNav.map((item, i) => {
            let Component = item.comp;
            return (
              <Route key={i} path={item.path} exact>
                <Component appData={appData} />
              </Route>
            );
          })}
        </div>
      </Router>
      <StatusBar />
      <>
        {popUp}
        {notification}
      </>
    </div>
  );
};

export default App;

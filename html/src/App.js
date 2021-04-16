import React from "react";

import Canvas from "./GraphCanvas";
import CodeEditor from "./CodeEditor";
import Train from "./Training";
import SummaryViewer from "./SummaryViewer";

import _layerGroups from './data/layers';

import {  icons } from "./data/icons";
import { appConfig } from "./data/appconfig.js";

import "./App.css";

window.copy = function (object) {
  return JSON.parse(JSON.stringify(object));
};

setInterval(function () {
  window.offsetX =
    appConfig.canvas.toolbar.width + appConfig.geometry.sideBar.width;
  window.offsetY = appConfig.geometry.topBar.height;
}, 1000);

const SaveDialogue = (
  props = {
    layers: {},
    saveFunction: function () {},
    popupState: function () {},
    project: { name: "graph", updated: false },
  }
) => {
  return (
    <div className="save-dialogue">
      <div className="title">Save</div>
      <input value={props.project.name} />
      <div className="btns">
        <div
          style={{ background:"green" }}
          onClick={(e) => {
            props.saveFunction({
              file: e.target.parentElement.previousElementSibling.value,
            });
          }}
        >
          save
        </div>
        <div
        style={{ background:"red" }}
          onClick={(e) => {
            document.getElementById("popups").style.visibility = "hidden";
            props.popupState(<div></div>);
          }}
        >
          cancel
        </div>
      </div>
    </div>
  );
};

const App = (props) => {
  let Logo = icons.Logo;
  let [layers, layersState] = React.useState({});
  let [ layerGroups, layerGroupsState ] = React.useState({ ..._layerGroups})
  
  let [buttons, buttonsState] = React.useState([
    {
      name: "Graph",
      path: "/",
      selected: window.location.pathname === "/",
      icon: icons.Graph,
    },
    {
      name: "Code",
      path: "/code",
      selected: window.location.pathname === "/code",
      icon: icons.Code,
    },
    {
      name: "Summary",
      path: "/summary",
      selected: window.location.pathname === "/summary",
      icon: icons.Summary,
    },
    {
      name: "Train",
      path: "/train",
      selected: window.location.pathname === "/train",
      icon: icons.Train,
    },
  ]);
  let [render, renderState] = React.useState({ name: "Graph" });
  let [project, projectState] = React.useState({
    file: {
      name: "graph",
      updated: false,
    },
  });
  let [train, trainState] = React.useState({
    training: false,
    hist: [],
  });
  let [popup, popupState] = React.useState(<div></div>);
  let [files, filesState] = React.useState({
    display: false,
    buttons: [
      {
        name: "Save",
        shortcut: "Ctrl + S",
        func: function () {
          popupState(
            <SaveDialogue
              layers={layers}
              saveFunction={saveGraph}
              popupState={popupState}
              project={project}
            />
          );
          document.getElementById("popups").style.visibility = "visible";
        },
      },
      { name: "Load", shortcut: "Ctrl + O", func: loadGraph },
      { name: "Save as", shortcut: "Ctrl + Shift + S", func: saveGraph },
      { name: "Download Code", shortcut: "Ctrl + D", func: downloadCode },
    ],
  });
  let [appconfig, appconfigState] = React.useState({
    ...appConfig,
  });

  window.getLayers = function () {
    return window.layers;
  };

  async function saveGraph(project = { file: "graph" }) {
    filesState({
      display: false,
      buttons: files.buttons,
    });

    await fetch("http://localhost/graph/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        graph: { ...window.getLayers() },
        file: project.file,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data, project);
        projectState({
          file: project.file,
          updated: true,
        });

        document.getElementById("popups").style.visibility = "hidden";
        popupState(<div></div>);
      });
  }

  async function loadGraph(e) {
    filesState({
      display: false,
      buttons: files.buttons,
    });
    setTimeout(async function () {
      let input = document.createElement("input");
      input.type = "file";
      input.id = "fileopen";
      input.onchange = function (e) {
        var reader = new FileReader();
        reader.onload = function () {
          let graph = JSON.parse(reader.result);
          layersState({ ...graph });
          layersState({ ...graph });

          projectState({
            file: input.files[0].name.split(".")[0],
            updated: true,
          });
          projectState({
            file: input.files[0].name.split(".")[0],
            updated: true,
          });
          document.body.style.cursor = "default";
        };
        reader.readAsText(e.target.files[0]);
      };
      input.click();
      document.body.style.cursor = "loading";
    }, 10);
  }

  async function downloadCode(e) {
    await fetch("http://localhost/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...layers }),
    })
      .then((response) => response.json())
      .then((data) => {
        let link = document.createElement("a");
        link.href = `data:text/x-python,${encodeURIComponent(data.code)}`;
        link.download = "train.py";
        link.click();
      });
  }

  function getRenderComp() {
    switch (render.name) {
      case "Graph":
        return (
          <Canvas
            appconfig={appconfig}
            appconfigState={appconfigState}

            layers={layers}
            layersState={layersState}

            layerGroups={layerGroups}
            layerGroupsState={layerGroupsState}

            popup={popup}
            popupState={popupState}
          />
        );
      case "Code":
        return (
          <CodeEditor
            appconfig={appconfig}
            appconfigState={appconfigState}

            layers={layers}
            layersState={layersState}
            
            layerGroups={layerGroups}
            layerGroupsState={layerGroupsState}
          />
        );
      case "Train":
        return (
          <Train
            train={train}
            trainState={trainState}
            
            appconfig={appconfig}
            appconfigState={appconfigState}

            layers={layers}
            layersState={layersState}
            
            layerGroups={layerGroups}
            layerGroupsState={layerGroupsState}
          />
        );
      case "Summary":
        return (
          <SummaryViewer
            layers={layers}
            
            appconfig={appconfig}
            appconfigState={appconfigState}
          />
        );
      default:
        return <Canvas />;
    }
  }

  React.useEffect(() => {
    document.getElementById("root").onmouseup = function () {
      if (files.display) {
        setTimeout(function () {
          filesState({
            display: false,
            buttons: files.buttons,
          });
        }, 100);
      }
    };

    document.getElementsByTagName("html")[0].onkeydown = function (e) {
      if (window.__SHORTCUT__) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            if (project.updated) {
              saveGraph(project);
            } else {
              files.buttons[0].func(project);
            }
            break;
          case "o":
            e.preventDefault();
            loadGraph();
            break;
          case "d":
            e.preventDefault();
            downloadCode();
            break;
          case "1":
            e.preventDefault();
            window.toolbarHandler({ mode: "normal", name: "Normal" });
            break;
          case "2":
            e.preventDefault();
            window.toolbarHandler({ mode: "line", name: "Edge" });
            break;
          case "3":
            e.preventDefault();
            window.toolbarHandler({ mode: "move", name: "Move" });
            break;
          case "4":
            e.preventDefault();
            window.toolbarHandler({ mode: "delete", name: "Delete" });
            break;
          case "5":
            e.preventDefault();
            layersState({});
            layersState({});
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
            popupState(<div></div>);
            document.getElementById("popups").style.visibility = "hidden";
            window.toolbarHandler({ mode: "normal", name: "Normal" });
            break;
          default:
            break;
        }
      }
    };
    document.getElementsByTagName("html")[0].onkeyup = function (e) {
      window.__SHORTCUT__ = false;
    };
  });

  return (
    <div className="_app" className={appconfig.theme}>
      <div className="popups" id="popups">
        {popup}
      </div>
      <div className="nav">
        <div className="title">
          <Logo />
        </div>
        <div className="navigation">
          {buttons.map((button, i) => {
            let Icon = button.icon;
            return (
              <div
                key={i}
                to={button.path}
                className={button.selected ? "btn selected" : "btn"}
                onClick={(e) => {
                  buttons = buttons.map((_button) => {
                    _button.selected = _button.name === button.name;
                    if (_button.selected) {
                      document.getElementById("context-title").innerText =
                        button.name;
                      renderState({
                        ..._button,
                      });
                    }
                    return _button;
                  });
                  buttonsState([...buttons]);
                }}
              >
                <Icon
                  fill={button.selected ? "white" : "rgba(255,255,255,0.3)"}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="context-menu">
        <div className="title" id="context-title">
          {" "}
          Graph{" "}
        </div>

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
      {getRenderComp()}
    </div>
  );
};

export default App;

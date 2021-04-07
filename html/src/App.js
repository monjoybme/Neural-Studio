import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Canvas from "./GraphCanvas";
import CodeEditor from "./CodeEditor";
import Train from "./Training";

import "./App.css";
import "./nav.css";

window.copy = function (object) {
  return JSON.parse(JSON.stringify(object));
};

setInterval(function () {
  window.offsetX = Math.floor(window.innerWidth * 0.1525);
  window.offsetY = 75;
}, 1000);

const App = (props) => {
  let [menu, menuState] = React.useState({
    comp: <div />,
  });
  let [layers, layersState] = React.useState({});
  let [trainingStatus, trainingStatusState] = React.useState({
    status: [],
    update_id: 0,
  });
  let [code, codeState] = React.useState({
    data: "",
  });

  let [buttons, buttonsState] = React.useState([
    { name: "Graph", path: "/", selected: window.location.pathname === "/" },
    {
      name: "Code",
      path: "/code",
      selected: window.location.pathname === "/code",
    },
    {
      name: "Train",
      path: "/train",
      selected: window.location.pathname === "/train",
    },
  ]);

  let [files, filesState] = React.useState({
    display: false,
    buttons: [
      { name: "Save", shortcut: "Ctrl + s", func: saveGraph },
      { name: "Load", shortcut: "Ctrl + o", func: loadGraph },
      { name: "Save as", shortcut: "Ctrl + Shift + s", func: saveGraph },
    ],
  });

  window.getLayers =  function (){
    return layers
  }

  async function saveGraph(e) {
    filesState({
      display: false,
      buttons: files.buttons,
    });
    setTimeout(async function(){
      let name = prompt("Enter Graph Name : ", "graph");
      await fetch("http://localhost/graph/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          graph: { ...window.layers },
          name: name,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
      });
    },100)
  }

  async function loadGraph(e) {
    filesState({
      display: false,
      buttons: files.buttons,
    });
    setTimeout(async function(){
      let input = document.createElement("input");
      input.type = "file";
      input.onchange = function (e) {
        var reader = new FileReader();
        reader.onload = function () {
          document.body.style.cursor = 'loading';
          window.layersState({ ...JSON.parse(reader.result) });
        };
        reader.readAsText(e.target.files[0]);
      };
      input.click();
    },10)
  }

  React.useEffect(() => {

  }, []);

  return (
    <Router className="app">
      <div className="nav">
        <div className="title">Tf Build</div>
        <div className="navigation">
          {buttons.map((button, i) => {
            return (
              <Link
                key={i}
                to={button.path}
                className={button.selected ? "btn selected" : "btn"}
                onClick={(e) => {
                  buttons = buttons.map((_button) => {
                    _button.selected = _button.name === button.name;
                    return _button;
                  });
                  buttonsState([...buttons]);
                }}
              >
                {button.name}
              </Link>
            );
          })}
        </div>
        <div className="files">
          <div
            className="icon"
            onClick={(e) =>
              filesState({ display: true, buttons: files.buttons })
            }
          >
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
          {files.display ? (
            <div className="dropdown">
              <div className="title">Menu</div>
              {files.buttons.map((button, i) => {
                return (
                  <div className="btn" key={i} onClick={button.func}>
                    <div className="name">
                      <span>⚫</span>
                      {button.name}
                    </div>
                    <div className="shortcut">{button.shortcut}</div>
                  </div>
                );
              })}
            </div>
          ) : undefined}
        </div>
      </div>
      <Route
        path="/"
        exact
        render={(props) => (
          <Canvas {...props}  />
        )}
      />
      <Route
        path="/code"
        exact
        render={(props) => (
          <CodeEditor
            {...props}
          />
        )}
      />
      <Route
        path="/train"
        exact
        render={(props) => (
          <Train {...props} />
        )}
      />
    </Router>
  );
};

export default App;

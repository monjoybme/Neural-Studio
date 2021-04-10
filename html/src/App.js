import React from "react";

import Canvas from "./GraphCanvas";
import CodeEditor from "./CodeEditor";
import Train from "./Training";
import SummaryViewer from './SummaryViewer';

import "./App.css";
import "./nav.css";

window.copy = function (object) {
  return JSON.parse(JSON.stringify(object));
};

setInterval(function () {
  window.offsetX = Math.floor(window.innerWidth * 0.1525);
  window.offsetY = 75;
}, 1000);

// function downloadCode(e) {
//   let link = document.createElement("a");
//   link.href = `data:text/x-python,${encodeURIComponent(props.code.data)}`;
//   link.download = 'train.py'
//   link.click()
// }

const App = (props) => {

  let [layers, layersState] = React.useState({

  });
  let [buttons, buttonsState] = React.useState([
    { name: "Graph", path: "/", selected: window.location.pathname === "/" },
    {
      name: "Code",
      path: "/code",
      selected: window.location.pathname === "/code",
    },
    {
      name: "Summary",
      path: "/summary",
      selected: window.location.pathname === "/summary",
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
  let [render, renderState] = React.useState({ name:"Graph"});

  window.getLayers =  function (){
    return window.layers
  }

  async function saveGraph(e) {
    filesState({
      display: false,
      buttons: files.buttons,
    });
    let name = prompt("Enter Graph Name : ", "graph");
    await fetch("http://localhost/graph/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        graph: { ...window.getLayers() },
        name: name,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data,);
    });
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
          layersState({ ...JSON.parse(reader.result) });
          document.body.style.cursor = 'default'
        };
        reader.readAsText(e.target.files[0]);
      };
      input.click();
      document.body.style.cursor = 'loading';
    },10)
  }

  function getRenderComp(){
    switch(render.name) {
      case "Graph":
        return <Canvas layers={layers} layersState={layersState} />
      case "Code":
        return <CodeEditor layers={layers} />
      case "Train":
        return <Train layers={layers} layersState={layersState} />
      case "Summary":
        return <SummaryViewer layers={layers} />
      default:
        return <Canvas />
    }
  }

  React.useEffect(()=>{
    document.getElementById("root").onmouseup = function(){
      if (files.display){
        setTimeout(function(){
          filesState({
            display:false,
            buttons:files.buttons
          })
        }, 500)
      }
    }
  })
  
  return (
    <div>
      <div className="nav">
        <div className="title"> Tf Builder </div>
        <div className="navigation">
          {buttons.map((button, i) => {
            return (
              <div
                key={i}
                to={button.path}
                className={button.selected ? "btn selected" : "btn"}
                onClick={(e) => {
                  buttons = buttons.map((_button) => {
                    _button.selected = _button.name === button.name;
                    if (_button.selected){
                      renderState({
                        ..._button
                      })
                    }
                    return _button;
                  });
                  buttonsState([...buttons]);
                }}
              >
                {button.name}
              </div>
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
      {getRenderComp()}
    </div>
  );

};

export default App;

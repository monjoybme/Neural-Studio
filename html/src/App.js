import React from "react";

import Canvas from "./GraphCanvas";
import CodeEditor from "./CodeEditor";
import Train from "./Training";
import SummaryViewer from "./SummaryViewer";

import { icons } from "./data/icons";
import { appConfig } from "./data/appconfig.js";
import { GET, POST } from "./Utils";

import _layerGroups from "./data/layers";

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

async function downloadCode(e) {
  await fetch("http://localhost/build", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...window.graphdef }),
  })
    .then((response) => response.json())
    .then((data) => {
      let link = document.createElement("a");
      link.href = `data:text/x-python,${encodeURIComponent(data.code)}`;
      link.download = "train.py";
      link.click();
    });
}

const WorkspaceCard = (props = { name: "Hello" }) => {
  return (
    <div className="card">
      <div className="image"></div>
      <div className="footer">
        <div className="name">
          {props.name}
          <icons.More />
        </div>
      </div>
    </div>
  );
};

const New = (props) =>{
  let { newworkspace, newworkspaceState } = props;
  function handleKey(e){
    if (e.key === 'Enter'){
      newworkspaceState({
        name:"",
        active:false
      })
      props.newWorkspace(
        document.getElementById("newname").value,
      )
    }
  }

  React.useEffect(()=>{
    document.getElementById("newname").focus()
  })

  return (
    <div>
      <input id={"newname"} defaultValue={newworkspace.name} placeholder={"Enter Name"} onKeyUp={handleKey} />
    </div>
  )
}

const NewCard = (props) => {
  let [ newworkspace, newworkspaceState ] = React.useState({
    active:false,
    name:""
  })
  
  return (
    <div className="card new" onClick={e=>newworkspaceState({name:"", active:true})} onMouseLeave={e=>newworkspaceState({name:"",active:false})}>
      {
        newworkspace.active ?
        <New newWorkspace={props.newWorkspace} newworkspace={newworkspace} newworkspaceState={newworkspaceState} />
          :
        <icons.Add  />
      }
    </div>
  );
};

const Home = (
  props = {
    appconfigState: undefined,
    graphdefState: undefined,
    workspace: undefined,
    workspaceState: undefined,
  }
) => {
  let { workspace, workspaceState } = props;

  async function fetchWorkspace() {
      let active = await GET({
        path: "workspace/active",
      }).then((response) => response.json());

      let all = await GET({
        path: "workspace/all",
      }).then((response) => response.json());

      workspaceState({
        ntbf: false,
        all: all.data,
        active: active.data,
      });

      console.log(all.data, active.data)

      props.graphdefState({
        ...active.data.graphdef,
      });
      props.appconfigState({
        ...active.data.app_config,
      });
      window.canvasConfig = active.data.canvas_config;
      window.graphdef = active.data.graphdef;
  }
  
  async function newWorkspace(name="model"){
    await POST({
      path:"workspace/new",
      data:{
        name:name
      }
    }).then(response=>response.json()).then(data=>{
      console.log(data)
      fetchWorkspace();
    })
  }

  React.useEffect(() => {
    if (workspace.ntbf){
      fetchWorkspace();
    }
  });

  return (
    <div className="container home">
      <div className="name">Active Worksapce</div>
      <div className="card active">
        <div className="head">{workspace.active.config.name}</div>
        <div className="footer">
          <div className="name">
            <icons.Save />
            <icons.Code />
            <icons.Download />
            <icons.Share />
          </div>
        </div>
      </div>
      <div className="name">Your Work</div>
      <div className="cards">
        <NewCard newWorkspace={newWorkspace} />
        {workspace.all.map((work, i) => {
          return <WorkspaceCard {...work} key={i} />;
        })}
      </div>
    </div>
  );
};

const App = (props) => {
  let Logo = icons.Logo;
  let [graphdef, graphdefState] = React.useState({});
  let [layerGroups, layerGroupsState] = React.useState({ ..._layerGroups });
  let [buttons, buttonsState] = React.useState([
    {
      name: "Home",
      path: "/",
      selected: window.location.pathname === "/",
      icon: icons.Home,
    },
    {
      name: "Graph",
      path: "/graph",
      selected: window.location.pathname === "/graph",
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
  let [render, renderState] = React.useState({ name: "Home" });
  let [train, trainState] = React.useState({
    training: false,
    hist: [],
  });
  let [popup, popupState] = React.useState(<div></div>);

  let [appconfig, appconfigState] = React.useState({
    ...appConfig,
  });
  let [workspace, workspaceState] = React.useState({
    ntbf: true,
    active: {
      config: {
        name: "Workspce",
      },
    },
    recent: [],
    all: [],
  });

  window.autosave = async function () {
    let data = {
      graphdef: { ...graphdef },
      app_config: { ...appconfig },
      canvas_config: { ...window.canvasConfig },
    };
    try {
      await POST({
        path: "workspace/autosave",
        data: data,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    } catch (TypeError) {
      console.log(TypeError);
    }
  };

  function getRenderComp() {
    switch (render.name) {
      case "Home":
        return (
          <Home
            appconfigState={appconfigState}
            graphdefState={graphdefState}
            workspace={workspace}
            workspaceState={workspaceState}
          />
        );
      case "Graph":
        return (
          <Canvas
            appconfig={appconfig}
            appconfigState={appconfigState}
            graphdef={graphdef}
            graphdefState={graphdefState}
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
            graphdef={graphdef}
            graphdefState={graphdefState}
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
            graphdef={graphdef}
            graphdefState={graphdefState}
            layerGroups={layerGroups}
            layerGroupsState={layerGroupsState}
          />
        );
      case "Summary":
        return (
          <SummaryViewer
            graphdef={graphdef}
            appconfig={appconfig}
            appconfigState={appconfigState}
          />
        );
      default:
        return <div>Under Construction</div>;
    }
  }

  React.useEffect(function () {
    window.graphdef = graphdef;
    window.graphdefState = graphdefState;
    document.getElementsByTagName("html")[0].onkeydown = function (e) {
      if (window.__SHORTCUT__) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            break;
          case "e":
            e.preventDefault();
            break;
          case "o":
            e.preventDefault();
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
            graphdefState({});
            window.autosave();
            break;
          case "Shift":
            e.preventDefault();
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
            popupState(<div></div>);
            if (render.name === "Graph") {
              window.toolbarHandler({ mode: "normal", name: "Normal" });
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

    document.getElementsByTagName("html")[0].onclick = function (e) {
      e.preventDefault();
    };
  });

  return (
    <div className={`_app ${appconfig.theme}`}>
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
      <div className="topbar">
        <div className="title" id="context-title">
          Graph
        </div>
        <div className="cmenupar">{/* <Icon icon={icons.Menu} /> */}</div>
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
      <div className="sidemenu"></div>
      {getRenderComp()}
    </div>
  );
};

export default App;

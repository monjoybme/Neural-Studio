import React from "react";
import { StoreContext } from "../Store/index";
import { icons } from "../data/icons";
import { GET, Loading, POST } from "../Utils";

const WorkspaceCard = (props = { name: "Hello" }) => {
  function loadMenu(e){
    props.store.popupState(
      <div 
        className="workspace-card-context" 
        style={{ top:e.clientY, left:e.clientX }} 
        onMouseLeave={e=>props.store.popupState(<div></div>)}
      >
        <div className="btn" onClick={e=>props.openWorkspace({ name: props.name})}>
          Open
        </div>
        <div className="btn">
          Renane
        </div>
        <div className="btn">
          Duplicate
        </div>
        <div className="btn" onClick={e=>props.deleteWorkspace({ name: props.name})} >
          Delete
        </div>
      </div>
    )
  }
  return (
    <div className="card" onDoubleClick={e=>props.openWorkspace({ name: props.name})}>
      <div className="image"></div>
      <div className="footer">
        <div className="name">
          {props.name}
          <icons.More onClick={loadMenu} />
        </div>
      </div>
    </div>
  );
};

const New = (props) => {
  let { newworkspace, newworkspaceState } = props;
  function handleKey(e) {
    switch (e.key) {
      case "Enter":
        newworkspaceState({
          name: "",
          active: false,
        });
        props.newWorkspace(document.getElementById("newname").value);
        break
      case " ":
        document.getElementById("newname").value = document.getElementById("newname").value.replaceAll(" ", "")
        break
      default:
        break
    }
  }

  React.useEffect(() => {
    document.getElementById("newname").focus();
  });

  return (
    <div>
      <input
        id={"newname"}
        defaultValue={newworkspace.name}
        placeholder={"Enter Name"}
        onKeyUp={handleKey}
      />
    </div>
  );
};

const NewCard = (props) => {
  let [newworkspace, newworkspaceState] = React.useState({
    active: false,
    name: "",
  });

  return (
    <div
      className="card new"
      onClick={(e) => newworkspaceState({ name: "", active: true })}
      onMouseLeave={(e) => newworkspaceState({ name: "", active: false })}
    >
      {newworkspace.active ? (
        <New
          newWorkspace={props.newWorkspace}
          newworkspace={newworkspace}
          newworkspaceState={newworkspaceState}
        />
      ) : (
        <icons.Add />
      )}
    </div>
  );
};

const DownloadModel = (props) =>{

  async function downloadModel(options={ format:"Format", download:"download.format" }){
    let { format, download } = options;
    renderState(<Loading />)
    POST({
      path:'download',
      data:{ 
        format:format  
      }      
    }).then(response=>response.json()).then(data=>{
      if (data.status){
        renderState(
          <div className="option output">
            <a href={`http://localhost/download/${download}`}  onClick={ e=>props.store.popupState(<div></div>) } download={download} > Click To Download Model </a>
          </div>
        )
      }else{
        renderState(
          <div className='option'>
            Error Occured While Building Model
          </div>
        )
      }
    })
  }
  
  let [ render, renderState ] = React.useState(
    <div className="options">
        <div className='option title'>
          Select Format
        </div>
        <div className="option" onClick={e=>downloadModel({ format:"json", download:"model.json" })}>
          json
        </div>
        <div className="option" onClick={e=>downloadModel({ format:"json_w", download:"model.zip" })}>
          json with weights
        </div>
        <div className="option" onClick={e=>downloadModel({ format:"pb", download:"model.zip" })}>
          pb
        </div>
        <div className="option" onClick={e=>downloadModel({ format:"hdf5", download:"model.hdf5" })}>
          hdf5
        </div>
    </div>
  )

  return (
    <div className="popup download-model">
      <div className="exit">
        Press Esc to exit.
      </div>
      { render }  
    </div>
  )
}

const Home = ( props = { store: StoreContext, }) => {
  let {
    workspace,
    workspaceState,
    graphdefState,
    appconfigState,
    popupState,
  } = props.store;

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

    graphdefState({
      ...active.data.graphdef,
    });
    appconfigState({
      ...active.data.app_config,
    });
    window.canvasConfig = active.data.canvas_config;
    window.canvasConfig.mode = 'normal'
  }

  async function newWorkspace(name = "model") {
    await POST({
      path: "workspace/new",
      data: {
        name: name,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        fetchWorkspace();
      });
  }

  async function openWorkspace(options={ name : "workspace"}){
   POST({
     path:`workspace/open/${options.name}`,
     data:{},
   }).then(response=>response.json()).then(data=>{
     popupState(undefined);
     fetchWorkspace();
   })
  }

  async function deleteWorkspace(options={ name: "workspace" }){
    POST({
      path:`workspace/delete/${encodeURIComponent(options.name)}`,
      data:{}
    }).then(response=>response.json()).then(data=>{
      if (data.status){
        fetchWorkspace();
      }
      popupState(undefined);
    })
  }
  
  React.useEffect(() => {
    if (workspace.ntbf) {
      fetchWorkspace();
    }
  });

  return (
    <div className="home container">
      <div className="name">Active Worksapce</div>
      <div className="card active">
        <div className="head">{workspace.active.config.name}</div>
        <div className="footer">
          <div className="name">
            <icons.Save onClick={window.autosave} />
            <icons.Code onClick={window.downloadCode} />
            <icons.Download onClick={ e=>{ popupState(<DownloadModel { ...props } />) } } />
            <icons.Delete onClick={e=>{deleteWorkspace({ name:workspace.active.config.name })}} />
          </div>
        </div>
      </div>
      <div className="name">Your Work</div>
      <div className="cards">
        <NewCard newWorkspace={newWorkspace} />
        {workspace.all.map((work, i) => {
          return (
            <WorkspaceCard 
              {...props} 
              {...work} 
              openWorkspace={openWorkspace} 
              deleteWorkspace={deleteWorkspace}
              key={i}
            />
          )
        })}
      </div>
    </div>
  );
};

export default Home;

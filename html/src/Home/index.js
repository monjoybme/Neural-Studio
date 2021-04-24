import React from "react";
import { StoreContext } from "../Store/index";
import { icons } from "../data/icons";
import { GET, Loading, POST } from "../Utils";

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

const New = (props) => {
  let { newworkspace, newworkspaceState } = props;
  function handleKey(e) {
    if (e.key === "Enter") {
      newworkspaceState({
        name: "",
        active: false,
      });
      props.newWorkspace(document.getElementById("newname").value);
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
      renderState(
        <div className="option output">
          <a href={`http://localhost/download/${download}`}  onClick={ e=>props.store.popupState(<div></div>) } download={download} > Click To Download Model </a>
        </div>
      )
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

const Home = (
  props = {
    store: StoreContext,
  }
) => {
  let {
    workspace,
    workspaceState,
    graphdefState,
    appconfigState,
    popupState
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
        console.log(data);
        fetchWorkspace();
      });
  }

  React.useEffect(() => {
    if (workspace.ntbf) {
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
            <icons.Save onClick={window.autosave} />
            <icons.Code onClick={window.downloadCode} />
            <icons.Download onClick={ e=>{ popupState(<DownloadModel { ...props } />) } } />
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

export default Home;

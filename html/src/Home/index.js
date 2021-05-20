import React from "react";
import {
  metaAppConfig,
  metaAppFunctions,
  metaStore,
  metaStoreContext,
} from "../Meta/index";
import { icons } from "../data/icons";
import { GET, Loading, POST } from "../Utils";

const WorkspaceCard = (
  props = { name: "Hello", store: metaStore, storeContext: metaStoreContext }
) => {
  function loadMenu(e) {
    props.store.popupState(
      <div
        className="workspace-card-context"
        style={{ top: e.clientY, left: e.clientX }}
        onMouseLeave={(e) => props.store.popupState(<div></div>)}
      >
        <div
          className="btn"
          onClick={(e) => props.openWorkspace({ name: props.name })}
        >
          Open
        </div>
        <div className="btn">Renane</div>
        <div className="btn">Duplicate</div>
        <div
          className="btn"
          onClick={(e) => props.deleteWorkspace({ name: props.name })}
        >
          Delete
        </div>
      </div>
    );
  }
  return (
    <div
      className="card"
      onDoubleClick={(e) => props.openWorkspace({ name: props.name })}
    >
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

const New = (props = { store: metaStore, storeContext: metaStoreContext }) => {
  let { newworkspace, newworkspaceState } = props;
  function handleKey(e) {
    switch (e.key) {
      case "Enter":
        newworkspaceState({
          name: "",
          active: false,
        });
        props.newWorkspace(document.getElementById("newname").value);
        break;
      case " ":
        document.getElementById("newname").value = document
          .getElementById("newname")
          .value.replaceAll(" ", "");
        break;
      default:
        break;
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

const NewCard = (
  props = { store: metaStore, storeContext: metaStoreContext }
) => {
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

const DownloadModel = (
  props = {
    store: metaStore,
    storeContext: metaStoreContext,
    appFunctions: metaAppFunctions,
  }
) => {
  async function downloadModel(
    options = { format: "Format", download: "download.format" }
  ) {
    let { format, download } = options;
    renderState(<Loading />);
    POST({
      path: "download",
      data: {
        format: format,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          renderState(
            <div className="option output">
              <a
                href={`http://localhost/download/${download}`}
                onClick={(e) => props.store.popupState(<div></div>)}
                download={download}
              >
                {" "}
                Click To Download Model{" "}
              </a>
            </div>
          );
        } else {
          renderState(
            <div className="option">Error Occured While Building Model</div>
          );
        }
      });
  }

  let [render, renderState] = React.useState(
    <div className="options">
      <div className="title option">Select Format</div>
      <div
        className="option"
        onClick={(e) =>
          downloadModel({ format: "json", download: "model.json" })
        }
      >
        json
      </div>
      <div
        className="option"
        onClick={(e) =>
          downloadModel({ format: "json_w", download: "model.zip" })
        }
      >
        json with weights
      </div>
      <div
        className="option"
        onClick={(e) => downloadModel({ format: "pb", download: "model.zip" })}
      >
        pb
      </div>
      <div
        className="option"
        onClick={(e) =>
          downloadModel({ format: "hdf5", download: "model.hdf5" })
        }
      >
        hdf5
      </div>
    </div>
  );

  return (
    <div className="popup download-model">
      <div className="exit">Press Esc to exit.</div>
      {render}
    </div>
  );
};

const Home = (
  props = {
    store: metaStore,
    storeContext: metaStoreContext,
    appFunctions: metaAppFunctions,
  }
) => {
  let { popupState, appConfig } = props.store;

  let [yourWorkData, yourWorkDataState] = React.useState([]);

  async function pullData() {
    await GET({
      path: "/workspace/all",
    })
      .then((response) => response.json())
      .then((data) => {
        yourWorkDataState([...data.data]);
      });
  }

  async function newWorkspace(name) {
    await props.appFunctions.autosave();
    await POST({
      path: "/workspace/new",
      data: {
        name: name,
      },
    })
      .then((response) => response.json())
      .then(async function(data) {
        props.appFunctions.loadState(true);
        Object.entries(props.storeContext).map(([key, val])=>{
          val.set({});
        })
        props.appFunctions.pullStore();
        await pullData().then(response=>{
          props.appFunctions.loadState(false);
        });
      });
  }

  async function openWorkspace(options = { name: "workspace" }) {
    await props.appFunctions.autosave();
    await POST({
      path: `/workspace/open/${options.name}`,
      data: {},
    })
      .then((response) => response.json())
      .then(async function (data) {
        props.appFunctions.loadState(true);
        await props.appFunctions.pullStore().then(async function(response){
          await pullData().then(async function(response){
            props.appFunctions.notify({ message: `${options.name} Loaded.` });
            props.appFunctions.loadState(false);
          })
        });
      });
  }

  async function deleteWorkspace(options = { name: "workspace" }) {
    POST({
      path: `/workspace/delete/${encodeURIComponent(options.name)}`,
      data: {},
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          props.appFunctions.pullStore();
          pullData();
        }
        popupState(undefined);
      });
  }

  React.useEffect(() => {
    if (!yourWorkData.length) {
      pullData();
    }
  }, [yourWorkData]);

  return (
    <div className="home container">
      <div className="name">Active Worksapce</div>
      <div className="card active">
        <div className="head">{appConfig.name}</div>
        <div className="footer">
          <div className="name">
            <icons.Save onClick={(e) => props.appFunctions.autosave()} />
            <icons.Code onClick={(e) => props.appFunctions.downloadCode()} />
            <icons.Download
              onClick={(e) => {
                popupState(<DownloadModel {...props} />);
              }}
            />
            <icons.Delete
              onClick={(e) => {
                deleteWorkspace({ name: appConfig?.name });
              }}
            />
          </div>
        </div>
      </div>
      <div className="name">Your Work</div>
      <div className="cards">
        <NewCard newWorkspace={newWorkspace} />
        {yourWorkData.map((work, i) => {
          return (
            <WorkspaceCard
              {...props}
              {...work}
              openWorkspace={openWorkspace}
              deleteWorkspace={deleteWorkspace}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Home;

import React from 'react';
import Editor from "@monaco-editor/react";

import { POST, GET, push, Notification, Loading } from '../Utils';

let csvPreProcCode = `def dataset_proprocessor(dataset)->None:
    """
    This function will be used to preprocess your dataset.

    You need to set following variables 

    dataset.train_x = np.ndarray
    dataset.train_y = np.ndarray
    dataset.test_x = np.ndarray
    dataset.test_y = np.ndarray

    dataset object will have following variables

    name: str
    metadata: dict {
      datatype: str,
      model: str
    }
    path: str
    dataframe: pd.Dataframe
    """
    pass
`;

let imagesPreProcCode = `def dataset_proprocessor(dataset)->None:
    """
    This function will be used to preprocess your dataset.

    You need to set following variables 

    dataset.train_x = np.ndarray
    dataset.train_y = np.ndarray
    dataset.test_x = np.ndarray
    dataset.test_y = np.ndarray

    dataset object will have following variables

    name: str
    metadata: dict {
      datatype: str,
      model: str
    }
    path: str
    dataframe: pd.Dataframe
    """
    pass
`;

const ImageDatasetFromDirectory = (
  props = {
    name: "Image Dataset From Directory",
    meta: {
      type: "image",
      config: {
        path: undefined,
        view: {
          folders: [],
        },
        folders: {
          train: "None",
          test: "None",
          val: "None",
        },
      },
      preprocessor: "#preprocessorcode",
    },
    deleteDataset: function () {},
  }
) => {
  let [paths, pathsState] = React.useState([]);
  let [dataset, datasetState] = React.useState({
    ...props,
  });
  let [load, loadState] = React.useState(false);

  async function addDataset() {
    loadState(true);
    await POST({
      path: "/dataset/add",
      data: { ...dataset },
    })
      .then((response) => response.json())
      .then((data) => {
        dataset.meta.config.view.sample = data.sample;
        datasetState({ ...dataset });
        loadState(false);
        console.log(data);
      });
  }

  async function fetchPath(e) {
    await POST({
      path: "/sys/path",
      data: {
        path: e.target.value,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dataset.meta.config.path = e.target.value;
        datasetState({ ...dataset });
        pathsState(data);
      });
  }

  async function getFolders(e) {
    await POST({
      path: "/sys/path",
      data: {
        path: dataset.meta.config.path,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dataset.meta.config.view.folders = ["None", ...data];
        datasetState({ ...dataset });
      });
  }

  React.useEffect(()=>{
    push({
      name: "dataset",
      data: dataset,
    });
  }, [dataset,]);

  return (
    <div className="datasetviewer imagedatasetfromdirectory">
      <div className="top">
        <div className="name">{props.name}</div>
        <div>
          <button onClick={props.deleteDataset}>delete</button>
        </div>
      </div>
      <div className="utils">
        <div className="pathinput">
          <datalist id="paths" style={{ height: "100px" }}>
            {paths.map((path, i) => {
              return <option value={path} key={i} />;
            })}
          </datalist>
          <input
            placeholder="Enter file path"
            onChange={fetchPath}
            list={"paths"}
            defaultValue={dataset.meta.config.path}
          />
          <button onClick={getFolders}>get folders</button>
        </div>
      </div>

      <div className="arguments">
        <div className="folder-selector">
          <div className="head">
            <div className="name">Select Paths</div>
          </div>
          <div className="select">
            <div className="name">Train Folder</div>
            <select
              onChange={(e) => {
                dataset.meta.config.folders.train = e.target.value;
                datasetState({ ...dataset });
              }}
              defaultValue={dataset.meta.config.folders.train}
            >
              {dataset.meta.config.view.folders.map((folder, i) => {
                folder = folder.split("\\");
                folder = folder[folder.length - 1];
                return (
                  <option key={i} value={folder}>
                    {folder}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="select">
            <div className="name">Test Folder</div>
            <select
              onChange={(e) => {
                dataset.meta.config.folders.test = e.target.value;
                datasetState({ ...dataset });
              }}
              defaultValue={dataset.meta.config.folders.test}
            >
              {dataset.meta.config.view.folders.map((folder, i) => {
                folder = folder.split("\\");
                folder = folder[folder.length - 1];
                return (
                  <option key={i} value={folder}>
                    {folder}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="select">
            <div className="name">Validation Folder</div>
            <select
              onChange={(e) => {
                dataset.meta.config.folders.val = e.target.value;
                datasetState({ ...dataset });
              }}
              defaultValue={dataset.meta.config.folders.val}
            >
              {dataset.meta.config.view.folders.map((folder, i) => {
                folder = folder.split("\\");
                folder = folder[folder.length - 1];
                return (
                  <option key={i} value={folder}>
                    {folder}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="viewer"></div>
        </div>
        <div className="params">
          <div className="head">Image Parameters</div>
          <div className="grid">
            <div className="param">
              <div className="name">Image Size</div>
              <input placeholder="size" />
            </div>
            <div className="param">
              <div className="name">Resize Size</div>
              <select>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>
            <div className="param">
              <div className="name">Show Progress</div>
              <select>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CSVDataset = (
  props = {
    name: "CSV Dataset",
    meta: {
      type: "csv",
      config: {
        path: undefined,
        view:{
            index:{
                start: 0,
                end: 10,
            },
            sample:{
                column:[],
                rows:[]         
            }
        }
      },
      preprocessor:"#preprocessorcode"
    },
    deleteDataset: function(){}
  }
) => {
  let [paths, pathsState] = React.useState([]);
  let [dataset, datasetState] = React.useState({
    ...props,
  })
  let [load, loadState] = React.useState(false);

    async function addDataset() {
      loadState(true);
      await POST({
        path: "/dataset/add",
        data: { ...dataset },
      })
        .then((response) => response.json())
        .then((data) => {
            dataset.meta.config.view.sample = data.sample;
            datasetState({ ...dataset });
            loadState(false);
        });
    }

    async function fetchPath(e) {
      await POST({
        path: "/sys/path",
        data: {
          path: e.target.value,
        },
      })
        .then((response) => response.json())
        .then((data) => {        
          dataset.meta.config.path = e.target.value;
          datasetState({ ...dataset });
          pathsState(data);
        });
    }

    async function applyPreprocessor(){
      await GET({
        path:"/dataset/preprocess",
      }).then(response => response.json()).then(data=>{
        if (data.status){
          console.log("Applied")
        }else{
          console.log(data.message)
        }
      })
    }

  React.useEffect(() => {
    if (dataset.meta.preprocessor === "#preprocessorcode") {
      dataset.meta.preprocessor = csvPreProcCode;
      datasetState(dataset);
    }
  },[]);

  React.useEffect(()=>{
    if (dataset.deleteDataset){
        delete dataset.deleteDataset;
    }
    console.log("Hello")
    push({
        name: "dataset",
        data: dataset
    })
  }, [dataset])

  return (
    <div className="datasetviewer csvdataset">
      <div className="top">
        <div className="name">{props.name}</div>
        <div>
          <button onClick={props.deleteDataset}>delete</button>
        </div>
      </div>
      <div className="utils">
        <div className="pathinput">
          <datalist id="paths" style={{ height: "100px" }}>
            {paths.map((path, i) => {
              return <option value={path} key={i} />;
            })}
          </datalist>
          <input
            placeholder="Enter file path"
            onChange={fetchPath}
            list={"paths"}
            defaultValue={dataset.meta.config.path}
          />
          <button onClick={addDataset}>read</button>
        </div>
      </div>
      <div className="viewer">
        {load ? (
          <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100%", width:"100%"}}>
            <Loading />
          </div>
        ) : (
          <>
            <div
              className="columns"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${
                  dataset.meta.config.view.sample.columns.slice(
                    dataset.meta.config.view.index.start,
                    dataset.meta.config.view.index.end
                  ).length
                }, 10%)`,
              }}
            >
              {dataset.meta.config.view.sample.columns
                .slice(
                  dataset.meta.config.view.index.start,
                  dataset.meta.config.view.index.end
                )
                .map((column, i) => {
                  return (
                    <div className="column" key={i}>
                      {column}
                    </div>
                  );
                })}
            </div>
            <div className="rows">
              {dataset.meta.config.view.sample.values.map((row, i) => {
                return (
                  <div
                    className="row"
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${
                        row.slice(
                          dataset.meta.config.view.index.start,
                          dataset.meta.config.view.index.end
                        ).length
                      }, 10%)`,
                    }}
                  >
                    {row
                      .slice(
                        dataset.meta.config.view.index.start,
                        dataset.meta.config.view.index.end
                      )
                      .map((column, j) => {
                        return (
                          <div className="column" key={j}>
                            {column}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="preprocessor">
        <div className="top">
          <div className="name">Preprocessor Function</div>
          <button onClick={applyPreprocessor}>apply</button>
        </div>
        <Editor
          defaultLanguage="python"
          defaultValue={dataset.meta.preprocessor}
          onChange={(e) => {
            dataset.meta.preprocessor = e;
            datasetState({ ...dataset });
          }}
          // theme={"vs-" + app.theme}
        />
      </div>
    </div>
  );
};

const datasetList = {
    csv: CSVDataset,
    imagedatasetfromdirectory: ImageDatasetFromDirectory
}

export default datasetList;
import React from 'react';
import Editor from "@monaco-editor/react";

import { post, get, push, Notification, Loading } from '../Utils';
import { metaAppFunctions } from '../Meta';

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
          sample: [],
          info: {
            n_train: 0,
            n_test: 0,
            n_val: 0,
          },
        },
        params: {
          folders: {
            train: "None",
            test: "None",
            val: "None",
          },
          image: {
            size: "Enter Image Size",
            resize: "False",
            show_progress: "True",
          },
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
    await post({
      path: "/dataset/add",
      data: { ...dataset },
    })
      .then((response) => response.json())
      .then((data) => {
        dataset.meta.config.view.sample = data.sample.sample;
        dataset.meta.config.view.info = data.sample.info
        datasetState({ ...dataset });
        loadState(false);
        console.log(data);
      });
  }

  async function fetchPath(e) {
    await post({
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
    await post({
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

  React.useEffect(() => {
    if (dataset.deleteDataset){
      delete dataset.deleteDataset;
    }
    if (dataset.appData){
      delete dataset.appData
    }
    push({
      name: "dataset",
      data: dataset,
    });
  }, [dataset]);

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
                dataset.meta.config.params.folders.train = e.target.value;
                datasetState({ ...dataset });
              }}
              defaultValue={dataset.meta.config.params.folders.train}
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
                dataset.meta.config.params.folders.test = e.target.value;
                datasetState({ ...dataset });
              }}
              defaultValue={dataset.meta.config.params.folders.test}
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
                dataset.meta.config.params.folders.val = e.target.value;
                datasetState({ ...dataset });
              }}
              defaultValue={dataset.meta.config.params.folders.val}
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
              <input
                placeholder="Image Size"
                defaultValue={dataset.meta.config.params.image.size}
                onChange={(e) => {
                  dataset.meta.config.params.image.size = e.target.value;
                  datasetState({ ...dataset });
                }}
              />
            </div>
            <div className="param">
              <div className="name">Resize To Size</div>
              <select
                defaultValue={dataset.meta.config.params.image.resize}
                onChange={(e) => {
                  dataset.meta.config.params.image.resize = e.target.value;
                  datasetState({ ...dataset });
                }}
              >
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>
            <div className="param">
              <div className="name">Show Progress</div>
              <select
                defaultValue={dataset.meta.config.params.image.show_progress}
                onChange={(e) => {
                  dataset.meta.config.params.image.show_progress = e.target.value;
                  datasetState({ ...dataset });
                }}
              >
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>
          </div>
        </div>
        <div className="info">
          <div className="head">Dataset Info</div>
          <div className="grid">
            <div className="param">
              <div className="name">Train Images</div>
              <label>{dataset.meta.config.view.info.n_train}</label>
            </div>
            <div className="param">
              <div className="name">Test Images</div>
              <label>{dataset.meta.config.view.info.n_test}</label>
            </div>
            <div className="param">
              <div className="name">Number Of Classes</div>
              <label>{dataset.meta.config.view.info.n_classes}</label>
            </div>
            <div
              className="param"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button style={{ width: "100%", marginTop:"15%" }} onClick={addDataset}>Read From Directory</button>
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
    deleteDataset: function(){},
    appFunctions: metaAppFunctions
  }
) => {
  let [paths, pathsState] = React.useState([]);
  let [dataset, datasetState] = React.useState({
    ...props,
  })
  let [load, loadState] = React.useState(false);

    async function addDataset() {
      loadState(true);
      await post({
        path: "/dataset/add",
        data: { ...dataset },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if(data.status){
            dataset.meta.config.view.sample = data.sample;
            datasetState({ ...dataset });
            loadState(false);
          }else{
            props.appFunctions.notify({ message: data.message});
            loadState(false);
          }
        });
    }

    async function fetchPath(e) {
      await post({
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
      await get({
        path:"/dataset/preprocess",
      }).then(response => response.json()).then(data=>{
        if (data.status){
          props.appFunctions.notify({ message: "Applied function" })
        }else{
          props.appFunctions.notify({ message: "Error Applying function" });
        }
      })
    }

  React.useEffect(() => {
    if (dataset.meta.preprocessor === "#preprocessorcode") {
      dataset.meta.preprocessor = csvPreProcCode;
      datasetState(dataset);
    }
  },[dataset,]);

  React.useEffect(()=>{
    if (dataset.deleteDataset){
        delete dataset.deleteDataset;
    }
     if (dataset.appData) {
       delete dataset.appData;
     }
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
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

const ImageDataset = (
  props = {
    name: "Dataset",
    metadata: { datatype: "data", model: "classification" },
  }
) => {
  return <div className="datasetviewer imageclassification">{props.name}</div>;
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
    console.log(dataset.meta.preprocessor)
    if (dataset.meta.preprocessor === "#preprocessorcode") {
      dataset.meta.preprocessor = csvPreProcCode;
      datasetState(dataset);
    }
  },[]);

  React.useEffect(()=>{
    if (dataset.deleteDataset){
        delete dataset.deleteDataset;
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
    csv: CSVDataset
}

export default datasetList;
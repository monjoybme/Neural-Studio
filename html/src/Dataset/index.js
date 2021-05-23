import React from "react";
import { metaAppFunctions, metaStore } from "../Meta";
import { icons } from "../data/icons";
import { POST } from "../Utils";

const metaDatasets = [
  {
    name: "CSV Dataset",
    metadata: {
      datatype: "csv",
      model: "select",
    },
  },
  {
    name: "Image Dataset From Directory",
    metadata: {
      datatype: "image",
      model: "classification",
    },
  },
  {
    name: "MNIST",
    metadata: {
      datatype: "image",
      model: "classification",
    },
  },
  {
    name: "CIFAR10",
    metadata: {
      datatype: "image",
      model: "classification",
    },
  },
];

const modelTypes = [
  "select",
  "regression",
  "classification"
]

const ImageDataset = (props={ name: 'Dataset', metadata:{ datatype: "data", model: "classification" } }) =>{
  return (
    <div className="datasetviewer imageclassification">
      {
        props.name
      }
    </div>
  )
}

const CSVDataset = (props={ name: 'Dataset', metadata:{ datatype: "data", model: "classification" }}) =>{
  return (
    <div className="datasetviewer csvdataset">
      <div className="top">
        <div className="name">
          { props.name }
        </div>
        <div className="modeltype">
          Select Model Type : &nbsp;
          <select id="modeltypelist" defaultValue={ props.metadata.model }>
            {
              modelTypes.map((type,i)=>{
                return <option value={type} key={i}>{type}</option>
              })
            }
          </select>
        </div>
      </div>
      <div className="utils">
          <div className="pathinput">
            <input placeholder="Enter file path" />
            <button>
              save
            </button>
          </div>
      </div>
      <div className="viewer">

      </div>
    </div>
  )
}

let dataset_config = {
  image:ImageDataset,
  csv: CSVDataset
}

const DatasetCard = (
  props = {
    store: metaStore,
    appFunctions: metaAppFunctions,
    data: { name: "Hello" },
    datasetState: function () {},
  }
) => {
  return (
    <div className="card" onClick={(e) => props.datasetState(props.data)}>
      {props.data.name}
    </div>
  );
};

const Selector = (
  props = {
    store: metaStore,
    appFunctions: metaAppFunctions,
    datasetState: function () {},
  }
) => {
  let [datasets, datasetsState] = React.useState([...metaDatasets]);
  function search(e) {
    let { value } = e.target;
    if (value) {
      datasets = datasets.filter((dataset) => {
        return dataset.name.toLowerCase().lastIndexOf(value.toLowerCase()) > -1;
      });
      datasetsState([...datasets]);
    } else {
      datasetsState([...metaDatasets]);
    }
  }

  return (
    <div className="selector">
      <div className="search">
        <icons.Search />
        <input placeholder="Search Dataset" onChange={search} />
      </div>
      <div className="datasets">
        {datasets.map((dataset, i) => {
          return (
            <DatasetCard
              data={dataset}
              key={i}
              datasetState={props.datasetState}
            />
          );
        })}
      </div>
    </div>
  );
};

const Dataset = (
  props = { store: metaStore, appFunctions: metaAppFunctions }
) => {
  let [dataset, datasetState] = React.useState({ 
    name : undefined,
    metadata : {
      datatype : undefined,
      model : undefined 
    }
   });

   async function addDataset(){
     return await POST({
       path:"/dataset/add",
       data: dataset
     }).then(response => response.json()).then(data=>{
       console.log(data);
     })
   }

  function getDatasetViewer() {
    if (dataset_config[dataset.metadata.datatype]){
      addDataset();
      let Viewer = dataset_config[dataset.metadata.datatype];
      return <Viewer {...dataset} />
    }
    return <div>{dataset.name}</div>;
  }

  React.useEffect(function () {
    
  });
  return (
    <div className="container dataset-container">
      {dataset.name !== undefined ? (
        getDatasetViewer()
      ) : (
        <Selector datasetState={datasetState} />
      )}
    </div>
  );
};

export default Dataset;

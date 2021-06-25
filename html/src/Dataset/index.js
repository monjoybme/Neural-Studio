import React from "react";

import Selector from './selector';
import datasetList from './datasets';

import { metaAppFunctions, metaStore } from "../Meta";
import { GET, POST, pull, push } from "../Utils";


const Dataset = (
  props = { store: metaStore, appFunctions: metaAppFunctions }
) => {
  let [dataset, datasetState] = React.useState({
    name: undefined,
    fetch: true
  });

  function deleteDataset(){
    datasetState({
      name: undefined,
      fetch: false
    })
  }

  React.useEffect(()=>{
    if(dataset.fetch){
      pull({
        name: "dataset",
      }).then((datasetData) => {
        datasetState(datasetData);
      });
    }else{
      
    }
  }, [dataset,])

  function getDataset(){
    let Dataset = datasetList[dataset.meta.type];
    return <Dataset {...dataset} deleteDataset={deleteDataset}  />
  }

  return (
    <div className="container dataset-container">
      {dataset.name ? getDataset() : <Selector datasetState={datasetState} />}
    </div>
  );
};

export default Dataset;


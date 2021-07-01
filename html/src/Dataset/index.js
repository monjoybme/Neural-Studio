import React from "react";

import Selector from './selector';
import datasetList from './datasets';

import { metaAppFunctions, metaAppData } from "../Meta";
import { GET, POST, pull, push } from "../Utils";


const Dataset = (
  props = { appData: metaAppData, appFunctions: metaAppFunctions }
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
    return <Dataset {...dataset} deleteDataset={deleteDataset} {...props} />
  }

  return (
    <div className="container dataset-container">
      {dataset.name ? getDataset() : <Selector datasetState={datasetState} appData={props}  />}
    </div>
  );
};

export default Dataset;


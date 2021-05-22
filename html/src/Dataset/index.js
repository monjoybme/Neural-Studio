import React from "react";
import { metaAppFunctions, metaStore } from "../Meta";
import { icons } from "../data/icons";

const metaDatasets = [
  {
    name: "Dataset",
  },
  {
    name: "Image Dataset From Directory",
  },
  {
    name: "MNIST",
  },
  {
    name: "Boston Housing",
  },
  {
    name: "CIFAR10",
  }
];

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
  let [dataset, datasetState] = React.useState({});

  function getDatasetViewer() {
    return <div>{dataset.name}</div>;
  }

  React.useEffect(function () {
    console.log(dataset);
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

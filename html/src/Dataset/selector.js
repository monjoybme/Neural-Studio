import React from 'react';

import { metaAppFunctions, metaAppData } from "../Meta";
import { icons } from "../data/icons";

const metaDatasets = [
  {
    name: "CSV Dataset",
    meta: {
      type: "csv",
      config: {
        path: undefined,
        view: {
          index: {
            start: 0,
            end: 10,
          },
          sample: {
            columns: [],
            values: [],
          },
        },
      },
      preprocessor: "#preprocessorcode",
    },
  },
  {
    name: "Image Dataset From Directory",
    meta: {
      type: "imagedatasetfromdirectory",
      config: {
        path: undefined,
        view: {
          folders: ["None"],
          sample: {
            images: [],
          },
          info: {
            n_train: 0,
            n_test: 0,
            n_val: 0,
            n_classes: 0
          },
        },
        params: {
          folders: {
            train: "None",
            test: "None",
            val: "None",
          },
          image :{
            size:"",
            resize: "False",
            show_progress: "True"
          }
        },
      },
      preprocessor: "#preprocessorcode",
    },
  },
];

const DatasetCard = (
  props = {
    store: metaAppData,
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
    store: metaAppData,
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

export default Selector;
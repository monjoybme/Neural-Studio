import React from "react";
import { PORT, post } from "../Utils";

import { Graph, Legend } from "../Components/PlotUtils";
import {
  plotConfig as _plotConfig,
  colors,
  Grid,
  XAxis,
  YAxis,
} from "../Components/PlotUtils/base";
import { BarChart } from "../Components/PlotUtils/barchart";

const BarPlotContainer = (props = { data: { values: [], labels: [] } }) => {
  let plotRef = React.useRef(null);
  let [plotConfig, plotConfigState] = React.useState({ ..._plotConfig });

  function updatePlotConfig() {
    if (plotRef.current) {
      plotConfig.height = plotRef.current.scrollHeight;
      plotConfig.width = plotRef.current.scrollWidth;
      plotConfig.grid_size.x = 10;
      plotConfig.grid_size.y = 10;
      plotConfig.pad = Math.floor(plotConfig.height * 0.1);
      plotConfig.plot.height = plotConfig.height - plotConfig.pad * 2;
      plotConfig.plot.width = plotConfig.width - plotConfig.pad * 2;

      plotConfigState({ ...plotConfig });
    }
  }

  React.useEffect(() => {
    updatePlotConfig();
  }, []);

  return (
    <div className="plot-container" style={{ height: "480px", width: "100%" }}>
      <Graph plotConfig={plotConfig} plotRef={plotRef}>
        <Grid />
        <XAxis />
        <YAxis />
        <BarChart data={props.data} />
      </Graph>
      <div className="legend">
        {props.data.labels.map((name, i) => {
          return <Legend label={name} color={colors[i]} key={i} />;
        })}
      </div>
    </div>
  );
};

export const Classification = (props) => {
  let [data, dataState] = React.useState({
    imageSrc: undefined,
  });
  let [result, resultState] = React.useState({
    data: {
      values: [],
      labels: [],
    },
  });

  async function runInference() {
    await post({
      path: "/model/infer",
      data: {
        image: data.imageSrc,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        result.data.values = response.data.probabilities;
        result.data.labels = response.data.labels;
        resultState({ ...result });
      });
  }

  function readImage(e) {
    let reader = new FileReader();
    reader.onload = function (e) {
      data.imageSrc = e.target.result;
      dataState({ ...data });
      runInference();
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  React.useEffect(() => {
    console.log("[classification]");
  }, []);

  return (
    <div className="image classification">
      <div className="image-container">
        <div className="upload">
          <input id="image-upload" type="file" onChange={readImage} />
          <label htmlFor="image-upload">Click to upload image</label>
        </div>
        <div className="display">
          <div className="image">
            <img src={data.imageSrc} alt={""} />
          </div>
        </div>
        <div className="curl">
          <code>
            <span>
              <span>$ &nbsp;</span>
              curl -X POST \
            </span>
            <span>&nbsp;&nbsp; -F "image=@/Users/test.jpg" \</span>
            <span>&nbsp;&nbsp; http://localhost:{PORT}/api/infer</span>
          </code>
        </div>
      </div>
      <div className="result-container">
        <div className="title">Predictions</div>
        <div className="prediction">
          <BarPlotContainer data={result.data} />
        </div>
      </div>
    </div>
  );
};

export const Segmentation = (props) => {
  let [data, dataState] = React.useState({
    imageSrc: undefined,
  });
  let [result, resultState] = React.useState({
    data: {
      image: undefined,
      mask: undefined
    },
  });

  async function runInference() {
    await post({
      path: "/model/infer",
      data: {
        image: data.imageSrc,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        result.data.image = response.data.image;
        result.data.mask = response.data.mask;
        resultState({ ...result });
      });
  }

  function readImage(e) {
    let reader = new FileReader();
    reader.onload = function (e) {
      data.imageSrc = e.target.result;
      dataState({ ...data });
      runInference();
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  React.useEffect(() => {
    console.log("[segmentation]");
  }, []);

  return (
    <div className="image classification segmentation">
      <div className="image-container">
        <div className="upload">
          <input id="image-upload" type="file" onChange={readImage} />
          <label htmlFor="image-upload">Click to upload image</label>
        </div>
        <div className="display">
          <div className="image">
            <img src={data.imageSrc} alt={""} />
          </div>
        </div>
        <div className="curl">
          <code>
            <span>
              <span>$ &nbsp;</span>
              curl -X POST \
            </span>
            <span>&nbsp;&nbsp; -F "image=@/Users/test.jpg" \</span>
            <span>&nbsp;&nbsp; http://localhost:{PORT}/api/infer</span>
          </code>
        </div>
      </div>
      <div className="result-container">
        <div className="title">Predictions</div>
        <div className="result">
            <img src={result.data.image} />
            <img src={result.data.mask} />
        </div>
      </div>
    </div>
  );
};

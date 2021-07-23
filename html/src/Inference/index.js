import React from "react";
import { PORT, post } from "../Utils";
import { icons } from "../data/icons";

import { metaAppFunctions, metaHome, metaAppData } from "../Meta/index";

const getColor = (index) => {
  let letters = "0123456789ABCDEF";
  if (!(index % 7)) {
    return (
      "#" +
      letters[Math.floor(Math.random() * 14)] +
      letters[(index + 8) % 16] +
      letters[Math.floor(Math.random() * 8)] +
      letters[Math.floor(Math.random() * 12)] +
      letters[(index + 8) % 16] +
      letters[(index + 8) % 16]
    );
  } else if (!(index % 5)) {
    return (
      "#" +
      letters[(index + 8) % 16] +
      letters[(index + 8) % 16] +
      letters[Math.floor(Math.random() * 16)] +
      letters[Math.floor(Math.random() * 14)] +
      letters[Math.floor(Math.random() * 12)] +
      letters[(index + 8) % 16]
    );
  } else if (!(index % 3)) {
    return (
      "#" +
      letters[Math.floor(Math.random() * 12)] +
      letters[Math.floor(Math.random() * 16)] +
      letters[(index + 8) % 16] +
      letters[Math.floor(Math.random() * 14)] +
      letters[(index + 8) % 16] +
      letters[(index + 8) % 16]
    );
  } else if (!(index % 2)) {
    return (
      "#" +
      letters[Math.floor(Math.random() * 16)] +
      letters[(index + 8) % 16] +
      letters[Math.floor(Math.random() * 16)] +
      letters[(index + 8) % 16] +
      letters[Math.floor(Math.random() * 16)] +
      letters[(index + 8) % 16]
    );
  }
  return (
    "#" +
    letters[(index + 8) % 16] +
    letters[(index + 8) % 16] +
    letters[(index + 8) % 16] +
    letters[Math.floor(Math.random() * 6)] +
    letters[Math.floor(Math.random() * 14)] +
    letters[Math.floor(Math.random() * 6)] 
  );
};

const YAxis = (props = { length: 0, graph_config: {} }) => {
  return (
    <g>
      <line
        x1={props.graph_config.pad}
        y1={props.graph_config.pad}
        x2={props.graph_config.pad}
        y2={props.graph_config.plot.height}
        strokeWidth="2"
        className="plot_axis"
      />
    </g>
  );
};

const XAxis = (props = { length: 0, graph_config: {} }) => {
  let xMultiplier = props.graph_config.plot.width / props.length;
  let showMod = Math.floor(props.length / 5);
  return (
    <g>
      <line
        x1={props.graph_config.pad}
        y1={props.graph_config.height - props.graph_config.pad}
        x2={props.graph_config.width - props.graph_config.pad}
        y2={props.graph_config.height - props.graph_config.pad}
        strokeWidth="2"
        className="plot_axis"
      />
    </g>
  );
};

const Grid = (
  props = {
    graph_config: {
      height: 400,
      width: 640,
      pad: 50,
      grid_size: {
        x: 8,
        y: 5,
      },
      plot: {
        height: 300,
        width: 560,
        pad: 25,
      },
      legend_index: ["train", "test"],
    },
  }
) => {
  return (
    <g className="plot_grid">
      <rect
        x={0}
        y={0}
        height={props.graph_config.height}
        width={props.graph_config.width}
        className="background"
      />
      {Array(props.graph_config.grid_size.x)
        .fill(0)
        .map((_, i) => {
          return (
            <line
              x1={
                i * (props.graph_config.width / props.graph_config.grid_size.x)
              }
              y1={0}
              x2={
                i * (props.graph_config.width / props.graph_config.grid_size.x)
              }
              y2={props.graph_config.height}
              key={i}
              strokeWidth="2"
              className="grid_line"
            />
          );
        })}
      {Array(props.graph_config.grid_size.y)
        .fill(0)
        .map((_, i) => {
          return (
            <line
              x1={0}
              y1={
                i * (props.graph_config.height / props.graph_config.grid_size.y)
              }
              x2={props.graph_config.width}
              y2={
                i * (props.graph_config.height / props.graph_config.grid_size.y)
              }
              key={i}
              strokeWidth="2"
              className="grid_line"
            />
          );
        })}
    </g>
  );
};

const BarChart = (
  props = {
    graph_config: {
      height: 0,
      width: 0,
      pad: 0,
      grid_size: {
        x: 0,
        y: 0,
      },
      plot: {
        height: 0,
        width: 0,
        pad: 0,
      },
      data: {
        values: [],
        colors: [],
        labels: [],
      },
    },
  }
) => {
  let x, y, height, width, xMultiplier, maxVal;
  xMultiplier =
    props.graph_config.plot.width / props.graph_config.data.values.length;
  maxVal = Math.max(...props.graph_config.data.values);

  function showInfo(e, color) {
    let { target } = e;
    target.style.stroke = color;
    target.style.strokeWidth = "3";
  }

  function hideInfo(e, color) {
    let { target } = e;
    target.style.stroke = "none";
    target.style.strokeWidth = "0";
  }

  return (
    <g className="bar">
      {props.graph_config.data.values.map((value, i) => {
        height =
          (value / maxVal) *
          (props.graph_config.plot.height - props.graph_config.pad);

        x =
          props.graph_config.plot.pad +
          xMultiplier * i +
          props.graph_config.plot.gap;
        y = props.graph_config.plot.height - height;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              height={height}
              width={props.graph_config.plot.gap}
              fill={props.graph_config.data.colors[i]}
              onMouseOver={(e) =>
                showInfo(e, props.graph_config.data.colors[i])
              }
              onMouseLeave={(e) =>
                hideInfo(e, props.graph_config.data.colors[i])
              }
            />
          </g>
        );
      })}
    </g>
  );
};

const Graph = (props = { ref: undefined }) => {
  return <svg ref={props.ref}>{props.children}</svg>;
};

let inferenceApps = {
  image: {
    Classification: (props) => {
      let [data, dataState] = React.useState({
        imageSrc: undefined,
      });
      let [graphConfig, graphConfigState] = React.useState({
        height: 0,
        width: 0,
        pad: 50,
        grid_size: {
          x: 10,
          y: 5,
        },
        plot: {
          height: 0,
          width: 0,
          pad: 25,
          gap: 25,
        },
        data: {
          values: [],
          colors: [],
          labels: [],
        },
      });
      let graphRef = React.useRef(null);

      async function runInference() {
        await post({
          path: "/model/infer",
          data: {
            image: data.imageSrc,
          },
        })
          .then((response) => response.json())
          .then((response) => {
            graphConfig.data.values = response.data.probabilities;
            graphConfig.data.labels = response.data.labels;
            graphConfig.data.colors = Array(response.data.probabilities.length)
              .fill(0)
              .map((_, i) => {
                return getColor(i);
              });
            graphConfigState({ ...graphConfig });
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
        graphConfig.height = graphRef.current.scrollHeight;
        graphConfig.width = graphRef.current.scrollWidth;

        graphConfig.plot.height =
          graphRef.current.scrollHeight - graphConfig.plot.pad * 2;
        graphConfig.plot.width =
          graphRef.current.scrollWidth - graphConfig.plot.pad * 2;

        graphConfigState({ ...graphConfig });
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
                <img src={data.imageSrc} />
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
              <div className="graph">
                <svg ref={graphRef}>
                  <Grid graph_config={graphConfig} />
                  <XAxis graph_config={graphConfig} />
                  <YAxis graph_config={graphConfig} />
                  <BarChart graph_config={graphConfig} />
                </svg>
                <div className="legends">
                  <div className="labels">
                    {graphConfig.data.labels.map((label, i) => {
                      return (
                        <div className="label" key={i}>
                          <div
                            className="color"
                            style={{ background: graphConfig.data.colors[i] }}
                          ></div>
                          <div className="name">{label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
};

const Inference = (
  props = {
    appData: metaAppData,
    appFunctions: metaAppFunctions,
  }
) => {
  let Inteference =
    inferenceApps[props.appData.app.config.datatype][
      props.appData.app.config.problemtype
    ];
  React.useEffect(() => {
    console.log("[inference]");
  }, []);
  return (
    <div className="inference container">
      <Inteference />
    </div>
  );
};

export default Inference;

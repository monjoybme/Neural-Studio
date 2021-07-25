import React from "react";
import { Graph } from "../Components/PlotUtils";
import {
  Grid,
  XAxis,
  YAxis,
  plotConfig as _plotConfig,
  colors,
} from "../Components/PlotUtils/base";
import { LineChart } from "../Components/PlotUtils/linechart";

const ToolTip = (
  props = { data: { epoch: 0, value: 0 }, cords: { x: 0, y: 0 } }
) => {
  return (
    <div
      className="tooltipcontainer"
      style={{
        top: props.cords.y,
        left: props.cords.x,
        transform:
          window.innerWidth - 200 < props.cords.x ? "translate(-100%, 0%)" : "",
        minWidth: "140px",
      }}
    >
      <div> Epoch : {props.data.epoch + 1} </div>
      <div> Value : {props.data.value.toString().slice(0, 6)} </div>
    </div>
  );
};

function format_data(data) {
  data = data
    .filter((log, i) => {
      return log.type === "epoch";
    })
    .map((log) => {
      return log.data;
    });
  let train = data.length > 0 ? data[0].train : { batches: 0, epochs: 0 };
  let loss_dat = {};
  try {
    data.forEach((epoch) => {
      Object.keys(epoch.log.output).forEach((key) => {
        if (!loss_dat[key.replace(/val_/, "")]) {
          loss_dat[key] = {
            train: [],
            val: [],
          };
        }
        if (key.startsWith("val_")) {
          loss_dat[key.replace(/val_/, "")].val.push(epoch.log.output[key]);
        } else {
          loss_dat[key.replace(/val_/, "")].train.push(epoch.log.output[key]);
        }
      });
    });
  } catch (err) {}

  return Object.entries(loss_dat).map(([key, value], i) => {
    return {
      title: key,
      data: Object.entries(value).map(([key2, value2], i) => {
        return {
          name: key2,
          values: value2,
          length: train.epochs,
        };
      }),
    };
  });
}

const Legend = (props = { data: {}, plotConfig: _plotConfig }) => {
  return props.data.map((data, i) => {
    return (
      <g key={i} className="legend">
        <rect
          x={props.plotConfig.plot.width + 15}
          y={props.plotConfig.pad - 30 + i * 25}
          height={15}
          width={15}
          fill={colors[i]}
        />
        <text
          x={props.plotConfig.plot.width + 35}
          y={props.plotConfig.pad - 18 + i * 25}
          fill={"#333"}
        >
          {data.name}
        </text>
      </g>
    );
  });
};

const Title = (props = { title: "title", plotConfig: _plotConfig }) => {
  return (
    <text x={props.plotConfig.pad} y={25} className="title"> 
      {props.title} 
    </text>
  )
}

const LinePlot = (
  props = { chartData: [], showTooltip: {}, hideTooltip: {} }
) => {
  let plotRef = React.useRef(null);
  let [plotConfig, plotConfigState] = React.useState({ ..._plotConfig });
  let { chartData } = props;

  React.useEffect(() => {
    if (plotRef.current) {
      plotConfig.height = plotRef.current.scrollHeight;
      plotConfig.width = plotRef.current.scrollWidth;
      plotConfig.grid_size.x = 10;
      plotConfig.grid_size.y = 10;
      plotConfig.pad = Math.floor(plotConfig.height * 0.1);
      plotConfig.plot.height = plotConfig.height - plotConfig.pad * 2;
      plotConfig.plot.width = plotConfig.width - plotConfig.pad * 2;
      plotConfig.grid_size.x = 8;
      plotConfig.grid_size.y = 7;
      plotConfigState({ ...plotConfig });
    }
  }, []);

  return (
    <div className="plot-container" style={{ height: "400px", width: "100%" }}>
      <Graph plotConfig={plotConfig} plotRef={plotRef} title={props.title}>
        <Grid />
        <XAxis />
        <YAxis />
        <LineChart data={chartData} />
        <Legend data={chartData} />
        <Title title={props.title}/>
      </Graph>
    </div>
  );
};

export const Monitor = (props = { data: [] }) => {
  let data = format_data(props.data);
  let [toolTip, toolTipState] = React.useState({
    data: false,
    cords: {
      x: 0,
      y: 0,
    },
  });

  React.useEffect(() => {
    // console.log(data);
  });

  function showTooltip(e, data) {
    let { target } = e;
    target.r.baseVal.value = 5;

    toolTipState({
      data: data,
      cords: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  }

  function showTooltip(e, data) {
    e.target.r.baseVal.value = 5;

    toolTipState({
      data: data,
      cords: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  }

  function hideTooltip(e, data) {
    e.target.r.baseVal.value = 3;
    toolTipState({
      data: false,
      cords: {
        x: 0,
        y: 0,
      },
    });
  }

  return (
    <div className="monitors">
      {data.map((item, i) => {
        return (
          <LinePlot
            title={item.title}
            chartData={item.data}
            key={i}
            showTooltip={showTooltip}
            hideTooltip={hideTooltip}
          />
        );
      })}
      {toolTip.data ? (
        <ToolTip data={toolTip.data} cords={toolTip.cords} />
      ) : undefined}
    </div>
  );
};

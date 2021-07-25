import React from "react";
import { plotConfig as _plotConfig, colors, Grid, XAxis, YAxis } from "./base";
import { BarChart } from "./barchart";
import { LineChart } from "./linechart";

import "../../style/_plotting.scss";

export const Graph = (props = { plotConfig: _plotConfig }) => {
  return (
    <svg
      className="plot"
      viewBox={`${0} ${0} ${props.plotConfig.width} ${props.plotConfig.height}`}
      ref={props.plotRef}
    >
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { ...props });
        }
        return child;
      })}
    </svg>
  );
};


export const Legend = (props={ label: "label", color: '#333' }) => {
    return (
        <div className="item">
              <div className="color" style={{ backgroundColor: props.color }} />
              <div className="label">{props.label}</div>
            </div>
    )
}

export const PlotContainer = (props) => {
  let plotRef = React.useRef(null);
  let [plotConfig, plotConfigState] = React.useState({ ..._plotConfig });
  const _n = 10;
  let [dataBar, dataBarState] = React.useState({
    labels: Array(_n)
      .fill(0)
      .map((_, i) => `Label ${i}`),
    values: Array(_n)
      .fill(0)
      .map((_, i) => Math.random() * 100),
  });
  let [dataLine, dataLineState] = React.useState([
    {
      name: "train",
      values: Array(_n)
        .fill(0)
        .map((_, i) => Math.random() * 100),
      length: _n,
    },
    {
      name: "test",
      values: Array(_n)
        .fill(0)
        .map((_, i) => Math.random() * 100),
      length: _n,
    },
  ]);

  React.useEffect(() => {
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
  }, []);

  return (
    <div className="plot-container" style={{ height: "480px", width: "100%" }}>
      <Graph plotConfig={plotConfig} plotRef={plotRef}>
        <Grid />
        <XAxis />
        <YAxis />
        <LineChart data={dataLine} />
      </Graph>
      <div className="legend">
        {dataLine.map((line, i) => {
          return <Legend label={line.name} color={colors[i]} key={i} />;
        })}
      </div>
    </div>
  );
};

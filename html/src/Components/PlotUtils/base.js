import React from "react";

export const colors = [
  "#f44336",
  "#673ab7",
  "#03a9f4",
  "#4caf50",
  "#ffeb3b",
  "#ff5722",
  "#607d8b",
  "#e91e63",
  "#3f51b5",
  "#00bcd4",
  "#8bc34a",
  "#ffc107",
  "#795548",
  "#9c27b0",
  "#2196f3",
  "#009688",
  "#cddc39",
  "#ff9800",
  "#9e9e9e",
  "#ef9a9a",
  "#b39ddb",
  "#81d4fa",
  "#a5d6a7",
  "#fff59d",
  "#ffab91",
  "#b0bec5",
  "#f06292",
  "#7986cb",
  "#4dd0e1",
  "#aed581",
  "#ffc107",
]

export const plotConfig =  {
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
}

export const YAxis = (props = { plotConfig: plotConfig  }) => {
  return (
    <g>
      <line
        x1={props.plotConfig.pad}
        y1={props.plotConfig.pad}
        x2={props.plotConfig.pad}
        y2={props.plotConfig.height - props.plotConfig.pad}
        className="axis"
      />
    </g>
  );
};

export const XAxis = (props = { plotConfig: plotConfig  }) => {
  return (
      <line
        x1={props.plotConfig.pad}
        y1={props.plotConfig.height - props.plotConfig.pad}
        x2={props.plotConfig.width - props.plotConfig.pad}
        y2={props.plotConfig.height - props.plotConfig.pad}
        className="axis"
      />
  );
};

export const Grid = (props = { plotConfig: plotConfig }) => {
  return (
    <g className="grid">
      <rect
        x={0}
        y={0}
        height={props.plotConfig.height}
        width={props.plotConfig.width}
        className="background"
      />
      {Array(props.plotConfig.grid_size.x)
        .fill(0)
        .map((_, i) => {
          return (
            <line
              x1={i * (props.plotConfig.width / props.plotConfig.grid_size.x)}
              y1={0}
              x2={i * (props.plotConfig.width / props.plotConfig.grid_size.x)}
              y2={props.plotConfig.height}
              key={i}
              className="line"
            />
          );
        })}
      {Array(props.plotConfig.grid_size.y)
        .fill(0)
        .map((_, i) => {
          return (
            <line
              x1={0}
              y1={i * (props.plotConfig.height / props.plotConfig.grid_size.y)}
              x2={props.plotConfig.width}
              y2={i * (props.plotConfig.height / props.plotConfig.grid_size.y)}
              key={i}
              className="line"
            />
          );
        })}
    </g>
  );
};

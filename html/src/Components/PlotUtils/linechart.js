import React from "react";
import { plotConfig as _plotConfig, colors } from "./base";

export const Line = (
  props = {
    plotConfig: _plotConfig,
    data: { name: "name", values: [], length: 0 },
    color: "#fff",
    title: "title",
  }
) => {
  let x1, y1, x2, y2, dx, dy;
  let xMultiplier, maxVal;
  let { data } = props;

  maxVal =
    props.title.lastIndexOf("accuracy") > -1 ? 1 : Math.max(...data.values);
  xMultiplier = props.plotConfig.plot.width / data.length;

  dx = props.plotConfig.pad;
  dy =
    props.plotConfig.pad +
    (props.plotConfig.plot.height -
      (data.values[0] * props.plotConfig.plot.height) / maxVal);

  return (
    <g className="line">
      {data.values.slice(1, data.values.length).map((d, i) => {
        x1 = dx;
        y1 = dy;
        x2 = props.plotConfig.pad + (i + 1) * xMultiplier;
        y2 =
          props.plotConfig.pad +
          (props.plotConfig.plot.height -
            (d * props.plotConfig.plot.height) / maxVal);
        dx = x2;
        dy = y2;
        return (
          <g key={i}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={props.color}
              className="point"
            />
          </g>
        );
      })}

      <circle
        cx={props.plotConfig.pad}
        cy={
          props.plotConfig.pad +
          (props.plotConfig.plot.height -
            (data.values[0] * props.plotConfig.plot.height) / maxVal)
        }
        r={3}
        className="hover"
      />

      {data.values.slice(1, data.values.length).map((d, i) => {
        x1 = dx;
        y1 = dy;
        x2 = props.plotConfig.pad + (i + 1) * xMultiplier;
        y2 =
          props.plotConfig.pad +
          (props.plotConfig.plot.height -
            (d * props.plotConfig.plot.height) / maxVal);
        dx = x2;
        dy = y2;
        
        try{
          return (
          <g key={i}>
            <circle cx={x1} cy={y1} r={3} className="hover" />
          </g>
        );
        }catch{
          return undefined;
        }

      })}
    </g>
  );
};

export const LineChart = (
  props = { plotConfig: _plotConfig, data: [], title: "title" }
) => {
  return (
    <g className="linechart">
      {props.data.map((d, i) => {
        return (
          <Line
            plotConfig={props.plotConfig}
            key={i}
            data={d}
            color={colors[i]}
            title={props.title}
          />
        );
      })}
    </g>
  );
};

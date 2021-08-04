import React from 'react';
import { plotConfig as _plotConfig, colors } from './base';

export const BarChart = (
  props = { plotConfig: _plotConfig, data: { values: [], labels: [] } }
) => {
  let x, y, height, width, xMultiplier, maxVal;
  maxVal = Math.max(...props.data.values);
  xMultiplier = Math.floor(
    props.plotConfig.plot.width / props.data.labels.length
  );

  return (
    <g className="barchart">
      {props.data.values.map((val, i) => {
        x = i * xMultiplier + props.plotConfig.pad + 1;
        y =
          props.plotConfig.plot.height -
          (val * props.plotConfig.plot.height) / maxVal +
          props.plotConfig.pad;
        height = (val * props.plotConfig.plot.height) / maxVal;
        width = props.plotConfig.plot.width / props.data.labels.length;

        return (
          <rect
            key={i}
            x={x}
            y={y}
            height={height}
            width={width}
            fill={colors[i]}
          />
        );
      })}
    </g>
  );
};

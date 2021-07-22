import React from "react";

const colors = [
  "#f44336",
  "#673ab7",
  "#4caf50",
  "#607d8b",
  "#e91e63",
  "#3f51b5",
  "#8bc34a",
];

/**
 *
 * @param {Array} data
 * @returns
 */

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
  let graph_colors = {
    train: colors[0],
    val: colors[1],
  };
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

  return {
    data: data,
    train: train,
    loss_dat: loss_dat,
    graph_colors: graph_colors,
  };
}

let graph_config = {
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
  legend_index: [
    "train",
    "test"
  ]
};

const YAxis = (props={
  trainData: {
    epochs: 0,
    batches: 0
  }
}) => {
  return (
    <g>
      <line
        x1={graph_config.pad}
        y1={graph_config.pad}
        x2={graph_config.pad}
        y2={graph_config.pad + graph_config.plot.height + graph_config.plot.pad}
        strokeWidth="2"
        className="plot_axis"
      />
    </g>
  );
};

const XAxis = (props={trainData: {
    epochs: 0,
    batches: 0
  }}) => {
    let xMultiplier = (graph_config.plot.width / props.trainData.epochs);
    let showMod = Math.floor(props.trainData.epochs / 5);
  return (
    <g>
      <line
        x1={graph_config.pad - graph_config.plot.pad}
        y1={graph_config.height - graph_config.pad}
        x2={graph_config.width - graph_config.pad}
        y2={graph_config.height - graph_config.pad}
        strokeWidth="2"
        className="plot_axis"
      />
      {
        Array(props.trainData.epochs).fill(0).map((_, i) => {
          if ((i+1) % showMod) {
            return undefined
          }else{
            return (
              <text
                x={graph_config.pad + i * xMultiplier}
                y={graph_config.plot.height + graph_config.pad + 15}
                className="axis_tick"
                key={i}
              >
                {i + 1}
              </text>
            );
          }
        })
      }
    </g>
  );
};

const Grid = (props) => {
  return (
    <g className="plot_grid">
      <rect
        x={0}
        y={0}
        height={graph_config.height}
        width={graph_config.width}
        className="background"
      />
      {Array(graph_config.grid_size.x)
        .fill(0)
        .map((_, i) => {
          return (
            <line
              x1={i * (graph_config.width / graph_config.grid_size.x)}
              y1={0}
              x2={i * (graph_config.width / graph_config.grid_size.x)}
              y2={graph_config.height}
              key={i}
              strokeWidth="2"
              className="grid_line"
            />
          );
        })}
      {Array(graph_config.grid_size.y)
        .fill(0)
        .map((_, i) => {
          return (
            <line
              x1={0}
              y1={i * (graph_config.height / graph_config.grid_size.y)}
              x2={graph_config.width}
              y2={i * (graph_config.height / graph_config.grid_size.y)}
              key={i}
              strokeWidth="2"
              className="grid_line"
            />
          );
        })}
    </g>
  );
};

const LinePlot = (
  props = {
    name: "loss",
    data: [],
    color: "#fff",
    showTooltip: function () {},
    hideTooltip: function () {},
    index: 0,
    trainData: {
      epochs: 0,
      batches: 0
    }
  }
) => {
  let { data, name } = props;
  let dx, dy, x2, y2, comp, maxVal, xMultiplier;

  maxVal =
    name.toLocaleLowerCase().lastIndexOf("accuracy") > -1
      ? 1
      : Math.max(...data);
  xMultiplier = graph_config.plot.width / props.trainData.epochs;
  dx = graph_config.pad;

  dy =
    graph_config.pad +
    (1 - data.slice(0, 1) / maxVal) * graph_config.plot.height;
  data = data.slice(1, data.length);

  return (
    <g>
      <text
        className="text"
        x={graph_config.plot.pad}
        y={graph_config.plot.pad}
      >
        {props.name}
      </text>
      <g className="legend">
        <rect
          x={graph_config.plot.width - 15}
          y={graph_config.plot.pad - 10 + props.index * 15}
          height={10}
          width={10}
          fill={props.color}
        />
        <text
          x={graph_config.plot.width}
          y={graph_config.plot.pad + props.index * 15}
        >
          {graph_config.legend_index[props.index]}
        </text>
      </g>
      {props.data.map((d, i) => {
        x2 = i * xMultiplier + graph_config.pad;
        y2 = graph_config.pad + (1 - d / maxVal) * graph_config.plot.height;
        comp = (
          <line
            x1={dx}
            y1={dy}
            x2={x2}
            y2={y2}
            className="graph_line"
            stroke={props.color}
            key={i}
          />
        );
        dx = x2;
        dy = y2;
        return comp;
      })}
      {props.data.map((d, i) => {
        dx = i * xMultiplier + graph_config.pad;
        dy = graph_config.pad + (1 - d / maxVal) * graph_config.plot.height;
        return (
          <circle
            cx={dx}
            cy={dy}
            r={3}
            key={i}
            onMouseEnter={(e) => props.showTooltip(e, { epoch: i, value: d })}
            onMouseLeave={(e) => props.hideTooltip(e, { epoch: i, value: d })}
            className="graph_marker"
          />
        );
      })}
    </g>
  );
};

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

export const Monitor = (props = { data: [] }) => {
  let { data, train, loss_dat, graph_colors } = format_data(props.data);
  let [toolTip, toolTipState] = React.useState({
    data: false,
    cords: {
      x: 0,
      y: 0,
    },
  });

  React.useEffect(() => {});

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
      {Object.entries(loss_dat).map(([key, value], i) => {
        return (
          <div className="monitor" key={i}>
            <svg viewBox="0 0 640 400">
              <Grid />
              <XAxis trainData={train} />
              <YAxis trainData={train} />
              <LinePlot
                name={key}
                data={value.train}
                color={graph_colors.train}
                trainData={train}
                showTooltip={showTooltip}
                hideTooltip={hideTooltip}
                index={0}
              />
              <LinePlot
                name={key}
                data={value.val}
                color={graph_colors.val}
                trainData={train}
                showTooltip={showTooltip}
                hideTooltip={hideTooltip}
                index={1}
              />
            </svg>
          </div>
        );
      })}
      {toolTip.data ? (
        <ToolTip data={toolTip.data} cords={toolTip.cords} />
      ) : undefined}
    </div>
  );
};

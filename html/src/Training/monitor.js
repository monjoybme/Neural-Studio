import React from "react";

const colors = [
  "#E53935",
  "#5E35B1",
  "#4CAF50",
  "#FF5722",
  "#757575",
  "#F48FB1",
  "#9FA8DA",
  "#80DEEA",
  "#004D40",
  "#4CAF50",
];

const EpochVsMetricMany = (
  props = {
    name: "Metric",
    data: [
      {
        data: {
          epoch: 0,
          log: {
            batch: 1,
            output: {
              loss: 0,
            },
          },
        },
      },
    ],
  }
) => {
  let data = props.data
    .map((epoch, i) => {
      try {
        return epoch.data.log.output[props.name];
      } catch (TypeError) {
        return 0;
      }
    })
    .filter((val) => {
      return val !== undefined;
    });

  let height = 360,
    width = 420,
    pad = 15;
  let epochs = 5,
    xaxisGap = (width - 10) / data.length,
    mod = Math.floor(data.length / epochs);
  let maxVal = props.name.lastIndexOf("accuracy") > -1 ? 1 : Math.max(...data);
  let x0,
    y0,
    x1,
    y1,
    drawHeight = height - pad;
  let prev = { x: false, y: false };
  let render = data.map((value, i) => {
    x0 = pad + i * xaxisGap;
    y0 = Math.floor(drawHeight * (1 - value / maxVal)) + pad;
    x1 = prev.x ? prev.x : x0;
    y1 = prev.y ? prev.y : y0;
    prev = {
      x: x0,
      y: y0,
    };
    return {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      epoch: i,
      value: value,
    };
  });

  let [toolTip, toolTipState] = React.useState({
    data: false,
    cords: {
      x: 0,
      y: 0,
    },
  });

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
            window.innerWidth - 200 < props.cords.x
              ? "translate(-100%, 0%)"
              : "",
          minWidth: "140px",
        }}
      >
        <div> Epoch : {props.data.epoch} </div>
        <div> Value : {props.data.value.toString().slice(0, 6)} </div>
      </div>
    );
  };

  function loadToolTip(e, data = { epoch: 0, value: 0 }) {
    toolTipState({
      data: data,
      cords: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  }

  return (
    <div className="lossvsmetric">
      <div className="name">{props.name}</div>
      <div className="graph">
        <svg>
          <g>
            <line x1={pad} y1={0} x2={pad} y2={drawHeight} className="axis" />
            <line
              x1={pad}
              y1={height - pad}
              x2={width}
              y2={height - pad}
              className="axis"
            />
          </g>
          <g>
            {data.map((_, i) => {
              if (i % mod || i === 0) {
                return undefined;
              }
              return (
                <text key={i} x={pad - 3 + i * xaxisGap} y={height - 1}>
                  {i}
                </text>
              );
            })}
          </g>
          {render.map((cords, i) => {
            let { x0, y0, x1, y1 } = cords;
            if (isNaN(y0)) {
              return undefined;
            } else {
              return (
                <line
                  x1={x0}
                  y1={y0}
                  x2={x1}
                  y2={y1}
                  className="line"
                  stroke={props.color}
                  key={i}
                />
              );
            }
          })}
          {render.map((cords, i) => {
            let { x0, y0, epoch, value } = cords;
            if (isNaN(y0)) {
              return undefined;
            } else {
              return (
                <circle
                  key={i}
                  r={2.5}
                  fill="white"
                  cy={y0}
                  cx={x0}
                  onMouseOver={(e) => {
                    e.target.r.baseVal.value = 5;
                    loadToolTip(e, { epoch: epoch, value: value });
                  }}
                  onMouseOut={(e) => {
                    loadToolTip(e, false);
                    e.target.r.baseVal.value = 2.5;
                  }}
                />
              );
            }
          })}
        </svg>
        {toolTip.data ? (
          <ToolTip data={toolTip.data} cords={toolTip.cords} />
        ) : undefined}
      </div>
    </div>
  );
};

const MonitorMany = (
  props = {
    data: [
      {
        type: "epoch",
        data: {
          epoch: 0,
          log: {
            batch: 1,
            output: {
              loss: 0,
              categorical_accuracy: 0,
              val_loss: 0,
              val_categorical_accuracy: 0,
            },
          },
          train: {
            epochs: 10,
            batches: 10,
          },
        },
      },
    ],
  }
) => {
  let data = props.data.filter((log, i) => {
    return log.type === "epoch";
  });

  React.useEffect(() => {});

  return (
    <div className="monitor">
      {data.length
        ? data[0].data.log.output === null
          ? undefined
          : Object.keys(data[0].data.log.output).map((metric, i) => {
              return (
                <EpochVsMetricMany
                  name={metric}
                  data={data}
                  key={i}
                  epochs={data[0].data.train.epochs}
                  color={colors[i]}
                />
              );
            })
        : undefined}
    </div>
  );
};

const MonitorOne = (
  props = {
    data: [
      {
        type: "epoch",
        data: {
          epoch: 0,
          log: {
            batch: 1,
            output: {
              loss: 0,
              categorical_accuracy: 0,
              val_loss: 0,
              val_categorical_accuracy: 0,
            },
          },
          train: {
            epochs: 10,
            batches: 10,
          },
        },
      },
    ],
  }
) => {
  let data = props.data.filter((log, i) => {
    return log.type === "epoch";
  });
  data = data === null ? [] : data;
  let height = 340,
    width = 410,
    pad = 15;
  let xAxisGap = (width - pad) / data.length;
  let epochsToShow = 5,
    showMod = Math.floor(data.length / epochsToShow);
  let x1, y1, x2, y2;
  let prevCords = {};
  let maxVals = {};

  data.forEach((epoch, i) => {
    let output = epoch.data.log.output === null ? {} : epoch.data.log.output;
    Object.entries(output).forEach(([key, val]) => {
      if (maxVals[key] === undefined) {
        maxVals[key] = val;
      } else {
          if ( key.lastIndexOf("accuracy") > -1){
              maxVals[key] = 1;
          }else if (maxVals[key] <= val) {
            maxVals[key] = val;
         }
        }
    });
  });

  let losses = [ ...Object.keys(maxVals) ]

  let render = data.map((epoch, i) => {
    let output = epoch.data.log.output === null ? {} : epoch.data.log.output;
    return Object.entries(output).map(([key, value]) => {
      x1 = pad + i * xAxisGap;
      y1 = Math.floor((1 - (value / maxVals[key])) * height) + 5;
      if (prevCords[key] === undefined) {
        prevCords[key] = {
          x: x1,
          y: y1,
        };
      }
      x2 = prevCords[key].x;
      y2 = prevCords[key].y;
      prevCords[key] = {
        x: x1,
        y: y1,
      };
      return {
        epoch: i,
        value: value,
        name: key,
        color: colors[losses.lastIndexOf(key)] ,
        cords: {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
        },
      };
    });
  });

  let [toolTip, toolTipState] = React.useState({
    data: false,
    cords: {
      x: 0,
      y: 0,
    },
  });

  const ToolTip = (
    props = { data: { epoch: 0, value: 0, name: "Loss" }, cords: { x: 0, y: 0 } }
  ) => {
    return (
      <div
        className="tooltipcontainer"
        style={{
          top: props.cords.y,
          left: props.cords.x,
          transform: (window.innerWidth - 200) < props.cords.x ?  "translate(-100%, 0%)" : '',
          minWidth:"140px"
        }}
      >
        { props.data.name }
        <div> Epoch : {props.data.epoch} </div>
        <div> Value : {props.data.value.toString().slice(0, 6)} </div>
      </div>
    );
  };

  function loadToolTip(e, data = { epoch: 0, value: 0 }) {
    toolTipState({
      data: data,
      cords: {
        x: e.pageX,
        y: e.pageY,
      },
    });
  }

  return (
    <div className="monitor">
      <div className="legends">
        {
            losses.map((loss, i)=>{
                return (
                  <div className="legend" key={i}>
                    <div
                      className="color"
                      style={{ background: colors[losses.lastIndexOf(loss)] }}
                    ></div>
                    <div className="name">{loss}</div>
                  </div>
                );
            })
        }
      </div>
      <div className="lossvsmetric">
        <div className="name">{props.name}</div>
        <div className="graph">
          <svg>
            <g>
              <line x1={pad} y1={0} x2={pad} y2={height} className="axis" />
              <line
                x1={pad}
                y1={height}
                x2={width}
                y2={height}
                className="axis"
              />
            </g>
            <g>
              {data.map((_, i) => {
                if (i % showMod) {
                  return undefined;
                }
                return (
                  <text key={i} x={pad + i * xAxisGap} y={height + 15}>
                    {i}
                  </text>
                );
              })}
            </g>
            {render.map((epoch, i) => {
              return (
                <g key={i}>
                  {epoch.map((loss, j) => {
                    return (
                      <line
                        x1={loss.cords.x1}
                        y1={loss.cords.y1}
                        x2={loss.cords.x2}
                        y2={loss.cords.y2}
                        strokeWidth={2}
                        stroke={loss.color}
                        key={j}
                      />
                    );
                  })}
                </g>
              );
            })}
            {render.map((epoch, i) => {
              return (
                <g key={i}>
                  {epoch.map((loss, j) => {
                    return (
                      <circle
                        key={j}
                        r={2}
                        cy={loss.cords.y1}
                        cx={loss.cords.x1}
                        fill={ "white" }
                        strokeWidth={1}
                        onMouseOver={(e) => {
                          e.target.r.baseVal.value = 5;
                          loadToolTip(e, {
                            epoch: loss.epoch,
                            value: loss.value,
                            name: loss.name,
                          });
                        }}
                        onMouseOut={(e) => {
                          loadToolTip(e, false);
                          e.target.r.baseVal.value = 2.5;
                        }}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>
          {toolTip.data ? (
            <ToolTip data={toolTip.data} cords={toolTip.cords} />
          ) : undefined}
        </div>
      </div>
    </div>
  );
};

export { MonitorOne, MonitorMany };

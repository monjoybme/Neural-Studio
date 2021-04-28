import React from "react";
import { icons } from "../data/icons";
import { appConfig } from "../data/appconfig";

import "./training.css";
import { StoreContext } from "../Store";

const Notification = (props) => {
  return <div className="log notif">{props.data.message}</div>;
};
const Epoch = (props) => {
  return (
    <div className="log epoch">
      <div className="upper">
        <div className="epochname">
          Epoch : {props.data.epoch + 1}/{props.data.train.epochs}
        </div>
        <div className="progress">
          <div className="bar">
            <div
              className="done"
              style={{
                width: `${Math.ceil(
                  (props.data.log.batch / props.data.train.batches) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="lower">
        {props.data.log.output ? (
          <div className="outputs">
            <div className="output">
              {props.data.log.batch} / {props.data.train.batches}
            </div>
            {Object.keys(props.data.log.output).map((output, i) => {
              return (
                <div className="output" key={i}>
                  <div className="name">{output}</div>
                  &nbsp;:&nbsp;
                  <div className="val">
                    {props.data.log.output[output].toString().slice(0, 7)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : undefined}
      </div>
    </div>
  );
};

const Error = (props) => {
  // console.log(props)
  return (
    <div className="log error">
      <div className="message">{props.data.error}</div>
      <pre>
        <code>{props.data.code}</code>
      </pre>
    </div>
  );
};

const Output = (props) => {
  return (
    <div className="log outvis">
      <div>Epoch Output | Type : {props.data.type}</div>
      <img src={props.data.value} alt={'output'} />
    </div>
  );
};

const Histogram = (props = { name: "Histogram", values: [] }) => {
  let values = props.values;
  let height = appConfig.monitor.graph.height;
  let width = appConfig.monitor.graph.width;

  let max =
    props.name.lastIndexOf("accuracy") > -1
      ? 1
      : Math.ceil(Math.max(...values));
  let col_size = Math.round((width - 30) / values.length);
  let pad = 20;

  let prev = false;
  let render = Math.ceil(values.length / 5);
  let cx, cy, _prev;

  return (
    <div className="histogram">
      <div className="name">{props.name}</div>
      <div className="chart">
        <svg height="100%" width="100%">
          <line
            x1={pad}
            y1={pad}
            x2={pad}
            y2={height - pad}
            strokeWidth="1"
            className="axis"
          />
          <line
            x1={pad}
            y1={height - pad}
            x2={width - pad}
            y2={height - pad}
            stroke="gray"
            strokeWidth="1"
            className="axis"
          />
          <text x={pad - 14} y={height - pad}>
            0
          </text>
          <text x={pad - 14} y={pad + 10}>
            {max}
          </text>

          {values.map((val, i) => {
            cx = pad + i * col_size;
            cy = 280 - Math.round((val / max) * 260);
            _prev = prev ? { ...prev } : { x: cx, y: cy };
            prev = {
              x: cx,
              y: cy,
            };
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="1.5" />
                <line
                  x1={_prev.x}
                  y1={_prev.y}
                  x2={cx}
                  y2={cy}
                  strokeWidth="1"
                />
                <text x={cx} y={height - 5}>
                  {" "}
                  {i % render ? undefined : i}{" "}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const Monitor = (
  props = {
    status: {
      data: [
        { type: "epoch", data: { epoch: 0, log: { batch: 0, output: {} } } },
      ],
    },
  }
) => {
  let epochs = props.status.data.filter((log) => {
    return log.type === "epoch";
  });
  let outputs = {};
  try {
    epochs.forEach((epoch, i) => {
      Object.keys(epoch.data.log.output).forEach((output) => {
        if (outputs[output] === undefined) {
          outputs[output] = [];
        }
        outputs[output].push(epoch.data.log.output[output]);
      });
    });

    return (
      <div className="monitor">
        {Object.keys(outputs).map((output, i) => {
          return <Histogram name={output} values={outputs[output]} key={i} />;
        })}
      </div>
    );
  } catch (TypeError) {
    return <div className="monitor"></div>;
  }
};

const Training = (
  props = {
    store:StoreContext
  }
) => {
  let { graphdef, train, trainState } = props.store;
  let [status, statusState] = React.useState({
    data: train.hist !== undefined ? train.hist : [],
    ended: false,
    updating: false,
  });
  let [halt, haltState] = React.useState({
    name: "Pause",
    state: true,
  });

  async function getStatus() {
    await fetch("http://localhost/status", {
      method: "GET",
    })
      .then((respomse) => respomse.json())
      .then((data) => {
        statusState({
          data: data.logs,
          ended: data.logs[data.logs.length - 1].data.ended || false,
          updating: true,
        });
        if (data.logs[data.logs.length - 1].data.ended) {
          console.log("Training Ended");
          trainState({
            training: false,
            hist: data.logs,
          });
        } else {
          if (document.getElementById("check")) {
            setTimeout(getStatus, 10);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function trainModel(e) {
    if ( train.training ){
      window.notify({
        text:"Training Already Running"
      })
    }else{
      await fetch("http://localhost/train/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...graphdef }),
    })
      .then((response) => response.json())
      .then((data) => {
        trainState({
          training: true,
        });
        statusState({
          data: [],
          ended: false,
          updating: false,
        });
        window.notify({
          text:"Training Started !"
        })
      });
    }
  }

  async function haltModel(e) {
    await fetch("http://localhost/train/halt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...halt }),
    })
      .then((response) => response.json())
      .then((data) => {});
    if (halt.state) {
      halt.name = "Resume";
      halt.state = false;
    } else {
      halt.name = "Pause";
      halt.state = true;
    }
    haltState({
      ...halt,
    });
  }

  async function stopModel(e) {
    window.__TRAIN__ = true;
    await fetch("http://localhost/train/stop", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.__TRAIN__ = false;
      });
  }

  React.useEffect(() => {
    var elem = document.getElementById("logs");
    elem.scrollTop = elem.scrollHeight;
    if (train.training) {
      if (status.updating === false) {
        if (status.ended === false && status.ended !== undefined) {
          console.log("Starting Update");
          getStatus();
        }
      }
    }
  });

  let buttons = [
    {
      name: "Start",
      func: trainModel,
      icon: icons.Play,
    },
    {
      name: "Pause",
      func: haltModel,
      icon: halt.state ? icons.Pause : icons.Resume,
    },
    {
      name: "Stop",
      func: stopModel,
      icon: icons.Stop,
    },
    {
      name: "Clean",
      func: function () {
        status.data = [];
        statusState({ ...status });
        trainState({
          training: false,
          hist: undefined,
        });
      },
      icon: icons.Delete,
    },
  ];

  return (
    <div className="training container">
      <div className="menu">
        <div className="buttons">
          {buttons.map((button, i) => {
            let Icon = button.icon;
            return (
              <div className="btn" key={i} onClick={button.func}>
                <Icon />
              </div>
            );
          })}
        </div>
      </div>
      <div className="logs" id="logs">
        {status.data.map((log, i) => {
          switch (log.type) {
            case "notif":
              return <Notification data={log.data} key={i} />;
            case "epoch":
              return <Epoch data={log.data} key={i} />;
            case "error":
              return <Error data={log.data} key={i} />;
            case "output":
              return <Output data={log.data} key={i} />;
            default:
              return <div />;
          }
        })}
      </div>
      <Monitor status={status} />
      <div id="check"> </div>
    </div>
  );
};

export default Training;

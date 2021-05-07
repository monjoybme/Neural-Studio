import React from "react";
import Menu from '../GraphCanvas/menu';
import { icons } from "../data/icons";
import { StoreContext } from "../Store";

function randomColor() {
  let r = 64 + Math.floor(Math.random() * 128);
  let g = 64 + Math.floor(Math.random() * 128);
  let b = 148 + Math.floor(Math.random() * ( 255 - 148));
  return `rgb(${r}, ${g}, ${b})`;
}

const colors = Array(128,).fill(undefined).map(_=>{
  return randomColor();
})

const NotificationLog = (props) => {
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
            <div className="output heading-5">
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
  return (
    <div className="log error">
      <div className="message">{props.data.error}</div>
      <pre>
        <code>{props.data.code}</code>
      </pre>
    </div>
  );
};

const EpochVsMetric = (
  props = {
    name: "Metric",
    data: [
      {
        data: {
          epoch: 0,
          log: {
            batch: 1,
            output: {
              loss:0
            },
          },
        },
      },
    ],
  }
) => {
  let data = props.data.map(( epoch, i )=>{
    try{
      return epoch.data.log.output[props.name]
    }catch(TypeError){
      return 0
    }
  }).filter((val, )=>{
    return val !== undefined
  })

  let height = 360, width = 430, pad=15 ;
  let epochs =  5, xaxisGap = ( width - 10 ) / data.length , mod = Math.floor(data.length / epochs);
  let maxVal = props.name.lastIndexOf("accuracy") > -1 ? 1 : Math.max(...data);
  let x0, y0, x1, y1, drawHeight = height - pad;
  let prev = { x: false , y:false }
  let render = data.map((value, i) => {
      x0 = pad  + i * xaxisGap;
      y0 = Math.floor(drawHeight * (1 - value / maxVal)) + pad;
      x1 = prev.x ? prev.x : x0;
      y1 = prev.y ? prev.y : y0;
      prev = {
        x: x0,
        y: y0,
      };
      return {
        x0:x0,
        y0:y0,
        x1:x1,
        y1:y1,
        epoch:i,
        value:value
      }
    })

  let [ toolTip, toolTipState ] = React.useState({
    data:false,
    cords:{
      x:0,
      y:0
    }
  })

  const ToolTip = (props={ data: { epoch:0, value:0 }, cords:{ x:0, y:0} }, ) =>{
    return (
      <div className="tooltipcontainer" style={{ top:props.cords.y, left:props.cords.x  }}>
        <div> Epoch : {props.data.epoch} </div>
        <div> Value : {props.data.value} </div>
      </div>
    );
  }

  function loadToolTip(e, data={ epoch:0, value: 0 }){
    toolTipState({
      data:{
        ...data
      },
      cords:{
        x: e.pageX,
        y: e.pageY
      }
    })
  }

  return (
    <div className="lossvsmetric" >
      <div className="name">{props.name}</div>
      <div className="graph">
        <svg>
          <g>
            <line x1={pad} y1={0} x2={pad} y2={height} className="axis" />
            <line
              x1={0}
              y1={height - pad - 5}
              x2={width}
              y2={height - pad - 5}
              className="axis"
            />
          </g>
          <g>
            {data.map((_, i) => {
              if (i % mod || i === 0) {
                return undefined;
              }
              return (
                <text key={i} x={pad - 3 + i * xaxisGap} y={height - 7}>
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
                  onMouseOver={(e) => (e.target.r.baseVal.value = 5)}
                  onMouseOut={(e) => (e.target.r.baseVal.value = 2.5)}
                  // onClick={(e) =>
                  //   loadToolTip(e, { epoch: epoch, value: value })
                  // }
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

const Monitor = (props={ data:[ {
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
    }
   } 
  ]}) =>{

  let data = props.data.filter(( log, i )=>{
    return log.type === 'epoch';
  })

  React.useEffect(()=>{

  })

  return (
    <div className="monitor">
      <div className="title">Loss Monitor</div>
      {data.length
        ? data[0].data.log.output === null
          ? undefined
          : Object.keys(data[0].data.log.output).map((metric, i) => {
              return <EpochVsMetric name={metric} data={data} key={i} epochs={ data[0].data.train.epochs } color={ colors[i] } />;
            })
        : undefined}
    </div>
  );
}

const Training = (
  props = {
    store: StoreContext,
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
    if (train.training) {
      window.notify({
        text: "Training Already Running",
      });
    } else {
      trainState({
        training: true,
      });
      statusState({
        data: [],
        ended: false,
        updating: false,
      });
      window.notify({
        text: "Training Started !",
      });
      await fetch("http://localhost/train/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...graphdef }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.status);  
        });
    }
  }

  async function haltModel(e) {
    if (train.training) {
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
        window.notify({
          text: "Training paused !",
        });
      } else {
        halt.name = "Pause";
        halt.state = true;
        window.notify({
          text: "Training resumed !",
        });
      }
      haltState({
        ...halt,
      });
    } else {
      window.notify({
        text: "Can't halt, Training has not started !",
      });
    }
  }

  async function stopModel(e) {
    if (train.training) {
      await fetch("http://localhost/train/stop", {
        method: "POST",
      })
        .then((response) => response.json())
        .then((data) => {
          trainState({
            training: false,
            hist: data.logs,
          });
          window.notify({
            text: "Training has stopped !",
          });
        });
    } else {
      window.notify({
        text: "Can't stop, Training has not started !",
      });
    }
  }


  React.useEffect(() => {
    var elem = document.getElementById("logs");
    elem.scrollTop = elem.scrollHeight;
    if (train.training && status.updating === false && status.ended === false && status.ended !== undefined) {
      getStatus();
    }
  });

  return (
    <div className="container training">
      <div className="tuner">
        <div className="toolbar">
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
        {graphdef.train_config ? (
          <div className="params">
            {graphdef.train_config.train ? (
              <div className="property">
                <Menu
                  {...graphdef.train_config.train}
                  {...props}
                  train={true}
                />
              </div>
            ) : undefined}
            {graphdef.train_config.compile ? (
              <div className="property">
                <Menu
                  {...graphdef.train_config.compile}
                  {...props}
                  train={true}
                />
              </div>
            ) : undefined}
            {graphdef.train_config.optimizer ? (
              <div className="property">
                <Menu
                  {...graphdef.train_config.optimizer}
                  {...props}
                  train={true}
                />
              </div>
            ) : undefined}
          </div>
        ) : undefined}
      </div>
      <div className="logs" id="logs">
        {status.data.map((log, i) => {
          switch (log.type) {
            case "notif":
              return <NotificationLog data={log.data} key={i} />;
            case "epoch":
              return <Epoch data={log.data} key={i} />;
            case "error":
              return <Error data={log.data} key={i} />;
            default:
              return <div />;
          }
        })}
      </div>
      <div className="monitor-container">
        {
          status.data.length ? <Monitor data={status.data}  {...props} /> : undefined 
        }
      </div>
      <div id="check"> </div>
    </div>
  );
};

export default Training;

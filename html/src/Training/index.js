import React from "react";

import Menu from '../GraphCanvas/menu';
import { MonitorMany, MonitorOne } from './monitor';
import { EpochLog, ErrorLog, NotificationLog } from './logs';

import { icons } from "../data/icons";
import { StoreContext } from "../Store";
import { GET } from "../Utils";




const Training = (
  props = {
    store: StoreContext,
  }
) => {

  let { graphdef, graphdefState, train, trainState } = props.store;
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
        graphdef.train_config.session_id = (new Date()).toTimeString();
        graphdefState({...graphdef})
      },
      icon: icons.Delete,
    },
  ];

  async function getStatus() {
    await GET({
      path:"/train/status"
    })
      .then((respomse) => respomse.json())
      .then((data) => {
        statusState({
          data: data.logs,
          ended: data.logs[data.logs.length - 1].data.ended || false,
          updating: true,
        });
        if (data.logs[data.logs.length - 1].data.epochEnd) {
          console.logs("Epoch End");
        }
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
        message: "Training Already Running",
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
        message: "Training Started !",
      });
      await fetch("http://localhost/train/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...graphdef }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data.status);  
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
          message: "Training paused !",
        });
      } else {
        halt.name = "Pause";
        halt.state = true;
        window.notify({
          message: "Training resumed !",
        });
      }
      haltState({
        ...halt,
      });
    } else {
      window.notify({
        message: "Can't halt, Training has not started !",
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
            message: "Training has stopped !",
          });
        });
    } else {
      window.notify({
        message: "Can't stop, Training has not started !",
      });
    }
  }

  React.useEffect(() => {
    if (train.training && status.updating === false && status.ended === false && status.ended !== undefined) {
      getStatus();
    }
  });

  let [ monitorMode, monitorModeState ] = React.useState(false);

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
        <div className="title">Logs</div>
        {status.data.map((log, i) => {
          switch (log.type) {
            case "notif":
              return <NotificationLog data={log.data} key={i} />;
            case "epoch":
              return <EpochLog data={log.data} key={i} />;
            case "error":
              return <ErrorLog data={log.data} key={i} />;
            default:
              return <div />;
          }
        })}
      </div>
      <div className="monitor-container">
        <div className="title" onClick={ e => monitorModeState( ~monitorMode ) }>
          Loss Monitor ({ monitorMode ? 'Combined' : 'Separate' })
        </div>
        {status.data.length 
          ? monitorMode 
              ? <MonitorOne data={status.data} {...props} /> 
              : <MonitorMany data={status.data} {...props} />
          : undefined}
      </div>
      <div id="check"> </div>
    </div>
  );
};

export default Training;

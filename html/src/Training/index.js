import React from "react";

import Menu from '../GraphCanvas/menu';
import { MonitorMany, MonitorOne } from './monitor';
import { EpochLog, ErrorLog, NotificationLog } from './logs';

import { icons } from "../data/icons";
import { metaAppFunctions, metaGraph, metaAppData,  metaTrain } from "../Meta";
import { get, pull, push, post } from "../Utils";

const Training = (
  props = { store: metaAppData, appFunctions: metaAppFunctions }
) => {
  let epoch = 0;
  let [graph, graphState] = React.useState(metaGraph);
  let [train, trainState] = React.useState(metaTrain);

  let [monitorMode, monitorModeState] = React.useState(false);
  let [status, statusState] = React.useState({
    data: train.hist !== undefined ? train.hist : [],
    ended: false,
    updating: false,
  });
  let [halt, haltState] = React.useState({
    name: "Pause",
    state: true,
  });
  let controls = [
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
        graph.train_config.session_id = new Date().toTimeString();
        graphState({ ...graph });
      },
      icon: icons.Delete,
    },
  ];
  let [istraining, istrainingState] = React.useState({ state: false});

  function statusSocket(){
    let socket = new WebSocket("ws://localhost:8000/train/socket_status");

    socket.onopen = function (event) {
      console.log("[socket] Connection established");
      socket.send("$")
    };

    socket.onmessage = function (event) {
      status.data = JSON.parse(event.data);
      statusState({...status});
      if (status.data[status.data.length - 1].data.epoch !== epoch) {
        let logs = document.getElementById("logs");
        logs.scrollTop = logs.scrollHeight;
        epoch = status.data[status.data.length - 1].data.epoch;
      }
      if (status.data[status.data.length-1].data.ended){
        socket.send("$exit");
        istrainingState({state: false})
      }else{
        socket.send("$");
      }
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[socket] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        console.log("[socket] Connection died");
      }
    };

    socket.onerror = function (error) {
      console.log(`[socket] ${error.message}`);
    };

    return socket;
  }

  /**
   * depricated
   */
  async function getStatus() {
    await get({
      path: "/train/status",
    })
      .then((respomse) => respomse.json())
      .then((data) => {
        statusState({
          data: data.logs,
          ended: data.logs[data.logs.length - 1].data.ended || false,
          updating: true,
        });
        if (data.logs[data.logs.length - 1].data.epoch !== epoch) {
          let logs = document.getElementById("logs");
          logs.scrollTop = logs.scrollHeight;
          epoch = data.logs[data.logs.length - 1].data.epoch;
        }
        if (data.logs[data.logs.length - 1].data.ended) {
          istrainingState({ state: false});
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
    if (istraining.state) {
      props.appFunctions.notify({
        message: "Training Session Already Running",
      });
    } else {
      istrainingState({state: true});
      epoch = 0;
      statusState({
        data: [],
        ended: false,
        updating: false,
      });
      istrainingState({
        state: true
      })
      props.appFunctions.notify({
        message: "Training Started !",
      });
      await post({
        path:"/train/start",
        data: {}
      })
        .then((response) => response.json())
        .then((data) => {
          props.appFunctions.notify({ message: data.message });
          let socket = statusSocket();
        });
    }
  }

  async function haltModel(e) {
    if (istraining.state) {
      await post({
        path: "/train/halt",
        data: halt
      })
        .then((response) => response.json())
        .then((data) => {});
      if (halt.state) {
        halt.name = "Resume";
        halt.state = false;
        props.appFunctions.notify({
          message: "Training paused !",
        });
      } else {
        halt.name = "Pause";
        halt.state = true;
        props.appFunctions.notify({
          message: "Training resumed !",
        });
      }
      haltState({
        ...halt,
      });
    } else {
      props.appFunctions.notify({
        message: "Can't halt, Training has not started !",
      });
    }
  }

  async function stopModel(e) {
    if (istraining.state) {
      post({
        path: "/train/stop",
        data: {}
      })
        .then((response) => response.json())
        .then((data) => {
          istrainingState({
            state: false
          })
          props.appFunctions.notify({
            message: "Training has stopped !",
          });
        });
    } else {
      props.appFunctions.notify({
        message: "Can't stop, Training has not started !",
      });
    }
  }

  React.useState(()=>{
    console.log("ello")
  }, [])

  React.useState(() => {
    if (graph.fetch) {
      pull({
        name: "canvas",
      }).then((response) => {
        let _graph = response.graph;
        delete response.graph;
        window.canvas = response;
        graphState({ ..._graph, fetch: false });
      });
    }
  }, [graph]);

  React.useEffect(() => {
    if (!graph.fetch) {
      console.log("[PUSH] Canvas");
      push({
        name: "canvas",
        data: {
          ...window.canvas,
          graph: graph,
        },
      });
    }
  }, [graph]);

  return (
    <div className="container training">
      <div className="tuner">
        <div className="toolbar">
          <div className="controls">
            {controls.map((button, i) => {
              let Icon = button.icon;
              return (
                <div className="btn" key={i} onClick={button.func}>
                  <Icon />
                </div>
              );
            })}
          </div>
        </div>
        {graph.train_config ? (
          <div className="params" style={istraining.state ? {
            pointerEvents: "none",
            opacity: '0.6',
            zoom: 1,
            msFilter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)",
            MozOpacity: 0.5,
            KhtmlOpacity: 0.5
          }: {}}>
            {graph.train_config.fit !== null ? (
              <div className="property">
                <Menu
                  {...graph.train_config.fit}
                  graph={graph}
                  graphState={graphState}
                  train={true}
                />
              </div>
            ) : undefined}
            {graph.train_config.compile ? (
              <div className="property">
                <Menu
                  {...graph.train_config.compile}
                  graph={graph}
                  graphState={graphState}
                  train={true}
                />
              </div>
            ) : undefined}
            {graph.train_config.optimizer ? (
              <div className="property">
                <Menu
                  {...graph.train_config.optimizer}
                  graph={graph}
                  graphState={graphState}
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
        <div className="title" onClick={(e) => monitorModeState(~monitorMode)}>
          Loss Monitor ({monitorMode ? "Combined" : "Separate"})
        </div>
        {status.data.length ? (
          monitorMode ? (
            <MonitorOne data={status.data} {...props} />
          ) : (
            <MonitorMany data={status.data} {...props} />
          )
        ) : undefined}
      </div>
      <div id="check"> </div>
    </div>
  );
};

export default Training;

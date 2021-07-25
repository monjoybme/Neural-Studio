import React from "react";

import Menu from "../GraphCanvas/menu";
import { EpochLog, ErrorLog, NotificationLog } from "./logs";

import { icons } from "../data/icons";
import { metaAppFunctions, metaGraph, metaAppData, metaTrain } from "../Meta";
import { get, pull, push, post, Loading, WSSR } from "../Utils";
import { Monitor } from "./loss";

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
  let [istraining, istrainingState] = React.useState({ state: false });
  let compRef = React.useRef();

  function statusSocket() {
    let socket = new WebSocket(`${WSSR}/train/socket_status`);

    socket.onopen = function (event) {
      console.log("[socket] Connection established");
      socket.send("$");
    };

    socket.onmessage = function (event) {
      if (compRef.current) {
        status.data = JSON.parse(event.data);
        statusState({ ...status });
        if (status.data[status.data.length - 1].data.epoch !== epoch) {
          let logs = document.getElementById("logs");
          logs.scrollTop = logs.scrollHeight;
          epoch = status.data[status.data.length - 1].data.epoch;
          trainState({
            history: status.data,
          });
        }
        if (status.data[status.data.length - 1].data.ended) {
          socket.send("$exit");
          istrainingState({ state: false });
        } else {
          socket.send("$");
        }
      } else {
        socket.send("$exit");
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

  async function trainModel(e) {
    if (istraining.state) {
      props.appFunctions.notify({
        message: "Training Session Already Running",
      });
    } else {
      istrainingState({ state: true });
      epoch = 0;
      statusState({
        data: [],
        ended: false,
        updating: false,
      });
      istrainingState({
        state: true,
      });
      props.appFunctions.notify({
        message: "Training Started !",
      });
      await post({
        path: "/train/start",
        data: {},
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
        data: halt,
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
        data: {},
      })
        .then((response) => response.json())
        .then((data) => {
          istrainingState({
            state: false,
          });
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

  React.useState(() => {
    console.log("[training]");
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
  }, []);

  React.useEffect(() => {
    get({
      path: "/train/status",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.is_training) {
          epoch = 0;
          statusState({
            data: [],
            ended: false,
            updating: false,
          });
          statusSocket();
        }
        istrainingState({ state: data.is_training });
      });
  }, []);

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

  React.useEffect(() => {
    if (train.fetch) {
      pull({
        name: "train",
      }).then((response) => {
        trainState({ history: response.history, fetch: false });
        statusState({
          data: response.history ? response.history : [],
          ended: false,
          updating: false,
        });
      });
    } else {
      push({
        name: "train",
        data: train,
      }).then((response) => {
        
      });
    }
  }, [train]);

  return (
    <div className="container training" ref={compRef}>
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
          <div
            className="params"
            style={
              istraining.state
                ? {
                    pointerEvents: "none",
                    opacity: "0.6",
                    zoom: 1,
                    msFilter:
                      "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)",
                    MozOpacity: 0.5,
                    KhtmlOpacity: 0.5,
                  }
                : {}
            }
          >
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
      {train.fetch ? (
        <Loading />
      ) : (
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
      )}
      <div className="monitor-container">
        <div className="title" onClick={(e) => monitorModeState(~monitorMode)}>
          Loss Monitor
          {/* ({monitorMode ? "Combined" : "Separate"}) */}
        </div>
        <Monitor data={status.data} />
      </div>
      <div id="check"> </div>
    </div>
  );
};

export default Training;

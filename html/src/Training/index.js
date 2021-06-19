import React from "react";

import Menu from '../GraphCanvas/menu';
import { MonitorMany, MonitorOne } from './monitor';
import { EpochLog, ErrorLog, NotificationLog } from './logs';

import { icons } from "../data/icons";
import { metaAppFunctions, metaGraph, metaStore, metaStoreContext, metaTrain } from "../Meta";
import { GET, pull, push } from "../Utils";

const Training = (
  props = { store: metaStore, storeContext: metaStoreContext, appFunctions: metaAppFunctions }
) => {
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

  async function getStatus() {
    await GET({
      path: "/train/status",
    })
      .then((respomse) => respomse.json())
      .then((data) => {
        statusState({
          data: data.logs,
          ended: data.logs[data.logs.length - 1].data.ended || false,
          updating: true,
        });
        if (data.logs[data.logs.length - 1].data.epochEnd) {
          console.log("Epoch End");
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
    if (train.training) {
      props.appFunctions.notify({
        message: "Training Already Running",
      });
    } else {
      istrainingState({state: true});
      statusState({
        data: [],
        ended: false,
        updating: false,
      });
      props.appFunctions.notify({
        message: "Training Started !",
      });
      await fetch("http://localhost/train/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...graph }),
      })
        .then((response) => response.json())
        .then((data) => {
          props.appFunctions.notify({ message: data.message });
          getStatus();
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
          <div className="params">
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

import React from "react";
import Graph from "../GraphCanvas";
import CodeEditor from "../CodeEditor";
import Train from "../Training";
import SummaryViewer from "../SummaryViewer";
import Home from "../Home";

import { icons } from "../data/icons";

let metaSideNav = [
  {
    name: "Home",
    path: "/",
    selected: window.location.pathname === "/",
    icon: icons.Home,
    comp: Home,
  },
  {
    name: "Graph",
    path: "/graph",
    selected: window.location.pathname === "/graph",
    icon: icons.Graph,
    comp: Graph,
  },
  {
    name: "Code",
    path: "/code",
    selected: window.location.pathname === "/code",
    icon: icons.Code,
    comp: CodeEditor,
  },
  {
    name: "Summary",
    path: "/summary",
    selected: window.location.pathname === "/summary",
    icon: icons.Summary,
    comp: SummaryViewer,
  },
  {
    name: "Train",
    path: "/train",
    selected: window.location.pathname === "/train",
    icon: icons.Train,
    comp: Train,
  },
];

let metaRender = {
  name: "Home",
  comp: Home,
};

let metaTrain = {
  training: false,
  hist: [],
};

let metaWorkspce = {
  ntbf: true,
  active: {
    config: {
      name: "Workspace",
    },
  },
  recent: [],
  all: [],
};

let metaGraphdef = {
  train_config: {
    session_id: null,
    train : null,
    compile : null,
    optimizer : null,
    dataset : null
  },
};

let metaAppConfig = {
  theme: "dark",
  geometry: {
    sideBar: {
      width: 70,
    },
    topBar: {
      height: 60,
    },
  },
  canvas: {
    toolbar: {
      width: 280,
    },
  },
  monitor: {
    width: 400,
    padding: 5,
    graph: {
      height: 295,
      width: 365,
    },
  },
};

let metaCanvasConfig = {
  activeLayer: null,
  activeLine: null,
  newEdge: null,
  pos: null,
  lineCount: 0,
  layerCount: {},
  mode: "normal",
  pan: false,
  panLast: null,
  viewBox: {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  },
  customNodes: {
    nodeCount: {},
    definitions: [],
  },
};

let metaStoreContext = {
  graphDef: {
    name: "graphdef",
    get: function () {
      return metaGraphdef;
    },
    set: function (data) {
      
    },
    pull: async function () {
      
    },
    push: async function () {},
  },
  appConfig: {
    name: "app_config",
    get: function () {
      return metaAppConfig;
    },
    set: function (data) {

    },
    pull: async function () {
    },
    push: async function () {},
  },
  canvasConfig: {
    name: "canvas_config",
    get: function () {
      return metaCanvasConfig;
    },
    set: function (data) {
    },
    pull: async function () {
    },
    push: async function () {},
  },
};

let metaStore = {
  graphDef: metaGraphdef,
  graphDefState: function (graphDef = metaGraphdef) {},
  layerGroups: [],
  layerGroupsState: function (layerGroups = []) {},
  sidenav: metaSideNav,
  sidenavState: function (sidenav = metaSideNav) {},
  render: metaRender,
  renderState: function (render = metaRender) {},
  train: metaTrain,
  trainState: function (train = metaTrain) {},
  popup: {},
  popupState: function (popup = {}) {},
  appConfig: metaAppConfig,
  appConfigState: function (appConfig = metaAppConfig) {},
  workspace: metaWorkspce,
  workspaceState: function (workspace = metaWorkspce) {},
  canvasConfig: metaCanvasConfig,
  statusbar: "Hello",
  statusbarState: function (statusbar = "Hello") {},
  notification: "Hello",
  notificationState: function (notification = "Hello") {},
};

let metaAppFunctions =  {
  autosave: async function () { },
  downloadCode: async function (e) { },
  updateStatus: function (options = { text: "Notification" }) { },
  notify: function ( options = { name: "test", message: "Hello", timeout: 3000 } ) { },
  pullStore: async function () { },
}

export {
  metaStore,
  metaStoreContext,
  metaAppFunctions,
  metaGraphdef,
  metaRender,
  metaTrain,
  metaSideNav,
  metaWorkspce,
  metaAppConfig,
  metaCanvasConfig
};

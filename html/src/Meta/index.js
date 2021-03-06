import React from "react";

import Home from "../Home";
import Graph from "../GraphCanvas";
import Dataset from "../Dataset";
import Train from "../Training";
import Inference from "../Inference";


import layerGroups from "../data/layers";
import datasets from '../data/datasets';
import { icons } from "../data/icons";

export const metaDatasets = { ...datasets };

export const metaSideNav = [
  {
    name: "Home",
    path: "/",
    selected: window.location.pathname === "/",
    icon: icons.Home,
    comp: Home,
  },
  {
    name: "Dataset",
    path: "/dataset",
    selected: window.location.pathname === "/dataset",
    icon: icons.Dataset,
    comp: Dataset,
  },
  {
    name: "Graph",
    path: "/graph",
    selected: window.location.pathname === "/graph",
    icon: icons.Graph,
    comp: Graph,
  },
  {
    name: "Train",
    path: "/train",
    selected: window.location.pathname === "/train",
    icon: icons.Train,
    comp: Train,
  },
  {
    name: "Inference",
    path: "/inference",
    selected: window.location.pathname === "/experiment",
    icon: icons.Experiment,
    comp: Inference,
  },
];

export const  metaPopop = <></>

export const  metaRoute = {
  name: "Home",
  comp: Home,
};

export const  metaApp = {
  fetch: true,
  name:"model",
  theme: "light",
  geometry: {
    sideBar: {
      width: 60,
    },
    topBar: {
      height: 60,
    },
  },
  canvas: {
    toolbar: {
      width: 300,
    },
  },
  monitor: {
    width: 640,
    padding: 5,
    graph: {
      height: 295,
      width: 365,
    },
  },
};

export const  metaHome = {
  active: {
    name: "model",
  },
  your_work: [],
  fetch: true
};

export const  metaCanvas = {
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

export const  metaTrain = {
  fetch: true,
  history: [],
};

export const  metaDataset = {

};

export const  metaGraph = {
  train_config: {
    session_id: null,
    model: null,
    compile: null,
    fit: null,
    optimizer: null,
    loss: null,
    dataset: null,
  },
  nodes:{

  },
  custom_nodes : {
    
  },
  fetch: true
};

export const metaRender = {
  name:"Home",
  comp: Home
}

export const metaAppData = {
  app: metaApp,
  appState: function (data = metaApp) {}
};

export const metaStoreContext = {
  graph: {
    name: "graph",
    get: function () {
      return metaGraph;
    },
    set: function (data) { },
    pull: async function () { },
    push: async function () { },
  },
  app: {
    name: "app",
    get: function () {
      return metaApp;
    },
    set: function (data) { },
    pull: async function () { },
    push: async function () {
    },
  },
  home: {
    name: "home",
    get: function () {
      return metaHome;
    },
    set: function (data) {},
    pull: async function () {},
    push: async function () {},
  },
  canvas: {
    name: "canvas",
    get: function () {
      return metaCanvas;
    },
    set: function (data) {},
    pull: async function () {},
    push: async function () {},
  },
  dataset: {
    name: "dataset",
    get: function () {
      return metaDataset;
    },
    set: function (data) {},
    pull: async function () {},
    push: async function () {},
  },
  train: {
    name: "train",
    get: function () {
      return metaTrain;
    },
    set: function (data) {},
    pull: async function () {},
    push: async function () {},
  },
};

export const  metaAppFunctions = {
  autosave: async function () {},
  downloadCode: async function (e) {},
  updateStatus: function (options = { text: "Notification" }) {},
  notify: function (
    options = { name: "test", message: "Hello", timeout: 3000 }
  ) {},
  pullStore: async function () {},
  loadState: function () {},
};

export const metaLayerGroups = { ...layerGroups }
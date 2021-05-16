import React from 'react';
import Graph from "../GraphCanvas";
import CodeEditor from "../CodeEditor";
import Train from "../Training";
import SummaryViewer from "../SummaryViewer";
import Home from '../Home'

import { icons } from '../data/icons';
import { appConfig } from '../data/appconfig';

const defaultSideNav = [
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

const defaultRender = {
  name: "Home",
  comp: Home,
};

const defaultTrain = {
  training: false,
  hist: [],
};

const defaultWorkspce = {
  ntbf: true,
  active: {
    config: {
      name: "Workspace",
    },
  },
  recent: [],
  all: [],
};

const defaultGraphdef = {
  train_config: {
    session_id: undefined,
  },
};


const StoreContext = {
    
}


export { StoreContext, defaultGraphdef, defaultRender, defaultTrain, defaultSideNav, defaultWorkspce, appConfig }
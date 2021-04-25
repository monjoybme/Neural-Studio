import React from 'react';
import Graph from "../GraphCanvas";
import CodeEditor from "../CodeEditor";
import Train from "../Training";
import SummaryViewer from "../SummaryViewer";
import Home from '../Home'

import layerGroupsDefault from '../data/layers';
import { icons } from '../data/icons';
import { appConfig } from '../data/appconfig';

const defaultGraphDef = {

}

const defaultSideNav = [
    {
      name: "Home",
      path: "/",
      selected: window.location.pathname === "/",
      icon: icons.Home,
      comp:Home,
    },
    {
      name: "Graph",
      path: "/graph",
      selected: window.location.pathname === "/graph",
      icon: icons.Graph,
      comp:Graph,
    },
    {
      name: "Code",
      path: "/code",
      selected: window.location.pathname === "/code",
      icon: icons.Code,
      comp:CodeEditor,
    },
    {
      name: "Summary",
      path: "/summary",
      selected: window.location.pathname === "/summary",
      icon: icons.Summary,
      comp:SummaryViewer
    },
    {
      name: "Train",
      path: "/train",
      selected: window.location.pathname === "/train",
      icon: icons.Train,
      comp:Train
    },
]

const defaultRender = { name:"Home", comp:<div></div> }

const defaultTrain = {
    training: false,
    hist: [],
}

const defaultWorkspce={
    ntbf: true,
    active: {
      config: {
        name: "Workspce",
      },
    },
    recent: [],
    all: [],
  }

const StoreContext = {
    graphdef: defaultGraphDef, 
    graphdefState: function({...defaultGraphDef}){},
    layerGroups: layerGroupsDefault, 
    layerGroupsState: function({...layerGroupsDefault}){},
    sidenav: defaultSideNav, 
    sidenavState: function({...defaultSideNav}){},
    render: defaultRender, 
    renderState: function({...defaultRender}){},
    train: defaultTrain, 
    trainState: function({...defaultTrain}){},
    popup: {}, 
    popupState: function(){},
    appconfig: appConfig, 
    appconfigState: function({...appConfig}){},
    workspace: defaultWorkspce, 
    workspaceState: function({...defaultWorkspce}){},
}


export { StoreContext, }
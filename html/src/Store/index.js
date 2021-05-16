import React from "react";

import GraphEditor from "../GraphCanvas";
import Home from "../Home";
import SummaryViewer from "../SummaryViewer";
import Training from "../Training";
import CodeEditor from "../CodeEditor";

import { icons } from "../data/icons";
import { GET, POST } from "../Utils";

let _dummyStore = {
  get: function () {
    return localStorage.getItem("graphDef");
  },
  set: function (options = { data: {} }) {
    localStorage.setItem("graphDef", { ...options.data });
  },
  retrive: async function () {
    GET({
      path: "/workspace/active/var/graphdef",
    })
      .then((response) => response.json())
      .then((data) => {
        this.set({ data: data });
      });
  },
  store: async function () {
    POST({
      path: "/workspace/active/var/graphdef",
      data: this.get(),
    });
  },
};

let _dummState = {
  get: function () {
    return {};
  },
  set: function (options = { data: {} }) {},
  retrive: async function () {},
  store: async function () {},
};

const StoreContext = {
  appConfig: {
    name: "app_config",
    get: function () {
      return {};
    },
    set: function (options = { data: {} }) {},
    retrive: async function () {},
    store: async function () {},
  },
  canvasConfig: {
    name: "canvas_config",
    get: function () {
      return {};
    },
    set: function (options = { data: {} }) {},
    retrive: async function () {},
    store: async function () {},
  },
  workspaceConfig: {
    name: "config",
    get: function () {
      return {};
    },
    set: function (options = { data: {} }) {},
    retrive: async function () {},
    store: async function () {},
  },
  render: {
    get: function () {
      return {};
    },
    set: function (options = { data: {} }) {},
    retrive: async function () {},
    store: async function () {},
  },
  sidenav: {
    name: "sidenav",
    get: function () {},
    set: function (options = { data: {} }) {},
    retrive: async function () {},
    store: async function () {},
  },
};

const defaultSideNav = [
  {
    name: "Home",
    path: "/",
    selected: window.location.pathname === "/",
    icon: "Home",
    comp: Home,
  },
  {
    name: "Graph",
    path: "/graph",
    selected: window.location.pathname === "/graph",
    icon: "Graph",
    comp: GraphEditor,
  },
  {
    name: "Code",
    path: "/code",
    selected: window.location.pathname === "/code",
    icon: "Code",
    comp: CodeEditor,
  },
  {
    name: "Summary",
    path: "/summary",
    selected: window.location.pathname === "/summary",
    icon: "Summary",
    comp: SummaryViewer,
  },
  {
    name: "Train",
    path: "/train",
    selected: window.location.pathname === "/train",
    icon: "Train",
    comp: Training,
  },
];

const Store = (props) => {
  let [fl, flState] = React.useState(true);
  let [children, childrenState] = React.useState(undefined);

  let [store, storeState] = React.useState({
    render: { name: "Home", comp: Home },
    appConfig:{},
    canvasConfig:{},
    workspaceConfig:{}
  });

  const StoreContext = {
    appConfig: {
      name: "app_config",
      get: function () {
        return store.appConfig;
      },
      set: function (options = { data: {} }) {
        store.appConfig = options.data;
        storeState({ ...storeState });
      },
      retrive: async function () {
        await GET({
          path: `/workspace/active/var/${this.name}`,
        })
          .then((response) => response.json())
          .then((data) => {
            this.set({ data: data })
            console.log(`Fetched ${this.name}`);
          });
      },
      store: async function () {
        await POST({
          path: `/workspace/active/var/${this.name}`,
          data: this.get(),
        })
          .then((response) => response.json())
          .then((data) => {});
      },
    },
    canvasConfig: {
      name: "canvas_config",
      get: function () {
        return store.canvasConfig;
      },
      set: function (options = { data: {} }) {
        store.canvasConfig = options.data;
        storeState({ ...storeState });
      },
      retrive: async function () {
        await GET({
          path: `/workspace/active/var/${this.name}`,
        })
          .then((response) => response.json())
          .then((data) => {
            this.set({ data: data });
            console.log(`Fetched ${ this.name }`)
          });
      },
      store: async function () {
        await POST({
          path: `/workspace/active/var/${this.name}`,
          data: this.get(),
        });
      },
    },
    workspaceConfig: {
      name: "config",
      get: function () {
        return store.workspaceConfig;
      },
      set: function (options = { data: {} }) {
        store.workspaceConfig = options.data;
        storeState({ ...storeState });
      },
      retrive: async function () {
        await GET({
          path: `/workspace/active/var/${this.name}`,
        })
          .then((response) => response.json())
          .then((data) => {
            this.set({ data: data });
            console.log(`Fetched ${this.name}`);
          });
      },
      store: async function () {
        await POST({
          path: `/workspace/active/var/${this.name}`,
          data: this.get(),
        });
      },
    },
    render: {
      get: function () {
        return store.render;
      },
      set: function (options = { data: {} }) {
        store.render = options.data;
        storeState({ ...storeState });;
      },
      retrive: async function () {
        this.set({ data: { data: { name: "Home" } }});
      },
      store: async function () {},
    },
    sidenav: {
      name: "sidenav",
      get: function () {
        return JSON.parse(localStorage.getItem(this.name));
      },
      set: function (options = { data: {} }) {
        localStorage.setItem(this.name, JSON.stringify(options.data));
      },
      retrive: async function () {
        this.set({ data: defaultSideNav });
      },
      store: async function () {},
    },
  };

  async function autoSave() {
    storeState({...store});
  }

  React.useEffect(()=> {
    if (fl) {
      async function fetchData (){
        Object.entries(StoreContext).map(async function([key, val]){
          await val.retrive();
        })
        autoSave()
      }
      fetchData();
      flState(false);
    }
    else{
      console.log( store )
    }
  },[ store ]);

  return (
    <div className={`app ${store.appConfig.theme}`}>
      { fl 
          ? undefined
          : React.Children.map(props.children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(
                child,
                (props = { store: StoreContext, autoSave: autoSave })
              );
            }
            return child;
          })
        
      }
    </div>
  )
};

export { Store, StoreContext };

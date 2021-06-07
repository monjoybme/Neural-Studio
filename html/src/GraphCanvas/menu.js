import React from "react";
import Editor from "@monaco-editor/react";
import Options from "../data/options";

import { POST } from "../Utils";
import { metaStore, metaStoreContext, metaAppFunctions } from "../Meta";

const propMeta = {
  id: "LayerId",
  name: "LayerName",
  arguments: {},
  width: 0,
  pos: {
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  },
  connections: {
    inbound: [],
    outbound: [],
  },
};

const TextProperty = (
  props = {
    ...propMeta,
    menu: undefined,
    menuState: function (_ = { comp: undefined, render: false }) {},
    store: metaStore,
    storeContext: metaStoreContext,
    appFunctions: metaAppFunctions,
    train: false,
  }
) => {
  let { graph, graphState } = props;
  let property = graph.nodes[props.layer_id].arguments[props.name];

  return (
    <div className="property">
      <div className="name"> {props.name} </div>
      <input
        name={`${props.layer_id}${props.name}`}
        id={`${props.layer_id}${props.name}`}
        defaultValue={property.value}
        onKeyUp={(e) => {
          graph.nodes[props.layer_id].arguments[props.name].value = e.target.value;
        }}
      />
    </div>
  );
};

const ListProperty = (
  props = {
    ...propMeta,
    menu: undefined,
    menuState: function (_ = { comp: undefined, render: false }) {},
    store: metaStore,
    storeContext: metaStoreContext,
    appFunctions: metaAppFunctions,
    train: false,
  }
) => {
  let { graph, graphState } = props;
  let property = graph.nodes[props.layer_id].arguments[props.name];
  let options = Options[property.options];

  return (
    <div className="property">
      <div className="name"> {props.name} </div>
      <select
        name={`${props.layer_id}${props.name}`}
        id={`${props.layer_id}${props.name}`}
        defaultValue={property.value}
        onChange={(e) => {
          graph.nodes[props.layer_id].arguments[props.name].value = e.target.value;
          props.storeContext.graph.set(graph);
        }}
      >
        {options.map((option, i) => {
          return (
            <option key={i} name={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const CheckboxProperty = (
  props = {
    ...propMeta,
    menu: undefined,
    menuState: function (_ = { comp: undefined, render: false }) {},
    store: metaStore,
    storeContext: metaStoreContext,
    appFunctions: metaAppFunctions,
    train: false,
  }
) => {
  let { graph, graphState } = props;
  let property = graph.nodes[props.layer_id].arguments[props.name];

  let [options, optionsState] = React.useState({
    data: Options[property.options].map((option) => {
      return {
        name: option,
        selected:
          graph.nodes[props.layer_id].arguments[props.name].value.lastIndexOf(
            option
          ) > -1,
      };
    }),
  });

  function selectBox(name = "Box") {
    if ( graph.nodes[props.layer_id].arguments[props.name].value.lastIndexOf(name) > -1 ) {
      graph.nodes[props.layer_id].arguments[props.name].value.pop(name);
    } else {
      graph.nodes[props.layer_id].arguments[props.name].value.push(name);
    }
    options.data = options.data.map((option) => {
      if (option.name === name) {
        option.selected = !option.selected;
      }
      return option;
    });

    optionsState({
      ...options,
    });
    props.storeContext.graph.set( graph );
  }

  const CheckBox = (
    props = {
      name: "Name",
      selected: false,
      onClick: function (name = "Box") {},
    }
  ) => {
    return (
      <div className="checkbox" onClick={(e) => props.onClick(props.name)}>
        <div className={props.selected ? "box selected" : "box"}></div>
        <div>{props.name}</div>
      </div>
    );
  };

  return (
    <div className="property" style={{ height: "auto" }}>
      <div className="name"> {props.name} </div>
      <div className="checkboxes">
        {options.data.map((option, i) => {
          return <CheckBox {...option} key={i} onClick={selectBox} />;
        })}
      </div>
    </div>
  );
};

const Layer = (
  props = {
    ...propMeta,
    menu: undefined,
    menuState: function (_ = { comp: undefined, render: false }) {},
    store: metaStore,
    storeContext: metaStoreContext,
    appFunctions: metaAppFunctions,
    train: false,
  }
) => {
  let  { graph, graphState } = props;
  return (
    <div className="menu">
      {props.train ? undefined : <div className="name">{props.name}</div>}
      <div className="properties">
        {props.train ? undefined : (
          <div className="property">
            <div className="name"> {props.name} </div>
            <input
              name="id"
              defaultValue={props.name}
              onKeyUp={(e) => {
                graph.nodes[props.id].name = e.target.value;
                props.storeContext.graph.set( graph )
              }}
            />
          </div>
        )}
        {Object.keys(props.arguments).map((property, i) => {
          switch (props.arguments[property].render) {
            case "text":
              return (
                <TextProperty
                  {...props}
                  layer_id={props.id}
                  name={property}
                  key={i}
                />
              );
            case "list":
              return (
                <ListProperty
                  {...props}
                  layer_id={props.id}
                  name={property}
                  key={i}
                />
              );
            case "checkbox":
              return (
                <CheckboxProperty
                  {...props}
                  layer_id={props.id}
                  name={property}
                  key={i}
                />
              );
            default:
              return <div></div>;
          }
        })}
      </div>
    </div>
  );
};

const Dataset = (
  props = {
    ...propMeta,
    menu: undefined,
    menuState: function (_ = { comp: undefined, render: false }) {},
    store: metaStore,
    storeContext: metaStoreContext,
    appFunctions: metaAppFunctions,
  }
) => {
  let { id, name, graph } = props;
  let  { app } = props.store;

  function updateCode(e) {
    graph.nodes[id].arguments.dataset.value = e;
    props.storeContext.graph.set(graph);
  }

  async function updateDataset(e) {
    await POST({
      path: "/dataset/checkpoint",
      data: {
        dataset: graph.nodes[id].arguments.dataset.value,
        id: id,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        props.appFunctions.notify({
          message: data.message,
          timeout: 5000,
        });
        if (data.status) {
          props.menuState(<div></div>);
        }
      });
  }

  React.useEffect(() => {});

  return (
    <div className="dataset">
      <div className="head">
        <input defaultValue={name} />
        <div className="buttons">
          <div className="btn" onClick={updateDataset}>
            Save
          </div>
        </div>
      </div>
      <Editor
        defaultLanguage="python"
        defaultValue={
          props.arguments.dataset.value.lastIndexOf("__id__") > 0
            ? props.arguments.dataset.value.replaceAll(/__id__/g, id)
            : props.arguments.dataset.value
        }
        onChange={updateCode}
        theme={"vs-" + app.theme}
      />
    </div>
  );
};

const CustomNode = (
  props = {
    ...propMeta,
    menu: undefined,
    menuState: function (_ = { comp: undefined, render: false }) {},
    store: metaStore,
    storeContext: metaStoreContext,
    appFunctions: metaAppFunctions,
  }
) => {
  let { graph, graphDefSt, app, layerGroups, layerGroupsState } = props.store;

  function updateCode(e) {
    graph.nodes[props.id].arguments.code.value = e;
    graphDefSt({
      ...graph,
    });
  }

  function updateName(e) {
    graph.nodes[props.id].name = e.target.value;
    graph.nodes[props.id].width = e.target.value.length * 10;
    graphDefSt({
      ...graph,
    });
  }

  async function saveAndExit(e) {
    await POST({
      path: "/custom/node/build",
      data: {
        code: graph.nodes[props.id].arguments.code.value,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        layerGroups.custom_nodes.layers =
          layerGroups.custom_nodes.layers.filter((layer) => {
            return layer.name !== graph.nodes[props.id].name;
          });
        window.canvasConfig.customNodes.definitions =
          window.canvasConfig.customNodes.definitions.filter((node) => {
            return node.name !== graph.nodes[props.id].name;
          });

        delete data.arguments["inbound"];
        let nodeDef = {
          name: graph.nodes[props.id].name,
          type: {
            name: data.id,
            object_class: "CustomNode",
          },
          arguments: data.arguments,
        };
        layerGroups.custom_nodes.layers.push(nodeDef);

        window.canvasConfig.customNodes.definitions.push(nodeDef);
        graphDefSt({
          ...graph,
        });

        layerGroupsState({
          ...layerGroups,
        });

        props.menuState({
          comp: <div></div>,
        });
      });
  }

  React.useEffect(() => {
    // console.log(graph.nodes[props.id])
  }, []);

  return (
    <div className="customNode dataset">
      <div className="head">
        <div className="name">{props.name}</div>
        <div className="btn" onClick={saveAndExit}>
          Save
        </div>
      </div>
      <div className="body">
        <Editor
          defaultLanguage="python"
          theme={"vs-" + app.theme}
          onChange={updateCode}
          defaultValue={props.arguments.code.value}
        />
        <div className="menu" style={{ position: "relative" }}>
          <div className="name">Options</div>
          <div className="properties">
            <div className="property">
              <div className="name">Node Name</div>
              <input defaultValue={props.name} onKeyUp={updateName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Menu = (
  props = {
    ...propMeta,
    menu: undefined,
    menuState: function (_ = { comp: undefined, render: false }) {},
    store: metaStore,
    graph: {},
    graphState: {},
    appFunctions: metaAppFunctions,
    train : false
  }
) => {
  let { type } = props;

  switch (type.object_class) {
    case "datasets":
      return <Dataset {...props} />;

    case "custom_def":
      return <CustomNode {...props} />;

    default:
      return <Layer {...props} train={props.train} />;
  }
};

export default Menu;

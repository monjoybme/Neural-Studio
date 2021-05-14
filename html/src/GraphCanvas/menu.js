import React from "react";
import Editor from "@monaco-editor/react";
import Options from "../data/options";

import { POST } from "../Utils";

const TextProperty = (props) => {
  let { graphdef, graphdefState } = props.store;
  let property = graphdef[props.layer_id].arguments[props.name];

  return (
    <div className="property">
      <div className="name"> {props.name} </div>
      <input
        name={props.layer_id + props.name}
        id={props.layer_id + props.name}
        defaultValue={property.value}
        onKeyUp={(e) => {
          graphdef[props.layer_id].arguments[props.name].value = e.target.value;
          graphdefState({
            ...graphdef,
          });
        }}
      />
    </div>
  );
};

const ListProperty = (props) => {
  let { graphdef, graphdefState } = props.store;
  let property = graphdef[props.layer_id].arguments[props.name];
  let options = Options[property.options];

  return (
    <div className="property">
      <div className="name"> {props.name} </div>
      <select
        name={props.layer_id + props.name}
        id={props.layer_id + props.name}
        defaultValue={property.value}
        onChange={(e) => {
          graphdef[props.layer_id].arguments[props.name].value = e.target.value;
          graphdefState({
            ...graphdef,
          });
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

const CheckboxProperty = (props) => {
  let { graphdef, graphdefState } = props.store;
  let property = graphdef[props.layer_id].arguments[props.name];
  
  let [ options, optionsState ] = React.useState({ 
    data : Options[property.options].map((option,)=>{
        return {
          name:option,
          selected:graphdef[props.layer_id].arguments[ props.name ].value.lastIndexOf(option) > -1
        }
      })
    }
  );
  
  function selectBox(name="Box") {
    if (
      graphdef[props.layer_id].arguments[props.name].value.lastIndexOf(
        name
      ) > -1
    ) {
      graphdef[props.layer_id].arguments[props.name].value.pop(name);
    } else {
      graphdef[props.layer_id].arguments[props.name].value.push(name);
    }

    options.data = options.data.map((option,)=>{
      if ( option.name === name ){
        option.selected = ! option.selected
      } 
      return option
    })

    optionsState({
      ...options
    })

    graphdefState({
      ...graphdef,
    });

  }

  const CheckBox = (props={name:"Name", selected:false, onClick:function( name="Box" ){  } }) =>{
    return (
      <div className="checkbox" onClick={e=>props.onClick(props.name)} >
        <div className={props.selected ? "box selected" : "box"}>
          
        </div>
        <div>
          { props.name }          
        </div>
      </div>
    );
  }

  return (
    <div className="property" style={{ height: "auto" }}>
      <div className="name"> {props.name} </div>
      <div className="checkboxes">
        {options.data.map((option, i) => {
          return <CheckBox {...option} key={i} onClick={selectBox} />
        })}
      </div>
    </div>
  );
};

const Layer = (props) => {
  let { graphdef, graphdefState } = props.store;
  return (
    <div className="menu">
      {
        props.train 
          ?
        undefined
          : 
        <div className="name">{props.name}</div>
      }
      <div className="properties">        
        {
          props.train 
           ?
          undefined 
            :
          (
              <div className="property">
                <div className="name"> {props.name} </div>
                <input
                  name="id"
                  defaultValue={props.name}
                  onKeyUp={(e) => {
                    graphdef[props.id].name = e.target.value;
                    graphdefState({
                      ...graphdef,
                    });
                  }}
                />
              </div>
              
          )
        }
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

const Dataset = (props) => {
  let { id, name } = props;
  let { graphdef, graphdefState, appconfig } = props.store;

  function updateCode(e) {
    graphdef[id].arguments.dataset.value = e;
    graphdefState({
      ...graphdef,
    });
  }
  
  async function updateDataset(e){
    await POST({
      path:"/dataset/checkpoint",
      data:{
        dataset:graphdef[id].arguments.dataset.value,
        id:id,
      }
    }).then(response=>response.json()).then(data=>{
      window.notify({
        message:data.message,
        timeout:5000
      });
      if (data.status){
        props.menuState(<div></div>);
      }
    })
  }

  React.useEffect(() => {
    
  });

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
        theme={"vs-" + appconfig.theme}
      />
    </div>
  );
};

const CustomNode = (props) => {
  let { graphdef, graphdefState, appconfig, layerGroups, layerGroupsState } = props.store;
  let [_id, _idState] = React.useState({
    value: props._id,
    index: 0,
  });

  function chageIndex(e) {
    _id.index = e.target.value;
    _idState({
      ..._id,
    });
  }

  function updateCode(e) {
    graphdef[props.id].arguments.code.value = e;
    graphdefState({
      ...graphdef,
    });
  }

  function updateName(e) {
    graphdef[props.id].name = e.target.value;
    graphdef[props.id].width = e.target.value.length * 10;
    graphdefState({
      ...graphdef,
    });
  }

  function updateNodeName(e) {
    _idState({
      value: e.target.value,
    });
  }

  async function saveAndExit(e) {
    await POST({
      path: "/custom/node/build",
      data: {
        code: graphdef[props.id].arguments.code.value,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        layerGroups.custom.layers = layerGroups.custom.layers.filter(
          (layer) => {
            return layer.name !== props._id && layer.name !== _id.value;
          }
        );

        delete data.arguments["inbound"];

        layerGroups.custom.layers.push({
          name: _id.value,
          type: {
            name: data.id,
            object_class: "CustomNode",
          },
          arguments: data.arguments,
        });

        graphdef[props.id]._id = _id.value;
        graphdef[props.id].index = _id.index;
        graphdefState({
          ...graphdef,
        });

        layerGroupsState({
          ...layerGroups,
        });
        props.menuState({
          comp: <div></div>,
        });
      });
  }

  return (
    <div className="customNode dataset">
      <div className="head">
        <div className="name">
          {props.name}
        </div>
        <div className="btn" onClick={saveAndExit}>
          Save
        </div>
      </div>
      <div className="body">
        <Editor
          defaultLanguage="python"
          theme={"vs-" + appconfig.theme}
          onChange={updateCode}
          defaultValue={props.arguments.code.value}
        />
        <div className="menu" style={{position:"relative"}}>
          <div className="name">Options</div>
          <div className="properties">
            <div className="property">
              <div className="name">Name</div>
              <input defaultValue={props.name} onKeyUp={updateName} />
            </div>
            <div className="property">
              <div className="name">Node Id</div>
              <input defaultValue={props._id} onKeyUp={updateNodeName} />
            </div>
            <div className="property">
              <div className="name">Index</div>
              <input defaultValue={0} type="number" onChange={chageIndex} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Menu = (props) => {
  let { type } = props;

  switch (type.name) {
    case "Dataset":
      return <Dataset {...props} />;

    case "Custom":
      return <CustomNode {...props} />;

    default:
      return <Layer {...props} train={props.train} />;
  }
};

export default Menu;

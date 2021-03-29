import React from "react";

let cursors = {
  line: "crosshair",
  delete: "no-drop",
  normal: "default",
  layer: "cell",
  move: "move",
};

const TextProperty = (props) =>{
    let property = props.data[props.name];
    return (
      <div className="property" >
        <div> {props.name} </div>
        <input 
          name={props.layer_id+props.name}
          id = {props.layer_id+props.name}
          defaultValue={property.value} 
          onKeyUp={e=>{
              props.data[props.name].value = e.target.value;
              props.dataState({
                ...props.data
              }) 
            }
          } 
        />
      </div>
    )
  }
  
  const ListProperty = (props) => {
    let property = props.data[props.name]; 
    let options = property.options;
    
    return (
      <div className="property" >
        <div> {props.name} </div>
        <select 
          name={props.layer_id+props.name}
          id = {props.layer_id+props.name}
          defaultValue={property.value} 
          onChange={(e)=>{
            props.data[props.name].value = e.target.value;
            props.dataState({
                ...props.data
            }) 
        }}
          >
          {
            options.map((option,i)=>{
              return (
                <option   
                  key={i}
                  name={option.value}
                > 
                  {option.name} 
                </option>
              )
            })
          }
        </select>
      </div>
    )
  }

const Menu = (props) => {
  let [data, dataState] = React.useState({
    ...props.layer.arguments,
  });

  let [meta, metaState] = React.useState({
    name: props.layer.name,
    id: props.layer.id,
  });

  React.useEffect(() => {
    window.layers[props.layer.id].arguments = data;
    window.layersState({
      ...window.layers,
    });
  }, [data]);

  return (
    <div className="menu">
      <div className="name">{meta.name}</div>
      <div className="properties">
        {Object.keys(meta).map((property, i) => {
          return (
            <div className="property" key={i}>
              <div> {property} </div>
              <input
                name="id"
                defaultValue={meta[property]}
                onKeyUp={(e) => {
                  meta[property] = e.target.value;
                  window.layers[props.layer.id][property] = meta[property];

                  window.layersState({
                    ...window.layers,
                  });
                  metaState({
                    ...meta,
                  });
                }}
              />
            </div>
          );
        })}
        {Object.keys(data).map((property, i) => {
          let comp;
          switch (data[property].render) {
            case "text":
              return (
                <TextProperty
                  layer_id={props.layer.id}
                  data={data}
                  dataState={dataState}
                  name={property}
                  key={i}
                />
              );
            case "list":
              return (
                <ListProperty
                  layer_id={props.layer.id}
                  data={data}
                  dataState={dataState}
                  name={property}
                  key={i}
                />
              );
          }
        })}
      </div>
    </div>
  );
};

export default Menu;

import React from "react";
import Editor from "@monaco-editor/react";
import Options from '../data/options';

import { POST } from '../Utils';

import './menu.css'


const TextProperty = (props) =>{
    let property = window.layers[props.layer_id].arguments[props.name];
    return (
      <div className="property" >
        <div className="name" > {props.name} </div>
        <input 
          name={props.layer_id+props.name}
          id = {props.layer_id+props.name}
          defaultValue={property.value} 
          onKeyUp={e=>{
              window.layers[props.layer_id].arguments[props.name].value = e.target.value;
              window.layersState({
                ...window.layers
              })
            }
          } 
        />
      </div>
    )
  }
  
const ListProperty = (props) => {
  let property = window.layers[props.layer_id].arguments[props.name];
  let options = Options[property.options];

  return (
    <div className="property" >
      <div className="name"> {props.name} </div>
      <select 
        name={props.layer_id+props.name}
        id = {props.layer_id+props.name}
        defaultValue={property.value} 
        onChange={(e)=>{
          window.layers[props.layer_id].arguments[props.name].value = e.target.value;
          window.layersState({
            ...window.layers
          }) 
      }}
        >
        {
          options.map((option,i)=>{
            return (
              <option   
                key={i}
                name={option}
              > 
                {option} 
              </option>
            )
          })
        }
      </select>
    </div>
  )
}

const CheckboxProperty = (props) => {
  let property = window.layers[props.layer_id].arguments[props.name];
  let options = Options[property.options];

  function selectBox(e){
    if (window.layers[props.layer_id].arguments[props.name].value.lastIndexOf(e.target.name) > -1){
      window.layers[props.layer_id].arguments[props.name].value.pop(e.target.name)
    }
    else{
      window.layers[props.layer_id].arguments[props.name].value.push(e.target.name)
    }

    window.layersState({
      ...window.layers
    }) 
  }
  return (
    <div className="property" style={{height:"auto"}}>
      <div className="name"> {props.name} </div>
      <div className="checkboxes">
        {
          options.map((option,i)=>{
            return (
              <label className='checkbox' key={i}>
                <input 
                  type="checkbox" 
                  name={option} 
                  key={i}  
                  defaultChecked={ window.layers[props.layer_id].arguments[props.name].value.lastIndexOf(option) > -1 }
                  onChange={selectBox}
                 /> 
                {option}
              </label>
            )
          })        
        }
      </div>
    </div>
  )
}

const Dataset = (props) =>{
  let { id, name } = props;

  function updateCode(e){
    window.layers[id].arguments.dataset.value = e;
    window.layersState({
      ...window.layers
    })
  }

  React.useEffect(()=>{
    window.layers[id].arguments.dataset.value = props.arguments.dataset.value.lastIndexOf("__id__") > 0 ?
      props.arguments.dataset.value.replaceAll(/__id__/g,id)
      :
      props.arguments.dataset.value
      
    window.layersState({
      ...window.layers
    })
  })

  return (
    <div className="dataset">
      <div className="head">
        <input  defaultValue={ name } />
        <div className="btn" onClick={e=>{
              props.menuState({comp:<div />})
            }
          }
          >
          Save
        </div>
      </div>
      <Editor
          defaultLanguage="python"
          defaultValue={ 
            props.arguments.dataset.value.lastIndexOf("__id__") > 0 ?
              props.arguments.dataset.value.replaceAll(/__id__/g,id)
              :
              props.arguments.dataset.value 
          }
          onChange={updateCode}
          theme={"vs-"+props.appconfig.theme}
      />
    </div>
  )
}

const CustomNode = (props)=>{

  let [_id, _idState] = React.useState({
    value:props._id,
    index:0
  })

  function chageIndex(e){
    _id.index = e.target.value
    _idState({
      ..._id
    })
  }

  function updateCode(e){
    window.layers[props.id].arguments.code.value = e;
    window.layersState({
      ...window.layers
    })
  }

  function updateName(e){
    window.layers[props.id].name = e.target.value;
    window.layers[props.id].width = e.target.value.length * 10;
    window.layersState({
      ...window.layers
    })
  }

  function updateNodeName(e){
    _idState({
      value:e.target.value
    })
  }

  async function saveAndExit(e){
    POST({
      path:'node/build',
      data:{
        code:window.layers[props.id].arguments.code.value
      }
    }).then(response=>response.json()).then(data=>{

      props.layerGroups.custom.layers = props.layerGroups.custom.layers.filter(layer=>{
        return layer.name !== props._id && layer.name !== _id.value 
      })

      delete data.arguments['inbound']

      props.layerGroups.custom.layers.push({
        name:_id.value,
        type: { 
          name: "Node", 
          _class: data.id 
        }, 
        arguments: data.arguments
      })
      
      window.layers[props.id]._id = _id.value
      window.layers[props.id].index = _id.index
      window.layersState({
        ...window.layers
      })

      props.layerGroupsState({
        ...props.layerGroups
      })
      props.menuState({
        comp:<div></div>
      })
    })
  }


  return (
    <div className="dataset customNode">
      <div className="head">
        <div style={{height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
          { props.name }
        </div>
        <div className="btn" onClick={saveAndExit} >
          Save
        </div>
      </div>
      <div className="body">
        <Editor
            defaultLanguage="python"
            theme={"vs-"+props.appconfig.theme}
            onChange={updateCode}
            defaultValue={props.arguments.code.value}
        />
        <div className="menu func_menu">
          <div className="name">
            Options
          </div>
          <div className="property">
            <div className="name">
              Name
            </div>
            <input defaultValue={props.name} onKeyUp={updateName} />
          </div>
          <div className="property">
            <div className="name">
              Node Id
            </div>
            <input defaultValue={props._id} onKeyUp={updateNodeName} />
          </div>
          <div className="property">
            <div className="name">
              Index
            </div>
            <input defaultValue={0} type="number" onChange={chageIndex} />
          </div>
        </div>
      </div>
    </div>
  )
}

const Layer = (props) =>{
  return (
    <div className="menu">
      <div className="name">{props.name}</div>
      <div className="properties">
        
        <div className="property" >
          <div className="name"> {props.name} </div>
          <input
            name="id"
            defaultValue={props.name}
            onKeyUp={(e) => {
              window.layers[props.id].name = e.target.value;
              window.layersState({
                ...window.layers
              })
            }}
          />
        </div>

        <div className="property">
          <div className="name"> {props.id} </div>
          <input
            name="id"
            defaultValue={props.id}
          />
        </div>
        {Object.keys(props.arguments).map((property, i) => {
          switch (props.arguments[property].render) {
            case "text":
              return (
                <TextProperty
                  layer_id={props.id}
                  name={property}
                  key={i}

                  layers={window.layers}
                  layersState={window.layersState}
                  menu={props.menu}
                  menuState={props.menuState}
                />
              );
            case "list":
              return (
                <ListProperty
                  layer_id={props.id}
                  name={property}
                  key={i}

                  layers={window.layers}
                  layersState={window.layersState}
                  menu={props.menu}
                  menuState={props.menuState}
                />
              );
            case "checkbox":
              return (
                <CheckboxProperty
                  layer_id={props.id}
                  name={property}
                  key={i}

                  layers={window.layers}
                  layersState={window.layersState}
                  menu={props.menu}
                  menuState={props.menuState}
                />
              );
            default:
              return <div></div>
          }
        })}
      </div>
    </div>
  )
}

const Menu = (props) => {
  let { type } = props;

  switch(type.name){
    case "Dataset":
      return (
        <Dataset 
          {...props}
        />
      )
    case "Custom":
      return (
        <CustomNode 
          {...props}
        />
      )
    default:
      return <Layer {...props} />
  }
};

export default Menu;

import React from "react";
import Editor from "@monaco-editor/react";
import Options from '../data/options';

import { POST } from '../Utils';

import './menu.css'


const TextProperty = (props) =>{
    let property = window.graphdef[props.layer_id].arguments[props.name];
    return (
      <div className="property" >
        <div className="name" > {props.name} </div>
        <input 
          name={props.layer_id+props.name}
          id = {props.layer_id+props.name}
          defaultValue={property.value} 
          onKeyUp={e=>{
              window.graphdef[props.layer_id].arguments[props.name].value = e.target.value;
              window.graphdefState({
                ...window.graphdef
              })
            }
          } 
        />
      </div>
    )
  }
  
const ListProperty = (props) => {
  let property = window.graphdef[props.layer_id].arguments[props.name];
  let options = Options[property.options];

  return (
    <div className="property" >
      <div className="name"> {props.name} </div>
      <select 
        name={props.layer_id+props.name}
        id = {props.layer_id+props.name}
        defaultValue={property.value} 
        onChange={(e)=>{
          window.graphdef[props.layer_id].arguments[props.name].value = e.target.value;
          window.graphdefState({
            ...window.graphdef
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
  let property = window.graphdef[props.layer_id].arguments[props.name];
  let options = Options[property.options];

  function selectBox(e){
    if (window.graphdef[props.layer_id].arguments[props.name].value.lastIndexOf(e.target.name) > -1){
      window.graphdef[props.layer_id].arguments[props.name].value.pop(e.target.name)
    }
    else{
      window.graphdef[props.layer_id].arguments[props.name].value.push(e.target.name)
    }

    window.graphdefState({
      ...window.graphdef
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
                  defaultChecked={ window.graphdef[props.layer_id].arguments[props.name].value.lastIndexOf(option) > -1 }
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
    window.graphdef[id].arguments.dataset.value = e;
    window.graphdefState({
      ...window.graphdef
    })
  }

  React.useEffect(()=>{
    window.graphdef[id].arguments.dataset.value = props.arguments.dataset.value.lastIndexOf("__id__") > 0 ?
      props.arguments.dataset.value.replaceAll(/__id__/g,id)
      :
      props.arguments.dataset.value
      
    window.graphdefState({
      ...window.graphdef
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
    window.graphdef[props.id].arguments.code.value = e;
    window.graphdefState({
      ...window.graphdef
    })
  }

  function updateName(e){
    window.graphdef[props.id].name = e.target.value;
    window.graphdef[props.id].width = e.target.value.length * 10;
    window.graphdefState({
      ...window.graphdef
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
        code:window.graphdef[props.id].arguments.code.value
      }
    }).then(response=>response.json()).then(data=>{

      props.layerGroups.custom.graphdef = props.layerGroups.custom.graphdef.filter(layer=>{
        return layer.name !== props._id && layer.name !== _id.value 
      })

      delete data.arguments['inbound']

      props.layerGroups.custom.graphdef.push({
        name:_id.value,
        type: { 
          name: "Node", 
          _class: data.id 
        }, 
        arguments: data.arguments
      })
      
      window.graphdef[props.id]._id = _id.value
      window.graphdef[props.id].index = _id.index
      window.graphdefState({
        ...window.graphdef
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
              window.graphdef[props.id].name = e.target.value;
              window.graphdefState({
                ...window.graphdef
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

                  graphdef={window.graphdef}
                  graphdefState={window.graphdefState}
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

                  graphdef={window.graphdef}
                  graphdefState={window.graphdefState}
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

                  graphdef={window.graphdef}
                  graphdefState={window.graphdefState}
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

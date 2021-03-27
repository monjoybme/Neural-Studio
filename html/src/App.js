import React from 'react';

import './App.css';
import { layerGroups } from './data/layers'; 


let cursors = {
  line:'crosshair',
  delete:'no-drop',
  normal:'default',
  layer:'cell',
  move:'move'
}

// Toolbar Functions
function downLine (e){
  e.preventDefault()
  document.getElementById("svg-canvas").innerHTML = (
    document.getElementById("svg-canvas").innerHTML +
    ( 
      `<line 
        id='${'line-'+window.__LINE_COUNTER}' 
        x1="${e.pageX}" y1="${e.pageY}" 
        x2="${e.pageX+1}" y2="${e.pageY+1}" 
        stroke="#333" 
        stroke-width="2"
        marker-end="url(#arrow)"
      />`
    )
  ) 
  window.__ACTIVE_LINE__ = {
    line:document.getElementById('line-'+window.__LINE_COUNTER)
  }
  window.__LINE_COUNTER ++;
}
function downDelete (e){
  e.preventDefault()
}

function downLayer (e){
  e.preventDefault()
  let _id = "layer_"+window.__LINE_COUNTER;
  window.layers[_id] = {
    id:_id,
    name:window.__ACTIVE_LAYER__.name,
    pos:{
      x:e.pageX-90,
      y:e.pageY-30
    },
    connections:{
      inbound:[],
      outbound:[]
    },
    arguments:window.__ACTIVE_LAYER__.args
  }
  window.layersState({
    ...window.layers
  })
  window.__LINE_COUNTER ++;
}

function moveNode(e){
  e.preventDefault()
  if (window.__ACTIVE_ELEMENT__){
    // document.getElementById("canvas").style.height =  Math.max(window.innerHeight,e.pageY+50) + "px"
    window.__ACTIVE_ELEMENT__.target.style.left = e.pageX - 80 + 'px'
    window.__ACTIVE_ELEMENT__.target.style.top = e.pageY - 30 + 'px'
    window.__POS__ = {
      x:e.pageX - 80,
      y:e.pageY - 30
    }
    console.log(e.clientY,e.pageY)
  }
}

function moveEdgeEnd(e){
  e.preventDefault()
  if(window.__ACTIVE_LINE__){
    window.__ACTIVE_LINE__.line.x2.baseVal.value = e.pageX;
    window.__ACTIVE_LINE__.line.y2.baseVal.value = e.pageY;
  }
}

let modeFunctions = {
  move:function(){
    // console.log("setting move mode")

    document.getElementById("canvas").onmousemove = moveNode;
    document.getElementById("canvas").onmousedown = undefined;
  },
  line:function(){
    // console.log("setting line mode")
    
    document.getElementById("canvas").onmousemove = moveEdgeEnd;
    document.getElementById("canvas").onmousedown = downLine;
  },
  delete:function(){
    // console.log("setting delete mode")
    
    document.getElementById("canvas").onmousemove = undefined;
    document.getElementById("canvas").onmousedown = downDelete;
  },
  layer:function(){ 
    // console.log("setting layer mode")
    
    document.getElementById("canvas").onmousemove = undefined;
    document.getElementById("canvas").onmousedown = downLayer;
  } ,
  normal:function(){ 
    // console.log("setting normal mode")
    
    document.getElementById("canvas").onmousemove = undefined;
    document.getElementById("canvas").onmousedown = undefined;
  }
}

function setMode(mode){ 
  if (window.__MODE__ !== mode){
    window.__MODE__ = mode
    document.getElementById("canvas").style.cursor = cursors[window.__MODE__]
    if (modeFunctions[mode]){
      modeFunctions[mode]()
    }
  }
  else{
    window.__MODE__ = 'normal'
    document.getElementById("canvas").style.cursor = 'default'

    document.getElementById("canvas").onmousemove = undefined;
    document.getElementById("canvas").onmousedown = undefined;
  }
}

function toolbarHandler(data={mode:undefined,layer:{name:"__LAYER__",args:{}}}){
  if (data.mode === "layer"){  
    if (window.__MODE__ !== "layer"){
      window.__MODE__ = "layer"
      document.getElementById("canvas").style.cursor = cursors[window.__MODE__]
      window.__ACTIVE_LAYER__ = data.layer
      modeFunctions.layer()
    }
    else{
      if (window.__ACTIVE_LAYER__.name === data.layer.name){
        window.__MODE__ = 'normal'
        document.getElementById("canvas").style.cursor = 'default'
        window.__ACTIVE_LAYER__ = { name: undefined }
      }
      else{
        window.__ACTIVE_LAYER__ = data.layer
      }
    }
  }
  else{
    setMode(data.mode)
  }
}

const Menu = (props) =>{
    let [data,dataState] = React.useState({
      name:props.name,
      id:props._id,
      ...props.args
    })
    return (
      <div className='menu' >
        <div className="name">
          {data.name}
        </div>
        <div className="properties">
          {
            Object.keys(data).map((property,i)=>{
              return (
                <div className="property" key={i}>
                  <div> {property} </div>
                  <input 
                    name='id' 
                    defaultValue={data.id} 
                    onKeyUp={e=>dataState({...data,_id:e.target.value})} 
                  />
                </div>
              )
            })
          } 
        </div>    
      </div>
    )
  }
  
const Node = (props) =>{ 
    function dragMouseDown(e) {
      e.target.style.cursor = cursors[window.__MODE__];
      e = e || window.event;
      e.preventDefault();
      if (window.__MODE__ === 'line'){
        window.__NEW_EDGE__ = {
          out:e.target.parentElement
        }
      }
      else if (window.__MODE__ === "delete"){
        let inbound = window.layers[props.layer.id].connections.inbound;
        let outbound = window.layers[props.layer.id].connections.outbound;
        
        inbound.forEach(layer=>{
          window.layers[layer].connections.outbound.pop(props.layer.id);
          window.layers[layer].connections.outbound = [
            ...window.layers[layer].connections.outbound ,
            ...outbound
          ] 
        })

        outbound.forEach(layer=>{
          window.layers[layer].connections.inbound.pop(props.layer.id);
          window.layers[layer].connections.inbound = [
            ...window.layers[layer].connections.inbound ,
            ...inbound
          ]
        })
        
        delete window.layers[props.layer.id]
        window.layersState({
          ...window.layers
        })
      }
      else {
        window.__ACTIVE_ELEMENT__ = {
          target : e.target.parentElement
        }
      }
    }
  
    function mouseUp(e){
      e.target.style.cursor = cursors[window.__MODE__];
      if (window.__MODE__ === 'line' && window.__NEW_EDGE__){
        window.__NEW_EDGE__['in'] = e.target.parentElement
      }
    }
  
    function menuToggle(e){
      props.menuState({
        comp:<div />
      })
      props.menuState({
        comp:<Menu x={e.pageX} y={e.pageY} name={e.target.innerText} _id={props.layer.id} args={props.layer.args}/>
      })
    }
  
    let width = Math.max(10 + ( props.layer.name.length * 12 ),180)
  
    return (
      <div id={'node-'+props.layer.id} className='node' 
          onMouseUp={mouseUp} 
          onMouseOver={e=>{e.target.style.cursor = cursors[window.__MODE__]}}
  
          style={{
            top:props.layer.pos.y+'px',
            left:props.layer.pos.x+'px',
            width:`${width}px`
          }} 
          key={props._key}
        >
        <div className='name' 
          id={'name'+props.layer.id}
  
          onMouseDown={dragMouseDown}
          onDoubleClick={menuToggle}
  
          style={{width:`${width-10}px`}} 
        >
          {props.layer.name}
        </div>
      </div>
    )
  }

const App = (props) =>{
  let [layers,layersState] = React.useState({
    
  })

  let [menu,menuState] = React.useState({
    comp:<div />
  })

  let [l,lState] = React.useState({
    layerGroups:Object.keys(layerGroups),
    ...layerGroups
  })
  

  function mouseCleanUp(e){
    if (window.__ACTIVE_LINE__ ){
      if (window.__NEW_EDGE__){
        let edge = window.__NEW_EDGE__;
        if (edge.in && edge.out && edge.in !== edge.out){
          let inNode = edge.in.id.split("-")[1],outNode = edge.out.id.split("-")[1];
          // console.log(edge)
          layers[inNode].connections.inbound.push(outNode);
          layers[outNode].connections.outbound.push(inNode);
          document.getElementById('svg-canvas').removeChild(window.__ACTIVE_LINE__.line);
          layersState({
            ...layers
          })
          window.__NEW_EDGE__ = undefined;
        }
        else{
          document.getElementById('svg-canvas').removeChild(window.__ACTIVE_LINE__.line);
        }
      }
      else{
        document.getElementById('svg-canvas').removeChild(window.__ACTIVE_LINE__.line);
      }
    }
    else if (window.__ACTIVE_ELEMENT__){
      if (window.__POS__){
        let layer = window.__ACTIVE_ELEMENT__.target.id.split("-")[1]
        layers[layer].pos = window.__POS__
        layersState({
          ...layers
        })
      }
    }
    window.__ACTIVE_ELEMENT__ = undefined;
    window.__ACTIVE_LINE__ = undefined;

    menuState({
      comp:<div />
    })
  }

  function toggleSection(e){
    l[e.target.id].visible = ~l[e.target.id].visible;
    lState({
      ...l
    })
  }

  const LayerGroupCollapsed = (props) =>{ 
    return (
      <div className='layers' key={props.i} style={{height:"45px",padding:"0 10px 0 10px"}}>
        <div 
          className='name' 
          id={props.id} 
          style={{height:"45px"}} 
          onClick={props.toggleSection}
        > 
          {props.layerGroup.name}
        </div>
      </div>
    )
  }

  const LayerGroupOpen = (props) =>{
    return (
      <div className='layers' key={props.i}>
        <div className='name' 
          id={props.id} 
          onClick={props.toggleSection}
        > 
          {props.layerGroup.name}
        </div>
            <div className='grid'>
            {
              props.layerGroup.layers.map((layer,j)=>{
                return (
                  <div className='btn' onClick={e=>{toolbarHandler({mode:"layer",layer:layer})}} id='btn-del' key={j}> 
                    {layer.name} 
                  </div>
                )
              })
            }  
          </div>
      </div>
    )
  }

  async function buildModel(e){
    await fetch(
      "http://localhost/build",
      {
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...layers })
      }
    )
    .then(response=>response.json())
    .then(data=>console.log(data))
  }

  React.useEffect(()=>{ 
    let svgCanvas = document.getElementById("svg-canvas");
    Array(...svgCanvas.children).forEach(edge=>svgCanvas.removeChild(edge));
    svgCanvas.innerHTML = `<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                            markerWidth="3.5" markerHeight="3.5"
                            orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" />
                          </marker>`
    Object.keys(layers).forEach(layer=>{
      layers[layer].connections.inbound.forEach((inbound,i)=>{
        if (document.getElementById(`${inbound}->${layer}`)){ 
          // document.getElementById(`${inbound}->${layer}`).onclick = removeEdge;
         }
        else{
          document.getElementById("svg-canvas").innerHTML = (
            document.getElementById("svg-canvas").innerHTML +
            (
              `<line id='${inbound}->${layer}' 
                x1="${layers[inbound].pos.x+85}" y1="${layers[inbound].pos.y+58}" 
                x2="${layers[layer].pos.x+85}" y2="${layers[layer].pos.y}" 
                stroke="#333" 
                stroke-width="2"
                marker-end="url(#arrow)"
              />` 
            )
          )
        }
      })
    });

    window.layers = layers
    window.layersState = layersState

  },[layers,layersState])

  return (
    <div style={{overflow:"scroll"}}> 
      {menu.comp}
      <div className='nav'>
        <div className='title'>
          Tensorflow Builder 1.0.0
        </div>
        <div className='toolbar'>
          <div className='row'>
            <div className='btn named' onClick={e=>{toolbarHandler({mode:"delete"})}} id='btn-del'> 
              Delete
            </div>
            <div className='btn named' onClick={e=>{toolbarHandler({mode:"line"})}} id='btn-lin'> 
              Edge
            </div>
            <div className='btn named' onClick={e=>{toolbarHandler({mode:"move"})}} id='btn-del'> 
              Move
            </div>
            <div className='btn named' onClick={e=>{toolbarHandler({mode:"normal"})}} id='btn-del'> 
              Normal
            </div>
          </div>
        </div>
        <div className="layergroups">
        {
          l.layerGroups.map((layerGroup,i)=>{
            return (
              l[layerGroup].visible ? 
                <LayerGroupOpen key={i} i={i} id={layerGroup} layerGroup={l[layerGroup]} toggleSection={toggleSection} /> 
              : 
                <LayerGroupCollapsed key={i} i={i} id={layerGroup} layerGroup={l[layerGroup]} toggleSection={toggleSection} />
            )
          })
        }
        </div>
        <div className="bbtn" onClick={buildModel}>
          Build
        </div>
      </div>
      <div id='canvas' className="canvas" 
        // onMouseDown={mouseDown} 
        onMouseUp={mouseCleanUp}
      >
        {
          Object.keys(layers).map((layer,i)=>{
            return <Node  layer={layers[layer]} key={i} menuState={menuState} />
          })
        }
        <svg xmlns="http://www.w3.org/2000/svg" id='svg-canvas'>
        </svg>
      </div>
    </div>
  )
}

export default App;
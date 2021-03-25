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

const Menu = (props) =>{
  let [data,dataState] = React.useState({
    name:props.name
  })

  return (
    <div className='menu' style={{left:props.x,top:props.y}}>
      <div>
        <input name='name' defaultValue={data.name} onKeyUp={e=>dataState({...data,name:e.target.value})} />
      </div>    
    </div>
  )
}

const Node = (props) =>{
  function dragMouseDown(e) {
    e.target.style.cursor = cursors[window.__MODE__];
    e = e || window.event;
    e.preventDefault();
    if (window.__MODE__ === 'move' || window.__MODE__ === 'delete'){
      window.__ACTIVE_ELEMENT__ = {
        target : e.target.parentElement
      }
    }
    else if (window.__MODE__ === 'line'){
      window.__NEW_EDGE__ = {
        out:e.target.parentElement
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
      comp:<Menu x={e.pageX} y={e.pageY} name={e.target.innerText} />
    })
  }

  return (
    <div id={'node-'+props.layer.id} className='node' 
        onMouseUp={mouseUp} 
        onMouseOver={e=>{e.target.style.cursor = cursors[window.__MODE__]}}

        style={{
          top:props.layer.pos.y+'px',
          left:props.layer.pos.x+'px',
        }} 
        key={props._key}
      >
      <div className='name' 
        id={'name'+props.layer.id}
        onMouseDown={dragMouseDown}
        onDoubleClick={menuToggle} 
      >
        {props.layer.name}
      </div>
    </div>
  )
}

const App = (props) =>{
  let [layers,layersState] = React.useState({
    'dense_1':{
      id:'dense_1',
      name:'Dense 1',
      pos:{
        x:600,
        y:0
      },
      connections:{
        inbound:[],
        outbound:[]
      }
    },
    'dense_2':{
      id:'dense_2',
      name:'Dense 2',
      pos:{
        x:400,
        y:300
      },
      connections:{
        inbound:['dense_1'],
        outbound:[]
      }
    },
    'dense_3':{
      id:'dense_3',
      name:'Dense 3',
      pos:{
        x:800,
        y:300
      },
      connections:{
        inbound:[],
        outbound:[]
      }
    },
    'dense_4':{
      id:'dense_4',
      name:'Dense 4',
      pos:{
        x:600,
        y:600
      },
      connections:{
        inbound:['dense_1'],
        outbound:[]
      }
    },
  })

  let [menu,menuState] = React.useState({
    comp:<div />
  })

  let [l,lState] = React.useState({
    layerGroups:Object.keys(layerGroups),
    ...layerGroups
  })

  function removeEdge(e){
    console.log(e);
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
        if (document.getElementById(`${inbound}->${layer}`)){  }
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
          document.getElementById(`${inbound}->${layer}`).onmousedown = removeEdge
        }
      })
    });
  },[layers,])

  function mouseMove(e ){
    e.preventDefault()
    if (window.__MODE__ === 'move'){
      if (window.__ACTIVE_ELEMENT__){
        let element = window.__ACTIVE_ELEMENT__.target;
        element.style.left = e.pageX - 80 + 'px'
        element.style.top = e.pageY - 30 + 'px'
        window.__POS__ = {
          x:e.pageX - 80,
          y:e.pageY - 30
        }
      }
    }
    else if(window.__MODE__ === 'line' && window.__ACTIVE_LINE__){
      window.__ACTIVE_LINE__.line.x2.baseVal.value = e.pageX;
      window.__ACTIVE_LINE__.line.y2.baseVal.value = e.pageY;
    }
  }
  
  function mouseDown(e){
    if (window.__MODE__ === 'line'){
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
    else if (window.__MODE__ === 'delete'){
      if (window.__ACTIVE_ELEMENT__){
        console.log(window.__ACTIVE_ELEMENT__)
        window.__ACTIVE_ELEMENT__.target.parentElement.removeChild(
          window.__ACTIVE_ELEMENT__.target
        )
        window.__ACTIVE_ELEMENT__ = undefined
      }
    }
    else if (window.__MODE__ === 'layer'){
      let _id = "layer_"+window.__LINE_COUNTER;
      layers[_id] = {
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
      layersState({
        ...layers
      })
      window.__LINE_COUNTER ++;
    }
  }

  function mouseCleanUp(e){
    if (window.__ACTIVE_LINE__ ){
      if (window.__NEW_EDGE__){
        let edge = window.__NEW_EDGE__;
        if (edge.in && edge.out && edge.in !== edge.out){
          let inNode = edge.in.id.split("-")[1],outNode = edge.out.id.split("-")[1];
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

  // Toolbar

  function setMode(mode){
    if (window.__MODE__ !== mode){
      window.__MODE__ = mode
      document.getElementById("canvas").style.cursor = cursors[window.__MODE__]
    }
    else{
      window.__MODE__ = 'normal'
      document.getElementById("canvas").style.cursor = 'default'
    }
  }

  function toolbarHandler(data={mode:undefined,layer:{name:"__LAYER__",args:{}}}){
    if (data.mode === "layer"){
      if (window.__MODE__ !== "layer"){
        window.__MODE__ = "layer"
        document.getElementById("canvas").style.cursor = cursors[window.__MODE__]
        window.__ACTIVE_LAYER__ = data.layer
      }
      else{
        window.__MODE__ = 'normal'
        document.getElementById("canvas").style.cursor = 'default'
        window.__ACTIVE_LAYER__ = { name: undefined }
      } 
      // window.__MODE__ = data.mode
      // document.getElementById("canvas").style.cursor = cursors[window.__MODE__]
    }
    else{
      setMode(data.mode)
    }
  }

  return (
    <div>
      {menu.comp}
      <div className='nav'>
        <div className='title'>
          Tensorflow Builder 1.0.0
        </div>
        <div className='toolbar'>
          <div className='row'>
            <div className='btn-33 named' onClick={e=>{toolbarHandler({mode:"delete"})}} id='btn-del'> 
              Eraser
            </div>
            <div className='btn-33 named' onClick={e=>{toolbarHandler({mode:"line"})}} id='btn-lin'> 
              Edge
            </div>
            <div className='btn-33 named' onClick={e=>{toolbarHandler({mode:"move"})}} id='btn-del'> 
              Move
            </div>
          </div>
        </div>

        {
          l.layerGroups.map((layerGroup,i)=>{
            return(
              <div className='layers' key={i}>
                <div className='name'>{layerGroup}</div>
                <div className='grid'>
                  {
                    l[layerGroup].layers.map((layer,j)=>{
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
          })
        }
      </div>
      <div id='canvas' className="canvas" 
        onMouseMove={mouseMove} 
        onMouseDown={mouseDown} 
        onMouseUp={mouseCleanUp}
      >
        {
          Object.keys(layers).map((layer,i)=>{
            return <Node  layer={layers[layer]} key={i} menuState={menuState} />
          })
        }
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" id='svg-canvas'>
        </svg>
      </div>
    </div>
  )
}

export default App;
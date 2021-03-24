import React from 'react';
import './App.css';

let cursors = {
  line:'crosshair',
  delete:'no-drop',
  normal:'default',
  layer:'cell'
}

const Node = (props) =>{
  function dragMouseDown(e) {
    e.target.style.cursor = cursors[window.__MODE__];
    e = e || window.event;
    e.preventDefault();
    if (window.__MODE__ === 'normal' || window.__MODE__ === 'delete'){
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
      <div className='name' onMouseDown={dragMouseDown} >
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
        x:400,
        y:0
      },
      connections:{
        inbound:[],
        outbound:['dense_2']
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
        inbound:[],
        outbound:[]
      }
    },
    'dense_3':{
      id:'dense_3',
      name:'Dense 3',
      pos:{
        x:600,
        y:300
      },
      connections:{
        inbound:[],
        outbound:[]
      }
    },
  })

  React.useEffect(()=>{
    Object.keys(layers).forEach(layer=>{
      layers[layer].connections.inbound.forEach((inbound,i)=>{
        document.getElementById("svg-canvas").innerHTML = (
          document.getElementById("svg-canvas").innerHTML +
          (
            `<line id='${'line-'+window.__LINE_COUNTER}' 
            x1="${layers[inbound].pos.x+90}" y1="${layers[inbound].pos.y+50}" 
            x2="${layers[layer].pos.x+90}" y2="${layers[layer].pos.y+10}" 
            stroke="#333" strokeWidth="10" />` 
          )
         ) 
        window.__LINE_COUNTER ++;
        })
    })

  },[layers,])

  function mouseMove(e ){
    e.preventDefault()
    if (window.__MODE__ === 'normal'){
      if (window.__ACTIVE_ELEMENT__){
        let element = window.__ACTIVE_ELEMENT__.target;
        element.style.left = e.pageX - 80 + 'px'
        element.style.top = e.pageY - 30 + 'px'

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
          `<line id='${'line-'+window.__LINE_COUNTER}' 
          x1="${e.pageX}" y1="${e.pageY}" x2="${e.pageX+1}" y2="${e.pageY+1}" 
          stroke="#333" strokeWidth="10" 
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
        name:"Layer",
        pos:{
          x:e.pageX-90,
          y:e.pageY-30
        },
        connections:{
          inbound:[],
          outbound:[]
        }
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
        if (edge.in && edge.out && edge.in != edge.out){
          window.__ACTIVE_LINE__.line.x1.baseVal.value = edge.out.offsetLeft + 80;
          window.__ACTIVE_LINE__.line.y1.baseVal.value = edge.out.offsetTop + 58;

          window.__ACTIVE_LINE__.line.x2.baseVal.value = edge.in.offsetLeft + 80;
          window.__ACTIVE_LINE__.line.y2.baseVal.value = edge.in.offsetTop + 5;
        }
        else{
          document.getElementById('svg-canvas').removeChild(window.__ACTIVE_LINE__.line);
        }
      }
      else{
        document.getElementById('svg-canvas').removeChild(window.__ACTIVE_LINE__.line);
      }
    }
      window.__ACTIVE_ELEMENT__=undefined;
      window.__ACTIVE_LINE__=undefined;
  }

  // Toolbar


  function deleteMode(e){
    if (window.__MODE__ !== 'delete'){
      window.__MODE__ = 'delete'
      document.getElementById("canvas").style.cursor = cursors[window.__MODE__]
    }
    else{
      window.__MODE__ = 'normal'
      document.getElementById("canvas").style.cursor = 'default'
    }
  }

  function drawLineMode(e){
    if (window.__MODE__ !== 'line'){
      window.__MODE__ = 'line'
      document.getElementById("canvas").style.cursor = cursors[window.__MODE__]
    }
    else{
      window.__MODE__ = 'normal'
      document.getElementById("canvas").style.cursor = 'default'
    }
  }

  function layerMode(e){
    if (window.__MODE__ !== 'layer'){
      window.__MODE__ = 'layer'
      document.getElementById("canvas").style.cursor = cursors[window.__MODE__]
    }
    else{
      window.__MODE__ = 'normal'
      document.getElementById("canvas").style.cursor = 'default'
    }
  }

  return (
    <div>
      <div className='nav'>
        <div className='title'>
          Tensorflow Builder 1.0.0
        </div>
        <div className='toolbar'>
          <div className='row'>
            <div className='btn-50' onClick={deleteMode} id='btn-del'> 
              ⭕
            </div>
            <div className='btn-50' onClick={drawLineMode} id='btn-lin'> 
              ➡
            </div>
          </div>
          <div className='row'>
            <div className='btn-100 named' onClick={layerMode} id='btn-del'> 
              Layer
            </div>
          </div>
        </div>
      </div>
      <div id='canvas' className="canvas" 
        onMouseMove={mouseMove} 
        onMouseDown={mouseDown} 
        onMouseUp={mouseCleanUp}
      >
        {
          Object.keys(layers).map((layer,i)=>{
            return <Node  layer={layers[layer]} key={i} />
          })
        }
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" id='svg-canvas'>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="3.5" markerHeight="3.5"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>

        </svg>
      </div>
    </div>
  )
}

export default App;
import React from 'react';

import './App.css';


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function hideEgdeGroups(layers=[],layername='__LAYER__'){
  layers.forEach(layer=>{
    if (layer !== window.__ACTIVE_LAYER__){
      document.getElementById(layer+'edgesin').style.visibility='hidden';
      document.getElementById(layer+'edgesout').style.visibility='hidden';
    }
  })
  window.__ACTIVE_LAYER__ = '__LAYER__';
}

function newEdge(e){
  console.log(e);
}

const Layer = (props) =>{

  function showEdges(e) {
    window.__ACTIVE_LAYER__ = props.id;
    if (e.target.className === 'head'){
      e.target.nextElementSibling.style.visibility='visible';
      e.target.previousElementSibling.style.visibility='visible';
    }
  }

  function hideEdges(e) {
    window.__ACTIVE_LAYER__ = '__LAYER__';
    if (e.target.className === 'head'){
      e.target.nextElementSibling.style.visibility='hidden';
      e.target.previousElementSibling.style.visibility='hidden';
    }
  }

  return (
    <div id={props.id} className='layer' key={props.i} onClick={showEdges} >
      <div id={props.id+'edgesin'} className="edgegroup egi">
        
      </div>
      <div id={props.id+"header"} className='head'>{props.name}</div>
      <div id={props.id+'edgesout'} className="edgegroup ego" onMouseDown={newEdge}>
        
      </div>
    </div>
  )
}

function handleMouseDown(e){
  window.__MOUSE_ACTION__ = 'down'
}

function handleMouseUp(e){
  window.__MOUSE_ACTION__ = undefined;
}

function handleMouseMove(e){
  if (window.__MOUSE_ACTION__ == 'down'){
    console.log(e.pageX);
  }
}

const App = (props) =>{

  let _layers = [];
  let layers = [
    {
      id:'dense_1',
      name:'Dense'
    },
    {
      id:'dense_2',
      name:'Dense'
    }
  ]

  React.useEffect(()=>{
    _layers.forEach(_id=>{
      dragElement(document.getElementById(_id));
    })

    window.__ACTIVE_LAYER__ = '__LAYER__'
    window.__MOUSE_ACTION__ = undefined;
    window.__ACTIVE_ELEMENT__ = undefined;

  },[])

  return (
    <div className="canvas" onClick={(e)=>{hideEgdeGroups(_layers)}} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {
        layers.map((layer,i)=>{
          _layers.push(layer.id);
          return <Layer id={layer.id} name={layer.name} key={i} /> 
        })
      }
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" id='canvas'>
        
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
          markerWidth="3.5" markerHeight="3.5"
          orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>

      
    </svg>
    </div>
  )
}

export default App;
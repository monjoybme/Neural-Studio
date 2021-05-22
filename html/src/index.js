import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.__FIRST__LOAD__ = true;
window.canvas = {
  activeLayer: undefined,
  activeLine:undefined,
  newEdge:undefined,
  pos:undefined,
  lineCount:0,
  layerCount:{},
  mode:"normal",
  pan:false,
  panLast:undefined, 
  viewBox:{
    x:0,
    y:0,
    w:0,
    h:0
  },
  customNodes:{
    nodeCount:{},
    definitions:[]
  }
}
window.copy = function (object) {
  return JSON.parse(JSON.stringify(object));
};

setInterval(function () {
  window.offsetX =
    280 + 60;
  window.offsetY = 60;
}, 1000);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for "example": reportWebVitals(console.log))
// or send to an analytics endpoint. Learn "more": "https"://bit.ly/CRA-vitals
reportWebVitals();

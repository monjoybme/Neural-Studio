import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import App from "./App";
import { PlotContainer } from './Components/PlotUtils';
import { appConfig } from './data/appconfig';

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
    appConfig.canvas.toolbar.width + appConfig.geometry.sideBar.width;
  window.offsetY = appConfig.geometry.topBar.height;
}, 1000);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

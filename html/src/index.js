import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

window.__ACTIVE_LAYER__ = { name:undefined }
window.__MOUSE_ACTION__ = undefined;
window.__ACTIVE_ELEMENT__ = undefined;
window.__ACTIVE_LINE__ = undefined;
window.__EDGE__ = undefined
window.__NEW_EDGE__ = undefined
window.__LINE_COUNTER = 0
window.__LAYER_COUNT = {}
window.__MODE__ = 'normal'
window.__POS__ = undefined
window.__ACTIVE_LAYER__ = undefined

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from "react";
import Training from '../Training';
import Editor from "@monaco-editor/react";

import "./code.css"

const CodeEditor = (props) => {

  let [comp,compState] = React.useState({
    state:true
  })

  let [ halt,haltState ] = React.useState({
    state:true,
    name:"Pause",
  })

    async function trainModel(e) {
      // window.__TRAIN__ = true;
      // await fetch(
      //   "http://localhost/train/start",
      //   {
      //     method:"POST",
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ ...props.layers })
      //   }
      // )
      // .then(response=>response.json())
      // .then(data=>{
      //   window.__TRAIN__ = true
      //   compState({
      //     state:false
      //   })
      // })
    }

    async function haltModel(e) {
      await fetch(
        "http://localhost/train/halt",
        {
          method:"POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...halt })
        }
      )
      .then(response=>response.json())
      .then(data=>{

      })
      if (halt.state) {
        halt.name = "Resume"
        halt.state = false
      }else{
        halt.name = "Pause"
        halt.state = true
      }
      haltState({
        ...halt
      })

    }

    async function stopModel(e) {
      window.__TRAIN__ = true;
      await fetch(
        "http://localhost/train/stop",
        {
          method:"POST",
        }
      )
      .then(response=>response.json())
      .then(data=>{
        console.log(data)
      })
    }

    function downloadCode(e) {
      let link = document.createElement("a");
      link.href = `data:text/x-python,${encodeURIComponent(props.code.data)}`;
      link.download = 'train.py'
      link.click()
    }

    return (
      <div className="tfcode">
        <div className="menubar">
            <div className="btn" onClick={downloadCode}>
                Download
            </div>
            <div className="btn" onClick={trainModel}>
                Train
            </div>
            <div className="btn" onClick={haltModel}>
                {halt.name}
            </div>
            <div className="btn" onClick={stopModel}>
                Stop
            </div>
        </div>
        {
          comp.state ?
            <Editor
              height="90vh"
              defaultLanguage="python"
              defaultValue={props.code.data}
              onChange={e=>console.log(e)}
            />
            :
            <Training />
        }
      </div>
    );
  };
  
  export default CodeEditor;
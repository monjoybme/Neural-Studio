import React from "react";
import Training from '../Training';
import Editor from "@monaco-editor/react";

import "./code.css"

const CodeEditor = (props) => {

  let [comp,compState] = React.useState({
    state:true
  })

    async function trainModel(e) {
      window.__TRAIN__ = true;
      await fetch(
        "http://localhost/train",
        {
          method:"POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...props.layers })
        }
      )
      .then(response=>response.json())
      .then(data=>{
        window.__TRAIN__ = true
        compState({
          state:false
        })
      })
    }

    return (
      <div className="tfcode">
        <div className="menubar">
            <div className="btn">
                Download
            </div>
            <div className="btn" onClick={trainModel}>
                Train
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
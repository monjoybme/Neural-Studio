import React from "react";
import Training from '../Training';
import Editor from "@monaco-editor/react";

import "./code.css"

const CodeEditor = (props) => {

  let [ halt,haltState ] = React.useState({
    state:true,
    name:"Pause",
  })
  let { code, codeState } = props;

  
  async function buildCode(e) {
    await fetch(
      "http://localhost/build",
      {
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...props.layers })
      }
    )
    .then(response=>response.json())
    .then(data=>{
      if (data.code !== code.data){
        codeState({
          data:data.code
        })
      }
    })
  }

  React.useEffect(()=>{
    buildCode()
    window.__TRAIN__ = false;
  },[code,codeState])

    return (
      <div className="tfcode">
        <Editor
          defaultLanguage="python"
          defaultValue={code.data}
        />
      </div>
    );
  };
  
  export default CodeEditor;

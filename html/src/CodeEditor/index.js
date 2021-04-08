import React from "react";
import Training from '../Training';
import Editor from "@monaco-editor/react";

import "./code.css"

const CodeEditor = (props={layers:{}}) => {

  let [code,codeState] = React.useState({
    data:"",
    fetched:true
  })

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
      codeState({
        data:data.code,
        fetched:false
      })
    })
  }

  React.useEffect(()=>{
    if ( code.data.length === 0 ){
      buildCode()
    }
  },[])

    return (
      <div className="tfcode">
      {
        code.fetched ?
          undefined
        :
          <Editor
            defaultLanguage="python"
            defaultValue={code.data}
          />         
      }
      </div>
    );
  };
  
  export default CodeEditor;

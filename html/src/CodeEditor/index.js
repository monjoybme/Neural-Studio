import React from "react";
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
    clearTimeout(window.__UPDATE_TIMEOUT__)
  },[])

    return (
      <div className="container">
      {
        code.fetched ?
          undefined
        :
          <Editor
            defaultLanguage="python"
            defaultValue={code.data}
            onValidate={e=>console.log(e)}
            theme={"vs-light"}
          />         
      }
      </div>
    );
  };
  
  export default CodeEditor;

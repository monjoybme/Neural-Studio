import React, { useState, useEffect } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

import "./code.css"

const CodeEditor = (props) => {
    React.useEffect(async function(){
        
    })
    return (
      <div className="tfcode">
        <div className="menubar">
            <div className="btn">
                Download
            </div>
            <div className="btn">
                Train
            </div>
        </div>
        <Editor
            height="90vh"
            defaultLanguage="python"
            defaultValue={props.code.data}
            onChange={e=>console.log(e)}
        />
      </div>
    );
  };
  
  export default CodeEditor;
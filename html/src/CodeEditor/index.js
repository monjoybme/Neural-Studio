import React from "react";
import Editor from "@monaco-editor/react";
import { metaStore, metaStoreContext } from "../Meta";
import { GET, } from "../Utils";

const CodeEditor = (
  props = { store: metaStore, storeContext: metaStoreContext }
) => {
  let { appConfig } = props.store;
  let [code, codeState] = React.useState({
    data: undefined,
    fetched: true,
  });
  async function buildCode(e) {
    await GET({
      path: "/model/code",
    })
      .then((response) => response.text())
      .then((data) => {
        codeState({
          data: data,
          fetched: false,
        });
      });
  }

  React.useEffect(() => {
    if (code.data === undefined) {
      buildCode();
    }
  }, [code]);

  return (
    <div className="container">
      {code.fetched ? undefined : (
        <Editor
          defaultLanguage="python"
          defaultValue={code.data}
          onValidate={(e) => console.log(e)}
          theme={"vs-" + appConfig.theme}
        />
      )}
    </div>
  );
};
  
  export default CodeEditor;

import React from "react";
import { PORT, post } from "../Utils";
import { icons } from "../data/icons";

import { metaAppFunctions, metaHome, metaAppData } from "../Meta/index";

const Graph = () => {
  return <svg></svg>;
};

let inferenceApps = {
  image: {
    Classification: (props) => {      
      let [data, dataState] = React.useState({
        imageSrc: undefined,
      });

      async function runInference(){
        await post({
          path : "/model/infer",
        }).then(response=>response.json()).then(response=>{
          console.log(response);
        });
      }

      function readImage(e) {
        let reader = new FileReader();
        reader.onload = function(e) {
          data.imageSrc = e.target.result;
          dataState({ ...data });
          runInference();
        };
        reader.readAsDataURL(e.target.files[0]);
      }

      return (
        <div className="image classification">
          <div className="image-container">
            <div className="upload">
              <input id="image-upload" type="file" onChange={readImage} />
              <label htmlFor="image-upload">Click to upload image</label>
            </div>
            <div className="display">
              <div className="image">
                <img src={data.imageSrc} />
              </div>
            </div>
            <div className="curl">
              <code>
                <span>
                  <span>$ &nbsp;</span> 
                  curl -X POST \
                </span>
                <span>&nbsp;&nbsp; -F "image=@/Users/matt/Desktop/test.jpg" \</span>
                <span>&nbsp;&nbsp; http://localhost:{PORT}/model/infer</span>
              </code>
            </div>
          </div>
          <div className="result-container"></div>
        </div>
      );
    },
  },
};

const Inference = (
  props = {
    appData: metaAppData,
    appFunctions: metaAppFunctions,
  }
) => {
  let Inteference =
    inferenceApps[props.appData.app.config.datatype][
      props.appData.app.config.problemtype
    ];
  React.useEffect(() => {
    console.log("[inference]");
  }, []);
  return (
    <div className="inference container">
      <Inteference />
    </div>
  );
};

export default Inference;

import React from "react";
import { metaAppFunctions, metaAppData } from "../Meta/index";
import { Classification, Segmentation } from "./image";

let inferenceApps = {
  image: {
    Classification: Classification,
    Segmentation: Segmentation
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
    console.log(inferenceApps[props.appData.app.config.datatype]);
  }, []);
  return (
    <div className="inference container">
      <Inteference />
    </div>
  );
};

export default Inference;

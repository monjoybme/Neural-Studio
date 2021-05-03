import React from "react";
import { Loading } from "../Utils";
import { StoreContext } from "../Store";

const SummaryViewer = (props = { graphdef: {}, store: StoreContext }) => {
  let [summary, summaryState] = React.useState({
    data: [],
    fetched: false,
  });
  let { graphdef } = props.store;

  async function getModel(e) {
    await fetch("http://localhost/model/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...graphdef }),
    })
      .then((response) => response.json())
      .then((data) => {
        summaryState({
          data: data.summary,
          fetched: true,
        });
      });
  }

  React.useEffect(() => {
    if (!summary.fetched) {
      getModel();
    }
  });

  return (
    <div className="container summary">
      {summary.data.length < 1 ? (
        <div
          className="load"
          style={{
            width: "100%",
            height: "95vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      ) : (
        <div className="logs summary">
          {summary.data.map((line, i) => {
            return (
              <div key={i} className="log notif sum-col">
                {line.map((col, i) => {
                  return (
                    <div className="col" key={i}>
                      {col}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SummaryViewer;

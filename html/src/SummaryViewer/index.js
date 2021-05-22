import React from "react";
import { GET, Loading } from "../Utils";
import { metaStore ,metaStoreContext } from "../Meta";

const SummaryViewer = (props = { store: metaStore, storeContext:metaStoreContext }) => {
  let [summary, summaryState] = React.useState({
    data: [],
    fetched: false,
  });

  async function getModel(e) {
    await GET({
      path: "/model/summary",
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

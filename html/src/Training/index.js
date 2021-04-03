import React from "react";
import './training.css';

//   let ex = [
//     { type: "notif", data: { message: "Copiling Code" } },
//     { type: "notif", data: { message: "Performing imports" } },
//     { type: "notif", data: { message: "Building Model" } },
//     { type: "notif", data: { message: "Compiling Model" } },
//     { type: "notif", data: { message: "Training Started" } },
//     {
//       type: "epoch",
//       data: {
//         epoch: 0,
//         log: { batch: 174, output: { loss: 0.7051395177841187 } },
//         train: { epochs: 3, batches: 1875 },
//       },
//     },
//     {
//       type: "epoch",
//       data: {
//         epoch: 1,
//         log: { batch: 874, output: { loss: 0.49694427847862244 } },
//         train: { epochs: 3, batches: 1875 },
//       },
//     },
//     {
//       type: "epoch",
//       data: {
//         epoch: 2,
//         log: { batch: 1874, output: { loss: 0.44203028082847595 } },
//         train: { epochs: 3, batches: 1875 },
//       },
//     },
//   ];

const Training = (props = { trainingStatus: [] }) => {
    const [status,statusState] = React.useState({
        data:[]
    })

    async function getStatus() {
        await fetch("http://localhost/status", {
            method: "GET",
        })
            .then((respomse) => respomse.json())
            .then((data) => {
                statusState({
                    data:data.logs
                })
                getStatus()
            })
            .catch((err) => {
                window.__TRAIN__ = false
                clearTimeout(window.__UPDATE_INTERVAL)
            });
            
    }
    React.useEffect(()=>{
        if (window.__UPDATE_RUNNING__ !== true && window.__TRAIN__){
            console.log("Starting Update")
            window.__UPDATE_INTERVAL =  setTimeout(getStatus,10)
            window.__UPDATE_RUNNING__ = true;
        }
    })

//   ex = props.trainingStatus;

  const Notification = (props) =>{
      return (
          <div className="log notif">
              {
                  props.data.message
              }
          </div>
      )
  }

  const Epoch = (props) =>{
      return (
          <div className="log epoch">
              <div className="head">
                <div className="epochname">
                    Epoch : {props.data.epoch+1} / {props.data.train.epochs}
                </div>
                <div className="batch">
                    {props.data.log.batch} / {props.data.train.batches}
                </div>
              </div>
              <div className="progress">
                <div className="bar">
                    <div className="done" style={{width:`${ Math.ceil((props.data.log.batch / props.data.train.batches)*100) }%`}}>

                    </div>
                </div>
              </div>
              <div className="foot">
                {
                    props.data.log.output ? 
                    (
                        <div className="outputs">
                            { Object.keys(props.data.log.output).map((output,i)=>{
                                    return (
                                        <div className="output">
                                            <div className="name">
                                                {output}
                                            </div>
                                            :
                                            <div className="val">
                                                { props.data.log.output[output].toString().slice(0,7) }
                                            </div>
                                        </div>
                                    )
                                }) 
                            }
                        </div>
                    )
                    : undefined
                }
              </div>
          </div>
      )
  }

  return (
    <div className="training">
      <div className="title">Training</div>
      <div className="logs">
        {
            status.data.map((log,i)=>{
                switch(log.type){
                    case "notif":
                        return <Notification data={log.data} key={i} />
                    case "epoch":
                        return <Epoch data={log.data} key={i} />

               }
            })
        }
      </div>
    </div>
  );
};

export default Training;

import React, { useDebugValue } from "react";
import './training.css';

const Training = (props = { trainingStatus: [] }) => {
    const [status,statusState] = React.useState({
        data:[],
        ended:false
    })

    async function getStatus() {
        await fetch("http://localhost/status", {
            method: "GET",
        })
            .then((respomse) => respomse.json())
            .then((data) => {
                statusState({
                    data:data.logs,
                    ended:data.logs[data.logs.length-1].data.ended,
                })
                if (data.logs[data.logs.length-1].data.ended){
                    console.log("Training Ended")
                    window.__TRAIN__ = false
                    window.__UPDATE_RUNNING__ = false;
                    clearTimeout(window.__UPDATE_INTERVAL)
                }else{
                    setTimeout(getStatus,10)
                }
            })
            .catch((err) => {
                console.log(err)
                window.__TRAIN__ = false
                window.__UPDATE_RUNNING__ = false;
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
            <div className="upper">
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
                </div>
            <div className="lower">
                {
                    props.data.log.output ? 
                    (
                        <div className="outputs">
                            { Object.keys(props.data.log.output).map((output,i)=>{
                                    return (
                                        <div className="output" key={i}>
                                            <div className="name">
                                                {output}
                                            </div>
                                            &nbsp;:&nbsp;
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

  React.useEffect(()=>{
    var elem = document.getElementById('logs');
    elem.scrollTop = elem.scrollHeight;
  })

  return (
    <div className="training">
      <div className="title">Training</div>
      <div className="logs" id="logs">
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
        {
            status.ended ? 
            (
                <div className="log buttons">
                    <div className='btn'>    
                        Download Model
                    </div>
                    <div className='btn'>    
                        Download Inference
                    </div>
                </div>
            ) 
            :
            (
                undefined
            )
        }
      </div>
    </div>
  );
};

export default Training;

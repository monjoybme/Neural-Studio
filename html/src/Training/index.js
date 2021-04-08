import React, { useDebugValue } from "react";
import './training.css';

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

const Training = (props = { trainingStatus: [] }) => {
    let [status,statusState] = React.useState({
        data:[],
        ended:false
    })

    let [halt,haltState] = React.useState({
        name:"Pause",
        state:true
    })   
    
    let { layers, layersState } = props;

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
                    window.__TRAINING__ = false;
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

    async function trainModel(e) {
      window.__TRAINING__ = true;
      await fetch(
        "http://localhost/train/start",
        {
          method:"POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...layers })
        }
      )
      .then(response=>response.json())
      .then(data=>{
        if (window.__UPDATE_RUNNING__){

        }
        else{
            getStatus()
        }
      })
    }

    async function haltModel(e) {
      await fetch(
        "http://localhost/train/halt",
        {
          method:"POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...halt })
        }
      )
      .then(response=>response.json())
      .then(data=>{

      })
      if (halt.state) {
        halt.name = "Resume"
        halt.state = false
      }else{
        halt.name = "Pause"
        halt.state = true
      }
      haltState({
        ...halt
      })

    }

    async function stopModel(e) {
      window.__TRAIN__ = true;
      await fetch(
        "http://localhost/train/stop",
        {
          method:"POST",
        }
      )
      .then(response=>response.json())
      .then(data=>{
        console.log(data)
        window.__TRAIN__ = false
      })
    }

    function downloadCode(e) {
      let link = document.createElement("a");
      link.href = `data:text/x-python,${encodeURIComponent(props.code.data)}`;
      link.download = 'train.py'
      link.click()
    }

    React.useEffect(()=>{
        if (window.__UPDATE_RUNNING__ !== true && window.__TRAIN__){
            console.log("Starting Update")
            window.__UPDATE_INTERVAL =  setTimeout(getStatus,10)
            window.__UPDATE_RUNNING__ = true;
        }
    })

//   ex = props.trainingStatus;

  React.useEffect(()=>{
    var elem = document.getElementById('logs');
    elem.scrollTop = elem.scrollHeight;
    if (window.__TRAINING__){
        if (window.__UPDATE_RUNNING__){

        }else{
            window.__UPDATE_RUNNING__ = true
            getStatus()
        }
    }
  })

  return (
    <div className="training">
        <div className="menu">
            <div className="title">Training</div>
            <div className="buttons">
                <div className="btn" onClick={trainModel}>
                    Start
                </div>
                <div className="btn" onClick={haltModel}>
                    {halt.name}
                </div>
                <div className="btn" onClick={stopModel}>
                    Stop
                </div>
            </div>
        </div>
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

import React from "react";
import { icons } from '../data/icons';
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

const Error = (props) =>{
    // console.log(props)
    return (
        <div className="log error">
            <div className="message">
                {props.data.error}
            </div>
            <pre>
                <code>
                    {props.data.code}
                </code>
            </pre>
        </div>
    )
}

const Output = (props) =>{
    return (
        <div className="log outvis">
            <div>
                Epoch Output | Type : {props.data.type}
            </div>
            <img src={props.data.value} />
        </div>
    )
}

const Training = (props = { train:{ training:false, hist:[], }, trainState:undefined ,layers:{}, layerState:undefined, }) => {
    
    let [status,statusState] = React.useState({
        data:props.train.hist !== undefined ? props.train.hist : [] ,
        ended:false,
        updating:false
    })
    let [halt,haltState] = React.useState({
        name:"Pause",
        state:true
    })   
    let { layers } = props;

    async function getStatus() {
        await fetch("http://localhost/status", {
            method: "GET",
        })
            .then((respomse) => respomse.json())
            .then((data) => {
                statusState({
                    data:data.logs,
                    ended:data.logs[data.logs.length-1].data.ended || false,
                    updating:true
                })
                if (data.logs[data.logs.length-1].data.ended){
                    console.log("Training Ended")
                    props.trainState({
                        training:false,
                        hist:data.logs,
                    })
                }else{
                    if (document.getElementById("check")){
                        setTimeout(getStatus,10)
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            });    
    }

    async function trainModel(e) {
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
        props.trainState({
            training:true,
        })
        // getStatus()
        statusState({
            data:[],
            ended:false,
            updating:false
        })
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

    const TrainEnd = (props) =>{
        return (
            <div className="log buttons">
                <div className='btn'>    
                    Download Model
                </div>
                <div className='btn'>    
                    Download Inference
                </div>
            </div>
        )
    }

    React.useEffect(()=>{
        var elem = document.getElementById('logs');
        elem.scrollTop = elem.scrollHeight;
        if (props.train.training){
            if ( status.updating === false ){
                if ( status.ended === false && status.ended !== undefined ){
                    console.log("Starting Update")
                    getStatus()
                }
            }
        }
    })

    let buttons = [
        {
            name: "Start",
            func: trainModel,
            icon: icons.Play
        },
        {
            name: "Pause",
            func: haltModel,
            icon: halt.state ? icons.Pause : icons.Resume ,
        },
        {
            name: "Stop",
            func: stopModel,
            icon: icons.Stop,
        }
    ]

  return (
    <div className="training container">
        <div className="menu">
            <div className="buttons">
                {
                    buttons.map((button,i)=>{
                        let Icon = button.icon;
                        return(
                            <div className="btn" key={i} onClick={button.func}>
                                <Icon />
                            </div>            
                        )
                    })
                }
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
                    case "error":
                        return <Error data={log.data} key={i} />
                    case "output":
                        return <Output data={log.data} key={i} />
                    default:
                        return <div />

               }
            })
        }
        {/* {
            status.ended ? 
            (
                <TrainEnd />
            ) 
            :
            (
                undefined
            )
        } */}
      </div>
      <div id="check">  </div>
    </div>
  );
};

export default Training;


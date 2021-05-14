import React from 'react';
import { icons } from '../data/icons';
import { ReactComponent as Logo } from "../data/images/logo.svg";

import './utils.css'

const PORT = 80
const HOST = "localhost"
const ROOT = `http://${HOST}:${PORT}`

async function POST( options = { path:"/", data:{  }, body: { }  } ){
    let { path, data, } = options;
    let response = await fetch( ROOT + path, 
        {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(data),
        }
    )
    return response;
}

async function GET( options = { path:"/",  } ){
    let { path } = options;
    let response = await fetch( ROOT + path, )
    return response;
}

const Loading = (props) =>{
    return (
        <div className="loading">
            <Logo />
        </div>
    )
}

const Notification = (props={ message:"Hello, World !", type:"message", notificationState:undefined, timeout:10 })=>{
    let ref = React.useRef();
    React.useEffect(function(){
        setTimeout(function(){
            if (ref.current){
                ref.current.setAttribute("class","notification nout");
                setTimeout(function(){
                    props.notificationState({ comp: undefined });
                }, 500)
            }
        }, props.timeout)
    },[])
    return (
      <div className="notification message" ref={ref}>
        <div className="message">
            {props.message}
        </div>
        {/* <div className="close">
            <icons.Close />
        </div> */}
      </div>
    );
}

export { Loading, Notification , POST, GET} 
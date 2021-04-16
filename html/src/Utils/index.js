import React from 'react';
import { ReactComponent as Logo } from "../data/images/logo.svg";

import './utils.css'

async function POST( options = { path:"/", data:{  }, body: { }  } ){
    let { path, data, body } = options;
    let response = await fetch(
        "http://localhost/"+path, 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }
    )
    return response;
}

async function GET( options = { path:"/",  } ){
    let { path } = options;
    let response = await fetch( "http://localhost/"+path, )
    return response;
}

const Loading = (props) =>{
    return (
        <div className="loading">
            <Logo />
        </div>
    )
}

export { Loading , POST, GET} 
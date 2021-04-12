import React from 'react';
import { ReactComponent as Logo } from "../data/images/logo.svg";

import './utils.css'

const Loading = (props) =>{
    return (
        <div className="loading">
            <Logo />
        </div>
    )
}

export default Loading 
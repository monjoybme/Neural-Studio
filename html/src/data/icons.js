import React from "react";
import { ReactComponent as ArrowRight } from "./images/arrow_right.svg";
import { ReactComponent as Logo } from "./images/logo.svg";
import { ReactComponent as Build } from "./images/build.svg";
import { ReactComponent as CheckCircle } from "./images/check_circle.svg";
import { ReactComponent as Close } from "./images/close.svg";
import { ReactComponent as Dashboard } from "./images/dashboard.svg";
import { ReactComponent as DeleteAll } from "./images/delete_all.svg";
import { ReactComponent as Delete } from "./images/delete.svg";
import { ReactComponent as Done } from "./images/done.svg";
import { ReactComponent as Home } from "./images/home.svg";
import { ReactComponent as Info } from "./images/info_black.svg";
import { ReactComponent as Pan } from "./images/pan.svg";
import { ReactComponent as Problem } from "./images/problem.svg";
import { ReactComponent as Search } from "./images/search.svg";
import { ReactComponent as Settings } from "./images/settings.svg";
import { ReactComponent as Train } from "./images/train.svg";
import { ReactComponent as Visibility } from "./images/visibility.svg";
import { ReactComponent as Code } from "./images/code.svg";
import { ReactComponent as Graph } from "./images/graph.svg";
import { ReactComponent as Summary } from "./images/summary.svg";
import { ReactComponent as Play } from "./images/play.svg";
import { ReactComponent as Pause } from "./images/pause.svg";
import { ReactComponent as Resume } from "./images/resume.svg";
import { ReactComponent as Stop } from "./images/stop.svg";
import { ReactComponent as Menu } from "./images/menu.svg";

// import { ReactComponent as  } from "./images/.svg";

const icons = {
    "ArrowRight":ArrowRight,
    "Logo":Logo,
    "Build":Build,
    "CheckCircle":CheckCircle,
    "Close":Close,
    "Dashboard":Dashboard,
    "DeleteAll":DeleteAll,
    "Delete":Delete,
    "Done":Done,
    "Home":Home,
    "Info":Info,
    "Pan":Pan,
    "Problem":Problem,
    "Search":Search,
    "Settings":Settings,
    "Train":Train,
    "Visibility":Visibility,
    "Code":Code,
    "Graph":Graph,
    "Summary":Summary,
    "Play":Play,
    "Pause":Pause,
    "Resume":Resume,
    "Stop":Stop,
    "Menu":Menu
}

const Icon = (props={icon:React.Component,style:{}}) =>{
    let IconClass = props.icon;
    return (
        <div className="icon" style={props.style} >
            <IconClass style={props.style} />
        </div>
    )
}

export { Icon,icons };
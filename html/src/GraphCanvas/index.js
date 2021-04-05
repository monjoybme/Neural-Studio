import React from "react";
import Menu from './menu';
import  './canvas.css';



const Node = (props) =>{
    let layer = props.layer;
    let width = layer.width;

    function onMouseDown(e){
        e.preventDefault();        
        switch (window.__MODE__){
            case 'move':
                window.__ACTIVE_ELEMENT__ = layer.id
                break
            case 'line':
                window.__NEW_EDGE__  = { from : layer.id }
                break
        } 
    }

    function onMouseUp(e){
        e.preventDefault(); 
        switch (window.__MODE__){
            case 'move':
                window.__ACTIVE_ELEMENT__ = undefined
                break
            case 'line':
                window.__NEW_EDGE__.to =  layer.id 
                break
        } 
    }

    function onClick(e){
        switch(window.__MODE__){
            case "delete":
                layer.connections.inbound.forEach(lid=>{
                    props.layers[lid].connections.outbound.pop(layer.id);
                })
                layer.connections.outbound.forEach(lid=>{
                    props.layers[lid].connections.inbound.pop(layer.id);
                })
                delete props.layers[layer.id]
                props.layersState({...props.layers})
                break
            case "normal":
                props.menuState({
                    comp:(
                        <Menu
                            layer = {props.layer}

                            layers = {props.layers}
                            layersState = {props.layersState}
                            menu = {props.menu}
                            menuState = {props.menuState}
                        />
                    )
                })
                break
        }
    }

    return (
        <g 
            x={layer.pos.x} 
            y={layer.pos.y} 
        >
            <rect 
                x={layer.pos.x} 
                y={layer.pos.y}

                rx={3} 
                ry={3}

                height={40}
                width={width}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onClick={onClick}
            >

            </rect>
            <text 
                x={layer.pos.x + Math.floor(width / 4.75 )} 
                y={layer.pos.y + 25}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onClick={onClick}
            >
                {layer.name}
            </text>
        </g>
    )
}

const Edge = (props) =>{
    let pos_out = props.layer.pos;
    return (
        <g>
            {
                props.layer.connections.outbound.map((layer,i)=>{
                    let pos_in = props.layers[layer];
                    if (pos_in){
                        return (
                            <line 
                                x1={pos_out.x + pos_out.offsetX} 
                                y1={pos_out.y + 20} 
                                x2={pos_in.pos.x + pos_in.pos.offsetX } 
                                y2={pos_in.pos.y + 20}

                                markerEnd="url(#triangle)" 
                                stroke="black" 
                                strokeWidth="2"
                                key={i}    
                            />
                        )
                    }
                })
            }
        </g>
    )
}

const Canvas = (props) => {
    function onMouseUp(e) {
        if (window.__ACTIVE_LINE__) {
            if (window.__NEW_EDGE__){
                let edge = window.__NEW_EDGE__;
                if (edge.from && edge.to && edge.from !== edge.to){
                    if (props.layers[edge.from].connections.outbound.lastIndexOf(edge.to) === -1){
                        props.layers[edge.from].connections.outbound.push(edge.to);
                    }
                    if (props.layers[edge.to].connections.inbound.lastIndexOf(edge.from) === -1){
                        props.layers[edge.to].connections.inbound.push(edge.from);
                    }
                    props.layersState({
                        ...props.layers
                    })
                }   
            }
            window.__ACTIVE_LINE__.line.style.strokeWidth = 0;
            window.__ACTIVE_LINE__.line.x1.baseVal.value = 0;
            window.__ACTIVE_LINE__.line.y1.baseVal.value = 0;
            window.__ACTIVE_LINE__.line.x2.baseVal.value = 1;
            window.__ACTIVE_LINE__.line.y2.baseVal.value = 1;
            window.__ACTIVE_LINE__.line.id = 'dummy';
            window.__NEW_EDGE__ = undefined;

        } else if (window.__ACTIVE_ELEMENT__) {
            if (window.__POS__) {
                let layer = window.__ACTIVE_ELEMENT__.target.id.split("-")[1];
                window.layers[layer].pos = window.__POS__;
                window.layersState({
                    ...window.layers,
                });
            }
        }
    
        window.__POS__ = undefined;
        window.__ACTIVE_ELEMENT__ = undefined;
        window.__ACTIVE_LINE__ = undefined;
    
        window.menuState({
            comp: <div />,
        });
    }
    return <div className="canvas-top" id="canvasTop">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="canvas"
            id="canvas"
            onMouseUp={onMouseUp}
            >
            <marker 
                xmlns="http://www.w3.org/2000/svg" 
                id="triangle" viewBox="0 0 10 10" 
                refX="0" refY="5" 
                markerUnits="strokeWidth" 
                markerWidth="4" 
                markerHeight="3" 
                orient="auto"
            >
                <path d="M 0 0 L 10 5 L 0 10 z"/>
            </marker>
            <line 
                id='dummy' 
                x1="0" y1="0" 
                x2="1" y2="1" 
                stroke="#333" 
                strokeWidth="0"
                markerEnd="url(#triangle)"
            />
            {
                Object.keys(props.layers).map((layer,i)=>{
                    return (
                        <Edge 
                            layers={props.layers} 
                            layer={props.layers[layer]} 
                            key={i} 
                        />
                    )
                })
            }
            {
                Object.keys(props.layers).map((layer,i)=>{
                    return (
                        <Node 
                            layer={props.layers[layer]} 
                            
                            layers={props.layers}
                            layersState={props.layersState}
                            menu={props.menu}
                            menuState={props.menuState}

                            key={i} 
                        />
                    )
                })
            }
            
        </svg>
    </div>
};

export default Canvas;

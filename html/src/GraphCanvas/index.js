import React from "react";
import Node from "./node";

function mouseCleanUp(e) {
    if (window.__ACTIVE_LINE__) {
        if (window.__NEW_EDGE__) {
            let edge = window.__NEW_EDGE__;
            if (edge.in && edge.out && edge.in !== edge.out) {
                let inNode = edge.in.id.split("-")[1],
                    outNode = edge.out.id.split("-")[1];
                window.layers[inNode].connections.inbound.push(outNode);
                window.layers[outNode].connections.outbound.push(inNode);
                document
                    .getElementById("svg-canvas")
                    .removeChild(window.__ACTIVE_LINE__.line);
                window.layersState({
                    ...window.layers,
                });
                window.__NEW_EDGE__ = undefined;
            } else {
                document
                    .getElementById("svg-canvas")
                    .removeChild(window.__ACTIVE_LINE__.line);
            }
        } else {
            document
                .getElementById("svg-canvas")
                .removeChild(window.__ACTIVE_LINE__.line);
        }
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

const Canvas = (props) => {
React.useEffect(()=>{ 
    let svgCanvas = document.getElementById("svg-canvas");
    Array(...svgCanvas.children).forEach(edge=>svgCanvas.removeChild(edge));
    svgCanvas.innerHTML = `<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
                            markerWidth="3.5" markerHeight="3.5"
                            orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" />
                            </marker>`
    Object.keys(props.layers).forEach(layer=>{
        props.layers[layer].connections.inbound.forEach((inbound,i)=>{
        if (document.getElementById(`${inbound}->${layer}`)){ 
            
            }
        else{
            document.getElementById("svg-canvas").innerHTML = (
            document.getElementById("svg-canvas").innerHTML +
            (
                `<line id='${inbound}->${layer}' 
                x1="${props.layers[inbound].pos.x+85}" y1="${props.layers[inbound].pos.y+58}" 
                x2="${props.layers[layer].pos.x+85}" y2="${props.layers[layer].pos.y}" 
                stroke="#333" 
                stroke-width="2"
                marker-end="url(#arrow)"
                />` 
            )
            )
        }
        })
    });

    })
    return (
        <div id="canvas" className="canvas" onMouseUp={mouseCleanUp}>
            {
                Object.keys(props.layers).map((layer, i) => {
                    return (
                        <Node
                            layer={props.layers[layer]} key={i}
                            layers={props.layers}
                            layersState={props.layersState}
                            menu={props.menu}
                            menuState={props.menuState}
                            layerGroups={props.layerGroups}
                            layerGroupsState={props.layerGroupsState}
                        />
                    )
                })
            }
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                id="svg-canvas"
            >

            </svg>
        </div>
    )
};

export default Canvas;

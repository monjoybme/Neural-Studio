// const Edge = (props) => {
//   let pos_out = props.layer.pos;
//   return (
//     <g>
//       {props.layer.connections.outbound.map((layer, i) => {
//         let pos_in = window.layers[layer];
//         if (pos_in) {
//           return (
//             <line
//               x1={pos_out.x + pos_out.offsetX - 5}
//               y1={pos_out.y + 15}
//               x2={pos_in.pos.x + pos_in.pos.offsetX - 5}
//               y2={pos_in.pos.y + 15}
//               markerMid="url(#triangle)"
//               stroke="#222"
//               strokeWidth="1"
//               key={i}
//             />
//           );
//         }
//         return undefined
//       })}
//     </g>
//   );
// };
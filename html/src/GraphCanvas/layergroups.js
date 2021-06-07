import React from 'react';
import { metaLayerGroups, metaStore, metaStoreContext } from '../Meta';

const LayerGroupCollapsed = (
  props = { store: metaStore, storeContext: metaStoreContext }
) => {
  return (
    <div className="layers" key={props.i}>
      <div
        className="name"
        id={props.id}
        style={{ height: "45px" }}
        onClick={props.toggleSection}
      >
        {props.layerGroup.name}
      </div>
    </div>
  );
};

const LayerGroupOpen = (
  props = { store: metaStore, storeContext: metaStoreContext }
) => {

  return (
    <div className="layers" key={props.i}>
      <div className="name" id={props.id} onClick={props.toggleSection}>
        {props.layerGroup.name}
      </div>
      <div className="grid">
        {props.layerGroup.layers.map((layer, j) => {
          return (
            <div
              className="btn"
              onClick={(e) => {
                props.setToolMode({
                  name: "layer",
                  layer: { ...layer },
                });
              }}
              key={j}
            >
              {layer.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LayerGroups = (
  props = { layergroups: metaLayerGroups, layergroupsState: function(){} }
) => {
  let { layergroups, layergroupsState } = props;

  function toggleSection(e) {
    layergroups[e.target.id].visible = ~layergroups[e.target.id].visible;
    layergroupsState({
      ...layergroups,
    });
  }

  return (
    <div className="layergroups">
      {Object.keys(layergroups).map((layerGroup, i) => {
        return layergroups[layerGroup].visible ? (
          <LayerGroupOpen
            key={i}
            id={layerGroup}
            layerGroup={layergroups[layerGroup]}
            toggleSection={toggleSection}
            {...props}
          />
        ) : (
          <LayerGroupCollapsed
            key={i}
            id={layerGroup}
            layerGroup={layergroups[layerGroup]}
            toggleSection={toggleSection}
            {...props}
          />
        );
      })}
      <div className="layers"></div>
    </div>
  );
};


export default LayerGroups;
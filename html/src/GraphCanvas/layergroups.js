import React from 'react';

const LayerGroupCollapsed = (props) => {
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

const LayerGroupOpen = (props) => {
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
                props.tools.toolbarHandler({
                  mode: "layer",
                  layer: { ...layer },
                });
              }}
              id="btn-del"
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

const LayerGroups = (props={tools:{ }, layerGroups : {  }, layerGroupsState:{ }}) => {
  let { layerGroups, layerGroupsState } = props;

  function toggleSection(e) {
    layerGroups[e.target.id].visible = ~layerGroups[e.target.id].visible;
    layerGroupsState({
      ...layerGroups,
    });
  }

  return (
    <div className="layergroups">
      {Object.keys(layerGroups).map((layerGroup, i) => {
        return layerGroups[layerGroup].visible ? (
          <LayerGroupOpen
            key={i}
            i={i}
            id={layerGroup}
            layerGroup={layerGroups[layerGroup]}
            toggleSection={toggleSection}
            tools={props.tools}
          />
        ) : (
          <LayerGroupCollapsed
            key={i}
            i={i}
            id={layerGroup}
            layerGroup={layerGroups[layerGroup]}
            toggleSection={toggleSection}
            tools={props.tools}
          />
        );
      })}
    </div>
  );
};


export default LayerGroups;
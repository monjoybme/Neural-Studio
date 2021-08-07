const Classification = (props = { data: [], menuState: undefined }) => {
  const Sample = (props) => {
    return (
      <div className="sample">
        <div className="label">{props.class}</div>
        <img src={props.image} alt={""} />
      </div>
    );
  };
  return (
    <div className="viewer">
      <div className="head">
        <div className="name">Image Viewer</div>
        <div className="buttons">
          <div className="btn" onClick={props.reload}>
            Reload
          </div>
          <div
            className="btn"
            onClick={(e) => {
              props.menuState({
                render: false,
                comp: undefined,
              });
            }}
          >
            Exit
          </div>
        </div>
      </div>
      <div className="container image">
        <div className="classification">
          {props.data.map((sample, i) => {
            return <Sample {...sample} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

const Segmentation = (props = { data: [], menuState: undefined }) => {
  const Sample = (props) => {
    return (
      <div className="sample">
        <div>
          <img src={props.image} alt={""} />
        </div>
        <div>
          <img src={props.mask} alt={""} />
        </div>
      </div>
    );
  };
  return (
    <div className="viewer">
      <div className="head">
        <div className="name">Image Viewer</div>
        <div className="buttons">
          <div className="btn" onClick={props.reload}>
            Reload
          </div>
          <div
            className="btn"
            onClick={(e) => {
              props.menuState({
                render: false,
                comp: undefined,
              });
            }}
          >
            Exit
          </div>
        </div>
      </div>
      <div className="container image">
        <div className="segmentation">
          {props.data.map((sample, i) => {
            return <Sample {...sample} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

const data = {
  Classification: Classification,
  Segmentation: Segmentation,
};

export default data;

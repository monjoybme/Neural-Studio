const Classification = (props = { data: [], menuState: undefined }) => {

    const Sample = (props={ text: "", label: "" }) => {
        return (
          <div className="row">
            <div className="label">{props.label}</div>
            <div className="text">{props.text}</div>
          </div>
        );
    }

    return (
      <div className="viewer">
        <div className="head">
          <div className="name">Text Data</div>
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
        <div className="text container">
          <div className="classification">
            {props.data.map((row, i) => {
              return <Sample text={row.text} label={row.class} key={i} />;
            })}
          </div>
        </div>
      </div>
    );
};

const data = {
    Classification: Classification
}

export default data;
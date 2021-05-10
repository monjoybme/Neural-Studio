import  React from 'react';

const NotificationLog = (props) => {
  return <div className="log notif">{props.data.message}</div>;
};

const EpochLog = (props) => {
  return (
    <div className="log epoch">
      <div className="upper">
        <div className="epochname">
          Epoch : {props.data.epoch + 1}/{props.data.train.epochs}
        </div>
        <div className="progress">
          <div className="bar">
            <div
              className="done"
              style={{
                width: `${Math.ceil(
                  (props.data.log.batch / props.data.train.batches) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="lower">
        {props.data.log.output ? (
          <div className="outputs">
            <div className="output heading-5">
              {props.data.log.batch} / {props.data.train.batches}
            </div>
            {Object.keys(props.data.log.output).map((output, i) => {
              return (
                <div className="output" key={i}>
                  <div className="name">{output}</div>
                  &nbsp;:&nbsp;
                  <div className="val">
                    {props.data.log.output[output].toString().slice(0, 7)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : undefined}
      </div>
    </div>
  );
};

const ErrorLog = (props) => {
  return (
    <div className="log error">
      <div className="message">{props.data.error}</div>
      <pre>
        <code>{props.data.code}</code>
      </pre>
    </div>
  );
};

export { ErrorLog, NotificationLog, EpochLog };
import React from "react";

export const Loading = (props) => {
  return (
    <div className="loading">
      <Logo />
    </div>
  );
};

export const Notification = (
  props = {
    message: "Hello, World !",
    type: "message",
    notificationState: undefined,
    timeout: 10,
  }
) => {
  let ref = React.useRef();
  React.useEffect(function () {
    setTimeout(function () {
      if (ref.current) {
        ref.current.setAttribute("class", "notification nout");
        setTimeout(function () {
          props.notificationState({ comp: undefined });
        }, 500);
      }
    }, props.timeout);
  }, []);
  return (
    <div className="notification message" ref={ref}>
      <div className="message">{props.message}</div>
    </div>
  );
};

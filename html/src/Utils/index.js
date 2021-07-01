import React from "react";
import { ReactComponent as Logo } from "../data/images/logo.svg";

export const PORT = 8000;
export const HOST = "localhost";
export const ROOT = `http://${HOST}:${PORT}`;

export const post = async function (options = { path: "/", data: {}, body: {} }) {
  let { path, data } = options;
  return await fetch(ROOT + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
};

export const get = async function (options = { path: "/" }) {
  let { path } = options;
  return await fetch(ROOT + path);
};

export const push = async function (
  options = {
    name: "var",
    data: null,
  }) {
  return await post({
    path: `/workspace/active/${options.name}`,
    data: options.data,
  }).then((response) => {
    return response.json()
  })
};

export const pull = async function (
  options = {
    name: "var",
  }) {
  return await get({
    path: `/workspace/active/${options.name}`
  }).then((response) => {
    return response.json()
  })
};

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

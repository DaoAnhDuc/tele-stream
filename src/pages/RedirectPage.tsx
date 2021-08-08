import { Spin } from "antd";
import React, { Component } from "react";

class RedirectPage extends Component {
  componentDidMount = () => {
    window.location.replace(window.location.protocol + "//" + window.location.host);
  };
  render() {
    return (
      <div
        style={{
          background: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <Spin tip="Redirecting..."></Spin>
      </div>
    );
  }
}

export default RedirectPage;

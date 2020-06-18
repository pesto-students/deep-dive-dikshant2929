import React, { Component } from "react";

export default class JoinRoom extends Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <p>
          You have successfully joined this room, please wait for another player
          to start
        </p>
      </div>
    );
  }
}

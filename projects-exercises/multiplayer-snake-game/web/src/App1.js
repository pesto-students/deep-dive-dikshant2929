import React, { Component } from "react";
import io from "socket.io-client";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.games = null;
  }
  componentDidMount() {
    this.games = io.connect("http://localhost:3003/games");
    this.games.on("Welcome", (data) => {
      console.log(data);
    });

    this.games.emit("joinRoom", "rocket");

    this.games.on("err", (err) => {
      console.log(err);
    });

    this.games.on("success", (res) => {
      console.log(res);
    });

    this.games.on("newUser", (res) => {
      console.log(res);
    });
  }
  render() {
    return <div>hi</div>;
  }
}

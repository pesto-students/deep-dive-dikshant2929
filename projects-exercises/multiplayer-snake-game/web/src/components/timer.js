import React, { Component } from "react";

export default class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time_left: 100,
    };
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ time_left: this.state.time_left - 1 });
      if (this.state.time_left === 0) {
        clearInterval(this.timer);
        this.props.onGameOver(false);
      }
    }, 1000);
  }
  render() {
    const { time_left } = this.state;
    return (
      <h1
        style={{ marginLeft: "auto", color: time_left < 10 ? "red" : "green" }}
      >
        Time Left:{time_left} sec
      </h1>
    );
  }
}

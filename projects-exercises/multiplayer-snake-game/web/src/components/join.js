import React, { Component } from "react";

export default class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      room: "",
      form_submit: false,
    };
  }
  handleName = (e) => {
    this.setState({ name: e.target.value });
  };
  handleRoom = (e) => {
    this.setState({ room: e.target.value });
  };

  handleFormSubmit = (e) => {
    const { name, room } = this.state;
    e.preventDefault();
    if (!!!name || !!!room) {
      this.setState({ form_submit: true });
      return;
    }
    this.props.joinRoom(name, room);
  };
  render() {
    const { name, room, form_submit } = this.state;
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div
          id="join"
          // className="login-wrapper"
          style={{
            width: 400,
            height: 250,
            backgroundColor: "#d9d9ff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBlockColor: "#7373ff",
          }}
        >
          <form onSubmit={this.handleFormSubmit}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>
                Name <sup style={{ color: "#ff0000" }}>*</sup>
              </label>
              <input
                type="text"
                name="name"
                value={name}
                placeholder="name"
                onChange={this.handleName}
              />
              {!!form_submit && !!!name && (
                <span className="error-txt" style={{ color: "#ff0000" }}>
                  empty name!
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>
                Room <sup style={{ color: "#ff0000" }}>*</sup>
              </label>
              <input
                type="text"
                name="room"
                value={room}
                placeholder="room"
                onChange={this.handleRoom}
              />
              {!!form_submit && !!!room && (
                <span className="error-txt" style={{ color: "#ff0000" }}>
                  empty room!
                </span>
              )}
            </div>
            <button onSubmit={this.handleFormSubmit} style={{ marginTop: 15 }}>
              Join
            </button>
          </form>
        </div>
      </div>
    );
  }
}

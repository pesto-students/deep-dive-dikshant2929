import React, { Component } from "react";
import io from "socket.io-client";
import Join from "./components/join";
import SnakeGame from "./components/snake_game";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      join_room: false,
      user_detail: {
        name: "",
        room: "",
      },
      start_game: false,
      my_snake: null,
    };
    this.snake_game = io.connect("http://localhost:3003/games");
  }

  componentDidMount() {
    this.snake_game.on("room_is_full", (res) => {
      alert(res);
    });
    this.snake_game.on("joined_room", (my_snake) => {
      this.setState({ my_snake });
    });
    this.snake_game.on("start_game", (res) => {
      this.setState({ start_game: true, join_room: true });
      console.log(res);
    });
  }

  joinRoom = (name, room) => {
    debugger;
    this.setState({ user_detail: { name, room } });
    this.snake_game.emit("request_to_join_room", room);
  };

  render() {
    const { join_room, user_detail, start_game } = this.state;
    return (
      <>
        {!start_game && !join_room && (
          <Join joinRoom={this.joinRoom} {...user_detail} />
        )}
        {start_game && join_room && (
          <SnakeGame my_snake={"snake_2"} snake_game={this.snake_game} />
        )}
      </>
    );
  }
}

import React, { Component } from "react";
import io from "socket.io-client";
import Join from "./components/join";
import SnakeGame from "./components/snake_game";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      join_room: true,
      user_detail: {
        name: "",
        room: "",
      },
      start_game: true,
    };
    this.snake_game = io.connect("http://localhost:3003/games");
  }

  componentDidMount() {
    // this.games.on("room_is_full", (res) => {
    //   alert(res);
    // });
    // this.games.on("joined_room", (res) => {
    //   console.log(res);
    // });
    // this.games.on("start_game", (res) => {
    //   this.setState({ start_game: true, join_room: true });
    //   console.log(res);
    // });
  }

  joinRoom = (name, room) => {
    this.setState({ user_detail: { name, room } });
    this.games.emit("request_to_join_room", room);
  };

  render() {
    const { join_room, user_detail, start_game } = this.state;
    return (
      <>
        {!start_game && !join_room && <Join {...user_detail} />}
        {start_game && join_room && <SnakeGame snake_game={this.snake_game} />}
      </>
    );
  }
}

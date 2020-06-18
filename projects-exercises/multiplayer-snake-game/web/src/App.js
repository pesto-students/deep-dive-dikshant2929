import React, { Component } from "react";
import io from "socket.io-client";
import Join from "./components/join";
import SnakeGame from "./components/snake_game";
import JoinRoom from "./components/join_room";

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
      snake_1: "",
      snake_2: "",
    };
    this.snake_game = io.connect("http://192.168.1.10:3003/games");
  }
  
  componentWillUnmount(){
    this.snake_game.disconnect();
  }

  componentDidMount() {
    this.snake_game.on("room_is_full", (res) => {
      alert(res);
    });
    this.snake_game.on("joined_room", (my_snake) => {
      this.setState({ my_snake });
      console.log(my_snake);
    });
    this.snake_game.on("start_game", (res) => {
      this.setState({ start_game: true, ...res });
    });
  }

  joinRoom = (name, room) => {
    this.setState({ user_detail: { name, room }, join_room: true });
    this.snake_game.emit("request_to_join_room", { room, name });
  };

  gameOver = () => {
    this.setState({
      join_room: false,
      user_detail: {
        name: "",
        room: "",
      },
      start_game: false,
      my_snake: null,
      snake_1: "",
      snake_2: "",
    });
  };

  render() {
    const {
      join_room,
      user_detail,
      start_game,
      my_snake,
      snake_1,
      snake_2,
    } = this.state;
    return (
      <>
        {!start_game && !join_room && (
          <Join joinRoom={this.joinRoom} {...user_detail} />
        )}
        {!start_game && join_room && <JoinRoom />}
        {start_game && join_room && (
          <SnakeGame
            {...user_detail}
            my_snake={my_snake}
            snake_game={this.snake_game}
            {...{ snake_1, snake_2 }}
            gameOver={this.gameOver}
          />
        )}
      </>
    );
  }
}

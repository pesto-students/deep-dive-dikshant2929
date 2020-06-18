import React, { Component } from "react";
import Snake from "./snake";
import Food from "./food";
import Timer from "./timer";
const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const initialState = {
  food: [50, 50],
  speed: 200,
  hide_food: false,
  // direction: "RIGHT",
  // snakeDots: [
  //   [0, 0],
  //   [2, 0],
  // ],
  snake_1: {
    direction: "RIGHT",
    snake_dots: [
      [0, 0],
      [2, 0],
    ],
  },
  snake_2: {
    direction: "RIGHT",
    snake_dots: [
      [10, 10],
      [12, 10],
    ],
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      highest_score: 0,
      speed: props.speed || initialState.speed,
    };
    this.speed = props.speed || initialState.speed;
    this.snake_game = this.props.snake_game;
    this.snake_game.on("move_snake", (state) => {
      this.setState({ ...state });
      // console.log(this.props.my_snake);
    });
    this.snake_game.on("eat_food", (state) => {
      this.setState({ ...state, hide_food: false });
    });
    this.snake_game.on("enlarge_snake", (state) => {
      this.setState({ ...state, hide_food: false });
    });
    this.snake_game.on("increase_game_speed", (state) => {
      this.setState({ ...state });
    });
    this.snake_game.on("game_over", (msg) => {
      alert(msg);
      this.props.gameOver();
    });
  }
  // state = initialState;

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
    this.checkIfEatAnotherSnake();
    this.checkIfHeadCollapse();
  }

  moveSnake = () => {
    requestAnimationFrame(() => {
      // let dots = [...this.state.snakeDots];
      let snake_1 = this.state.snake_1;
      let snake_2 = this.state.snake_2;
      let dots_1 = [...snake_1.snake_dots];
      let dots_2 = [...snake_2.snake_dots];
      let head_1 = dots_1[dots_1.length - 1];
      let head_2 = dots_2[dots_2.length - 1];

      switch (snake_1.direction) {
        case "RIGHT":
          head_1 = [head_1[0] + 2, head_1[1]];
          break;
        case "LEFT":
          head_1 = [head_1[0] - 2, head_1[1]];
          break;
        case "DOWN":
          head_1 = [head_1[0], head_1[1] + 2];
          break;
        case "UP":
          head_1 = [head_1[0], head_1[1] - 2];
          break;
      }

      switch (snake_2.direction) {
        case "RIGHT":
          head_2 = [head_2[0] + 2, head_2[1]];
          break;
        case "LEFT":
          head_2 = [head_2[0] - 2, head_2[1]];
          break;
        case "DOWN":
          head_2 = [head_2[0], head_2[1] + 2];
          break;
        case "UP":
          head_2 = [head_2[0], head_2[1] - 2];
          break;
      }

      dots_1.push(head_1);
      dots_2.push(head_2);
      dots_1.shift();
      dots_2.shift();

      // let state = {
      //   snake_1: {
      //     ...snake_1,
      //     snake_dots: dots_1,
      //   },
      //   snake_2: {
      //     ...snake_2,
      //     snake_dots: dots_2,
      //   },
      // };

      // this.snake_game.emit("move_snake", { state, room: this.props.room });

      this.setState({
        snake_1: {
          ...snake_1,
          snake_dots: dots_1,
        },
        snake_2: {
          ...snake_2,
          snake_dots: dots_2,
        },
      });
    });
  };

  onKeyDown = (e) => {
    // const { direction } = this.state;
    let snake = this.state[this.props.my_snake];
    let direction = snake.direction;
    e = e || window.event;
    let state = {};
    switch (e.keyCode) {
      case 40:
        if (direction != "UP")
          state = { [this.props.my_snake]: { ...snake, direction: "DOWN" } };
        break;
      case 38:
        if (direction != "DOWN")
          state = { [this.props.my_snake]: { ...snake, direction: "UP" } };
        break;
      case 39:
        if (direction != "LEFT")
          state = { [this.props.my_snake]: { ...snake, direction: "RIGHT" } };
        break;
      case 37:
        if (direction != "RIGHT")
          state = { [this.props.my_snake]: { ...snake, direction: "LEFT" } };
        break;
    }

    this.snake_game.emit("move_snake", { state, room: this.props.room });
  };

  checkIfOutOfBorders() {
    let snake = this.state[this.props.my_snake];
    let head = snake.snake_dots[snake.snake_dots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver(true);
    }
  }

  checkIfEatAnotherSnake = () => {
    let snake = this.state[this.props.my_snake];
    let head = snake.snake_dots[snake.snake_dots.length - 1];
    let opponent_snake_dots = [];
    if (this.props.my_snake === "snake_1") {
      opponent_snake_dots = [...this.state.snake_2.snake_dots];
    } else {
      opponent_snake_dots = [...this.state.snake_1.snake_dots];
    }

    opponent_snake_dots.pop();
    opponent_snake_dots.forEach((dot) => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver(true);
      }
    });
  };

  checkIfHeadCollapse = () => {
    let head_1 = [
      ...this.state.snake_1.snake_dots[
        this.state.snake_1.snake_dots.length - 1
      ],
    ];

    let head_2 = [
      ...this.state.snake_2.snake_dots[
        this.state.snake_2.snake_dots.length - 1
      ],
    ];

    if (head_1[0] == head_2[0] && head_1[1] == head_2[1]) {
      this.onGameOver(false);
    }
  };

  checkIfCollapsed() {
    // let snake = [...this.state.snakeDots];

    let snake_dots = [...this.state[this.props.my_snake].snake_dots];
    let head = snake_dots[snake_dots.length - 1];
    snake_dots.pop();
    snake_dots.forEach((dot) => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver(true);
      }
    });
  }

  checkIfEat() {
    let snake = this.state[this.props.my_snake];

    let head = snake.snake_dots[snake.snake_dots.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      ///eat food logic
      this.setState({ hide_food: true, food: [0, 0] });
      this.snake_game.emit("eat_food", {
        state: { food: getRandomCoordinates() },
        room: this.props.room,
      });

      // this.setState({
      //   food: getRandomCoordinates(),
      // });
      this.enlargeSnake();
      this.increaseSpeed();
    }
  }

  enlargeSnake() {
    let snake = this.state[this.props.my_snake];
    let new_snake_dots = [...snake.snake_dots];
    new_snake_dots.unshift([]);
    new_snake_dots.unshift([]);
    new_snake_dots.unshift([]);
    new_snake_dots.unshift([]);
    new_snake_dots.unshift([]);

    this.snake_game.emit("enlarge_snake", {
      state: {
        [this.props.my_snake]: { ...snake, snake_dots: new_snake_dots },
      },
      room: this.props.room,
    });
    // this.setState({
    //   [this.props.my_snake]: { ...snake, snake_dots: new_snake_dots },
    // });
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.snake_game.emit("increase_game_speed", {
        state: { speed: this.state.speed - 10 },
        room: this.props.room,
      });

      // this.setState({
      //   speed: this.state.speed - 10,
      // });
    }
  }

  onGameOver = (is_snake_dead) => {
    let opponent_player = "";
    let message = "";

    if (this.props.my_snake === "snake_1") {
      opponent_player = this.props.snake_2;
    } else {
      opponent_player = this.props.snake_1;
    }
    message =
      opponent_player +
      "won as " +
      this.props[this.props.my_snake] +
      "'s snake dead";

    if (is_snake_dead) {
      this.snake_game.emit("game_over", {
        message,
        room: this.props.room,
      });
    } else {
      if (
        this.state.snake_1.snake_dots.length >
        this.state.snake_2.snake_dots.length
      ) {
        message =
          this.props.snake_1 +
          " won by" +
          (this.state.snake_1.snake_dots.length -
            this.state.snake_2.snake_dots.length) +
          " points";
      } else if (
        this.state.snake_1.snake_dots.length <
        this.state.snake_2.snake_dots.length
      ) {
        message =
          this.props.snake_2 +
          " won by" +
          (this.state.snake_2.snake_dots.length -
            this.state.snake_1.snake_dots.length) +
          " points";
      } else {
        message = "Match Draw";
      }
      this.snake_game.emit("game_over", {
        message,
        room: this.props.room,
      });
    }
  };

  render() {
    return (
      <div>
        <div style={{ display: "flex" }}>
          <h1>
            {this.props.snake_1}:
            {this.state.snake_1.snake_dots.length -
              initialState.snake_1.snake_dots.length}
          </h1>
          <Timer onGameOver={this.onGameOver} />
          <h1 style={{ marginLeft: "auto" }}>
            {this.props.snake_2}:
            {this.state.snake_2.snake_dots.length -
              initialState.snake_2.snake_dots.length}
          </h1>
        </div>

        <div className="game-area">
          <Snake snake_dots={this.state.snake_1.snake_dots} />
          <Snake snake_dots={this.state.snake_2.snake_dots} />
          {!this.state.hide_food && <Food food={this.state.food} />}
        </div>
      </div>
    );
  }
}

export default App;

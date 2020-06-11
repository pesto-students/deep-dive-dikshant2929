import React, { Component } from "react";
import Snake from "./snake";
import Food from "./food";
const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const initialState = {
  food: getRandomCoordinates(),
  speed: 200,
  direction: "RIGHT",
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
  }

  moveSnake = () => {
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
  };

  onKeyDown = (e) => {
    // const { direction } = this.state;
    let snake = this.state[this.props.my_snake];
    let direction = snake.direction;
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        if (direction != "DOWN")
          this.setState({
            [this.props.my_snake]: { ...snake, direction: "UP" },
          });
        break;
      case 40:
        if (direction != "UP")
          this.setState({
            [this.props.my_snake]: { ...snake, direction: "DOWN" },
          });
        break;
      case 37:
        if (direction != "RIGHT")
          this.setState({
            [this.props.my_snake]: { ...snake, direction: "LEFT" },
          });
        break;
      case 39:
        if (direction != "LEFT")
          this.setState({
            [this.props.my_snake]: { ...snake, direction: "RIGHT" },
          });
        break;
    }
  };

  checkIfOutOfBorders() {
    let snake = this.state[this.props.my_snake];
    let head = snake.snake_dots[snake.snake_dots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    // let snake = [...this.state.snakeDots];

    let snake_dots = [...this.state[this.props.my_snake].snake_dots];
    let head = snake_dots[snake_dots.length - 1];
    snake_dots.pop();
    snake_dots.forEach((dot) => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    });
  }

  checkIfEat() {
    let snake = this.state[this.props.my_snake];

    let head = snake.snake_dots[snake.snake_dots.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      this.setState({
        food: getRandomCoordinates(),
      });
      this.enlargeSnake();
      this.increaseSpeed();
    }
  }

  enlargeSnake() {
    let snake = this.state[this.props.my_snake];

    let new_snake_dots = [...snake.snake_dots];
    new_snake_dots.unshift([]);
    this.setState({
      [this.props.my_snake]: { ...snake, snake_dots: new_snake_dots },
    });
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 10,
      });
    }
  }

  onGameOver() {
    let snake = this.state[this.props.my_snake];
    const snake_dots = snake.snake_dots;

    const { highest_score } = this.state;

    let score =
      snake_dots.length - initialState[this.props.my_snake].snake_dots.length;
    let new_highest_score = highest_score;
    if (score > highest_score) new_highest_score = score;
    alert(`Game Over`);
    this.setState({
      ...initialState,
      highest_score: new_highest_score,
      speed: this.speed,
    });
  }

  render() {
    debugger;
    return (
      <div>
        <div style={{ display: "flex" }}>
          <h1>
            Score:
            {this.state[this.props.my_snake].snake_dots.length -
              initialState[this.props.my_snake].snake_dots.length}
          </h1>
          <h1 style={{ marginLeft: "auto" }}>
            Highest Score:{this.state.highest_score}
          </h1>
        </div>

        <div className="game-area">
          <Snake snake_dots={this.state.snake_1.snake_dots} />
          <Snake snake_dots={this.state.snake_2.snake_dots} />
          <Food food={this.state.food} />
        </div>
      </div>
    );
  }
}

export default App;

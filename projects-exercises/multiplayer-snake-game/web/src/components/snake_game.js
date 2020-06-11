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
  snakeDots: [
    [0, 0],
    [2, 0],
  ],
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
  }
  state = initialState;

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
  }

  onKeyDown = (e) => {
    const { direction } = this.state;
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        if (direction != "DOWN") this.setState({ direction: "UP" });
        break;
      case 40:
        if (direction != "UP") this.setState({ direction: "DOWN" });
        break;
      case 37:
        if (direction != "RIGHT") this.setState({ direction: "LEFT" });
        break;
      case 39:
        if (direction != "LEFT") this.setState({ direction: "RIGHT" });
        break;
    }
  };

  moveSnake = () => {
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
    dots.shift();
    this.setState({
      snakeDots: dots,
    });
  };

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach((dot) => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    });
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
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
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([]);
    this.setState({
      snakeDots: newSnake,
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
    const { snakeDots, highest_score } = this.state;
    let score = snakeDots.length - initialState.snakeDots.length;
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
    return (
      <div>
        <div style={{ display: "flex" }}>
          <h1>
            Score:{this.state.snakeDots.length - initialState.snakeDots.length}
          </h1>
          <h1 style={{ marginLeft: "auto" }}>
            Highest Score:{this.state.highest_score}
          </h1>
        </div>

        <div className="game-area">
          <Snake snake_dots={this.state.snakeDots} />
          <Food food={this.state.food} />
        </div>
      </div>
    );
  }
}

export default App;

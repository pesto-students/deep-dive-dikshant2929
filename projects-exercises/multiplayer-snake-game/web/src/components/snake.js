import React from "react";

export default function Snake(props) {
  return (
    <div>
      {props.snake_dots.map((dot, i) => {
        const style = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`,
          borderRadius: "50%",
        };
        return <div key={i} className="snake-dot" style={style}></div>;
      })}
    </div>
  );
}

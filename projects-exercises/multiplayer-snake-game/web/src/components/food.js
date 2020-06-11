import React from "react";

export default function food(props) {
  const style = {
    left: `${props.food[0]}%`,
    top: `${props.food[1]}%`,
    borderRadius: "50%",
  };

  return <div className="snake-food" style={style}></div>;
}

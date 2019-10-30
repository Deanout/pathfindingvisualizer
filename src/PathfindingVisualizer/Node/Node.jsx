import React, { Component } from "react";

import "./node.css";

export default class Node extends Component {
  render() {
    const { row, col, isStart, isFinish, isWall } = this.props;
    /*
    const extraClassName = isFinish
      ? `node-finish`
      : isStart
      ? `node-start`
      : isWall
      ? `node-wall`
      : "";*/

    return (
      <div id={`node-${row}-${col}`} className={`node`}>
        <p className="node-text">
          [{row},{col}]
        </p>
      </div>
    );
  }
}

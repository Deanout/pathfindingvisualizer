import React, { Component } from "react";

import "./node.css";

export default class Node extends Component {
  render() {
    const { row, col } = this.props;

    return (
      <div id={`node-${row}-${col}`} className={`node`}>
        <div className="path"></div>
      </div>
    );
  }
}

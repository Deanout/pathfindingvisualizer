import React, { Component } from "react";

import "./node.css";
import store from "../../store/gridstore";

export default class Node extends Component {
  /*
<div className="path-row">
            <div className="path-score">G {gScore.toFixed(1)}</div>
            <div className="path-score">H {hScore.toFixed(1)}</div>
          </div>
          <div className="path-row">
            <div className="path-score">F {fScore.toFixed(1)}</div>
            <div className="path-score">D {distance.toFixed(1)}</div>
          </div>
*/

  scores(gScore, hScore, fScore, distance) {
    if (store.nodeWidth >= 75 && store.nodeHeight >= 75) {
      return (
        <div className="path">
          <div className="path-row">
            <div className="path-score">
              {gScore == Infinity ? "∞" : gScore.toFixed(1)}
            </div>
            <div className="path-score">
              {hScore == Infinity ? "∞" : hScore.toFixed(1)}
            </div>
          </div>
          <div className="path-row">
            <div className="path-score">
              {fScore == Infinity ? "∞" : fScore.toFixed(1)}
            </div>
            <div className="path-score">
              {distance == Infinity ? "∞" : distance.toFixed(1)}
            </div>
          </div>
        </div>
      );
    } else {
      return <div className="path"></div>;
    }
  }

  render() {
    const { row, col } = this.props;
    // var pathScoreContainer = this.scores(gScore, hScore, fScore, distance);
    return (
      <div id={`node-${row}-${col}`} className={`node`}>
        <div className="path"></div>
      </div>
    );
  }
}

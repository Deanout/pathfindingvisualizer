import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/Dijkstra";
import Toolbar from "../partials/toolbar";
import { BuildRecursiveWalls } from "../algorithms/RecursiveWalls";

import "./PathfindingVisualizer.css";

const GRID_WIDTH = Math.floor(window.innerWidth / 25);
const GRID_HEIGHT = Math.floor(window.innerHeight / 25) - 5;

const START_NODE_ROW = 3;
const START_NODE_COL = 3;
const FINISH_NODE_ROW = GRID_WIDTH - START_NODE_ROW - 1;
const FINISH_NODE_COL = GRID_HEIGHT - START_NODE_COL - 1;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      start: 0,
      end: 0,
      statistic: ""
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    this.buildWall(row, col);
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) {
      return;
    }
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  buildWall(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `node node-visited`;
      }, 10 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `node node-shortest-path`;
      }, 50 * i);
    }
  }
  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    this.init(false);
    let start = performance.now();
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    let end = performance.now();
    this.setState({
      statistic:
        "Runtime of Dijkstra's algorithm: " + (end - start).toString() + " ms."
    });
    document.getElementById("statistics").innerHTML +=
      `<p class="statistic-text">` + this.state.statistic + `</p>`;
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  init(clearBoard) {
    for (let row = 0; row < GRID_WIDTH; row++) {
      for (let col = 0; col < GRID_HEIGHT; col++) {
        let node = document.getElementById(`node-${row}-${col}`);
        if (
          node.className === `node node-visited` ||
          node.className === `node node-shortest-path` ||
          (node.classList === `node node-wall` && clearBoard)
        ) {
          node.className = `node`;
        }
      }
    }
    if (clearBoard) {
      this.componentDidMount();
    }
    document.getElementById(
      `node-${START_NODE_ROW}-${START_NODE_COL}`
    ).className = `node node-start`;
    document.getElementById(
      `node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`
    ).className = `node node-finish`;
  }

  recursiveWalls() {
    var coords = [];
    this.init(true);

    for (let row = 0; row < GRID_HEIGHT; row++) {
      let currentRow = [];
      for (let col = 0; col < GRID_WIDTH; col++) {
        if (row === 0) {
          currentRow.push(1);
        } else if (col === 0) {
          currentRow.push(1);
        } else if (row === GRID_HEIGHT - 1) {
          currentRow.push(1);
        } else if (col === GRID_WIDTH - 1) {
          currentRow.push(1);
        } else {
          currentRow.push(0);
        }
      }
      coords.push(currentRow);
    }

    BuildRecursiveWalls(coords, 0, GRID_WIDTH - 1, 0, GRID_HEIGHT - 1);
    console.log(FINISH_NODE_ROW);
    console.log(FINISH_NODE_COL);
    console.log(coords[0]);
    coords[START_NODE_COL][START_NODE_ROW] = 0;
    coords[FINISH_NODE_COL][FINISH_NODE_ROW] = 0;
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_HEIGHT; y++) {
        if (coords[y][x] === 1) {
          this.buildWall(x, y);
        }
      }
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <Toolbar pfv={this}></Toolbar>
        <div className="statistics" id="statistics"></div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < GRID_WIDTH; row++) {
    const currentRow = [];
    for (let col = 0; col < GRID_HEIGHT; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

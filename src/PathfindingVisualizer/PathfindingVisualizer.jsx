import React, { Component } from "react";
import Node from "./node/node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import Toolbar from "../partials/toolbar";
import Console from "../partials/console";
import { recursiveWallBuilder } from "../algorithms/recursivewalls";

import "./pathfindingvisualizer.css";
var GRID_WIDTH = 5;
var GRID_HEIGHT = 5;

const NODE_SIZE = 25;

const START_NODE = `node-start`;
const FINISH_NODE = `node-finish`;
const NODE_VISITED = `node-visited`;
const NODE_SHORTEST_PATH = `node-shortest-path`;

const WALL = "W";
const AIR = "A";
const START = "S";
const FINISH = "F";

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      nodeType: WALL,
      startPosition: [0, 0],
      finishPosition: [0, 1]
    };
  }

  componentDidMount() {
    let consoleElement = document.getElementById("console");
    if (consoleElement) {
      let consoleBottom = consoleElement.getBoundingClientRect().bottom;
      let veritcalNodeReduction = consoleBottom / NODE_SIZE;
      GRID_WIDTH = Math.floor(window.innerWidth / NODE_SIZE);
      GRID_HEIGHT = Math.floor(
        window.innerHeight / NODE_SIZE - veritcalNodeReduction
      );

      document.getElementById("grid").style.height =
        (window.innerHeight - consoleBottom).toString() + "px";
      const grid = getInitialGrid(
        this.state.startPosition,
        this.state.finishPosition
      );
      this.setState({ grid: grid }, () => {
        this.toggleStartPosition(3, 3);
        this.toggleFinishPosition(GRID_HEIGHT - 3, GRID_WIDTH - 3);
      });
    }
    document.addEventListener("keydown", event => {
      switch (event.key.toLowerCase()) {
        case "s":
          this.setState({ nodeType: START });
          break;
        case "w":
          this.setState({ nodeType: WALL });
          break;
        case "f":
          this.setState({ nodeType: FINISH });
          break;
        default:
          this.setState({ nodeType: WALL });
          break;
      }
    });
  }

  toggleStartPosition(row, col) {
    const newGrid = getNewGridWithStartToggled(
      this.state.grid,
      row,
      col,
      this.state.startPosition
    );
    this.setState({
      grid: newGrid,
      mouseIsPressed: false,
      startPosition: [row, col]
    });
  }

  toggleFinishPosition(row, col) {
    const newGrid = getNewGridWithFinishToggled(
      this.state.grid,
      row,
      col,
      this.state.finishPosition
    );
    this.setState({
      grid: newGrid,
      mouseIsPressed: false,
      finishPosition: [row, col]
    });
  }

  handleMouseDown(row, col) {
    this.toggleNodeType(row, col);
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) {
      return;
    }
    this.toggleNodeType(row, col);
  }

  toggleNodeType(row, col) {
    switch (this.state.nodeType) {
      case WALL:
        this.toggleNode(row, col);
        break;
      case START:
        this.toggleStartPosition(row, col);
        break;
      case FINISH:
        this.toggleFinishPosition(row, col);
        break;
      default:
        break;
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  toggleNode(row, col) {
    const newGrid = getNewGridWithNodeToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: false });
  }

  resetDistances() {
    const newGrid = getNewGridWithDistancesReset(this.state.grid);
    this.setState({ grid: newGrid });
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        this.modifyNode(node, false, NODE_VISITED);
      }, 10 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        this.modifyNode(node, false, NODE_SHORTEST_PATH);
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    this.resetDistances();
    const { grid } = this.state;
    const startNode =
      grid[this.state.startPosition[0]][this.state.startPosition[1]];
    const finishNode =
      grid[this.state.finishPosition[0]][this.state.finishPosition[1]];
    this.init(false);
    let start = performance.now();
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    let end = performance.now();

    this.renderTextToConsole(
      "Dijkstra's Algorithm",
      start,
      end,
      `<p class="statistic-text">`,
      `</p>`
    );

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    this.resetDistances();
  }

  renderTextToConsole(algorithm, start, end, openingTag, closingTag) {
    let time = (end - start).toFixed(2).toString();
    let content = "Runtime of " + algorithm + ": " + time + " ms.";
    let consoleElement = document.getElementById("console");
    consoleElement.innerHTML += openingTag + content + closingTag;
    consoleElement.scrollTo(0, consoleElement.scrollHeight);
  }

  modifyNode(node, clearBoard, newClass) {
    if (clearBoard) {
      document.getElementById(
        `node-${node.row}-${node.col}`
      ).className = `${newClass}`;
    } else {
      document.getElementById(
        `node-${node.row}-${node.col}`
      ).className += ` ${newClass}`;
    }
  }

  init(clearBoard) {
    const { grid } = this.state;

    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        let node = grid[row][col];

        if (clearBoard && node.isWall) {
          this.toggleNode(row, col);
        } else if (!clearBoard && node.isWall) {
        } else if (clearBoard && !node.isWall) {
          this.modifyNode(node, clearBoard, `node`);
        } else {
          this.modifyNode(node, clearBoard, `node`);
        }
      }
    }

    this.modifyNode(
      grid[this.state.startPosition[0]][this.state.startPosition[1]],
      false,
      START_NODE
    );
    this.modifyNode(
      grid[this.state.finishPosition[0]][this.state.finishPosition[1]],
      false,
      FINISH_NODE
    );
  }

  recursiveWalls() {
    this.init(true);

    const output = recursiveWallBuilder(
      GRID_WIDTH,
      GRID_HEIGHT,
      this.state.startPosition[0],
      this.state.startPosition[1],
      this.state.finishPosition[0],
      this.state.finishPosition[1],
      WALL,
      AIR
    );
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        if (output[row][col] === WALL) {
          this.toggleNode(row, col);
        }
      }
    }
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    const console = <Console></Console>;
    const toolBar = <Toolbar pfv={this} console={console}></Toolbar>;
    return (
      <>
        {toolBar}
        <div id="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
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

const getInitialGrid = (startPosition, finishPosition) => {
  const grid = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const currentRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      currentRow.push(createNode(row, col, startPosition, finishPosition));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col, startPosition, finishPosition) => {
  return {
    row,
    col,
    isStart: row === startPosition[0] && col === startPosition[1],
    isFinish: row === finishPosition[0] && col === finishPosition[1],
    distance: Infinity,
    isVisited: false,
    isShortest: false,
    isWall: false,
    previousNode: null
  };
};

const getNewGridWithDistancesReset = grid => {
  const newGrid = grid.slice();
  for (let row of newGrid) {
    for (let node of row) {
      node.distance = Infinity;
      node.isVisited = false;
      node.isShortest = false;
      node.previousNode = null;
    }
  }
  return newGrid;
};

const getNewGridWithNodeToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStartToggled = (grid, row, col, oldPosition) => {
  grid[oldPosition[0]][oldPosition[1]].isStart = false;
  grid[row][col].isStart = true;
  return grid;
};
const getNewGridWithFinishToggled = (grid, row, col, oldPosition) => {
  grid[oldPosition[0]][oldPosition[1]].isFinish = false;
  grid[row][col].isFinish = true;
  return grid;
};

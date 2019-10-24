import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/Dijkstra";
import Toolbar from "../partials/toolbar";
import Console from "../partials/console";
import { recursiveWallBuilder } from "../algorithms/RecursiveWalls";

import "./PathfindingVisualizer.css";
var GRID_WIDTH = 5;
var GRID_HEIGHT = 5;

const NODE_SIZE = 25;

var START_NODE_ROW = 3;
var START_NODE_COL = 4;
var FINISH_NODE_ROW = GRID_HEIGHT - START_NODE_ROW;
var FINISH_NODE_COL = GRID_WIDTH - START_NODE_COL;

const START_NODE = `node-start`;
const FINISH_NODE = `node-finish`;
const NODE_VISITED = `node-visited`;
const NODE_SHORTEST_PATH = `node-shortest-path`;

const WALL = "W";
const AIR = "A";

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      start: 0,
      end: 0
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
      console.log(GRID_HEIGHT);
      START_NODE_ROW = 3;
      START_NODE_COL = 4;
      FINISH_NODE_ROW = GRID_HEIGHT - START_NODE_ROW;
      FINISH_NODE_COL = GRID_WIDTH - START_NODE_COL;
      document.getElementById("grid").style.height =
        (window.innerHeight - consoleBottom).toString() + "px";
      const grid = getInitialGrid();
      this.setState({ grid });
    }
  }

  handleMouseDown(row, col) {
    this.toggleWall(row, col);
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

  toggleWall(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: false });
  }

  removeWall(row, col) {
    const newGrid = getNewGridWithoutWall(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: false });
  }

  makeWall(row, col) {
    const newGrid = getNewGridWithWall(this.state.grid, row, col);
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
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    this.init(false);
    let start = performance.now();
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    let end = performance.now();
    let algorithm = "Dijkstra's Algorithm";
    this.renderTextToConsole(
      algorithm,
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
    let console = document.getElementById("console");
    console.innerHTML += openingTag + content + closingTag;
    console.scrollTo(0, console.scrollHeight);
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
    let numWalls = 0;

    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        let node = grid[row][col];

        if (clearBoard && node.isWall) {
          numWalls++;
          this.toggleWall(row, col);
        } else if (!clearBoard && node.isWall) {
        } else if (clearBoard && !node.isWall) {
          this.modifyNode(node, clearBoard, `node`);
        } else {
          this.modifyNode(node, clearBoard, `node`);
        }
      }
    }

    //console.log("Toggled: " + numWalls + " walls.");

    this.modifyNode(grid[START_NODE_ROW][START_NODE_COL], false, START_NODE);
    this.modifyNode(grid[FINISH_NODE_ROW][FINISH_NODE_COL], false, FINISH_NODE);
  }

  recursiveWalls() {
    this.init(true);

    const output = recursiveWallBuilder(
      GRID_WIDTH,
      GRID_HEIGHT,
      START_NODE_ROW,
      START_NODE_COL,
      FINISH_NODE_ROW,
      FINISH_NODE_COL,
      WALL,
      AIR
    );
    let numWalls = 0;
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        if (output[row][col] === WALL) {
          this.toggleWall(row, col);
          numWalls++;
        }
      }
    }
    //console.log("Created: " + numWalls + " walls.");
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

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const currentRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
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
    }
  }
  return newGrid;
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

const getNewGridWithoutWall = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: false
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWall = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: true
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

function offset(input) {
  var rect = input.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

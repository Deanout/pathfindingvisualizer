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

const NODE = `node`;
const NODE_START = `node-start`;
const NODE_FINISH = `node-finish`;
const NODE_WALL = `node-wall`;
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
      mouseIsPressed: true,
      nodeType: WALL,
      startPosition: [0, 0],
      finishPosition: [0, 1],
      previousNode: [-1, -1]
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
        this.drawGrid();
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
      this.drawGrid();
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
    return newGrid;
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
    return newGrid;
  }

  componentDidUpdate() {}

  handleMouseUp() {
    this.setState({
      mouseIsPressed: false,
      previousNode: [-1, -1],
      mouseTesta: "Set By Up"
    });
  }

  handleMouseDown(row, col) {
    const newGrid = this.toggleNodeType(row, col, true);
    this.setState({
      grid: newGrid,
      mouseIsPressed: true,
      previousNode: [row, col]
    });
    this.drawGrid();
  }

  handleMouseEnter(row, col) {
    if (
      !this.state.mouseIsPressed ||
      (row === this.state.previousNode[0] && col === this.state.previousNode[1])
    ) {
      return;
    } else {
      const newGrid = this.toggleNodeType(row, col, false);
      this.setState({ grid: newGrid, previousNode: [row, col] });
      this.drawGrid();
    }
  }

  toggleNodeType(row, col) {
    switch (this.state.nodeType) {
      case WALL:
        return this.toggleMouseNode(row, col);
      case START:
        return this.toggleStartPosition(row, col);
      case FINISH:
        return this.toggleFinishPosition(row, col);
      default:
        break;
    }
  }

  toggleMouseNode(row, col) {
    const newGrid = getNewGridWithNodeToggled(this.state.grid, row, col);
    return newGrid;
  }

  toggleNode(row, col) {
    const newGrid = getNewGridWithNodeToggled(this.state.grid, row, col);

    this.setState({ grid: newGrid });
  }

  toggleNodeOff(row, col) {
    const newGrid = getNewGridWithNodeToggledOff(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  toggleNodeAnimated(row, col) {
    const newGrid = getNewGridWithNodeToggledOn(this.state.grid, row, col);
    this.setState({ grid: newGrid });
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

        // If you're clearing the board and the node is a wall
        // but it is not the start node or finish node, then
        // toggle the node.
        if (clearBoard && node.isWall && !(node.isStart || node.isFinish)) {
          this.toggleNodeOff(row, col);
        }
      }
    }
    this.drawGrid(clearBoard);
  }

  removeClassFromNode(node, classToRemove) {
    document
      .getElementById(`node-${node.row}-${node.col}`)
      .classList.remove(classToRemove);
  }

  drawGrid(clearBoard) {
    const { grid } = this.state;
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        let node = grid[row][col];
        if (node.isWall) {
          this.modifyNode(node, true, `node node-wall`);
        } else {
          this.removeClassFromNode(node, NODE_WALL);
        }
        if (node.isStart) {
          this.modifyNode(node, true, `node node-start`);
        } else {
          this.removeClassFromNode(node, NODE_START);
        }
        if (node.isFinish) {
          this.modifyNode(node, true, `node node-finish`);
        } else {
          this.removeClassFromNode(node, NODE_FINISH);
        }
        if (clearBoard) {
          this.removeClassFromNode(node, NODE_VISITED);
          this.removeClassFromNode(node, NODE_SHORTEST_PATH);
        }
      }
    }
  }

  recursiveWalls() {
    this.init(true);
    const nodesToAnimate = recursiveWallBuilder(
      GRID_WIDTH,
      GRID_HEIGHT,
      this.state.startPosition[0],
      this.state.startPosition[1],
      this.state.finishPosition[0],
      this.state.finishPosition[1],
      WALL,
      AIR
    );

    this.animateWalls(nodesToAnimate);
  }
  animateWalls(nodesToAnimate) {
    const context = this;
    for (let i = 0; i < nodesToAnimate.length; i++) {
      if (
        this.state.grid[nodesToAnimate[i][0]][[nodesToAnimate[i][1]]].isStart ||
        this.state.grid[nodesToAnimate[i][0]][[nodesToAnimate[i][1]]].isFinish
      ) {
        nodesToAnimate.splice(i, 1);
        continue;
      }
      setTimeout(() => {
        context.modifyNode(
          context.state.grid[nodesToAnimate[i][0]][nodesToAnimate[i][1]],
          true,
          `node node-wall`
        );
      }, 25 * i);
      this.toggleNode(nodesToAnimate[i][0], nodesToAnimate[i][1]);
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

const getNewGridWithNodeToggledOff = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: false
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
const getNewGridWithNodeToggledOn = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: false,
    isFinish: false,
    isWall: true
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStartToggled = (grid, row, col, oldPosition) => {
  grid[oldPosition[0]][oldPosition[1]].isStart = false;
  grid[row][col].isFinish = false;
  grid[row][col].isWall = false;
  grid[row][col].isStart = true;
  return grid;
};
const getNewGridWithFinishToggled = (grid, row, col, oldPosition) => {
  grid[oldPosition[0]][oldPosition[1]].isFinish = false;
  grid[row][col].isStart = false;
  grid[row][col].isWall = false;
  grid[row][col].isFinish = true;
  return grid;
};

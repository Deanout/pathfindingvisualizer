import React, { Component } from "react";
import Node from "./node/node.jsx";
import {
  dijkstra,
  getNodesInShortestPathOrder
} from "../algorithms/dijkstra.js";
import Toolbar from "../partials/toolbar.jsx";
import Console from "../partials/console.jsx";
import store from "./gridstore.js";
import { observer } from "mobx-react";

import { recursiveWallBuilder } from "../algorithms/recursivewalls.js";

import "./pathfindingvisualizer.css";

// Initialize these values to something runnable, then
// update them after the component mounts.

var GRID_WIDTH = 5;
var GRID_HEIGHT = 5;
var NODE_WIDTH = 25;
var NODE_HEIGHT = 25;

// The list of nodes that are looped through and animated.
const NODES_TO_ANIMATE = [];

// Constants used to retrieve class names of different node types.
const NODE = `node`;
const NODE_START = `node-start`;
const NODE_FINISH = `node-finish`;
const NODE_WALL = `node-wall`;
const NODE_VISITED = `node-visited`;
const NODE_SHORTEST_PATH = `node-shortest-path`;

// The list of node types that exist in the grid.
const WALL = "wall";
const AIR = "air";
const START = "start";
const FINISH = "finish";

@observer
export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      initialized: false // Used for the initial grid draw
    };
  }

  /* After the initial render, this function runs.
   * Outline:
   * Get a reference to the bottom of the console in order to calculate the
   * grid height and width. Afterwards, set the grid's height and initialize the
   * grid with a start position and a finish position, but do not draw yet.
   *
   * Next add the event listeners for hotkeys.
   *
   * Finally, capture the mouse position and translate it into clamped values
   * in order to pass it to the appropriate handlers. By utilizing this method,
   * we avoid the mouseUp event not being called if the user clicks and drags
   * into a neighboring node too quickly.
   *
   */
  componentDidMount() {
    var consoleElement = document.getElementById("console");
    var consoleBottom = consoleElement.getBoundingClientRect().bottom;
    var grid = document.getElementById("grid");

    // Recalculate the grid's height and width in terms of node size.
    GRID_WIDTH = Math.floor(window.innerWidth / NODE_WIDTH);
    GRID_HEIGHT = Math.floor(
      (window.innerHeight - consoleBottom) / NODE_HEIGHT
    );

    // Set the grid's height to occupy all space below the console.
    grid.style.height = (window.innerHeight - consoleBottom).toString() + "px";

    // Set the state of the start and finish node positions declared above.
    store.startPosition = [3, 3];
    store.finishPosition = [GRID_HEIGHT - 3, GRID_WIDTH - 3];

    // Get the initial grid with start and finish node positions, and assign it to
    // the MobX grid.
    store.grid = getInitialGrid(store.startPosition, store.finishPosition);

    //this.setState({ initialized: false });
    // Add the hotkey event listener, setting the desired nodeTypes for each.
    window.requestAnimationFrame(() => {
      this.drawGrid();
    });
    document.addEventListener("keydown", event => {
      switch (event.key.toLowerCase()) {
        case "s":
          store.nodeType = START;
          break;
        case "w":
          store.nodeType = WALL;
          break;
        case "f":
          store.nodeType = FINISH;
          break;
        default:
          store.nodeType = WALL;
          break;
      }
      // Draw the grid on key press. This allows you to skip
      // the maze generation if you'd like.
      this.drawGrid();
    });
    /* Add the mousemove event listener.
     * NODE_WIDTH: The width of each node in pixels, at the time of the event.
     * NODE_HEIGHT: The width of each node in pixels, at the time of the event.
     * row: Clamped between 0 and NODE_HEIGHT.
     * col: Clamped between 0 and NODE_WIDTH.
     *
     * Before handling mouse enter, make sure we've entered a different node.
     */
    document.addEventListener("mousemove", event => {
      NODE_WIDTH = grid.firstElementChild.firstElementChild.getBoundingClientRect()
        .width;
      NODE_HEIGHT = grid.firstElementChild.firstElementChild.getBoundingClientRect()
        .height;

      var x = event.clientX;
      var y = event.clientY;
      var row = Math.floor((y - consoleBottom) / NODE_HEIGHT);
      var col = Math.floor(x / NODE_WIDTH);
      let oldMousePosition = store.mousePosition;
      row = Math.clamp(row, 0, GRID_HEIGHT - 1);
      col = Math.clamp(col, 0, GRID_WIDTH - 1);
      if (row !== oldMousePosition[0] || col !== oldMousePosition[1]) {
        store.mousePosition = [row, col];
        this.handleMouseEnter(row, col);
      }
    });
  }

  // Meant to loop through the nodes and animate x amount per frame.
  componentDidUpdate() {
    if (NODES_TO_ANIMATE.length > 0) {
      let node = NODES_TO_ANIMATE.shift();
      this.drawNode(node);
    }
  }

  handleMouseUp() {
    store.mouseIsPressed = false;
  }

  // Toggle the node, set the previous node, then draw the node.
  handleMouseDown(row, col) {
    this.toggleNodeType(row, col);
    store.mouseIsPressed = true;
    store.previousNode = [row, col];
    this.drawNode(store.grid[row][col]);
  }

  handleMouseEnter(row, col) {
    if (!store.mouseIsPressed) {
      return;
    } else {
      this.toggleNodeType(row, col);
      NODES_TO_ANIMATE.push(store.grid[row][col]);
      store.previousNode = [row, col];
    }
  }

  toggleNodeType(row, col) {
    console.log(store.nodeType);
    switch (store.nodeType) {
      case WALL:
        toggleWall(row, col);
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

  toggleStartPosition(row, col) {
    let oldRow = store.startPosition[0];
    let oldCol = store.startPosition[1];

    store.grid[oldRow][oldCol].isStart = false;
    store.grid[row][col].isFinish = false;
    store.grid[row][col].isWall = false;
    store.grid[row][col].isStart = true;

    // Now we need to turn off the previous start node's class.
    this.drawNode(store.grid[oldRow][oldCol]);
    this.drawNode(store.grid[row][col]);

    store.startPosition = [row, col];
  }

  toggleFinishPosition(row, col) {
    let oldRow = store.finishPosition[0];
    let oldCol = store.finishPosition[1];

    store.grid[oldRow][oldCol].isFinish = false;
    store.grid[row][col].isStart = false;
    store.grid[row][col].isWall = false;
    store.grid[row][col].isFinish = true;

    // Now we need to turn off the previous finish node's class.
    this.drawNode(store.grid[oldRow][oldCol]);
    this.drawNode(store.grid[row][col]);

    store.finishPosition = [row, col];
  }

  resetDistances() {
    store.grid = getNewGridWithDistancesReset(store.grid);
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (i === visitedNodesInOrder.length - 1) {
          if (nodesInShortestPathOrder.length > 1) {
          } else {
            this.modifyNode(node, false, NODE_VISITED);
          }
        } else {
          this.modifyNode(node, false, NODE_VISITED);
        }
      }, 10 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        this.modifyNode(node, false, NODE_SHORTEST_PATH);
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    this.resetDistances();

    const startNode =
      store.grid[store.startPosition[0]][store.startPosition[1]];
    const finishNode =
      store.grid[store.finishPosition[0]][store.finishPosition[1]];
    this.init(false);
    let start = performance.now();
    const visitedNodesInOrder = dijkstra(store.grid, startNode, finishNode);
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
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        let node = store.grid[row][col];

        // If you're clearing the board and the node is a wall
        // but it is not the start node or finish node, then
        // toggle the node.
        if (clearBoard && node.isWall && !(node.isStart || node.isFinish)) {
          toggleWallOff(row, col);
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

  drawNode(node) {
    if (node.isWall) {
      this.modifyNode(node, true, NODE + " " + NODE_WALL);
    } else {
      this.removeClassFromNode(node, NODE_WALL);
    }
    if (node.isStart) {
      this.modifyNode(node, true, NODE + " " + NODE_START);
    } else {
      this.removeClassFromNode(node, NODE_START);
    }
    if (node.isFinish) {
      this.modifyNode(node, true, NODE + " " + NODE_FINISH);
    } else {
      this.removeClassFromNode(node, NODE_FINISH);
    }
  }

  drawGrid(clearBoard) {
    for (let row = 0; row < GRID_HEIGHT; row++) {
      for (let col = 0; col < GRID_WIDTH; col++) {
        let node = store.grid[row][col];
        if (node.isWall) {
          this.modifyNode(node, true, NODE + " " + NODE_WALL);
        } else {
          this.removeClassFromNode(node, NODE_WALL);
        }
        if (node.isStart) {
          this.modifyNode(node, true, NODE + " " + NODE_START);
        } else {
          this.removeClassFromNode(node, NODE_START);
        }
        if (node.isFinish) {
          this.modifyNode(node, true, NODE + " " + NODE_FINISH);
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
      store.startPosition[0],
      store.startPosition[1],
      store.finishPosition[0],
      store.finishPosition[1],
      WALL,
      AIR
    );

    this.animateWalls(nodesToAnimate);
  }
  // Change this context.modify to use drawnode maybe?
  // Might remove the need to splice or something
  animateWalls(nodesToAnimate) {
    const context = this;
    for (let i = 0; i < nodesToAnimate.length; i++) {
      let row = nodesToAnimate[i][0];
      let col = [nodesToAnimate[i][1]];
      if (store.grid[row][col].isStart || store.grid[row][col].isFinish) {
        nodesToAnimate.splice(i, 1);
        continue;
      }
      setTimeout(() => {
        context.modifyNode(store.grid[row][col], true, `node node-wall`);
      }, 10 * i);
      toggleWall(nodesToAnimate[i][0], nodesToAnimate[i][1]);
    }
  }

  // Too many calls to render means this is expensive to compute.
  // Could increase speed if the grid generation is only done once
  // maybe?
  render() {
    const consoleElement = <Console></Console>;
    const toolBar = <Toolbar pfv={this} console={consoleElement}></Toolbar>;

    return (
      <>
        {toolBar}
        <div
          id="grid"
          onMouseDown={() =>
            this.handleMouseDown(store.mousePosition[0], store.mousePosition[1])
          }
          onMouseUp={() => this.handleMouseUp()}
        >
          {store.grid.map((row, rowIdx) => {
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
    parent: null
  };
};

const getNewGridWithDistancesReset = grid => {
  const newGrid = grid.slice();
  for (let row of newGrid) {
    for (let node of row) {
      node.distance = Infinity;
      node.isVisited = false;
      node.isShortest = false;
      node.parent = null;
    }
  }
  return newGrid;
};

const toggleWall = (row, col) => {
  store.grid[row][col].isWall = !store.grid[row][col].isWall;
};

const toggleWallOff = (row, col) => {
  store.grid[row][col].isWall = false;
};

Math.clamp = (value, min, max) => {
  return Math.min(Math.max(min, value), max);
};

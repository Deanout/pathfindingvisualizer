import React, { Component } from "react";
import Node from "./node/node.jsx";
import { dijkstra, getShortestDijkstraPath } from "../algorithms/dijkstra.js";
import { AStar, getShortestAStarPath } from "../algorithms/astar.js";
import { AStarPQ, getShortestAStarPQPath } from "../algorithms/astarpq.js";
import { BFS, getShortestBFSPath } from "../algorithms/bfs.js";
import { DFS, getShortestDFSPath } from "../algorithms/dfs.js";
import Toolbar from "../partials/toolbar.jsx";
import Console from "../partials/console.jsx";
import store from "../store/gridstore.js";
import { observer } from "mobx-react";
import { recursiveWallBuilder } from "../algorithms/recursivewalls.js";
import { simplexTerrain } from "../algorithms/noisewalls.js";
import { randomWalls } from "../algorithms/randomwalls.js";

import "./pathfindingvisualizer.css";

const NODE_VISITED = `node-visited`;
const NODE_SHORTEST_PATH = `node-shortest-path`;

var shortestPathAnimationTimer;
var pathAnimationTimer;
var updatePathTimer;
var resizeTimer;

@observer
export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.setup();
    var grid = document.getElementById("grid");
    // PC Events
    document.addEventListener("mousemove", this.onMouseMove, false);
    document.addEventListener("keydown", this.onKeyDown, false);
    document.addEventListener("mouseup", this.onMouseUp, false);
    grid.addEventListener("mousedown", this.onMouseDown, false);
    window.addEventListener("resize", this.onResize, false);
    // Mobile Events
    document.addEventListener("touchmove", this.onMouseMove, false);
    document.addEventListener("touchend", this.onMouseUp, false);
    grid.addEventListener("touchstart", this.onMouseDown, false);
  }
  componentWillUnmount() {
    // PC Events
    document.removeEventListener("mousemove", this.onMouseMove, false);
    document.removeEventListener("keydown", this.onKeyDown, false);
    document.removeEventListener("mouseup", this.onMouseUp, false);
    grid.removeEventListener("mousedown", this.onMouseDown, false);
    window.removeEventListener("resize", this.onResize, false);

    // Mobile Events
    document.removeEventListener("touchmove", this.onMouseMove, false);
    document.removeEventListener("touchup", this.onMouseUp, false);
    grid.removeEventListener("touchdown", this.onMouseDown, false);
  }
  onResize = event => {
    if (
      window.innerWidth / store.nodeWidth > store.gridWidth + 1 ||
      window.innerWidth / store.nodeWidth < store.gridWidth - 1 ||
      (window.innerHeight - store.consoleBottom) / store.nodeHeight >
        store.gridHeight + 1 ||
      (window.innerHeight - store.consoleBottom) / store.nodeHeight <
        store.gridHeight - 1
    ) {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        store.resetNodeSize(store.nodeSize);
        this.initializeGridSizes();
        this.resizeGrid();
        this.drawGrid();
      }, 100);
    }
  };
  onMouseDown = event => {
    switch (event.button) {
      case 0:
        this.handleMouseDown(0);
        break;
      case 1:
        this.handleMiddleMouseDown();
        break;
      case 2:
        this.handleMouseDown(2);
        break;
      default:
        let target = document
          .elementFromPoint(event.touches[0].clientX, event.touches[0].clientY)
          .id.split("-");
        store.mousePosition[0] = target[1];
        store.mousePosition[1] = target[2];
        this.handleMouseDown(0);
        break;
    }
  };
  onMouseUp = event => {
    this.handleMouseUp();
  };
  onKeyDown = event => {
    switch (event.key.toLowerCase()) {
      case "s":
        store.clickNodeType = store.nodeTypes.start;
        break;
      case "w":
        store.clickNodeType = store.nodeTypes.wall;
        break;
      case "f":
        store.clickNodeType = store.nodeTypes.finish;
        break;
      case " ":
        event.preventDefault();
        break;
      case "arrowup":
        this.handleNodeSelect(-1);
        break;
      case "arrowdown":
        this.handleNodeSelect(1);
        break;
      default:
        break;
    }
    // Draw the grid on key press. This allows you to skip
    // the maze generation if you'd like.
    this.drawGrid();
  };
  onMouseMove = event => {
    {
      if (
        grid.firstElementChild != null &&
        grid.firstElementChild.firstElementChild != null
      ) {
        // Grab Nodes via event id:
        // This approach works through scaling, so we don't need to
        // recalculate the nodesize.
        let target;
        let row, col;
        let x, y;
        if (event.clientX != undefined) {
          x = Math.clamp(event.clientX, 1, grid.offsetWidth - 1);
          y = Math.clamp(
            event.clientY,
            store.consoleBottom + 1,
            grid.offsetHeight + store.consoleBottom - 2
          );
          target = document.elementFromPoint(x, y).id.split("-");
        } else if (event.touches[0]) {
          x = Math.clamp(event.touches[0].clientX, 1, grid.offsetWidth - 1);
          y = Math.clamp(
            event.touches[0].clientY,
            store.consoleBottom + 1,
            grid.offsetHeight + store.consoleBottom - 2
          );
        }
        target = document.elementFromPoint(x, y).id.split("-");
        row = target[1];
        col = target[2];

        let oldRow = store.mousePosition[0];
        let oldCol = store.mousePosition[1];
        if ((row != oldRow || col != oldCol) && (!isNaN(row) && !isNaN(col))) {
          row = Math.clamp(row, 0, store.gridHeight - 1);
          col = Math.clamp(col, 0, store.gridWidth - 1);
          store.mousePosition = [row, col];
          let oldNodeType = store.nodeTypeAtMousePosition;
          store.nodeTypeAtMousePosition = store.grid[row][col].nodeType;

          this.handleMouseEnter(row, col);

          if (
            oldNodeType != store.nodeTypes.start &&
            oldNodeType != store.nodeTypes.finish
          ) {
            this.handleMouseLeave(oldRow, oldCol, oldNodeType);
          }
          if (
            store.mouseButton === 0 &&
            (store.clickNodeType == store.nodeTypes.start ||
              store.clickNodeType == store.nodeTypes.finish)
          ) {
            this.updateShortestPath();
          }
        }
      }
    }
  };
  setup() {
    this.initializeGridSizes();
    // Recalculate the grid's height and width in terms of node size.
    store.gridWidth = Math.floor(window.innerWidth / store.nodeWidth);
    store.gridHeight = Math.floor(
      (window.innerHeight - store.consoleBottom) / store.nodeHeight
    );
    this.initializeKeyNodes();

    store.grid.replace(getInitialGrid());
    setKeyNode(
      store.startPosition[0],
      store.startPosition[1],
      store.nodeTypes.start
    );
    setKeyNode(
      store.finishPosition[0],
      store.finishPosition[1],
      store.nodeTypes.finish
    );
    window.requestAnimationFrame(() => {
      this.drawGrid();
    });
  }

  initializeGridSizes() {
    var grid = document.getElementById("grid");

    var consoleElement = document.getElementById("console");
    consoleElement.style.marginTop =
      document.getElementById("AppBar").offsetHeight + "px";
    store.consoleBottom = consoleElement.getBoundingClientRect().bottom;

    // Set the grid's height to occupy all space below the console.
    grid.style.height =
      (window.innerHeight - store.consoleBottom).toString() + "px";
  }

  initializeKeyNodes() {
    if (store.gridWidth >= 5 && store.gridHeight >= 5) {
      store.startPosition = [3, 3];
      store.finishPosition = [store.gridHeight - 3, store.gridWidth - 3];
    } else {
      store.startPosition = [0, 0];
      store.finishPosition = [store.gridHeight - 1, store.gridWidth - 1];
    }
  }

  resizeGrid() {
    var oldGridHeight = store.gridHeight;
    var oldGridWidth = store.gridWidth;

    // Recalculate the grid's height and width in terms of node size.
    store.gridWidth = Math.floor(window.innerWidth / store.nodeWidth);
    store.gridHeight = Math.floor(
      (window.innerHeight - store.consoleBottom) / store.nodeHeight
    );
    var grewVertically = oldGridHeight > store.gridHeight ? false : true;
    var grewHorizontally = oldGridWidth > store.gridWidth ? false : true;

    let startChanged = false;
    let finishChanged = false;

    if (store.startNode.row > store.gridHeight - 1) {
      store.startPosition[0] = store.gridHeight - 1;
      startChanged = true;
    }
    if (store.startNode.col > store.gridWidth - 1) {
      store.startPosition[1] = store.gridWidth - 1;
      startChanged = true;
    }
    if (store.finishNode.row > store.gridHeight - 1) {
      store.finishPosition[0] = store.gridHeight - 1;
      finishChanged = true;
    }
    if (store.finishNode.col > store.gridWidth - 1) {
      store.finishPosition[1] = store.gridWidth - 1;
      finishChanged = true;
    }

    if (startChanged) {
      this.toggleKeyPosition(
        store.startPosition[0],
        store.startPosition[1],
        store.nodeTypes.start
      );
    }
    if (finishChanged) {
      this.toggleKeyPosition(
        store.finishPosition[0],
        store.finishPosition[1],
        store.nodeTypes.finish
      );
    }

    const modGrid = store.grid;

    if (!grewVertically) {
      modGrid.splice(store.gridHeight, oldGridHeight - store.gridHeight);
    }
    if (!grewHorizontally) {
      for (let row = 0; row < store.gridHeight; row++) {
        modGrid[row].splice(store.gridWidth, oldGridWidth - store.gridWidth);
      }
    }
    if (grewVertically && !grewHorizontally) {
      for (let row = oldGridHeight; row < store.gridHeight; row++) {
        let currentRow = [];
        for (let col = 0; col < oldGridWidth; col++) {
          currentRow.push(createNode(row, col));
        }
        modGrid.push(currentRow);
      }
    }
    if (grewVertically && grewHorizontally) {
      for (let row = 0; row < store.gridHeight; row++) {
        if (row < oldGridHeight) {
          for (let col = oldGridWidth; col < store.gridWidth; col++) {
            modGrid[row].push(createNode(row, col));
          }
        } else {
          let currentRow = [];
          for (let col = 0; col < store.gridWidth; col++) {
            currentRow.push(createNode(row, col));
          }
          modGrid.push(currentRow);
        }
      }
    }

    store.grid.replace(modGrid);

    requestAnimationFrame(() => {
      this.drawGrid();
    });
  }

  calculateNodeSize(grid) {
    store.nodeWidth = grid.firstElementChild.firstElementChild.getBoundingClientRect().width;
    store.nodeHeight = grid.firstElementChild.firstElementChild.getBoundingClientRect().height;
  }

  handleNodeSelect(direction) {
    let index = store.clickNodeIndex;
    let length = store.clickableNodeTypes.length;
    if (index + direction < 0) {
      index = length - 1;
    } else if (index + direction > length - 1) {
      index = 0;
    } else {
      index += direction;
    }
    store.clickNodeIndex = index;
    store.clickNodeType = store.clickableNodeTypes[index];
  }

  handleMouseUp() {
    store.mouseButton = -1;
    store.clickNodeType = store.previousClickNodeType;
  }

  // Toggle the node, set the previous node location, then draw the node.
  handleMouseDown(mouseButton) {
    let row = store.mousePosition[0];
    let col = store.mousePosition[1];
    let node = store.grid[row][col];
    if (node.nodeType == store.nodeTypes.start) {
      store.previousClickNodeType = store.clickNodeType;
      store.clickNodeType = store.nodeTypes.start;
    } else if (node.nodeType == store.nodeTypes.finish) {
      store.previousClickNodeType = store.clickNodeType;
      store.clickNodeType = store.nodeTypes.finish;
    } else {
      store.previousClickNodeType = store.clickNodeType;
      this.handleMouseButton(mouseButton);
    }
    this.toggleNodeType(row, col);

    store.mouseButton = mouseButton;
    store.previousNode = [row, col];
    this.drawNode(store.grid[row][col]);
  }

  handleMouseEnter(row, col) {
    if (store.mouseButton === -1) {
      return;
    } else {
      if (!isNaN(row) && !isNaN(col)) {
        this.toggleNodeType(row, col);
        this.drawNode(store.grid[row][col]);
        store.previousNode = [row, col];
      }
    }
  }

  handleMouseLeave(oldRow, oldCol, oldNodeType) {
    if (store.mouseButton === -1) {
      return;
    } else if (
      store.clickNodeType == store.nodeTypes.start ||
      store.clickNodeType == store.nodeTypes.finish
    ) {
      if (!isNaN(oldRow) && !isNaN(oldCol)) {
        this.toggleNodeType(oldRow, oldCol, oldNodeType);
        this.drawNode(store.grid[oldRow][oldCol]);
      }
    }
  }

  handleMouseButton(button) {
    if (button === 0) {
    } else if (button === 2) {
      store.clickNodeType = store.nodeTypes.air;
    }
  }

  handleMiddleMouseDown() {
    let row = store.mousePosition[0];
    let col = store.mousePosition[1];
    let nodeType = store.grid[row][col].nodeType;
    store.clickNodeType = nodeType;
    store.previousClickNodeType = nodeType;
    store.clickableNodeIndexFromNodeType(nodeType);
  }

  toggleNodeType(row, col, nodeType) {
    nodeType = nodeType == undefined ? store.clickNodeType : nodeType;
    switch (nodeType) {
      case store.nodeTypes.start:
        this.toggleKeyPosition(row, col, store.nodeTypes.start);
        break;
      case store.nodeTypes.finish:
        this.toggleKeyPosition(row, col, store.nodeTypes.finish);
        break;
      default:
        setNodeType(row, col, nodeType);
        break;
    }
  }

  toggleKeyPosition(row, col, nodeType) {
    let target = store.grid[row][col];
    let oldRow;
    let oldCol;
    if (
      target.nodeType != store.nodeTypes.start &&
      target.nodeType != store.nodeTypes.finish
    ) {
      if (nodeType == store.nodeTypes.start) {
        oldRow = store.startNode.row;
        oldCol = store.startNode.col;
        store.startPosition = [row, col];
      } else {
        oldRow = store.finishNode.row;
        oldCol = store.finishNode.col;
        store.finishPosition = [row, col];
      }

      setKeyNode(oldRow, oldCol, store.nodeTypes.air);
      setKeyNode(row, col, nodeType);

      // Now we need to turn off the previous start node's class.
      this.drawNode(store.grid[oldRow][oldCol]);
      this.drawNode(target);
    }
  }

  updateShortestPath() {
    if (store.pathDrawn) {
      clearTimeout(updatePathTimer);
      updatePathTimer = setTimeout(() => {
        let animationSpeed = store.currentAnimationSpeed;
        store.currentAnimationSpeed = store.animationSpeed.instant;
        this.visualizeAlgorithm(store.algorithm);
        requestAnimationFrame(() => {
          store.currentAnimationSpeed = animationSpeed;
        });
      }, 1);
    }
  }

  visualizeAlgorithm(algorithm) {
    this.gridStateManager(0);
    this.resetDistances();
    store.pathDrawn = true;
    switch (algorithm) {
      case 0:
      case 1:
        //this.visualizeDijkstra(startNode, finishNode);
        this.findPath(dijkstra, "Dijkstra's", getShortestDijkstraPath);
        break;
      case 2:
        this.findPath(AStar, "A*", getShortestAStarPath);
        break;
      case 3:
        this.findPath(BFS, "BFS", getShortestBFSPath);
        break;
      case 4:
        this.findPath(DFS, "DFS", getShortestDFSPath);
        break;
      case 5:
        this.findPath(AStarPQ, "A*PQ", getShortestAStarPQPath);
        break;
      default:
        this.findPath(dijkstra, "Dijkstra's", getShortestDijkstraPath);
        break;
    }
  }

  resetDistances() {
    for (let row of store.grid) {
      for (let node of row) {
        node.distance = Infinity;
        node.isVisited = false;
        node.isShortest = false;
        node.parent = null;
        node.neighbor = null;
        node.closed = false;
        node.fScore = Infinity;
        node.hScore = Infinity;
        node.gScore = Infinity;
      }
    }
  }

  findPath(algorithm, name, shortestPath) {
    let startNode = store.grid[store.startPosition[0]][store.startPosition[1]];
    let finishNode =
      store.grid[store.finishPosition[0]][store.finishPosition[1]];
    let start = performance.now();
    const visitedNodesInOrder = algorithm(
      store.grid,
      startNode,
      finishNode,
      store.gridWidth,
      store.gridHeight
    );
    let end = performance.now();
    const nodesInShortestPathOrder = shortestPath(finishNode);
    this.renderTextToConsole(
      name,
      visitedNodesInOrder,
      nodesInShortestPathOrder,
      start,
      end,
      `<p class="statistic-text">`,
      `</p>`
    );

    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  renderTextToConsole(
    algorithm,
    total,
    path,
    start,
    end,
    openingTag,
    closingTag
  ) {
    let time = (end - start).toFixed(2).toString();
    let content =
      "[" +
      store.consoleLineNumber +
      "] " +
      algorithm +
      " visited " +
      total.length +
      " nodes in: " +
      time +
      " ms. Path length = " +
      path.length +
      ".";

    let consoleElement = document.getElementById("console");
    consoleElement.innerHTML += openingTag + content + closingTag;
    consoleElement.scrollTo(0, consoleElement.scrollHeight);
    store.consoleLineNumber++;
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    if (store.currentAnimationSpeed == 0) {
      for (let i = 0; i < visitedNodesInOrder.length; i++) {
        this.createPath(visitedNodesInOrder[i], NODE_VISITED);
      }
      for (let j = 0; j < nodesInShortestPathOrder.length; j++) {
        this.createPath(nodesInShortestPathOrder[j], NODE_SHORTEST_PATH);
      }
    } else {
      if (store.onlyDrawShortestPath) {
        this.shortestPathAnimation(
          0,
          store.currentAnimationSpeed,
          nodesInShortestPathOrder,
          this
        );
        return;
      }
      this.pathAnimation(
        0,
        store.currentAnimationSpeed,
        visitedNodesInOrder,
        nodesInShortestPathOrder,
        this
      );
    }
  }

  pathAnimation(
    index,
    animationSpeed,
    visitedNodesInOrder,
    nodesInShortestPathOrder,
    context
  ) {
    if (index > visitedNodesInOrder.length) {
      context.shortestPathAnimation(
        0,
        animationSpeed,
        nodesInShortestPathOrder,
        context
      );
    } else {
      const node = visitedNodesInOrder[index];
      if (index === visitedNodesInOrder.length) {
      } else {
        context.createPath(node, NODE_VISITED);
      }
      // f(n), delay, arg_0, ..., arg_n
      pathAnimationTimer = setTimeout(
        context.pathAnimation,
        animationSpeed,
        ++index,
        animationSpeed,
        visitedNodesInOrder,
        nodesInShortestPathOrder,
        context
      );
    }
  }
  shortestPathAnimation(
    index,
    animationSpeed,
    nodesInShortestPathOrder,
    context
  ) {
    if (index >= nodesInShortestPathOrder.length - 1) {
      return;
    }
    const node = nodesInShortestPathOrder[index];
    context.createPath(node, NODE_SHORTEST_PATH);
    // f(n), delay, arg_0, ..., arg_n
    shortestPathAnimationTimer = setTimeout(
      context.shortestPathAnimation,
      animationSpeed,
      ++index,
      animationSpeed,
      nodesInShortestPathOrder,
      context
    );
  }

  gridStateManager(clearFlag) {
    switch (clearFlag) {
      case 0:
        // clear paths
        this.clearAllPaths();
        break;
      case 1:
        // clear paths
        this.clearAllPaths();
        break;
      case 2:
        // clear board
        this.clearBoard();
        this.clearAllPaths();
        break;
      case 3:
        // reset board
        this.clearBoard();
        this.clearAllPaths();
        this.setup();
        break;
      default:
        break;
    }
    store.pathDrawn = false;
  }

  clearAllPaths() {
    for (let row = 0; row < store.gridHeight; row++) {
      for (let col = 0; col < store.gridWidth; col++) {
        let node = store.grid[row][col];
        this.removePath(node, NODE_VISITED);
        this.removePath(node, NODE_SHORTEST_PATH);
        clearTimeout(pathAnimationTimer);
        clearTimeout(shortestPathAnimationTimer);
      }
    }
  }

  clearBoard() {
    for (let row = 0; row < store.gridHeight; row++) {
      for (let col = 0; col < store.gridWidth; col++) {
        let node = store.grid[row][col];
        setNodeType(row, col, store.nodeTypes.air);
      }
    }
    this.drawGrid();
  }
  createPath(node, newClass) {
    document.getElementById(
      `node-${node.row}-${node.col}`
    ).firstChild.className += ` ${newClass}`;
  }
  removePath(node, newClass) {
    document
      .getElementById(`node-${node.row}-${node.col}`)
      .firstChild.classList.remove(newClass);
  }

  removeClassFromNode(node, classToRemove) {
    document
      .getElementById(`node-${node.row}-${node.col}`)
      .classList.remove(classToRemove);
  }

  drawNode(node) {
    let nodeType = node.nodeType;
    document.getElementById(
      `node-${node.row}-${node.col}`
    ).className = `node ${nodeType.class}`;
  }

  drawGrid() {
    for (let row = 0; row < store.gridHeight; row++) {
      for (let col = 0; col < store.gridWidth; col++) {
        let node = store.grid[row][col];
        this.drawNode(node);
      }
    }
  }

  generateTerrain(terrain) {
    switch (terrain) {
      case 0:
      case 1:
        this.handleTerrainGeneration(recursiveWallBuilder);
        break;
      case 2:
        this.handleTerrainGeneration(simplexTerrain);
        break;
      case 3:
        this.handleTerrainGeneration(randomWalls);
        break;
      default:
        this.handleTerrainGeneration(recursiveWallBuilder);
        break;
    }
  }

  handleTerrainGeneration(terrain) {
    this.gridStateManager(2);
    const nodesToAnimate = terrain();
    this.animateTerrain(nodesToAnimate);
  }

  animateTerrain(nodesToAnimate) {
    let speedMod = store.terrain == 0 || store.terrain == 1 ? 1 : 0;
    for (let i = 0; i < nodesToAnimate.length; i++) {
      let row = nodesToAnimate[i][0];
      let col = nodesToAnimate[i][1];
      let nodeType = nodesToAnimate[i][2];
      setTimeout(() => {
        this.drawNode(store.grid[row][col], nodeType);
      }, store.currentAnimationSpeed * speedMod * i);
      setNodeType(row, col, nodeType);
    }
  }

  render() {
    const consoleElement = <Console></Console>;
    const toolBar = (
      <Toolbar
        pfv={this}
        console={consoleElement}
        algorithm={this.state.algorithm}
      ></Toolbar>
    );
    return (
      <>
        {toolBar}
        <div
          id="grid"
          onContextMenu={event => {
            event.preventDefault();
            return false;
          }}
        >
          {store.grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row" id={`row-${rowIdx}`}>
                {row.map((node, nodeIdx) => {
                  const { row, col } = node;
                  return <Node key={nodeIdx} row={row} col={col}></Node>;
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
  const output = [];
  for (let row = 0; row < store.gridHeight; row++) {
    const currentRow = [];
    for (let col = 0; col < store.gridWidth; col++) {
      currentRow.push(createNode(row, col));
    }
    output.push(currentRow);
  }
  return output;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    closed: false,
    distance: Infinity,
    fScore: Infinity,
    gScore: Infinity,
    hScore: Infinity,
    isShortest: false,
    isVisited: false,
    neighbor: null,
    nodeType: store.defaultNodeType,
    parent: null
  };
};

const setNodeType = (row, col, nodeType) => {
  let node = store.grid[row][col];
  if (
    node.nodeType != store.nodeTypes.start &&
    node.nodeType != store.nodeTypes.finish
  ) {
    node.nodeType = nodeType;
  }
};

const setKeyNode = (row, col, nodeType) => {
  let node = store.grid[row][col];
  if (nodeType == store.nodeTypes.start) {
    store.startNode = node;
  } else if (nodeType == store.nodeTypes.finish) {
    store.finishNode = node;
  }
  store.grid[row][col].nodeType = nodeType;
};

Math.clamp = (value, min, max) => {
  return Math.min(Math.max(min, value), max);
};

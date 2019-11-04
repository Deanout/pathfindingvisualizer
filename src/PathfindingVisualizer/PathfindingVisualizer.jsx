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

// Constants used to retrieve class names of different node types.

const NODE_VISITED = `node-visited`;

const NODE_SHORTEST_PATH = `node-shortest-path`;

@observer
export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {};
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
    this.setup();
    window.requestAnimationFrame(() => {
      this.drawGrid();
    });
    window.addEventListener("resize", event => {
      if (
        Math.floor(window.innerWidth / store.nodeWidth) > store.gridWidth + 1 ||
        Math.floor(window.innerWidth / store.nodeWidth) < store.gridWidth - 1 ||
        Math.floor(
          (window.innerHeight - store.consoleBottom) / store.nodeHeight
        ) >
          store.gridHeight + 1 ||
        Math.floor(
          (window.innerHeight - store.consoleBottom) / store.nodeHeight
        ) <
          store.gridHeight - 1
      ) {
        this.setup();
        requestAnimationFrame(() => {
          this.drawGrid();
        });
      }
    });
    document.addEventListener("keydown", event => {
      switch (event.key.toLowerCase()) {
        case "s":
          store.clickNodeType = store.start;
          break;
        case "w":
          store.clickNodeType = store.wall;
          break;
        case "f":
          store.clickNodeType = store.finish;
          break;
        case " ":
          document.activeElement.blur();
          this.init(false);
          break;
        case "arrowup":
          this.handleNodeSelect(-1);
          break;
        case "arrowdown":
          this.handleNodeSelect(1);
          break;
        default:
          store.clickNodeType = store.air;
          break;
      }
      // Draw the grid on key press. This allows you to skip
      // the maze generation if you'd like.
      this.drawGrid();
    });
    document.addEventListener("mouseup", event => {
      this.handleMouseUp();
    });
    document.getElementById("grid").addEventListener("mousedown", event => {
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
          break;
      }
    });
    /* Add the mousemove event listener.
     * store.nodeWidth: The width of each node in pixels, at the time of the event.
     * store.nodeHeight: The width of each node in pixels, at the time of the event.
     * row: Clamped between 0 and store.nodeHeight.
     * col: Clamped between 0 and store.nodeWidth.
     *
     * Before handling mouse enter, make sure we've entered a different node.
     *
     * TODO: Draw lines tracing the mouse movement and add the nodes
     * according to which nodes the line touches. This would fix the
     * mouse move event not updating fast enough.
     */
    document.getElementById("grid").addEventListener("mousemove", event => {
      if (
        grid.firstElementChild != null &&
        grid.firstElementChild.firstElementChild != null
      ) {
        store.nodeWidth = grid.firstElementChild.firstElementChild.getBoundingClientRect().width;
        store.nodeHeight = grid.firstElementChild.firstElementChild.getBoundingClientRect().height;
        var x = event.clientX;
        var y = event.clientY;
        var row = Math.floor((y - store.consoleBottom) / store.nodeHeight);
        var col = Math.floor(x / store.nodeWidth);
        let oldMousePosition = store.mousePosition;

        row = Math.clamp(row, 0, store.gridHeight - 1);
        col = Math.clamp(col, 0, store.gridWidth - 1);
        if (row !== oldMousePosition[0] || col !== oldMousePosition[1]) {
          store.mousePosition = [row, col];
          this.handleMouseEnter(row, col, store.mouseButton);
        }
      }
    });
    // requestAnimationFrame(() => {
    //   this.generateTerrain(2);
    // });
  }

  setup() {
    console.log("Setup ran");
    var grid = document.getElementById("grid");

    var consoleElement = document.getElementById("console");
    store.consoleBottom = consoleElement.getBoundingClientRect().bottom;

    // Recalculate the grid's height and width in terms of node size.
    store.gridWidth = Math.floor(window.innerWidth / store.nodeWidth);
    store.gridHeight = Math.floor(
      (window.innerHeight - store.consoleBottom) / store.nodeHeight
    );
    // Set the grid's height to occupy all space below the console.
    grid.style.height =
      (window.innerHeight - store.consoleBottom).toString() + "px";

    if (store.gridWidth >= 5 && store.gridHeight >= 5) {
      store.startPosition = [3, 3];
      store.finishPosition = [store.gridHeight - 3, store.gridWidth - 3];
    } else {
      store.startPosition = [0, 0];
      store.finishPosition = [store.gridHeight - 1, store.gridWidth - 1];
    }

    // Get the initial grid with start and finish node positions, and assign it to
    // the MobX grid.

    store.grid.replace(getInitialGrid());
    setKeyNode(store.startPosition[0], store.startPosition[1], store.start);
    setKeyNode(store.finishPosition[0], store.finishPosition[1], store.finish);
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
    console.log("Node Height: " + store.nodeHeight);
    console.log("Node Width: " + store.nodeWidth);
    console.log("Oldgridheight: " + oldGridHeight);
    console.log("oldgridwidth: " + oldGridWidth);
    console.log("New grid height: " + store.gridHeight);
    console.log("New grid width: " + store.gridWidth);
    const modGrid = store.grid;

    if (!grewVertically) {
      modGrid.splice(store.gridHeight, oldGridHeight - store.gridHeight);
      console.log(
        "Splice from: " +
          store.gridHeight +
          " to: " +
          (oldGridHeight - store.gridHeight)
      );
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
      this.drawGrid;
    });
  }

  handleNodeSelect(direction) {
    let index = store.clickNodeIndex;
    let length = store.clickableNodeTypes.length;
    if (index + direction < 0) {
      // 0 + 1
      index = length - 1;
    } else if (index + direction > length - 1) {
      // 11 + 1
      index = 0;
    } else {
      index += direction;
    }
    store.clickNodeIndex = index;
    store.clickNodeType = store.clickableNodeTypes[index];
  }

  handleMouseUp() {
    store.mouseButton = -1;
  }

  // Toggle the node, set the previous node location, then draw the node.
  handleMouseDown(mouseButton) {
    let row = store.mousePosition[0];
    let col = store.mousePosition[1];
    let nodeType = this.handleMouseButton(mouseButton);

    this.toggleNodeType(row, col, nodeType);
    store.mouseButton = mouseButton;
    store.previousNode = [row, col];
    this.drawNode(store.grid[row][col]);
  }

  handleMouseEnter(row, col) {
    if (store.mouseButton === -1) {
      return;
    } else {
      let nodeType = this.handleMouseButton(store.mouseButton);

      this.toggleNodeType(row, col, nodeType);
      this.drawNode(store.grid[row][col]);
      store.previousNode = [row, col];
    }
  }

  handleMouseButton(button) {
    let nodeType;
    if (button === 0) {
      nodeType = store.clickNodeType;
    } else if (button === 2) {
      nodeType = store.air;
    }
    return nodeType;
  }

  handleMiddleMouseDown() {
    let row = store.mousePosition[0];
    let col = store.mousePosition[1];
    let nodeType = store.grid[row][col].nodeType;
    store.clickNodeType = nodeType;
    store.clickableNodeIndexFromNodeType(nodeType);
  }

  toggleNodeType(row, col, mouseNodeType) {
    switch (store.clickNodeType) {
      case store.start:
        this.toggleKeyPosition(row, col, store.start);
        break;
      case store.finish:
        this.toggleKeyPosition(row, col, store.finish);
        break;
      default:
        setNodeType(row, col, mouseNodeType);
        break;
    }
  }

  toggleKeyPosition(row, col, nodeType) {
    let target = store.grid[row][col];
    let oldRow;
    let oldCol;
    if (target.nodeType != store.start && target.nodeType != store.finish) {
      if (nodeType == store.start) {
        oldRow = store.startPosition[0];
        oldCol = store.startPosition[1];
        store.startPosition = [row, col];
      } else {
        oldRow = store.finishPosition[0];
        oldCol = store.finishPosition[1];
        store.finishPosition = [row, col];
      }

      setKeyNode(oldRow, oldCol, store.air);
      setKeyNode(row, col, nodeType);

      // Now we need to turn off the previous start node's class.
      this.drawNode(store.grid[oldRow][oldCol]);
      this.drawNode(target);
    }
  }

  visualizeAlgorithm(algorithm) {
    this.resetDistances();
    this.init(false);
    switch (algorithm) {
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
    this.resetDistances();
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
        if (i === visitedNodesInOrder.length - 1) {
          if (nodesInShortestPathOrder.length > 1) {
          } else {
            this.createPath(node, NODE_VISITED);
          }
        } else {
          this.createPath(node, NODE_VISITED);
        }
      }, 10 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length - 1; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        this.createPath(node, NODE_SHORTEST_PATH);
      }, 50 * i);
    }
  }

  init(clearBoard) {
    for (let row = 0; row < store.gridHeight; row++) {
      for (let col = 0; col < store.gridWidth; col++) {
        let node = store.grid[row][col];
        this.removePath(node, NODE_VISITED);
        this.removePath(node, NODE_SHORTEST_PATH);

        if (clearBoard) {
          setNodeType(row, col, store.air);
        }
      }
    }
    this.drawGrid(clearBoard);
  }
  createPath(node, newClass) {
    document.getElementById(
      `node-${node.row}-${node.col}`
    ).firstChild.className += ` ${newClass}`;
  }
  removePath(node, newClass) {
    document.getElementById(
      `node-${node.row}-${node.col}`
    ).firstChild.className = `path`;
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

  drawGrid(clearBoard) {
    for (let row = 0; row < store.gridHeight; row++) {
      for (let col = 0; col < store.gridWidth; col++) {
        let node = store.grid[row][col];
        this.drawNode(node);
        if (clearBoard) {
          this.removePath(node, NODE_VISITED);
          this.removePath(node, NODE_SHORTEST_PATH);
        }
      }
    }
  }

  generateTerrain(terrain) {
    switch (terrain) {
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
    this.init(true);
    const nodesToAnimate = terrain();
    this.animateTerrain(nodesToAnimate);
  }

  animateTerrain(nodesToAnimate) {
    var speedMod;
    switch (store.terrain) {
      case 0:
      case 1:
        speedMod = 10;
        break;
      case 2:
        speedMod = 5;
        break;
      case 3:
        speedMod = 2;
        break;
    }
    for (let i = 0; i < nodesToAnimate.length; i++) {
      let row = nodesToAnimate[i][0];
      let col = nodesToAnimate[i][1];
      let nodeType = nodesToAnimate[i][2];
      setTimeout(() => {
        this.drawNode(store.grid[row][col], nodeType);
      }, speedMod * i);
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
          key={store.gridId}
          onContextMenu={event => {
            event.preventDefault();
            return false;
          }}
        >
          {store.grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row" id={`row-${rowIdx}`}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
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

// Need to change from just setting a boolean for the node type
// to an actual node type we can track. This should fix pf issues.
const createNode = (row, col) => {
  return {
    row,
    col,
    distance: Infinity,
    isVisited: false,
    isShortest: false,
    fScore: Infinity,
    gScore: Infinity,
    hScore: Infinity,
    parent: null,
    nodeType: store.nodeType
  };
};

const setNodeType = (row, col, nodeType) => {
  let node = store.grid[row][col];
  if (node.nodeType != store.start && node.nodeType != store.finish) {
    node.nodeType = nodeType;
  }
};

const setKeyNode = (row, col, nodeType) => {
  store.grid[row][col].nodeType = nodeType;
};

Math.clamp = (value, min, max) => {
  return Math.min(Math.max(min, value), max);
};

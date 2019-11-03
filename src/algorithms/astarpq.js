import { MinHeapPriorityQueue } from "../datastructures/binaryheap.js";

export function AStarPQ(grid, startNode, finishNode, width, height) {
  const openSet = new MinHeapPriorityQueue();
  const visitedNodesInOrder = [];

  startNode.gScore = 0;
  startNode.hScore = heuristic_cost_estimate(startNode, startNode, finishNode);
  startNode.fScore = startNode.hScore;

  openSet.push(startNode);
  while (openSet.size() > 0) {
    var currentNode = openSet.popMin();

    visitedNodesInOrder.push(currentNode);
    if (currentNode == finishNode) {
      return computeVisitedNodes(visitedNodesInOrder);
    }
    currentNode.closed = true;

    for (let neighbor of getNeighbors(grid, currentNode, width, height)) {
      if (neighbor.nodeType.walkable === false || neighbor.closed) {
        continue;
      }
      let tentative_gScore = currentNode.gScore + neighbor.nodeType.weight;

      if (tentative_gScore < neighbor.gScore) {
        neighbor.gScore = tentative_gScore;
        neighbor.hScore = heuristic_cost_estimate(
          startNode,
          neighbor,
          finishNode
        );
        neighbor.fScore = neighbor.gScore + neighbor.hScore;
        neighbor.parent = currentNode;
        if (!openSet.find(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return computeVisitedNodes(visitedNodesInOrder);
}

function computeVisitedNodes(visitedNodesInOrder) {
  visitedNodesInOrder.length;
  visitedNodesInOrder.shift();
  return visitedNodesInOrder;
}

function printScores(currentNode) {
  console.log("__________________");
  console.log(
    "G: " +
      currentNode.gScore +
      " H: " +
      currentNode.hScore +
      " F: " +
      currentNode.fScore
  );
  console.log("[" + currentNode.row + "," + currentNode.col + "]");
}

function getNeighbors(grid, currentNode, width, height) {
  const neighbors = [];
  const row = currentNode.row;
  const col = currentNode.col;

  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (row < height - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < width - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  /* These enable diagonal movement
  if (row > 0 && col > 0) {
    neighbors.push(grid[row - 1][col - 1]);
  }
  if (row < height - 1 && col > 0) {
    neighbors.push(grid[row + 1][col - 1]);
  }
  if (row > 0 && col < width - 1) {
    neighbors.push(grid[row - 1][col + 1]);
  }
  if (row < height - 1 && col < width - 1) {
    neighbors.push(grid[row + 1][col + 1]);
  }
  */
  return neighbors;
}

// Idea: Add a slider to allow the user to tweak this
// heuristic value to see how it changes the algorithm's path.
function heuristic_cost_estimate(start, current, finish) {
  const dx = Math.abs(current.col - finish.col);
  const dy = Math.abs(current.row - finish.row);
  const deltaX1 = current.col - finish.col;
  const deltaY1 = current.row - finish.row;
  const deltaX2 = start.col - finish.col;
  const deltaY2 = start.row - finish.row;
  // Calculate the vector cross-product between the start to goal
  // vector and the current node to goal vecctor.
  const cross = Math.abs(deltaX1 * deltaY2 - deltaX2 * deltaY1);
  var heuristic = dx + dy;
  heuristic += cross * 0.001;
  return heuristic;
}

export function getShortestAStarPQPath(finishNode) {
  const path = [];
  let currentNode = finishNode;

  while (currentNode.parent != null) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

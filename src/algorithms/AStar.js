import { globalAgent } from "http";

export function AStar(grid, startNode, finishNode, width, height) {
  // Should be a Priority Queue.
  const openSet = [];
  const closedSet = [];
  const visitedNodesInOrder = [];

  startNode.gScore = 0;
  startNode.hScore = heuristic_cost_estimate(startNode, startNode, finishNode);
  startNode.fScore = startNode.hScore;
  openSet.push(startNode);
  let counter = 0;
  while (openSet.length > 0 && counter < 2000) {
    counter++;

    var lowestFScore = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].fScore < openSet[lowestFScore].fScore) {
        lowestFScore = i;
      }
    }
    var currentNode = openSet[lowestFScore];
    visitedNodesInOrder.push(currentNode);
    if (currentNode == finishNode) {
      return computeVisitedNodes(visitedNodesInOrder);
    }
    openSet.splice(lowestFScore, 1);
    closedSet.push(currentNode);

    // printScores(currentNode);
    for (let neighbor of getNeighbors(grid, currentNode, width, height)) {
      if (neighbor.isWall || isInSet(neighbor, closedSet)) {
        continue;
      }
      let tentative_gScore = currentNode.gScore + 1;
      if (tentative_gScore < neighbor.gScore) {
        neighbor.gScore = tentative_gScore;
        neighbor.hScore = heuristic_cost_estimate(
          startNode,
          neighbor,
          finishNode
        );
        neighbor.fScore = neighbor.gScore + neighbor.hScore;
        neighbor.parent = currentNode;
        if (!isInSet(neighbor, openSet)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return computeVisitedNodes(visitedNodesInOrder);
}

function isInSet(node, set) {
  for (let i = set.length - 1; i >= 0; i++) {
    if (set[i].row === node.row && set[i].col === node.col) {
      return true;
    } else {
      return false;
    }
  }
}

function computeVisitedNodes(visitedNodesInOrder) {
  visitedNodesInOrder.shift();
  return visitedNodesInOrder;
}

function removeFromSet(node, set) {
  for (let i = set.length - 1; i >= 0; i++) {
    if (set[i].row === node.row && set[i].col === node.col) {
      set.splice(i, 1);
    } else {
    }
  }
  return set;
}

function printScores(currentNode) {
  console.log("__________________");
  console.log(
    "[" +
      counter +
      "] " +
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

export function getShortestAStarPath(finishNode) {
  const path = [];
  let currentNode = finishNode;

  while (currentNode.parent != null) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

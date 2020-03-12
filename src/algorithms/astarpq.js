import { PriorityQueue } from "../datastructures/priorityqueue.js";

export function AStarPQ(grid, startNode, finishNode, width, height) {
  const openSet = new PriorityQueue();
  const visitedNodesInOrder = [];

  startNode.gScore = 0;
  startNode.hScore = heuristic_cost_estimate(startNode, startNode, finishNode);
  startNode.fScore = startNode.hScore;

  openSet.enqueue(startNode);

  while (openSet.size() > 0) {
    var currentNode = openSet.dequeue();

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
        if (!openSet.containsNode(neighbor)) {
          openSet.enqueue(neighbor);
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
  var directions = store.directionOrder;
  for (let i = 0; i < directions.length; i++) {
    switch (directions[i]) {
      case 1:
        if (row > 0) {
          neighbors.push(grid[row - 1][col]);
        }
        break;
      case 2:
        if (col > 0) {
          neighbors.push(grid[row][col - 1]);
        }
        break;
      case 3:
        if (col < width - 1) {
          neighbors.push(grid[row][col + 1]);
        }

        break;
      case 4:
        if (row < height - 1) {
          neighbors.push(grid[row + 1][col]);
        }

        break;
      case 5:
        if (row > 0 && col > 0) {
          neighbors.push(grid[row - 1][col - 1]);
        }
        break;
      case 6:
        if (row > 0 && col < width - 1) {
          neighbors.push(grid[row - 1][col + 1]);
        }
        break;
      case 7:
        if (row < height - 1 && col > 0) {
          neighbors.push(grid[row + 1][col - 1]);
        }
        break;
      case 8:
        if (row < height - 1 && col < width - 1) {
          neighbors.push(grid[row + 1][col + 1]);
        }
        break;
      default:
        console.log("Error choosing neighbor, value not in range [1,8].");
        break;
    }
  }
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
  // vector and the current node to goal vector.
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

import { Queue } from "../datastructures/queue.js";

export function BFS(grid, startNode, finishNode, width, height) {
  const queue = new Queue();
  const visitedNodes = [];
  startNode.isVisited = true;
  queue.enqueue(startNode);

  while (!queue.isEmpty()) {
    let currentNode = queue.dequeue();
    visitedNodes.push(currentNode);
    if (currentNode === finishNode) {
      return getVisitedNodes(visitedNodes);
    }
    for (let neighbor of getNeighbors(grid, currentNode, width, height)) {
      if (neighbor.nodeType.walkable == false) {
        continue;
      }
      if (!neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.parent = currentNode;
        queue.enqueue(neighbor);
      }
    }
  }
  return getVisitedNodes(visitedNodes);
}

function getVisitedNodes(visitedNodes) {
  return visitedNodes;
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

export function getShortestBFSPath(finishNode) {
  const path = [];
  let currentNode = finishNode;

  while (currentNode.parent != null) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

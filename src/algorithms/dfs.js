import { Stack } from "../datastructures/stack.js";

export function DFS(grid, startNode, finishNode, width, height) {
  const stack = new Stack();
  const visitedNodes = [];
  stack.push(startNode);

  while (!stack.isEmpty()) {
    let currentNode = stack.pop();
    visitedNodes.push(currentNode);
    currentNode.isVisited = true;
    if (currentNode === finishNode) {
      return getVisitedNodes(visitedNodes);
    }

    for (let neighbor of getNeighbors(grid, currentNode, width, height)) {
      if (neighbor.nodeType.walkable == false) {
        continue;
      }
      if (!neighbor.isVisited) {
        neighbor.parent = currentNode;
        stack.push(neighbor);
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

export function getShortestDFSPath(finishNode) {
  const path = [];
  let currentNode = finishNode;

  while (currentNode.parent != null) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

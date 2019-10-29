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
      if (neighbor.isWall) {
        continue;
      }
      if (!neighbor.isVisited) {
        neighbor.parent = currentNode;
        stack.push(neighbor);
      }
    }
  }
}

function getVisitedNodes(visitedNodes) {
  visitedNodes.shift();
  return visitedNodes;
}

function getNeighbors(grid, currentNode, width, height) {
  const neighbors = [];
  const row = currentNode.row;
  const col = currentNode.col;
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  if (row < height - 1) {
    neighbors.push(grid[row + 1][col]);
  }

  if (col < width - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
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

export function getShortestDFSPath(finishNode) {
  const path = [];
  let currentNode = finishNode;

  while (currentNode.parent != null) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

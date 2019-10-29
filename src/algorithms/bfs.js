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
      if (neighbor.isWall) {
        continue;
      }
      if (!neighbor.isVisited) {
        neighbor.isVisited = true;
        neighbor.parent = currentNode;
        queue.enqueue(neighbor);
      }
    }
  }
}

function getVisitedNodes(visitedNodes) {
  visitedNodes.shift();
  visitedNodes.pop();
  return visitedNodes;
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

export function getShortestBFSPath(finishNode) {
  const path = [];
  let currentNode = finishNode;

  while (currentNode.parent != null) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

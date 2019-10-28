import { globalAgent } from "http";

var nodesToAnimate = [];

// OPEN: the set of nodes to be evaluated.
// CLOSED: the set of nodes already evaluated

// Add the start node to open
// loop
//
//function sortNodesByDistance(unvisitedNodes) {
//  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
//}
export function AStar(grid, startNode, finishNode, width, height) {
  const openSet = [];
  const listOfNodes = getAllNodes(grid);

  openSet.push(startNode);
  while (openSet.length > 0) {
    openSet.sort();
    currentNode = openSet.shift();
    currentNode.closed;

    if (currentNode == finishNode) {
      return makePath(startNode, currentNode);
    }
    for (neighbor of getNeighbors(grid, currentNode)) {
      // Can't do this until we refactor nodes
      if (neighbor.isWall || neighbor.closed) {
        continue;
      }
      let newPathToNeighbor = makePath(startNode, neighbor);
      if ()
    }
  }
}

function getNeighbors(grid, currentNode) {
  const neighbors = [];
  const row = currentNode.row;
  const col = currentNode.col;
  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (row < height) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < height) {
    neighbors.push(grid[row][col + 1]);
  }
  return neighbors;
}

function hCost(start, current, finish) {
  const deltaX1 = current.row - finish.row;
  const deltaX2 = current.col - finish.col;
  const deltaY1 = start.x - finish.x;
  const deltaY2 = start.y - finish.y;
  // Calculate the vector cross-product between the start to goal
  // vector and the current node to goal vecctor.
  const cross = Math.abs((deltaX1 * deltaY2 - deltaX2 * deltaY1))
  const heuristic += cross * 0.001;
  return deltaX + deltaY;
}

function makePath(startNode, finishNode) {
  const path = [];
  currentNode = finishNode;
  while (currentNode != startNode) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

var nodesToAnimate = [];
export function AStar(grid, startNode, finishNode) {
  const openSet = [];
  const closedSet = [];

  openSet.push(startNode);
  while (openSet.length > 0) {
    openSet.sort();
    currentNode = openSet.shift();
    closedSet.push(currentNode);

    if (currentNode == finishNode) {
      return makePath(currentNode);
    }
    for (neighborNode : )
  }
}

function heuristic_cost_estimate(nodeA, nodeB) {
  const deltaX = Math.abs(nodeA.row - nodeB.row);
  const deltaY = Math.abs(nodeA.col - nodeB.col);
  return deltaX + deltaY;
}

function makePath(currentNode) {
  const path = [];
  while (currentNode != endNode) {
    path.push(currentNode);
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

import { pathMatch } from "tough-cookie";

export function AStar(grid, startNode, finishNode) {
  openSet = [];
  closedSet = [];
  openSet.push(startNode);
  while (openSet.length > 0) {
    openSet.sort();
    currentNode = openSet.shift();
    closedSet.push(currentNode);

    if (currentNode == finishNode) {
      while (currentNode != endNode) {
        pathMatch.push(currentNode);
        currentNode = currentNode.parent;
      }
    }
  }
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

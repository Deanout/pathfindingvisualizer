/* Dijkstra's algorithm takes three parameters:
 * grid - The list of nodes you could potentially visit
 * startNode - The initial node that you are traveling from
 * finishNode - The final node you will finish at
 *
 * Overview:
 * Dijkstra's works by initially giving every node a
 * cost of infinity except for the starting node.
 * You then iterate over every non-infinite cost node = currentNode
 * and give their neighbors a cost of:
 * neighborCost = currentNode.cost + 1
 * and set isVisited to true, which removes it from the list.
 *
 * If you use a proper data structure, you should have a reference
 * chain that gives you the shortest--lowest cost--path.
 *
 * Additionally, we want the order that every node was visited in,
 * because it allows us to animate the nodes.
 *
 * Notes:
 * If you're using weights, however, you can replace the 1 with
 * 1 + weight, or simply the weight, and everything works the same.
 */
export function dijkstra(grid, startNode, finishNode) {
  // The list of visited nodes to animate over
  const visitedNodesInOrder = [];

  // Set the initial node's distance to 0.
  startNode.distance = 0;
  // The list of unvisited nodes
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) {
      continue;
    }
    if (closestNode.distance === Infinity) {
      return visitedNodesInOrder;
    }
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) {
      return visitedNodesInOrder;
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.parent = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (row < grid.length - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < grid[0].length - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  return neighbors.filter(neighbor => !neighbor.isVisited);
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

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode != null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return nodesInShortestPathOrder;
}

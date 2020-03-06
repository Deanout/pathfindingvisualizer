import store from "../store/gridstore";
import queue, { Queue } from "../datastructures/queue.js";

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
  switch (store.algorithms[1].dataStructure) {
    default:
    case "array":
      return dijkstra_array(grid, startNode, finishNode);
    case "queue":
      return dijkstra_queue(grid, startNode, finishNode);
    case "priority queue":
      return dijkstra_priority_queue(grid, startNode, finishNode);
  }
}

function dijkstra_array(grid, startNode, finishNode) {
  // The list of visited nodes to animate over
  const visitedNodesInOrder = [];

  // Set the initial node's distance to 0.
  startNode.distance = 0;
  // The list of unvisited nodes
  const unvisitedNodes = getAllNodesArray(grid);

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) {
      continue;
    }
    if (closestNode.nodeType.walkable === false) {
      return computeVisitedNodes(visitedNodesInOrder);
    }
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) {
      return computeVisitedNodes(visitedNodesInOrder);
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function dijkstra_queue(grid, startNode, finishNode) {
  // The list of visited nodes to animate over
  const visitedNodesInOrder = [];

  // Set the initial node's distance to 0.
  startNode.distance = 0;
  // The list of unvisited nodes
  const unvisitedNodes = getAllNodesQueue(grid);

  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.dequeue();
    if (closestNode.isWall) {
      continue;
    }
    if (closestNode.nodeType.walkable === false) {
      return computeVisitedNodes(visitedNodesInOrder);
    }
    closestNode.isVisited = true;
    visitedNodesInOrder.enqueue(closestNode);
    if (closestNode === finishNode) {
      return computeVisitedNodes(visitedNodesInOrder);
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function computeVisitedNodes(visitedNodesInOrder) {
  visitedNodesInOrder.shift();
  return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(
    grid,
    node,
    store.gridWidth,
    store.gridHeight
  );
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + neighbor.nodeType.weight;
    neighbor.parent = node;
  }
}

function getUnvisitedNeighbors(grid, currentNode, width, height) {
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
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodesArray(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function getAllNodesQueue(grid) {
  const nodes = new Queue();
  for (const row of grid) {
    for (const node of row) {
      nodes.enqueue(node);
    }
  }
  return nodes;
}

export function getShortestDijkstraPath(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode.parent != null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return nodesInShortestPathOrder;
}

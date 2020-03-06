var activeHeuristic = false;
export function AStar(grid, startNode, finishNode, width, height) {
  // Should be a Priority Queue.
  const openSet = [];
  const visitedNodesInOrder = [];

  startNode.gScore = 0;
  startNode.hScore = heuristic_cost_estimate(startNode, finishNode);
  startNode.fScore = startNode.hScore;
  openSet.push(startNode);

  while (openSet.length > 0) {
    var lowestFScore = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].fScore < openSet[lowestFScore].fScore) {
        lowestFScore = i;
      }
    }
    var currentNode = openSet[lowestFScore];
    //printScores(currentNode);
    visitedNodesInOrder.push(currentNode);
    if (currentNode == finishNode) {
      return computeVisitedNodes(visitedNodesInOrder);
    }
    openSet.splice(lowestFScore, 1);
    currentNode.closed = true;

    //printScores(counter, currentNode);
    for (let neighbor of getNeighbors(grid, currentNode, width, height)) {
      if (neighbor.nodeType.walkable === false || neighbor.closed) {
        continue;
      }
      let tentative_gScore = currentNode.gScore + neighbor.nodeType.weight;
      if (tentative_gScore < neighbor.gScore) {
        neighbor.gScore = tentative_gScore;
        neighbor.hScore = heuristic_cost_estimate(neighbor, finishNode);
        neighbor.fScore = neighbor.gScore + neighbor.hScore;
        neighbor.parent = currentNode;
        if (!isInSet(neighbor, openSet)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return computeVisitedNodes(visitedNodesInOrder);
}

function isInSet(node, set) {
  for (let i = set.length - 1; i >= 0; i++) {
    if (set[i].row === node.row && set[i].col === node.col) {
      return true;
    } else {
      return false;
    }
  }
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
        activeHeuristic = true;
        if (row > 0 && col > 0) {
          neighbors.push(grid[row - 1][col - 1]);
        }
        break;
      case 6:
        activeHeuristic = true;
        if (row > 0 && col < width - 1) {
          neighbors.push(grid[row - 1][col + 1]);
        }
        break;
      case 7:
        activeHeuristic = true;
        if (row < height - 1 && col > 0) {
          neighbors.push(grid[row + 1][col - 1]);
        }
        break;
      case 8:
        activeHeuristic = true;
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
function heuristic_cost_estimate(current, finish) {
  const dx = Math.abs(current.col - finish.col);
  const dy = Math.abs(current.row - finish.row);
  // Fix this dean

  var heuristic;
  if (activeHeuristic) {
    heuristic = Math.max(dx, dy) + 1.4 * Math.min(dx, dy);
  } else {
    heuristic = dx + dy;
  }

  heuristic = heuristic * (1 + store.algorithms[2].config.heuristic);

  return heuristic;
}

export function getShortestAStarPath(finishNode) {
  const path = [];
  let currentNode = finishNode;

  while (currentNode.parent != null) {
    path.unshift(currentNode);
    currentNode = currentNode.parent;
  }
  return path;
}

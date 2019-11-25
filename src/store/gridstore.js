import { observable, computed, action } from "mobx";
import { Simplex } from "./simplex.js";
import { NodeTypes } from "./nodetypes.js";

/*
 * Initialize the MobX Grid here, so that the first render call is not null.
 * wall: Used to determine what class to give nodes
 * startPosition: The start node position, initialized in componentDidMount.
 * finishPosition: The initial finish node position, initialized in componentDidMount.
 * mousePosition: The [row, col] position of the mouse
 * previousNode: Used to limit the mouse function calls
 */
class GridStore {
  constructor() {}
  @observable grid = [];
  @observable nodeTypes = new NodeTypes();
  @observable terrain = 0;
  @observable algorithm = 0;
  @observable mouseButton = -1;
  @observable startPosition = [0, 0];
  @observable startNode;
  @observable finishNode;
  @observable finishPosition = [0, 1];
  @observable gridWidth = 5;
  @observable gridHeight = 5;
  // Change to control the default grid size.
  @observable nodeSize = 25;
  @observable nodeWidth = this.nodeSize;
  @observable nodeHeight = this.nodeSize;

  @observable debugCounter = 0;
  @observable gridScale = 1;
  @observable pathDrawn = false;
  @observable currentPathIndex = 0;
  @observable currentShortestPathIndex = 0;
  @observable consoleLineNumber = 1;

  @observable mousePosition = [-1, -1];
  @observable previousNode = [-1, -1];

  @observable animationSpeed = {
    crawl: 500,
    slow: 50,
    med: 25,
    fast: 10,
    ultra: 1,
    instant: 0
  };
  @observable currentAnimationSpeed = this.animationSpeed.fast;

  @action resetNodeSize(newValue) {
    this.nodeWidth = newValue;
    this.nodeHeight = newValue;
  }

  @observable simplex = new Simplex();

  @observable defaultNodeType = this.nodeTypes.air;
  @observable clickNodeType = this.nodeTypes.wall;
  @observable clickNodeIndex = 0;
  @observable previousClickNodeType = this.nodeTypes.wall;
  @observable nodeTypeAtMousePosition = this.nodeTypes.air;

  // UI Variables
  @observable consoleBottom = 0;

  @observable configPanel = {
    toggle: false,
    minimize: true,
    panelID: 0
  };

  @action clickableNodeIndexFromNodeType(nodeTypeToCheck) {
    // this.nodeTypes.find((nodeType, index) => {
    //   if (nodeTypeToCheck === nodeType) {
    //     this.clickNodeIndex = index;
    //     return true;
    //   }
    // });

    for (let i = 0; i < this.nodeTypes.list.length; i++) {
      if (nodeTypeToCheck === this.nodeTypes.list[i]) {
        this.clickNodeIndex = i;
        break;
      }
    }
  }

  @computed get algorithmName() {
    return this.algorithms[this.algorithm].name;
  }
  @observable algorithms = [
    {
      name: "Algorithms",
      summary:
        "Select pathfinding algorithm. The default is Dijkstra's, which is a weighted algorithm that is guaranteed to find the shortest path even if some of the tiles are easier or more difficult to move through. An example might be taking the road or cutting through a muddy field."
    },
    {
      name: "Dijkstra's Algorithm",
      summary:
        "Dijkstra's is a weighted algorithm that is guaranteed to find the shortest path even if some of the tiles are easier or more difficult to move through. An example might be taking the road or cutting through a muddy field."
    },
    {
      name: "A* Search",
      summary:
        "A* is a weighted, informed algorithm which uses a heuristic to estimate the distance to the finish node. If this heuristic is admissable (never overestimates the cost), A* is guaranteed to return the lowest cost path. If the heuristic, h(x) <= lengthOfEdge(x,y) + h(y) for every edge(x,y), h is considered monotone or consistent, meaning it is equivalent to Dijkstra's with a reduced cost."
    },
    {
      name: "Breadth First Search",
      summary:
        "Breadth First Search (BFS) is an unweighted algorithm that starts at the root and explores each node at the current depth before proceeding to the next depth level's nodes. This algorithm guarantees an unweighted shortest path. If you have weights, however, it will ignore them and possibly provide a false shortest path."
    },
    {
      name: "Depth First Search",
      summary:
        "Depth First Search (DFS) is an unweighted algorithm that starts at the root node and explores as far as possible along each branch before backtracking. While it probably won't provide the shortest path, if there are too many branches per layer for BFS to run efficiently, it may be advantagous to utilize DFS to evaluate some of the branches in their entirety instead of attempting to evaluate all of them."
    },
    {
      name: "A* Optimized",
      summary:
        "This is a custom variation of the default A*. Instead of using an array, this uses a priority queue that is implemented through a min-heap."
    }
  ];

  @observable terrains = [
    {
      name: "Terrain",
      summary:
        "Choose from a list of terrain generation algorithms. The default is the recursive maze algorithm, in which all moveable tiles have a weight of 1, meaning that all algorithms will perform as expected."
    },
    {
      name: "Recursive Maze",
      summary:
        "A recursively generated maze is created. It is guaranteed to be solvable if the start and end nodes are not surrounded by walls."
    },
    {
      name: "Simplex Terrain",
      summary:
        "This algorithm uses a simplex noise algorithm to create a procedurally generated terrain. This terrain is weighted, giving penalities for movement across sand, water, mountains, and even snow. There is an extensive configuration menu which allows for near limitless possibilities."
    },
    {
      name: "Random Terrain",
      summary:
        "The simplest option, this terrain is generated by taking a random number and assigning any value below a threshold to be a wall, and making all others grass."
    }
  ];
}

// This allows us to access the grid store from inside the console.
var store = (window.store = new GridStore());
export default store;

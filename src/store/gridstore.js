import { observable, computed } from "mobx";
import { Simplex } from "./simplex.js";

/*
 * Initialize the MobX Grid here, so that the first render call is not null.
 * wall: Used to determine what class to give nodes
 * startPosition: The start node position, initialized in componentDidMount.
 * finishPosition: The initial finish node position, initialized in componentDidMount.
 * mousePosition: The [row, col] position of the mouse
 * previousNode: Used to limit the mouse function calls
 */
class GridStore {
  @observable nodeTypes = [];
  constructor() {
    this.nodeTypes.push(
      this.waterDeep,
      this.water,
      this.sand,
      this.grass,
      this.stone,
      this.granite,
      this.snow
    );
  }
  @observable grid = [];
  @observable terrain = 0;
  @observable algorithm = 0;
  @observable mouseIsPressed = false;
  @observable startPosition = [0, 0];
  @observable finishPosition = [0, 1];
  @observable mousePosition = [-1, -1];
  @observable previousNode = [-1, -1];
  @observable gridWidth = 5;
  @observable gridHeight = 5;
  @observable nodeWidth = 25;
  @observable nodeHeight = 25;
  @observable gridId = 0;

  @observable simplex = new Simplex();

  // Node types:
  @observable air = {
    name: "air",
    minThreshold: 0,
    maxThreshold: 1,
    weight: 1,
    class: "",
    walkable: true,
    rgb: [255, 255, 255]
  };
  @observable wall = {
    name: "wall",
    minThreshold: 0,
    maxThreshold: 1,
    weight: Infinity,
    class: "node-wall",
    walkable: false,
    rgb: [12, 53, 71]
  };
  @observable start = {
    name: "start",
    minThreshold: 0,
    maxThreshold: 1,
    weight: 1,
    class: "node-start",
    walkable: true,
    rgb: [0, 150, 5]
  };
  @observable finish = {
    name: "finish",
    minThreshold: 0,
    maxThreshold: 1,
    weight: 1,
    class: "node-finish",
    walkable: true,
    rgb: [150, 0, 5]
  };
  @observable waterDeep = {
    name: "waterDeep",
    minThreshold: 0,
    maxThreshold: 0.25,
    weight: 250,
    class: "node-water-deep",
    walkable: true,
    rgb: [0, 65, 150]
  };
  @observable water = {
    name: "water",
    minThreshold: 0.25,
    maxThreshold: 0.35,
    weight: 100,
    class: "node-water",
    walkable: true,
    rgb: [0, 110, 255]
  };
  @observable sand = {
    name: "sand",
    minThreshold: 0.35,
    maxThreshold: 0.4,
    weight: 15,
    class: "node-sand",
    walkable: true,
    rgb: [195, 175, 125]
  };
  @observable grass = {
    name: "grass",
    minThreshold: 0.4,
    maxThreshold: 0.7,
    weight: 10,
    class: "node-grass",
    walkable: true,
    rgb: [85, 125, 70]
  };
  @observable stone = {
    name: "stone",
    minThreshold: 0.7,
    maxThreshold: 0.8,
    weight: 100,
    class: "node-stone",
    walkable: true,
    rgb: [175, 175, 175]
  };
  @observable granite = {
    name: "granite",
    minThreshold: 0.8,
    maxThreshold: 0.9,
    weight: 250,
    class: "node-granite",
    walkable: true,
    rgb: [140, 140, 140]
  };
  @observable snow = {
    name: "snow",
    minThreshold: 0.9,
    maxThreshold: 1,
    weight: 150,
    class: "node-snow",
    walkable: true,
    rgb: [200, 215, 225]
  };

  @observable nodeType = this.air;
  @observable clickNodeType = this.wall;
  @observable clickNodeIndex = 1;

  // UI Variables
  @observable consoleBottom = 0;

  @observable configPanel = {
    toggle: false,
    minimize: true,
    panelID: 0
  };

  @computed get clickableNodeTypes() {
    var nodeTypes = this.nodeTypes;
    nodeTypes.unshift(this.finish);
    nodeTypes.unshift(this.start);
    nodeTypes.unshift(this.wall);
    nodeTypes.unshift(this.air);
    return nodeTypes;
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
      name: "A* Search",
      summary:
        "Depth First Search (DFS) is an unweighted algorithm that starts at the root node and explores as far as possible along each branch before backtracking. While it probably won't provide the shortest path, if there are too many branches per layer for BFS to run efficiently, it may be advantagous to utilize DFS to evaluate some of the branches in their entirety instead of attempting to evaluate all of them."
    },
    {
      name: "A* MHPQ",
      summary:
        "This is a custom variation of the default A*. Instead of using an array, this uses a priority queue that is implemented through a min-heap."
    }
  ];
}

// This allows us to access the grid store from inside the console.
var store = (window.store = new GridStore());
export default store;

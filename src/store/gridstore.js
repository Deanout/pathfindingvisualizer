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
  @observable nodeType = "wall";
  @observable wall = "wall";
  @observable air = "air";
  @observable start = "start";
  @observable finish = "finish";

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
  // UI Variables
  @observable consoleBottom = 0;

  @observable configPanel = {
    toggle: true,
    minimize: true,
    panelID: 0
  };

  @computed get algorithmName() {
    return this.algorithms[this.algorithm].name;
  }
}

// This allows us to access the grid store from inside the console.
var store = (window.store = new GridStore());
export default store;

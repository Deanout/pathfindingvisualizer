import { observable } from "mobx";

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
  @observable algorithm = 0;
  @observable nodeType = "wall";
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

  // UI Variables
  @observable consoleBottom = 0;

  @observable configPanel = {
    toggle: false,
    minimize: false,
    panelID: 0
  };

  @observable simplex = {
    seed: 1337,
    threshold: 0.5,
    scale: 10,
    defaultSeed: 1337,
    minSeed: 0,
    maxSeed: 1000000,
    stepSeed: 1,
    defaultThreshold: 0.5,
    minThreshold: -1,
    maxThreshold: 1,
    stepThreshold: 0.1,
    defaultScale: 10,
    minScale: 1,
    maxScale: 100,
    stepScale: 1
  };

  getAlgorithmName() {
    let name = "";
    switch (this.algorithm) {
      case 0:
        name = "Dijkstra's Algorithm";
        break;
      case 1:
        name = "Dijkstra's Algorithm";
        break;
      case 2:
        name = "A* Search";
        break;
      case 3:
        name = "Breadth First Search";
        break;
      case 4:
        name = "Depth First Search";
        break;
      case 5:
        name = "A* MHPQ";
        break;
      default:
        break;
    }
    return name;
  }
}

// This allows us to access the grid store from inside the console.
var store = (window.store = new GridStore());
export default store;

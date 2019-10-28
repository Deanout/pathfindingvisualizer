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
  @observable nodeType = "wall";
  @observable mouseIsPressed = false;
  @observable startPosition = [0, 0];
  @observable finishPosition = [0, 1];
  @observable mousePosition = [-1, -1];
  @observable previousNode = [-1, -1];
}

// This allows us to access the grid store from inside the console.
var store = (window.store = new GridStore());
export default store;

import store from "../store/gridstore.js";

export class BinaryHeap {
  constructor() {
    this.items = [];
  }
  // Puts the element at the end of the array of items,
  // then calls reheapify with that element's index as the arg.
  push(element) {
    this.items.push(element);
    this.reheapify(this.size() - 1);
  }
  // Returns the first element in the array, which is the minimum.
  // Stores the last element in a var called end.
  // If there are still more elements, put end at the 0th pos and sort.
  popMin() {
    var result = this.items[0];
    var end = this.items.pop();

    if (this.size() > 0) {
      this.items[0] = end;
      this.heapify(0);
    }

    return result;
  }

  find(node) {
    for (let i = 0; i < this.size(); i++) {
      let heapNode = this.items[i];
      if (heapNode.row === node.row && heapNode.col === node.col) {
        return true;
      } else {
      }
    }
    return false;
  }

  setDistance(node, distance) {
    for (let i = 0; i < this.size(); i++) {
      let heapNode = this.items[i];
      if (heapNode.row === node.row && heapNode.col === node.col) {
        heapNode.distance = distance;
        this.heapify(i);
        this.reheapify(i);
        break;
      }
    }
  }
  setParent(neighbor, parent) {
    for (let i = 0; i < this.size(); i++) {
      let heapNode = this.items[i];
      if (heapNode.row === neighbor.row && heapNode.col === neighbor.col) {
        heapNode.parent = parent;
      }
    }
  }

  remove(node) {
    for (var i = 0; i < this.size(); i++) {
      if (this.items[i] != node) {
        continue;
      }
      var end = this.items.popMin();

      if (i == this.size() - 1) {
        break;
      }
      this.items[i] = end;
      this.reheapify(i);
      this.heapify(i);
      break;
    }
  }

  reheapify(index) {
    var element = this.items[index];
    while (index > 0) {
      var parentIndex = Math.floor((index + 1) / 2) - 1;
      var parent = this.items[parentIndex];
      if (store.algorithmName === store.algorithms[1].name) {
        if (element.distance >= parent.distance) {
          break;
        }
      } else if (store.algorithmName === store.algorithms[6].name) {
        if (element.fScore >= parent.fScore) {
          break;
        }
      }

      this.items[parentIndex] = element;
      this.items[index] = parent;
      index = parentIndex;
    }
  }
  heapify(index) {
    var element = this.items[index];
    while (true) {
      var leftChildIndex = index * 2 + 1;
      var rightChildIndex = leftChildIndex + 1;

      var swap = null;

      if (leftChildIndex < this.size()) {
        var leftChild = this.items[leftChildIndex];
        if (store.algorithmName === store.algorithms[1].name) {
          if (leftChild.distance < element.distance) {
            swap = leftChildIndex;
          }
        }
        if (store.algorithmName === store.algorithms[5].name) {
          if (leftChild.fScore < element.fScore) {
            swap = leftChildIndex;
          }
        }
      }
      if (rightChildIndex < this.size()) {
        var rightChild = this.items[rightChildIndex];
        if (store.algorithmName === store.algorithms[1].name) {
          if (
            rightChild.distance <
            (swap == null ? element.distance : leftChild.distance)
          ) {
            swap = rightChildIndex;
          }
        }
        if (store.algorithmName === store.algorithms[5].name) {
          if (
            rightChild.fScore <
            (swap == null ? element.fScore : leftChild.fScore)
          ) {
            swap = rightChildIndex;
          }
        }
      }
      if (swap == null) {
        break;
      } else {
        this.items[index] = this.items[swap];
        this.items[swap] = element;
        index = swap;
      }
    }
  }

  size() {
    return this.items.length;
  }
}

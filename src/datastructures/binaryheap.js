export class MinHeapPriorityQueue {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
    this.reheapify(this.size() - 1);
  }
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
      //console.log("Heapnode = " + heapNode.row + ", " + heapNode.col);
      //console.log("Node[i] " + node.row + ", " + node.col);
      //console.log("heapNode === node[i] " + heapNode === node[i]);
      if (heapNode.row === node.row && heapNode.col === node.col) {
        return true;
      } else {
      }
    }
    return false;
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

      if (element.fScore >= parent.fScore) {
        break;
      }
      this.items[parentIndex] = element;
      this.items[index] = parent;
      index = parentIndex;
    }
  }
  heapify(index) {
    var element = this.items[index];
    while (true) {
      var child2Index = (index + 1) * 2;
      var child1Index = child2Index - 1;
      var swap = null;

      if (child1Index < this.size()) {
        var child1 = this.items[child1Index];
        if (child1.fScore < element.fScore) {
          swap = child1Index;
        }
      }
      if (child2Index < this.size()) {
        var child2 = this.items[child2Index];
        if (child2.fScore < (swap == null ? element.fScore : child1.fScore)) {
          swap = child2Index;
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

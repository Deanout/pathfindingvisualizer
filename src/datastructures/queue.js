export class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(element) {
    this.items.push(element);
  }
  dequeue() {
    if (this.isEmpty()) {
      return "Failed to dequeue because: Queue was empty.";
    } else {
      return this.items.shift();
    }
  }
  front() {
    if (this.isEmpty()) {
      return "Failed to get front element because: Queue was empty";
    } else {
      return this.items[0];
    }
  }
  isEmpty() {
    return this.items.length == 0;
  }
  length() {
    return this.items.length;
  }
  sort() {
    this.items.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  printQueue() {
    var output = "";
    for (let i = 0; i < this.items.length; i++) {
      output += this.items[i] + " ";
    }
    return output;
  }
}

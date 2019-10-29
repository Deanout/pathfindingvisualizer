export class Stack {
  constructor() {
    this.items = [];
  }
  push(element) {
    this.items.push(element);
  }
  pop() {
    if (this.isEmpty()) {
      return "Failed to pop because: Stack was empty.";
    } else {
      return this.items.pop();
    }
  }
  front() {
    if (this.isEmpty()) {
      return "Failed to peek because: Stack was empty";
    } else {
      return this.items[this.items.length - 1];
    }
  }
  isEmpty() {
    return this.items.length == 0;
  }
  length() {
    return this.items.length;
  }
  printStack() {
    var output = "";
    for (let i = 0; i < this.items.length; i++) {
      output += this.items[i] + " ";
    }
    return output;
  }
}

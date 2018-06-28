class Stack<T> {
  elements: T[] = [];

  push(e: T) {
    return this.elements.push(e);
  }

  pop() {
    return this.elements.pop();
  }
};

export { Stack };
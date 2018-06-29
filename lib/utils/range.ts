class Range<T> {
  from: T;
  to: T;

  constructor(from: T, to: T) {
    this.from = from;
    this.to = to;
  }
};

export { Range };
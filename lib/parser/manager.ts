import { Parser } from '.';

class Manager {
  parsers: Parser[];

  constructor() {
    this.parsers = Array<Parser>();
  }

  addParser(p: Parser) {
    this.parsers.push(p);
  }
};

export default Manager;
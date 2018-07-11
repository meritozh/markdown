import { Rule } from "../rules";

class Success {
  nextRule: Rule | undefined;

  constructor(nextRule?: Rule) {
    if (nextRule) {
      this.nextRule = nextRule;
    }
  }
}

class Failure {
  fallbackRule: Rule | undefined;

  constructor(fallbackRule?: Rule) {
    if (fallbackRule) {
      this.fallbackRule = fallbackRule;
    }
  }
}

type R = Success | Failure;

export { Success, Failure, R };

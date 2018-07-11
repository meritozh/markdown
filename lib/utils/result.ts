class Success {
  nextRule?: string;

  constructor(nextRule?: string) {
    if (nextRule) {
      this.nextRule = nextRule;
    }
  }
}

class Failure {
  fallbackRule?: string;

  constructor(fallbackRule?: string) {
    if (fallbackRule) {
      this.fallbackRule = fallbackRule;
    }
  }
}

type R = Success | Failure;

export { Success, Failure, R };

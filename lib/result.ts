interface Result {
  message: string;
  recoverable: boolean;
  /// If success, should be current parser's output.
  /// Otherwise, should be previous parser's output.
  rest: string;
  /// When need chain `Result`s, set this
  error?: Error;
};

class Success implements Readonly<Result> {
  message: string;
  recoverable: boolean;
  rest: string;
  error?: Error;

  constructor(rest: string, message: string,
              recoverable = false, error?: Error) {
    this.rest = rest;
    this.recoverable = recoverable;
    this.error = error;
    this.message = message;
  }
};

class Failure implements Result {
  message: string;
  recoverable: boolean;
  rest: string;
  error?: Error;

  constructor(rest: string, message: string,
              recoverable = true, error?: Error) {
    this.rest = rest;
    this.message = message;
    this.recoverable = recoverable;
    this.error = error;
  }
};

export { Result, Success, Failure };
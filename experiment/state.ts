const Code = (char: string) => {
  if (char.length !== 1) {
    throw Error('Must pass single character.');
  }
  return char.charCodeAt(0);
}

class Stack<T> {
  elements: T[] = [];

  push(e: T) {
    this.elements.push(e);
  }

  pop() {
    return this.elements.pop();
  }

  isPair() {
    /// algorithm here
  }
};

enum State {
  Start = 'start',
  Heading = 'heading',
  Text = 'text',
  Italic = 'italic',
  Bold = 'bold',
  OrderList = 'order_list',
  UnorderList = 'unoder_list',
  End = 'end',
}

class StateMachie {
  public states: State[] = [];
  /// current tokenizing position
  public pos: number = 0;
  /// current line
  public content?: string;
  /// some states are ambiguous
  private pending: boolean = false;
  private state: State = State.Start;

  // private pairs: Stack<State> = [];
 
  get ch(): number {
    return this.charCodeAt(this.pos);
  }

  /// look forward
  forward(append: number) {
    return this.content!.charCodeAt(this.pos + append);
  }

  initailize() {
    this.state = State.Start;
    this.pending = false;
    this.pos = 0;
  }

  process(content: string) {
    this.initailize();
    this.content = content;
    this.tokenize();
    if (!this.isResolved()) {
      throw Error('Final state must be resolved!');
    }
    console.log(`"${this.content}" tokenized`);
  }

  tokenize() {
    while (this.pos !== this.content!.length) {
      switch (this.ch) {
        case Code('#'):
          this.transfer(State.Heading);
          /// heading rule
          break;
        case Code('-'):
          this.pendingTransfer(State.Italic);
          if (this.ch === Code('-')) {
            this.transfer(State.Bold);
          } else if (this.ch === Code('*')) {
            this.transfer(State.Text);
          } else if (this.ch === Code(' ')) {
            this.transfer(State.UnorderList);
          } else {
            this.resolve();
          }
          break;
        case Code('*'):
          this.pendingTransfer(State.Italic);
          if (this.ch === Code('*')) {
            this.transfer(State.Bold);
          } else if (this.ch === Code('-')) {
            this.transfer(State.Text);
          } else if (this.ch === Code(' ')) {
            this.transfer(State.UnorderList);
          } else {
            this.resolve();
          }
          break;
        default:
          this.transfer(State.Text);
          break;
      }
    }
    this.transfer(State.End);
  }

  /// current state is resolved, or not
  private isResolved() {
    if (this.pending) {
      return false;
    } else {
      return true;
    }
  }

  private resolve() {
    this.pending = false;

    console.log(`char: ${this.content!.charAt(this.pos) || ' '} pos: ${this.pos}, state: ${this.state}`);
  }

  private transfer(to: State) {
    this.state = to;

    console.log(`char: ${this.content!.charAt(this.pos) || ' '} pos: ${this.pos}, state: ${this.state}`);

    this.pos++;
    this.pending = false;
  }

  private pendingTransfer(to: State) {
    this.state = to;
    this.pos++;
    this.pending = true;
  }

  private isInitized() {
    return this.state === State.Start 
           && this.pos === 0 && this.pending === false;
  }

  private isEnd() {
    return this.state === State.End;
  }

  private charCodeAt(pos: number) {
    return this.content!.charCodeAt(pos);
  }
}


const machine = new StateMachie();

const test = (content: string) => {
  machine.process(content);
};

test('a**bla**');
test('# asd');
test('-italic-');
test('*italic*');
test('**bold**');
test('--bold--');
test('   ');
test('### h3');
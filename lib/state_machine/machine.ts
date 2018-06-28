import { Code } from "../utils/string";

/**
 * Keep State Machine simple.
 * 
 * Lexer just tokenize below states:
 * 
 * Start ---> Pending ---> Block ---> Paragraph ---> End
 *              ^           |
 *              +-----------+
 * 
 * Parser process Inline states:
 * 
 * Paragraph
 *   |
 *   v
 * Inline ---> Bold
 *   |
 *   +-----> Italic
 *   |
 *   +-----> Image
 *   |
 *   +-----> Link
 *   |
 *   +-----> InlineCode
 */
enum State {
  Start = 'start',
  End = 'end',

  Pending = 'pending',
  
  /// Block
  Heading = 'heading',
  Paragraph = 'paragraph', 
  UnorderList = 'unorder_list',
  OrderList = 'order_list',
  Block = 'block',
  Quote = 'quote',

  /// Inline
  Bold = 'bold',
  Italic = 'italic',
  Image = 'image',
  Link = 'link',
  InlineCode = 'inline_code',
};

class StateMachine {
  state = State.Start;
  /// Current tokenizing position
  pos = 0;
  /// Forward looking position
  forward_pos = 0;
  /// Some states need be resolved by forward looking
  pending = false;
  /// Current processing string
  content = '';

  get charCode() {
    return this.content.charCodeAt(this.pos);
  }

  get char() {
    return this.content.charAt(this.pos);
  }

  get isResolved() {
    if (this.pending) {
      return false;
    }
    return true;
  }

  get isEnd() {
    return this.state === State.End;
  }

  initialize(pos?: number) {
    this.state = State.Start;
    this.pending = false;
    this.pos = pos || 0;
    this.forward_pos = this.pos;
  }
  
  forward(append: number) {
    this.forward_pos = this.pos + append;
    return this.content.charCodeAt(this.forward_pos);
  }

  increase() {
    this.pos++;
    if (this.forward_pos < this.pos) {
      this.forward_pos = this.pos;
    }
  }

  transferTo(state: State) {
    this.state = state;
    
    console.log(`char: ${this.char || ' '} pos: ${this.pos} state: ${this.state}`);

    this.increase();
    this.pending = false;
  }

  pendingTransferTo(state: State) {
    this.state = state;
    this.increase();
    this.pending = true;
  }

  process(content: string) {
    this.initialize();
    this.content = content;
  }

  tokenize() {
    while (this.pos !== this.content.length || this.isEnd) {
      if (this.charCode === Code('#')) {
        this.transferTo(State.Heading);
        this.transferTo(State.End);
      } else if (this.charCode === Code('*')) {
        this.pendingTransferTo(State.UnorderList)
      } else if (this.charCode === Code('-')) {
        this.pendingTransferTo(State.UnorderList);
      }
    }
  }

};

export { StateMachine };
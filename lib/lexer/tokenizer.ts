import { Token } from './token';
import { heading } from './rules';
import { State } from '../core/state';

enum Status {
  Start,
  Text,
  InlineCode,
  Heading,
  Bold,
  Italic,
  Delete,
  Image,
  Link,
  UnorderList,
  OrderList,
  Table,
  Footer,
  MetaData,
}

export class Tokenizer {
  tokens: Token[];
  /// state machine status
  status: Status = Status.Start;

  constructor() {
    this.tokens = [];
  }

  process(state: State) {
    let code = state.content!.charCodeAt(0);
    
    switch (code) {
      case 0x23: /// #
        this.status = Status.Heading;
        break;
      case 0x60: /// `
        this.status = Status.InlineCode;
        break;
      case 0x2A: /// *
      case 0x5F: /// _
        if (this.status === Status.Start) {
          /// 这里还有问题，可能一行的一开始就是斜体或者粗体，需要向前看 ll(k)
          this.status = Status.UnorderList;
        } else {
          /// 先进入斜体模式，再判断是否是粗体
          this.status = Status.Italic;
        }
        break;
      default:
        this.status = Status.Text;
    }
    
    
    /// heading
    let token = heading(state, 0);
    if (token) {
      this.tokens.push(token);
    }
  }
}
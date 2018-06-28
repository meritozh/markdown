import { Tokenizer } from '../lexer';
import { Parser } from '../parser';
import { Renderer } from '../renderer';
import { Token } from '../lexer/token';
import { IsSpace } from '../utils/string';

class State {
  tokenizer: Tokenizer;
  parser: Parser;
  renderer: Renderer;

  /// Current processing string
  content?: string;
  /// Position of current processing string
  pos: number;

  constructor() {
    this.tokenizer = new Tokenizer();
    this.parser = new Parser();
    this.renderer = new Renderer();
    this.pos = 0;
  }

  process(content: string) {
    this.content = content;
    this.tokenize();
  }

  push(token: Token) {
    this.tokenizer.tokens.push(token);
  }

  private tokenize() {
    this.tokenizer.process(this);
  }

  parse(content: string) {
    this.parser.process(content);
  }

  render(content: string) {
    this.renderer.process(content);
  }

  /// ====== utils ======
  skipSpaces(pos: number) {
    let code: number;
    for (let max = this.content!.length; pos < max; ++pos) {
      code = this.content!.charCodeAt(pos);
      if (!IsSpace(code)) {
        break;
      }
    }
    return pos;
  }

  skipSpacesBack(pos: number, min: number) {
    if (pos <= min) {
      return pos;
    }

    while(pos > min) {
      if (!IsSpace(this.content!.charCodeAt(--pos))) {
        return pos + 1;
      }
    }

    return pos;
  }
}

export { State };
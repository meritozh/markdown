import { Token, TokenType } from './token';

class HeadingToken extends Token {
  level: number = 0;
  tag: string;

  constructor(type: TokenType, pos: number, tag: string) {
    super(type, pos);
    this.tag = tag;
  }
}

export { HeadingToken };
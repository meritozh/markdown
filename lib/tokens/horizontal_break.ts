import { Token, TokenType } from './token';

class HorizontalBreakToken extends Token {
  tag: string;

  constructor(type: TokenType, pos: number, tag: string) {
    super(type, pos);
    this.tag = tag;
  }
};

export { HorizontalBreakToken };
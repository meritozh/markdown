import { Token, TokenType } from "./token";

class QuoteToken extends Token {
  tag: string;
  level: number;
  content?: string;

  constructor(
    type: TokenType,
    pos: number,
    tag: string,
    level: number,
    content?: string
  ) {
    super(type, pos);
    this.tag = tag;
    this.level = level;
    this.content = content;
  }
}

export { QuoteToken };

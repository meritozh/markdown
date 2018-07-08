import { Token, TokenType } from "./token";

class ParagraphToken extends Token {
  tag: string;

  constructor(type: TokenType, pos: number, tag: string) {
    super(type, pos);
    this.tag = tag;
    this.inline = false;
  }
}

export { ParagraphToken };

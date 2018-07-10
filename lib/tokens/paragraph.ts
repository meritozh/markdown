import { Token, TokenType, T } from "./token";

class ParagraphToken extends Token {
  tag: string = 'p';
  content: string;

  constructor(start: T, lineMap: T, content: string) {
    super(TokenType.Paragraph, start, lineMap);
    this.content = content;
  }
}

export { ParagraphToken };

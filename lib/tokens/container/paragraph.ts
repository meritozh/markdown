import { Token, TokenType, Location } from "../token";

class ParagraphToken extends Token {
  tag: string = 'p';
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.Paragraph, start, lineMap);
    this.content = content;
  }
}

export { ParagraphToken };

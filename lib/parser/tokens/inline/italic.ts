import { Location, TokenType, Token } from "../token";

class ItalicToken extends Token {
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.Italic, start, lineMap);
    this.content = content;
  }
}

export { ItalicToken };

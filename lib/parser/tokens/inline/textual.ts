import { Location, Token, TokenType } from "../token";

class TextualToken extends Token {
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.Textual, start, lineMap);
    this.content = content;
  }
}

export { TextualToken };

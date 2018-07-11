import { Token, Location, TokenType } from "../token";

class SuperscriptToken extends Token {
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.Superscript, start, lineMap);
    this.content = content;
  }
}

export { SuperscriptToken };

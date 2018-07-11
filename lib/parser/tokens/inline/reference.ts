import { Token, Location, TokenType } from "../token";

class RefMarkToken extends Token {
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.RefMark, start, lineMap);
    this.content = content;
  }
}

class RefDescToken extends Token {
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.RefDesc, start, lineMap);
    this.content = content;
  }
}

export { RefDescToken, RefMarkToken };

import { Token, Location, TokenType } from "../token";

class SubscriptToken extends Token {
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.Subscript, start, lineMap);
    this.content = content;
  }
}

export { SubscriptToken };

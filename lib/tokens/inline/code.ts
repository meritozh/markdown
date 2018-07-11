import { Token, TokenType, Location } from "../token";

class CodeToken extends Token {
  tag = 'code'
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.Code, start, lineMap);
    this.content = content;
  }
}

export { CodeToken };

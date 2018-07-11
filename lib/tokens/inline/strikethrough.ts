import { Token, Location, TokenType } from "../token";

class StrikethroughToken extends Token {
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.Strikethrough, start, lineMap);
    this.content = content;
  }  
}

export {StrikethroughToken}
import { Token, TokenType, Location } from "./token";

class BlockToken extends Token {
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.CodeBlock, start, lineMap);
    this.content = content;
  }
}

export { BlockToken };

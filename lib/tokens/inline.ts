import { Token, TokenType, Location } from "./token";

/// InlineToken need be tokenized later
class InlineToken extends Token {
  content: string;
  children: Token[] = [];

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.Inline, start, lineMap);
    this.content = content;
  }
}

export { InlineToken };

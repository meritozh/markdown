import { Token, TokenType, T } from "./token";

/// InlineToken need be tokenized later
class InlineToken extends Token {
  content: string;
  children: Token[] = [];

  constructor(start: T, lineMap: T, content: string) {
    super(TokenType.Inline, start, lineMap);
    this.content = content;
  }
}

export { InlineToken };

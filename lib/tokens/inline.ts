import { Token, TokenType } from "./token";

/// InlineToken need be tokenized later
class InlineToken extends Token {
  content: string;
  children: Token[] = [];

  constructor(pos: number, content: string) {
    super(TokenType.Inline, pos);
    this.content = content;
    this.inline = true;
  }
}

export { InlineToken };

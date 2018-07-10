import { Token, TokenType, T } from "./token";

class CodeBlockToken extends Token {
  content: string;

  constructor(start: T, lineMap: T, content: string) {
    super(TokenType.CodeBlock, start, lineMap);
    this.content = content;
  }
}

export { CodeBlockToken };

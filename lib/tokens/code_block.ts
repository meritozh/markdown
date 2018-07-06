import { Token, TokenType } from './token';

class CodeBlockToken extends Token {
  content: string;

  constructor(pos: number, content: string) {
    super(TokenType.CodeBlock, pos);
    this.content = content;
  }
};

export { CodeBlockToken };
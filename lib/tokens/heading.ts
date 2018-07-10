import { Token, TokenType, T } from "./token";

class HeadingToken extends Token {
  level: number = 0;
  tag: string;
  content: string;

  constructor(start: T, lineMap: T, tag: string, content: string) {
    super(TokenType.Heading, start, lineMap);
    this.tag = tag;
    this.content = content;
  }
}

export { HeadingToken };

import { Token, TokenType, Location } from "../token";

class HeadingToken extends Token {
  tag: string;
  content: string;

  constructor(
    start: Location,
    lineMap: Location,
    tag: string,
    content: string
  ) {
    super(TokenType.Heading, start, lineMap);
    this.tag = tag;
    this.content = content;
  }
}

export { HeadingToken };

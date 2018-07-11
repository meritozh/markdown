import { Token, TokenType, Location } from "../token";

class FenceToken extends Token {
  content: string;
  /// Language name, used for highlight.
  lang: string;

  constructor(
    start: Location,
    lineMap: Location,
    lang: string,
    content: string
  ) {
    super(TokenType.CodeFence, start, lineMap);
    this.lang = lang;
    this.content = content;
  }
}

export { FenceToken };

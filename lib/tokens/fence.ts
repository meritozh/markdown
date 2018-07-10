import { Token, TokenType, T } from "./token";

class FenceToken extends Token {
  tag: string = 'code';
  content: string;
  /// Language name, used for highlight.
  lang: string;

  constructor(start: T, lineMap: T, lang: string, content: string) {
    super(TokenType.CodeFence, start, lineMap);
    this.lang = lang;
    this.content = content;
  }
}

export { FenceToken };

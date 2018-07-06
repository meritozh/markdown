import { Token, TokenType } from './token';

class FenceToken extends Token {
  tag: string;
  content: string;
  /// Language name, used for highlight.
  lang?: string;

  constructor(type: TokenType, pos: number, tag: string, content: string) {
    super(type, pos);
    this.tag = tag;
    this.content = content;
  }
};

export {
  FenceToken
};
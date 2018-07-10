import { Token, TokenType, T } from "./token";

interface LevelContentMap {
  level: number;
  content: string | undefined;
}

class QuoteToken extends Token {
  tag: string = "blockquote";
  content: LevelContentMap[];

  constructor(start: T, lineMap: T, content: LevelContentMap[]) {
    super(TokenType.Quote, start, lineMap);
    this.content = content;
  }
}

export { QuoteToken, LevelContentMap };

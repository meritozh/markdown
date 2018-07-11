import { Token, TokenType, Location } from "../token";

interface LevelContentMap {
  level: number;
  content: string;
}

class QuoteToken extends Token {
  tag: string = "blockquote";
  content: LevelContentMap[];

  constructor(start: Location, lineMap: Location, content: LevelContentMap[]) {
    super(TokenType.Quote, start, lineMap);
    this.content = content;
  }
}

export { QuoteToken, LevelContentMap };

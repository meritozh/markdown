import { Token, TokenType, Location } from "../token";

class EmphasisToken extends Token {
  tag = "em";
  content: string;

  constructor(start: Location, lineMap: Location, content: string) {
    super(TokenType.Emphasis, start, lineMap);
    this.content = content;
  }
}

export { EmphasisToken };

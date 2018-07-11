import { Token, TokenType, Location } from "../token";

class HorizontalBreakToken extends Token {
  tag: string = "hr";

  constructor(start: Location, lineMap: Location) {
    super(TokenType.HorizontalBreak, start, lineMap);
  }
}

export { HorizontalBreakToken };

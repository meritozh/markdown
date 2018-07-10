import { Token, TokenType, T } from "./token";

class HorizontalBreakToken extends Token {
  tag: string = "hr";

  constructor(start: T, lineMap: T) {
    super(TokenType.HorizontalBreak, start, lineMap);
  }
}

export { HorizontalBreakToken };

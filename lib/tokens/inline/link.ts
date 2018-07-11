import { Token, Location, TokenType } from "../token";

class LinkToken extends Token {
  url: string;
  title: string;

  constructor(start: Location, lineMap: Location, url: string, title: string) {
    super(TokenType.Link, start, lineMap);
    this.url = url;
    this.title = title;
  }
}

export { LinkToken };

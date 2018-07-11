import { Token, Location, TokenType } from "../token";

class ImageToken extends Token {
  title: string;
  url: string;

  constructor(start: Location, lineMap: Location, url: string, title: string) {
    super(TokenType.Image, start, lineMap);
    this.title = title;
    this.url = url;
  }
}

export { ImageToken };

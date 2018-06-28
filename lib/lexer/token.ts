enum TokenType {
  HeadingOpen = 'heading_open',
  HeadingClose = 'heading_close',

  Text = 'text',
};

class Token {
  type: TokenType;
  pos: number;

  constructor(type: TokenType, pos: number) {
    this.type = type;
    this.pos = pos;
  }
};

class HeadingToken extends Token {
  level: number = 0;
  tag: string;

  constructor(type: TokenType, pos: number, tag: string) {
    super(type, pos);
    this.tag = tag;
  }
}

class TextToken extends Token {
  content: string;

  constructor(pos: number, content: string) {
    super(TokenType.Text, pos);
    this.content = content;
  }
};

export { TokenType, Token, HeadingToken, TextToken };

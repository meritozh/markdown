enum TokenType {
  HeadingOpen = 'heading_open',
  HeadingClose = 'heading_close',

  Text = 'text',
};

class Token {
  type: TokenType;
  pos: number;
  inline: boolean = false;
  /// Line map
  set lineMap(map: [number, number]) {
    this.lineMap = map;
  }

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
    this.inline = false;
  }
}

/// InlineToken need be tokenized later
class InlineToken extends Token {
  content: string;
  children: Token[] = [];

  constructor(pos: number, content: string) {
    super(TokenType.Text, pos);
    this.content = content;
    this.inline = true;
  }
};

export { TokenType, Token, HeadingToken, InlineToken };

import { Node } from "../utils";

/// If token need future processing, we need open close
/// two type token, otherwise self-closing.
enum TokenType {
  CodeBlock = "code_block",
  CodeFence = "code_fence",
  HorizontalBreak = "horizontal_break",
  Quote = "quote",

  HeadingOpen = "heading_open",
  HeadingClose = "heading_close",

  ParagraphOpen = "paragraph_open",
  ParagraphClose = "paragraph_close",

  Inline = "inline"
}

class Token extends Node {
  tokenType: TokenType;
  /// Position in whole string, not token's content.
  pos: number;
  inline: boolean = false;
  /// Line map, if same, means one line
  lineMap: [number, number] = [0, 0];

  constructor(type: TokenType, pos: number) {
    super();
    this.tokenType = type;
    this.pos = pos;
  }
}

export { TokenType, Token };

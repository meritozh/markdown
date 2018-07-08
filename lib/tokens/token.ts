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

type T = [number, number];

class Token extends Node {
  tokenType: TokenType;
  /**
   * A position map of begin of current token to source file.
   */
  row: number;
  column: number;
  /**
   * Line map, if same number means one line.
   * Ditermine how big this token is.
   */
  lineMap: T;

  constructor(type: TokenType, row: number, column: number, lineMap: T) {
    super();
    this.tokenType = type;
    this.row = row;
    this.column = column;
    this.lineMap = lineMap;
  }
}

export { TokenType, Token };

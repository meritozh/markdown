import { Node } from "../../utils";

/// If token need future processing, we need open close
/// two type token, otherwise self-closing.
enum TokenType {
  /// Container
  Block = "block",
  Fence = "fence",
  HorizontalBreak = "horizontal_break",
  Quote = "quote",
  Heading = "heading",
  Paragraph = "paragraph",
  
  /// Inline
  Code = 'code',
  Emphasis = 'emphasis',
  Italic = 'italic',
  Image = 'image',
  Link = 'image',
  Superscript = 'superscript',
  Subscript = 'subscript',
  Strikethrough = 'strikethrough',
  Textual = 'textual',
  RefMark = 'reference_mark',
  RefDesc = 'reference_desc',
}

type Location = [number, number];

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
  lineMap: Location;

  constructor(type: TokenType, start: Location, lineMap: Location) {
    super();
    this.tokenType = type;
    this.row = start["0"];
    this.column = start["1"];
    this.lineMap = lineMap;
  }
}

export { TokenType, Token, Location };

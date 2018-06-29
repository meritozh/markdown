import { IsTab, IsIndent, IsNewLine, IsNonWhitespace } from "../utils/string";
import { Token } from "./token";

/// Current `Core` is too heavy!
/// Need move some logics to state machine, to keep `Core` only
/// manage parsing phases.
class Core {
  /**
   * Current processing block is tight or not.
   * 
   * i.e.
   * 
   * ```
   * <empty line>
   * conten here
   * <empty line>
   * ```
   * 
   * is not tight.
   */
  tight: boolean = false;
  /**
   * The processing markdown file.
   */
  src: string = '';
  /**
   * Current processing line number.
   */
  line: number = 0;
  /**
   * Max line number.
   */
  maxLine: number = 0;

  /// They are map, because key is `this.line`, value is `this.src.index`.

  /**
   * Line begin position for fast jump, is one `this.src.index`.
   */
  beginPosMap: number[] = [];
  /**
   * Line end position for fast jump, is one `this.src.index`.
   */
  endPosMap: number[] = [];
  /**
   * Offset of first non-whitespace character (tab not expanded),
   * Used when handle raw file content or unicode.
   */
  indentMap: number[] = [];
  /**
   * Offset of first non-whitespace character (tab expand),
   * Used when handle markdown format.
   */
  offsetMap: number[] = [];

  /**
   * Used for nested calls, such as *blockquotes* & *lists*.
   */
  blockIndent = 0;
  /**
   * Indent level.
   */
  level = 0;

  tokens: Token[] = [];

  /// initialize phase
  process(src: string) {
    this.src = src;

    /// in next loop, start is
    let start = 0;
    /// current processing position
    let pos = 0;
    /// expand tab to 4 spaces, final number of spaces is offset
    let offset = 0;
    /// every tab and space is a indent
    let indent = 0;
    let length = this.src.length;
    /// has detected indent status of current processing line
    let indentDetected = false;
    
    while (pos < length) {
      let code = this.src.charCodeAt(pos);

      if (!indentDetected) {
        if (IsIndent(code)) {
          indent++;
          if (IsTab(code)) { /// tab expand to 4 spaces
            /// for example `<space><tab>`, it should be expand to:
            /// 5? not beautiful.
            /// 4. beautiful, of course commonmark spec defined this.
            offset += 4 - offset % 4;
          } else { /// space
            offset++;
          }
          continue;
        } else {
          indentDetected = true;
        }
      }

      if (IsNewLine(code) || pos === length - 1) {
        if (!IsNewLine(code)) {
          pos++;
        }

        this.beginPosMap.push(start);
        this.endPosMap.push(pos);
        this.indentMap.push(indent);
        this.offsetMap.push(offset);

        indentDetected = false;
        indent = 0;
        offset = 0;
        start = pos + 1;
      }

      ++pos;
    }

    this.maxLine = this.beginPosMap.length - 1;
  }

  skipEmptyLines(from: number) {
    for (let max = this.maxLine; from < max; ++from) {
      if (this.beginPosMap[from] + this.indentMap[from]
          < this.endPosMap[from]) {
        break;
      }
    }
    return from;
  }

  skipWhitespaces(pos: number) {
    let code;
    for (let max = this.src.length; pos < max; ++pos) {
      code = this.src.charCodeAt(pos);
      if (IsNonWhitespace(code)) {
        break;
      }
    }
    return pos;
  }

  skipWhitespacesBack(pos: number, min: number) {
    if (pos <= min) {
      return pos;
    }

    while (pos > min) {
      if (IsNonWhitespace(this.src.charCodeAt(pos))) {
        return pos;
      }
      --pos;
    }

    return pos;
  }

  skipCharsBack(pos: number, min: number, code: number) {
    if (pos <= min) {
      return pos;
    }

    while (pos > min) {
      if (this.src.charCodeAt(pos) !== code) {
        break;
      }
      --pos;
    }

    return pos;
  }

  push(token: Token) {
    this.tokens.push(token);
  }
};

export { Core };
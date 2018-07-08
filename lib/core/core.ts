import { Token } from "../tokens/token";
import { IsIndent, IsNewLine, IsNonWhitespace, IsTab } from "../utils";

/// Need move some logics to state machine, to keep `Core` only
/// manage parsing state.
class StateManager {
  /**
   * The processing markdown file content.
   */
  src: string = "";
  /**
   * Current processing line number.
   */
  currentLine: number = 0;
  /**
   * Max line number.
   */
  maxLine: number = 0;

  /// They are map, because key is `this.line`, value is `this.src.index`.

  /**
   * Line begin position for fast jump, is one `this.src.index`.
   */
  beginMap: number[] = [];
  /**
   * Line end position for fast jump, is one `this.src.index`.
   */
  endMap: number[] = [];
  /**
   * Offset of first non-whitespace character (tab not expanded),
   * Used when handle raw file content or unicode.
   */
  rawIndentMap: number[] = [];
  /**
   * Offset of first non-whitespace character (tab expand),
   * Used when handle markdown format.
   */
  expandIndentMap: number[] = [];

  /**
   * In some case, like indent code block, number of tab expand to space is
   * dynamic. For example, if this map show 21, first tab should be expanded
   * to 4 - 21 % 4 = 3. To make final indent more beautiful.
   *
   * This value will be set outside.
   */
  recordTabExpandGuideMap: number[] = [];

  /**
   * Used for nested calls, such as blockquote, list, table, etc.
   */
  blockIndent = 0;

  tokens: Token[] = [];

  /// Handle file as one big string.
  /// Will calculate [line -> pos] map, number of line, etc.
  process(src: string) {
    this.src = src;

    /// Initial position of current processing line.
    /// In next loop, start will be updated.
    let start = 0;
    /// Current processing position
    let pos = 0;
    /// Expand tab to 4 spaces, final number of spaces is offset
    let expandIndent = 0;
    /// Every tab and space is one raw indent
    let rawIndent = 0;
    /// Has handled indent of current processing line
    let handledIndent = false;
    let length = this.src.length;

    for (; pos < length; ++pos) {
      let code = this.src.charCodeAt(pos);

      if (!handledIndent) {
        if (IsIndent(code)) {
          rawIndent++;
          if (IsTab(code)) {
            /// tab expand to 4 spaces
            /// for example `<space><tab>`, it should be expand to:
            /// 5? not beautiful.
            /// 4. beautiful, of course commonmark spec defined this.
            expandIndent += 4 - (expandIndent % 4);
          } else {
            /// space
            expandIndent++;
          }
          continue;
        } else {
          handledIndent = true;
        }
      }

      if (IsNewLine(code) || pos === length - 1) {
        if (!IsNewLine(code)) {
          pos++;
        }

        /// Store
        this.beginMap.push(start);
        this.endMap.push(pos);
        this.rawIndentMap.push(rawIndent);
        this.expandIndentMap.push(expandIndent);
        this.recordTabExpandGuideMap.push(0);

        /// Initialize
        handledIndent = false;
        rawIndent = 0;
        expandIndent = 0;
        start = pos + 1;
      }
    }

    /// Push fake entry to simplify cache bounds checks.
    this.beginMap.push(src.length);
    this.endMap.push(src.length);
    this.rawIndentMap.push(0);
    this.expandIndentMap.push(0);
    this.recordTabExpandGuideMap.push(0);

    this.maxLine = this.beginMap.length;
  }

  skipEmptyLines(from: number) {
    for (let max = this.maxLine; from < max; ++from) {
      if (this.beginMap[from] + this.rawIndentMap[from] < this.endMap[from]) {
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
        /// Current pos is not whitespace, so `end` index should be `pos + 1`.
        return pos + 1;
      }
      --pos;
    }

    return pos;
  }

  skipChars(pos: number, max: number, code: number) {
    if (pos >= max) {
      return pos;
    }

    while (pos < max) {
      if (this.src.charCodeAt(pos) !== code) {
        break;
      }
      ++pos;
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

  /// FIXME: need handle block indention.
  isEmpty(line: number) {
    return this.beginMap[line] + this.rawIndentMap[line] >= this.endMap[line];
  }

  /**
   * Get content of one line.
   *
   * @param line line number
   * @param indent indent, start from beginMap[line]
   */
  getLine(line: number, indent?: number) {
    let start = this.beginMap[line] + (indent || 0);
    let end = this.endMap[line];
    return this.src.slice(start, end);
  }

  /**
   * Get content as html tag content, may need some trick about indent
   *
   * @param start start line number
   * @param end end line number
   * @param indent used in code block, trim indent
   */
  getLines(start: number, end: number, indent?: number) {
    if (start >= end) {
      return "";
    }

    if (indent) {
      let line = start;
      /// Current processing line begin position
      let first = 0;
      /// Current processing line end position
      let last = 0;
      let lineIndent = 0;
      let lineStart = 0;

      const queue = new Array<string>(end - start);

      for (let i = 0; line < end; ++line, ++i) {
        lineIndent = 0;
        lineStart = this.beginMap[line];
        first = lineStart;

        /// \tasfdgf
        /// \tasfdghrjtu
        ///
        /// Code block above, queue should be:
        /// [0]: asfdgf\n
        /// [1]: asfdghrjtu
        ///
        /// So line end position needn't increase 1 to make
        /// slice cotain `\n`, except last line.
        if (line + 1 < end) {
          last = this.endMap[line] + 1;
        } else {
          last = this.endMap[line];
        }

        while (first < last && lineIndent < indent) {
          let code = this.src.charCodeAt(first);

          if (IsIndent(code)) {
            if (IsTab(code)) {
              lineIndent +=
                4 - ((lineIndent + this.recordTabExpandGuideMap[line]) % 4);
            } else {
              ++lineIndent;
            }
          } else if (first - lineStart < this.rawIndentMap[line]) {
            /// In code block or other similar case, tab in content may expand
            /// to one space.
            ++lineIndent;
          } else {
            break;
          }

          ++first;
        }

        if (lineIndent > indent) {
          /// Dead code??? lineIndent++ won't skip ===
          /// Partially expanding tabs in code blocks, e.g '\t\tfoobar'
          /// with indent = 2 will becomes '  \tfoobar'.
          queue[i] =
            new Array(lineIndent - indent + 1).join(" ") +
            this.src.slice(first, last);
        } else {
          queue[i] = this.src.slice(first, last);
        }
      }

      return queue.join("");
    }

    return this.src.slice(this.beginMap[start], this.endMap[end]);
  }

  push(token: Token) {
    this.tokens.push(token);
  }
}

export { StateManager };

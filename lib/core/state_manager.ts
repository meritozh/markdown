import { Token, Location } from "../tokens";
import { IsIndent, IsNewLine, IsTab, Tree, IsWhitespace } from "../utils";

/// Need move some logics to state machine, to keep `Core` only
/// manage parsing state.
class StateManager {
  /**
   * The processing markdown file content.
   */
  src: string = "";
  /**
   * Current processing row.
   *
   * Warning: Start from 1.
   */
  currentRow: number = 1;
  /**
   * Max row number.
   */
  maxRow: number = 0;

  /// They are map, because key is `this.currentRow`, value is `this.src.index`.

  /**
   * Line begin position for fast jump, is one `this.src.index`.
   *
   * Warning: Start from 1.
   */
  beginMap: number[] = [0];
  /**
   * Line end position for fast jump, is one `this.src.index`.
   *
   * Warning: Start from 1.
   */
  endMap: number[] = [0];
  /**
   * Offset of first non-whitespace character (tab not expanded),
   * Used when handle raw file content or unicode.
   *
   * Warning: Start from 1.
   */
  rawIndentMap: number[] = [0];
  /**
   * Offset of first non-whitespace character (tab expand),
   * Used when handle markdown format.
   *
   * Warning: Start from 1.
   */
  expandIndentMap: number[] = [0];
  /**
   * In some case, like indent code block, number of tab expand to space is
   * dynamic. For example, if this map show 21, first tab should be expanded
   * to 4 - 21 % 4 = 3. To make final indent more beautiful.
   *
   * This value will be set from outside.
   *
   * Warning: Start from 1.
   */
  recordTabExpandGuideMap: number[] = [0];

  /**
   * Note current indent.
   * Used for nested blocks, such as blockquote, list, table, etc.
   *
   * FIXME: should not be here.
   */
  blockIndent = 0;

  AST = new Tree();

  /// Handle file as one big string.
  /// Will calculate [line -> pos] map, number of line, etc.
  initialize(src: string) {
    this.src = src;

    /// Initial position of current processing line.
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
            /// for example `<space><tab>`, tab should be expand to:
            /// 5? not beautiful.
            /// 4. beautiful.
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
        /// Maybe last line is a empty line, just skip it, no more loop.
        if (!IsNewLine(code)) {
          pos++;
        }

        this.beginMap.push(start);
        this.endMap.push(pos);
        this.rawIndentMap.push(rawIndent);
        this.expandIndentMap.push(expandIndent);
        this.recordTabExpandGuideMap.push(0);

        handledIndent = false;
        rawIndent = 0;
        expandIndent = 0;
        start = pos + 1;
      }
    }

    this.maxRow = this.beginMap.length - 1;

    /// Fake entry. Useful when no new empty line as EOF.
    this.beginMap.push(pos);
    this.endMap.push(pos);
    this.rawIndentMap.push(0);
    this.expandIndentMap.push(0);
    this.recordTabExpandGuideMap.push(0);
  }

  codeFor(pos: number) {
    return this.src.charCodeAt(pos);
  }

  getPosition(location: Location) {
    const row = location["0"];
    const column = location["1"];
    return this.beginMap[row] + column;
  }

  getLocation(pos: number): Location {
    let column = 0;
    let row = 1;
    const start = pos + 1;
    for (; row < this.beginMap.length; ++row) {
      if (this.beginMap[row] < start) {
        if (this.beginMap[row + 1] > start) {
          break;
        } else {
          continue;
        }
      } else if (this.beginMap[row] === start) {
        break;
      }
    }
    column = start - this.beginMap[row];
    if (column < 1) {
      console.log("something wrong");
    }
    return [row, column];
  }

  skipEmptyRows(from: number) {
    for (let max = this.maxRow; from < max; ++from) {
      if (!this.isEmpty(from)) {
        break;
      }
    }
    return from;
  }

  skipWhitespaces(pos: number) {
    for (let max = this.src.length; pos < max; ++pos) {
      if (!IsWhitespace(this.codeFor(pos))) {
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
      if (!IsWhitespace(this.codeFor(pos))) {
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
      if (this.codeFor(pos) !== code) {
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
      if (this.codeFor(pos) !== code) {
        break;
      }
      --pos;
    }

    return pos;
  }

  /// FIXME: need handle block indention.
  isEmpty(row: number) {
    return this.beginMap[row] + this.rawIndentMap[row] >= this.endMap[row];
  }

  /**
   * Get content of one row.
   *
   * @param row row number
   * @param indent indent, start from beginMap[line]
   */
  getRow(row: number, indent?: number) {
    let start = this.beginMap[row] + (indent || 0);
    let end = this.endMap[row];
    /// No last `\n'.
    return this.src.slice(start, end - 1);
  }

  /**
   * Get content as html tag content, may need some trick about indent
   *
   * @param start start row number
   * @param end end row number
   * @param indent used in code block, trim indent
   */
  getRows(start: number, end: number, indent?: number) {
    if (start >= end) {
      return "";
    }

    if (indent) {
      /// Current processing row begin position
      let first = 0;
      /// Current processing row end position
      let last = 0;
      let lineIndent = 0;
      let lineStart = 0;

      const queue = new Array<string>(end - start);

      for (let i = 0; start < end; ++start, ++i) {
        lineIndent = 0;
        lineStart = this.beginMap[start];
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
        if (start + 1 < end) {
          last = this.endMap[start] + 1;
        } else {
          last = this.endMap[start];
        }

        while (first < last && lineIndent < indent) {
          let code = this.codeFor(first);

          if (IsIndent(code)) {
            if (IsTab(code)) {
              lineIndent +=
                4 - ((lineIndent + this.recordTabExpandGuideMap[start]) % 4);
            } else {
              ++lineIndent;
            }
          } else if (first - lineStart < this.rawIndentMap[start]) {
            /// In code block or other similar case, tab in content may expand
            /// to one space.
            ++lineIndent;
          } else {
            break;
          }

          ++first;
        }

        // if (lineIndent > indent) {
        /// Dead code??? lineIndent++ won't skip ===
        /// Partially expanding tabs in code blocks, e.g '\t\tfoobar'
        /// with indent = 2 will becomes '  \tfoobar'.
        //   queue[i] =
        //   new Array(lineIndent - indent + 1).join(" ") +
        //   this.src.slice(first, last);
        // } else {
        queue[i] = this.src.slice(first, last);
        // }
      }

      return queue.join("");
    }

    return this.src.slice(this.beginMap[start], this.endMap[end] - 1);
  }

  addChild(token: Token, to?: Token) {
    if (to) {
      this.AST.addChild(token, to);
    } else {
      this.AST.addChild(token, this.AST.current);
    }
  }
}

export { StateManager };

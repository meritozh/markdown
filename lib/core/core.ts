import { IsTab, IsIndent, IsNewLine } from "../utils/string";

class SourceManager {
  /// the processing markdown file
  src: string = '';
  /// current processing line number
  line: number = 0;
  /// max line number
  maxLine: number = 0;

  /// They are map, because key is `this.line`, value is `this.src.index`

  /// line begin position for fast jump, is one `this.src.index`
  beginLinePosMap: number[] = [];
  /// line end position for fast jump, is one `this.src.index`
  endLinePosMap: number[] = [];
  /// offset of first non-whitespace character (tab not expanded)
  indentMap: number[] = [];
  /// offset of first non-whitespace character (tab expand)
  offsetMap: number[] = [];

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
    let foundIndent = false;
    
    while (pos < length) {
      let code = this.src.charCodeAt(pos);

      if (!foundIndent) {
        if (IsIndent(code)) {
          indent++;
          if (IsTab(code)) { /// tab expand to 4 spaces
            /// for example `<space><tab>`, it should be expand to:
            /// 5? not beautiful.
            /// 4. beautiful, also commonmark spec defined this.
            offset += 4 - offset % 4;
          } else { /// space
            offset++;
          }
          continue;
        } else {
          foundIndent = true;
        }
      }

      if (IsNewLine(code) || pos === length - 1) {
        if (!IsNewLine(code)) {
          pos++;
        }

        this.beginLinePosMap.push(start);
        this.endLinePosMap.push(pos);
        this.indentMap.push(indent);
        this.offsetMap.push(offset);

        foundIndent = false;
        indent = 0;
        offset = 0;
        start = pos + 1;
      }

      ++pos;
    }

    this.maxLine = this.beginLinePosMap.length - 1;
  }

  constructor(src: string) {
    this.process(src);
  }
};

export { SourceManager };
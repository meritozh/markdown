import { Core } from '.';
import fs from 'fs';
import { Rule, Heading } from '../rules';

class Parser {
  private core = new Core();
  /// Order of rules initialize is important
  private rules: Rule[] = [
    new Heading(),
  ];

  process(src: string) {
    this.core.process(src);
  }

  tokenize() {
    const length = this.rules.length;

    let hasEmptyLines = false;

    let line = this.core.line;
    let endLine = this.core.maxLine;

    while (line < endLine) {
      /// Tokenize from first non-empty line
      line = this.core.skipEmptyLines(line);
      this.core.line = line;
      if (line >= endLine) {
        break;
      }

      /// Do not tokenize nested blocks
      if (this.core.offsetMap[line] < this.core.blockIndent) {
        break;
      }

      for (let i = 0; i < length; ++i) {
        const result = this.rules[i].process(this.core, line);
        if (result) { /// One line can only match one rule per time.
          break;
        }
      }

      /// Set `core.tight` if we had an empty before current tag.
      /// i.e. latest empty line should not count.
      this.core.tight = !hasEmptyLines;
    }
  }
};

const p = new Parser();
const data = fs.readFileSync('/Users/gaoge/Development/markdown/test/test.md');
p.process(data.toString());

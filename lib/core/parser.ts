import fs from "fs";

import { Heading, Rule } from "../rules";
import { CodeBlock } from "../rules/code_block";
import { Paragraph } from "../rules/paragraph";
import { Token } from "../tokens/token";

import { Core } from ".";
import { Fence } from "../rules/fence";
import { HorizonalBreak } from "../rules/horizontal_break";
import { Quote } from "../rules/quote";

class Parser {
  core = new Core();
  /// Order of rules initialize is important
  rules: Rule[] = [
    new Quote(),
    new Fence(),
    new CodeBlock(),
    new Heading(),
    new HorizonalBreak(),
    new Paragraph()
  ];

  process(src: string) {
    this.core.process(src);
    this.tokenize();
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
      if (this.core.expandIndentMap[line] < this.core.blockIndent) {
        break;
      }

      for (let i = 0; i < length; ++i) {
        const result = this.rules[i].process(this.core, line);
        if (result) {
          /// One line can only match one rule per time.
          break;
        }
      }

      /// Set `core.tight` if we had an empty before current tag.
      /// i.e. latest empty line should not count.
      this.core.tight = !hasEmptyLines;

      /// Paragraph might "eat" one newline after it in nested lists
      if (this.core.isEmpty(line - 1)) {
        hasEmptyLines = true;
      }

      /// In `rule.process`, might increase `core.line`, so synchronize
      /// it here.
      line = this.core.line;

      if (line < endLine && this.core.isEmpty(line)) {
        hasEmptyLines = true;
        ++line;
        this.core.line = line;
      }
    }
  }
}

const p = new Parser();
const data = fs.readFileSync("/Users/gaoge/Development/markdown/test/test1.md");
p.process(data.toString());

p.core.tokens.forEach((token: Token) => {
  console.log(token);
});

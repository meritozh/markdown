import fs from "fs";

import { Heading } from "../rules";
import { CodeBlock } from "../rules/code_block";
import { Paragraph } from "../rules/paragraph";
import { Token } from "../tokens/token";

import { StateManager } from ".";
import { Fence } from "../rules/fence";
import { HorizonalBreak } from "../rules/horizontal_break";
import { Quote } from "../rules/quote";

class Parser {
  manager = new StateManager();
  /// Order of rules initialize is important
  blockRules = [
    new Quote(),
    new Fence(),
    new CodeBlock(),
    new Heading(),
    new HorizonalBreak(),
    new Paragraph(),
  ];

  inlineRules = [

  ]

  process(src: string) {
    this.manager.process(src);
    this.tokenize();
  }

  private tokenize() {
    const length = this.blockRules.length;

    let line = this.manager.currentLine;
    let endLine = this.manager.maxLine;

    while (line < endLine) {
      /// Tokenize from first non-empty line
      line = this.manager.skipEmptyLines(line);
      this.manager.currentLine = line;
      if (line >= endLine) {
        break;
      }

      /// Do not tokenize nested blocks
      if (this.manager.expandIndentMap[line] < this.manager.blockIndent) {
        break;
      }

      for (let i = 0; i < length; ++i) {
        const result = this.blockRules[i].process(this.manager, line);
        if (result) {
          /// One line can only match one rule per time.
          break;
        }
      }

      /// In `rule.process`, might increase `core.line`, so synchronize
      /// it here.
      line = this.manager.currentLine;

      if (line < endLine && this.manager.isEmpty(line)) {
        ++line;
        this.manager.currentLine = line;
      }
    }
  }
}

const p = new Parser();
const data = fs.readFileSync("/Users/gaoge/Development/markdown/test/test1.md");
p.process(data.toString());

p.manager.tokens.forEach((token: Token) => {
  console.log(token);
});

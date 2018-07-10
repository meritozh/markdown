import fs from "fs";

import {
  Heading,
  Paragraph,
  CodeBlock,
  Quote,
  HorizonalBreak,
  Fence
} from "../rules";

import { StateManager } from ".";

class Parser {
  manager = new StateManager();
  /// Order of rules initialize is important
  blockRules = [
    new CodeBlock(), /// Must be first.
    new Quote(),
    new Fence(),
    new Heading(),
    new HorizonalBreak(),
    new Paragraph()
  ];

  inlineRules = [];

  initialize(src: string) {
    this.manager.initialize(src);
    return this;
  }

  tokenize() {
    const length = this.blockRules.length;

    let row = this.manager.currentRow;
    let endRow = this.manager.maxRow;

    while (row < endRow) {
      /// Tokenize from first non-empty line
      row = this.manager.skipEmptyRows(row);
      this.manager.currentRow = row;
      if (row >= endRow) {
        break;
      }

      /// Do not tokenize nested blocks
      if (this.manager.expandIndentMap[row] < this.manager.blockIndent) {
        break;
      }

      for (let i = 0; i < length; ++i) {
        const result = this.blockRules[i].process(this.manager);
        if (result) {
          /// One line can only match one rule per time.
          break;
        }
      }

      /// In `rule.process`, might increase `core.line`, so synchronize
      /// it here.
      row = this.manager.currentRow;

      if (row < endRow && this.manager.isEmpty(row)) {
        ++row;
        this.manager.currentRow = row;
      }
    }
    return this;
  }
}

const p = new Parser();
const data = fs.readFileSync("/Users/gaoge/Development/markdown/test/test1.md");
p.initialize(data.toString()).tokenize();

p.manager.tokens.visit(token => {
  console.log(token);
});

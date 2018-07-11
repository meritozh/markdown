import {
  Heading,
  Paragraph,
  Block,
  Quote,
  HorizonalBreak,
  Fence
} from "./rules";

import { StateManager } from "../core";

class ParserAction {
  manager = new StateManager();
  /// Order of rules initialize is important
  containerRules = [
    new Block(), /// Must be first.
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
    const length = this.containerRules.length;

    let row = this.manager.currentRow;
    let endRow = this.manager.maxRow;

    while (row <= endRow) {
      /// Tokenize from first non-empty line
      row = this.manager.skipEmptyRows(row);
      this.manager.currentRow = row;
      if (row > endRow) {
        break;
      }

      /// Do not tokenize nested blocks
      if (this.manager.expandIndentMap[row] < this.manager.blockIndent) {
        break;
      }

      for (let i = 0; i < length; ++i) {
        const result = this.containerRules[i].process(this.manager);
        if (result) {
          /// One line can only match one rule per time.
          break;
        }
      }

      /// In `rule.process`, might increase `core.line`, so synchronize
      /// it here.
      row = this.manager.currentRow;

      if (row <= endRow && this.manager.isEmpty(row)) {
        ++row;
        this.manager.currentRow = row;
      }
    }
    return this;
  }
}

export { ParserAction };

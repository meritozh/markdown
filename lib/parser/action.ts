import { StateManager } from "../core";
import { RuleManager } from "./rules/manager";

class ParserAction {
  SM = new StateManager();
  RM = new RuleManager();

  initialize(src: string) {
    this.SM.initialize(src);
    this.RM.initialize();
    return this;
  }

  process() {
    let row = this.SM.currentRow;
    let endRow = this.SM.maxRow;

    while (row <= endRow) {
      /// Tokenize from first non-empty line
      row = this.SM.skipEmptyRows(row);
      this.SM.currentRow = row;
      if (row > endRow) {
        break;
      }

      /// Do not tokenize nested blocks
      if (this.SM.expandIndentMap[row] < this.SM.blockIndent) {
        break;
      }
      
      this.RM.process(this.SM);

      /// In `rule.process`, might increase `core.line`, so synchronize
      /// it here.
      row = this.SM.currentRow;

      if (row <= endRow && this.SM.isEmpty(row)) {
        ++row;
        this.SM.currentRow = row;
      }
    }
    return this;
  }
}

export { ParserAction };

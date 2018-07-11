import { StateManager } from "../core";
import { BlockToken } from "../tokens";

import { Rule } from "./rule";

class Block implements Rule {
  process(state: StateManager) {
    const startRow = state.currentRow;
    const expandIndent = state.expandIndentMap[startRow] - state.blockIndent;

    if (expandIndent < 4) {
      return false;
    }

    let nextRow = startRow + 1;
    /// Store last non-empty line number.
    let lastRow = startRow;

    while (nextRow <= state.maxRow) {
      if (state.isEmpty(nextRow)) {
        ++nextRow;
        continue;
      }

      if (state.expandIndentMap[nextRow] - state.blockIndent >= 4) {
        ++nextRow;
        lastRow = nextRow;
        continue;
      }

      break;
    }

    state.currentRow = nextRow;

    const content = state.getRows(startRow, lastRow, state.blockIndent + 4);
    /// Column start from 1.
    const column = state.rawIndentMap[startRow] + 1;
    state.addChild(
      new BlockToken([startRow, column], [startRow, lastRow], content)
    );

    return true;
  }
}

export { Block };

import { Rule } from "../rule";
import { StateManager } from "../../core";
import { ParagraphToken } from "../../tokens";

class Paragraph implements Rule {
  process(state: StateManager) {
    const startRow = state.currentRow;
    let nextRow = startRow + 1;
    let endRow = state.maxRow;

    for (; nextRow <= endRow && !state.isEmpty(nextRow); ++nextRow) {
      /// This would be a code block normally, but after paragraph
      /// it's considered a lazy continuation regardless of what's there.
      if (state.expandIndentMap[nextRow] - state.blockIndent >= 4) {
        continue;
      }
    }

    state.currentRow = nextRow;

    const pos = state.beginMap[startRow] + state.blockIndent;
    const content = state.getRows(startRow, nextRow);
    const location = state.getLocation(pos);

    state.addChild(
      new ParagraphToken(location, [startRow, state.currentRow], content)
    );

    return true;
  }
}

export { Paragraph };

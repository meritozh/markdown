import { Rule } from "./rule";
import { StateManager } from "../core";

import { Code, IsSpace, IsNewLine } from "../utils";
import { QuoteToken, LevelContentMap } from "../tokens";

/// All space is not optional.
class Quote implements Rule {
  process(state: StateManager) {
    const startRow = state.currentRow;

    let pos =
      state.beginMap[startRow] +
      state.rawIndentMap[startRow] +
      state.blockIndent;
    let code = state.codeFor(pos);

    if (code !== Code(">")) {
      return false;
    }

    let nextRow = startRow;

    /// Content per level.
    const rowContent = Array<LevelContentMap>();
    let level = 0;
    /// Next char code after current position.
    let next = 0;
    let content = "";

    let startLocation: [number, number] | undefined = undefined;

    while (!state.isEmpty(nextRow)) {
      level = 0;
      pos = state.beginMap[nextRow] + state.blockIndent;
      code = state.codeFor(pos);
      next = state.codeFor(pos + 1);
      /// > > content
      /// Each `>` must have a following space.
      while (
        code === Code(">") &&
        (IsSpace(next) || IsNewLine(next) || !next) /// next === NaN
      ) {
        if (!startLocation) {
          startLocation = [nextRow, pos];
        }
        ++level;
        pos = pos + 2;
        if (IsNewLine(next) || !next) {
          break;
        }
        code = state.codeFor(pos);
        next = state.codeFor(pos + 1);
      }
      let indent = pos - state.beginMap[nextRow];
      content = state.getRow(nextRow, indent);
      rowContent[nextRow - startRow] = { level: level, content: content };
      ++nextRow;
    }

    state.currentRow = nextRow;

    const quoteToken = new QuoteToken(
      startLocation!,
      [startRow, nextRow],
      rowContent
    );
    state.addChild(quoteToken);

    return true;
  }
}

export { Quote };

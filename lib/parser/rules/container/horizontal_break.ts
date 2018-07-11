import { StateManager } from "../../../core";
import { HorizontalBreakToken } from "../../tokens";
import { Code, IsWhitespace, Failure, Success } from "../../../utils";

import { Rule } from "../rule";

class HorizonalBreak implements Rule {
  isa(t: string) {
    return t.toLowerCase() === "horizonal_break";
  }

  process(state: StateManager) {
    const startRow = state.currentRow;
    /// If it's indented more than 3 spaces, it should be a code block
    if (state.expandIndentMap[startRow] - state.blockIndent >= 4) {
      return new Failure();
    }

    /// This is important
    let pos = state.beginMap[startRow];
    pos = state.skipWhitespaces(pos);
    let level = 0;
    let code = state.src.charCodeAt(pos);

    const location = state.getLocation(pos);

    while (code === Code("-")) {
      ++level;
      code = state.src.charCodeAt(++pos);
    }

    /// At least three -, and after all -, must whitespace.
    if (level < 3 || !IsWhitespace(code)) {
      return new Failure();
    }

    state.currentRow = startRow + 1;

    state.addChild(
      new HorizontalBreakToken(location, [startRow, state.currentRow])
    );

    return new Success();
  }
}

export { HorizonalBreak };

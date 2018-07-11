import { StateManager } from "../../../core";
import { FenceToken } from "../../tokens";

import { Code, Failure, Success } from "../../../utils";
import { Rule } from "../rule";

/// ```lang
/// <blabla>
/// ```
class Fence implements Rule {
  isa(t: string) {
    return t.toLowerCase() === "fence";
  }

  process(state: StateManager) {
    const startRow = state.currentRow;

    let pos =
      state.beginMap[startRow] +
      state.rawIndentMap[startRow] +
      state.blockIndent;
    let max = state.endMap[startRow];

    /// At least 4 length.
    if (pos + 3 > max) {
      return new Failure();
    }

    let code = state.codeFor(pos);
    if (code !== Code("`")) {
      return new Failure();
    }

    const location = state.getLocation(pos);

    let mem = pos;
    pos = state.skipChars(pos, max, Code("`"));
    const length = pos - mem;

    if (length < 3) {
      return new Failure();
    }

    /// Allow trailing whitespace.
    let lang = state.src.slice(pos, max).trimRight();

    let nextRow = startRow;
    let haveEndMarker = false;

    while (true) {
      ++nextRow;

      pos =
        state.beginMap[nextRow] +
        state.rawIndentMap[nextRow] +
        state.blockIndent;
      mem = pos;
      max = state.endMap[nextRow];

      if (pos < max && state.expandIndentMap[nextRow] < state.blockIndent) {
        /// Non-empty line with negative indent should stop the list:
        /// - ```
        ///  test
        break;
      }

      if (state.codeFor(pos) !== Code("`")) {
        continue;
      }

      if (state.expandIndentMap[nextRow] - state.blockIndent >= 4) {
        /// Closing fence should be indented less than 4 spaces.
        continue;
      }

      pos = state.skipChars(pos, max, Code("`"));

      /// Closing code fence must be at least as long as the opening one.
      if (pos - mem < length) {
        continue;
      }

      /// Make sure tail has spaces only.
      /// Newline is whitespace.
      pos = state.skipWhitespaces(pos);

      if (pos < max) {
        continue;
      }

      haveEndMarker = true;
      break;
    }
    /// If a fence has heading spaces, they should be removed from its inner
    /// block.
    ///
    /// Such as:
    /// \b\b```c
    /// \b\bint main() {
    /// \b\b}
    /// \b\b```
    ///
    /// Need trim all `\b`s.
    const indent = state.rawIndentMap[startRow] + state.blockIndent;

    state.currentRow = nextRow + (haveEndMarker ? 1 : 0);

    /// `startLine + 1`, because we do not need ```<lang>.
    const content = state.getRows(startRow + 1, nextRow, indent);
    state.addChild(
      new FenceToken(location, [startRow, state.currentRow], lang, content)
    );

    return new Success();
  }
}

export { Fence };

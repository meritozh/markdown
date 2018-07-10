import { HeadingToken } from "../tokens";
import { StateManager } from "../core";
import { IsSpace, Code } from "../utils";
import { Rule } from "./rule";

class Heading implements Rule {
  process(state: StateManager) {
    const startLine = state.currentRow;

    let pos =
      state.beginMap[startLine] +
      state.rawIndentMap[startLine] +
      state.blockIndent;
    let max = state.endMap[startLine];

    let code = state.codeFor(pos);
    if (code !== Code("#")) {
      return false;
    }

    /// `#` starting position
    const start = pos;

    let level = 0;
    while (code === Code("#") && level <= 6) {
      level++;
      code = state.codeFor(++pos);
    }

    /// After a sequence of `#`, must have one space
    if (level > 6 || (pos < max && !IsSpace(code))) {
      return false;
    }

    /// Cut '   ###    ' from the end of string.
    max = state.skipWhitespacesBack(max, pos);
    let tmp = state.skipCharsBack(max, pos, Code("#"));
    /// Closing sequence of `#` must have a prefix space.
    if (tmp > pos && IsSpace(state.codeFor(tmp - 1))) {
      max = tmp;
    }

    state.currentRow = startLine + 1;

    const hTag = "h" + String(level);
    const content = state.src.slice(pos, max);

    state.addChild(
      new HeadingToken(
        [startLine, start],
        [startLine, state.currentRow],
        hTag,
        content
      )
    );

    return true;
  }
}

export { Heading };

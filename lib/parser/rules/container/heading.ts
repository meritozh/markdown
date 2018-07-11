import { HeadingToken } from "../../tokens";
import { StateManager } from "../../../core";
import { IsSpace, Code, Failure, Success } from "../../../utils";
import { Rule } from "../rule";

class Heading implements Rule {
  isa(t: string) {
    return t.toLowerCase() === "heading";
  }

  process(state: StateManager) {
    const startLine = state.currentRow;

    let pos =
      state.beginMap[startLine] +
      state.rawIndentMap[startLine] +
      state.blockIndent;
    let max = state.endMap[startLine];

    let code = state.codeFor(pos);
    if (code !== Code("#")) {
      return new Failure();
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
      return new Failure();
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
    /// Current `pos` point to required space, so plus 1.
    const content = state.src.slice(pos + 1, max);
    const location = state.getLocation(start);

    state.addChild(
      new HeadingToken(location, [startLine, state.currentRow], hTag, content)
    );

    return new Success();
  }
}

export { Heading };

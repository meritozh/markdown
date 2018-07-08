import { StateManager } from "../core";
import { TokenType } from "../tokens";
import { HorizontalBreakToken } from "../tokens/horizontal_break";
import { Code, IsNewLine, IsNonWhitespace } from "../utils";

import { Rule } from "./rule";

class HorizonalBreak implements Rule {
  process(core: StateManager, startLine: number) {
    /// If it's indented more than 3 spaces, it should be a code block
    if (core.expandIndentMap[startLine] - core.blockIndent >= 4) {
      return false;
    }

    let pos = core.beginMap[startLine];
    pos = core.skipWhitespaces(pos);
    let level = 0;
    let code = core.src.charCodeAt(pos);

    while (code === Code("-")) {
      ++level;
      code = core.src.charCodeAt(++pos);
    }

    /// At least three -, and after all -, must \n or whitespace.
    if (level < 3 || IsNonWhitespace(code) || !IsNewLine(code)) {
      return false;
    }

    core.currentLine = startLine + 1;

    const horizontalBreakToken = new HorizontalBreakToken(
      TokenType.HorizontalBreak,
      pos,
      "hr"
    );
    horizontalBreakToken.lineMap = [startLine, core.currentLine];
    core.push(horizontalBreakToken);

    return true;
  }
}

export { HorizonalBreak };

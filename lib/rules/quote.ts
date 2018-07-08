import { Rule } from "./rule";
import { StateManager } from "../core";

import { Code, IsSpace, IsNewLine } from "../utils";
import { QuoteToken } from "../tokens/quote";
import { TokenType } from "../tokens";

class LevelContentMap {
  level: number;
  content: string | undefined;

  constructor(level: number, content: string | undefined) {
    this.level = level;
    this.content = content;
  }
}

/// All space is not optional.
class Quote implements Rule {
  process(core: StateManager, startLine: number) {
    if (core.expandIndentMap[startLine] - core.blockIndent >= 4) {
      return false;
    }

    let pos = core.beginMap[startLine] + core.rawIndentMap[startLine];
    let code = core.src.charCodeAt(pos);

    if (code !== Code(">")) {
      return false;
    }

    let nextLine = startLine;

    /// Content per level.
    /// I think 6 is enough.
    const lineContent = Array<LevelContentMap>();
    let level = 0;
    /// Next char code after current position.
    let next = 0;
    let content = "";

    while (!core.isEmpty(nextLine)) {
      level = 0;
      pos = core.beginMap[nextLine] + core.blockIndent;
      code = core.src.charCodeAt(pos);
      next = core.src.charCodeAt(pos + 1);
      /// > > content
      /// Each `>` must have a following space.
      while (
        code === Code(">") &&
        (IsSpace(next) || IsNewLine(next) || !next) /// next === NaN
      ) {
        ++level;
        pos = pos + 2;
        if (IsNewLine(next) || !next) {
          break;
        }
        code = core.src.charCodeAt(pos);
        next = core.src.charCodeAt(pos + 1);
      }
      let indent = pos - core.beginMap[nextLine];
      content = core.getLine(nextLine, indent);
      lineContent[nextLine - startLine] = { level: level, content: content };
      ++nextLine;
    }

    core.currentLine = nextLine + 1;

    for (const map of lineContent) {
      let quoteToken = new QuoteToken(
        TokenType.Quote,
        pos,
        "blockquote",
        map.level,
        map.content
      );
      core.push(quoteToken);
    }

    return true;
  }
}

export { Quote };

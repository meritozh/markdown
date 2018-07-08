import { HeadingToken, InlineToken, TokenType } from "../tokens";
import { StateManager } from "../core";
import { IsSpace, Code } from "../utils/string";
import { Rule } from './rule';

class Heading implements Rule {
  process(core: StateManager, startLine: number) {
    const content = core.src;

    let pos = core.beginMap[startLine] + core.rawIndentMap[startLine];
    let max = core.endMap[startLine];

    if (core.expandIndentMap[startLine] - core.blockIndent >= 4) {
      return false;
    }
    
    let code = content.charCodeAt(pos);
    if (code !== Code('#')) {
      return false;
    }

    /// `#` starting position
    const start = pos;

    let level = 0;
    while(code === Code('#') && level <= 6) {
      level++;
      code = content.charCodeAt(++pos);
    }

    /// After a sequence of `#`, must have one space
    if (level > 6 || (pos < max && !IsSpace(code))) {
      return false;
    }

    /// Cut '   ###    ' from the end of string.
    max = core.skipWhitespacesBack(max, pos);
    let tmp = core.skipCharsBack(max, pos, Code('#'));
    /// Closing sequence of `#` must have a prefix space.
    if (tmp > pos && IsSpace(core.src.charCodeAt(tmp - 1))) {
      max = tmp;
    }

    core.currentLine = startLine + 1;

    const hTag = 'h' + String(level);

    /// heading open
    const headingOpen = new HeadingToken(TokenType.HeadingOpen, start, hTag);
    headingOpen.lineMap = [startLine, core.currentLine];
    core.push(headingOpen);

    /// all remaining characters in current line are text
    const text = content.slice(pos, max).trim();
    /// `pos + 1`, because current `pos` is a space, but
    /// line text start from next position.
    const Text = new InlineToken(pos + 1, text);
    Text.lineMap = [startLine, core.currentLine];
    core.push(Text); 

    /// heading close
    /// Treat cutted line end position as heading ending.
    const headingClose = new HeadingToken(TokenType.HeadingClose, max, hTag);
    headingClose.lineMap = [startLine, core.currentLine];
    core.push(headingClose);

    return true;
  }
};

export {
  Heading,
};
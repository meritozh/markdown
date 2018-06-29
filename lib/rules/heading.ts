import { HeadingToken, InlineToken, TokenType } from "../core/token";
import { Core } from "../core";
import { IsSpace } from "../utils/string";

interface Rule {
  process(core: Core, startLine: number): boolean;
};

class Heading implements Rule {
  process(core: Core, startLine: number) {
    const content = core.src;

    let pos = core.beginPosMap[startLine] + core.indentMap[startLine];
    let max = core.endPosMap[startLine];

    if (core.offsetMap[startLine] - core.blockIndent >= 4) {
      return false;
    }
    
    let code = content.charCodeAt(pos);
    /// `0x23` === `#`
    if (code !== 0x23) {
      return false;
    }

    let level = 1;
    code = content.charCodeAt(pos);
    while(code === 0x23 && level <= 6) {
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

    core.line = startLine + 1;

    const hTag = 'h' + String(level);

    /// heading open
    const headingOpen = new HeadingToken(TokenType.HeadingOpen, pos, hTag);
    headingOpen.lineMap = [startLine, core.line];
    core.push(headingOpen);

    const end = pos + level;

    /// all remaining characters in current line are text
    const text = content.slice(pos, max).trim();
    const Text = new InlineToken(pos, text);
    Text.lineMap = [startLine, core.line];
    core.push(Text); 

    /// heading close
    const headingClose = new HeadingToken(TokenType.HeadingClose, end, hTag);
    headingClose.lineMap = [startLine, core.line];
    core.push(headingClose);

    return true;
  }
};

export {
  Rule,
  Heading,
};
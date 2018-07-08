import {StateManager} from '../core';
import {TokenType} from '../tokens';
import {FenceToken} from '../tokens/fence';

import {Code} from '../utils';
import {Rule} from './rule';

/// ```lang
class Fence implements Rule {
  process(core: StateManager, startLine: number) {
    if (core.expandIndentMap[startLine] - core.blockIndent >= 4) {
      return false;
    }

    /// Truely begin position
    let pos = core.beginMap[startLine] + core.rawIndentMap[startLine];
    let max = core.endMap[startLine];

    /// At least 3 length.
    if (pos + 3 > max) {
      return false;
    }

    let code = core.src.charCodeAt(pos);
    if (code !== Code('`')) {
      return false;
    }

    let mem = pos;
    pos = core.skipChars(pos, max, code);
    let length = pos - mem;

    if (length < 3) {
      return false;
    }

    let lang = core.src.slice(pos, max);

    let nextLine = startLine;
    let haveEndMarker = false;

    let firstPos = mem;

    while (true) {
      ++nextLine;

      pos = core.beginMap[nextLine] + core.rawIndentMap[nextLine];
      mem = pos;
      max = core.endMap[nextLine];

      if (pos < max && core.expandIndentMap[nextLine] < core.blockIndent) {
        /// Non-empty line with negative indent should stop the list:
        /// - ```
        ///  test
        break;
      }

      if (core.src.charCodeAt(pos) !== code) {
        continue;
      }

      if (core.expandIndentMap[nextLine] - core.blockIndent >= 4) {
        /// Closing fence should be indented less than 4 spaces.
        continue;
      }

      pos = core.skipChars(pos, max, code);

      /// Closing code fence must be at least as long as the opening one.
      if (pos - mem < length) {
        continue;
      }

      /// make sure tail has spaces only.
      pos = core.skipWhitespaces(pos);

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
    length = core.expandIndentMap[startLine];

    core.currentLine = nextLine + (haveEndMarker ? 1 : 0);

    /// `startLine + 1`, because we do not need ```<lang> here.
    /// `nextLine - 1`, because we do not need ```.
    const content = core.getLines(startLine + 1, nextLine - 1, length);
    const fenceToken =
        new FenceToken(TokenType.CodeFence, firstPos, 'code', content);
    fenceToken.lang = lang;
    fenceToken.lineMap = [startLine, core.currentLine];
    core.push(fenceToken);

    return true;
  }
};

export {Fence};
import {Core} from '../core';
import {CodeBlockToken} from '../tokens/code_block';

import {Rule} from './rule';

class CodeBlock implements Rule {
  process(core: Core, startLine: number) {
    if (core.expandIndentMap[startLine] - core.blockIndent < 4) {
      return false;
    }

    let nextLine = startLine + 1;
    /// Store last non-empty line number.
    let lastLine = startLine;

    while (nextLine < core.maxLine) {
      if (core.isEmpty(nextLine)) {
        ++nextLine;
        continue;
      }

      if (core.expandIndentMap[nextLine] - core.blockIndent >= 4) {
        ++nextLine;
        lastLine = nextLine;
        continue;
      }

      break;
    }

    core.line = nextLine;

    const content = core.getLines(startLine, lastLine, core.blockIndent + 4);
    const codeBlockToken =
        new CodeBlockToken(core.beginMap[startLine], content);
    codeBlockToken.lineMap = [startLine, lastLine];
    core.push(codeBlockToken);

    return true;
  }
};

export {CodeBlock};
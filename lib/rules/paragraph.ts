import { Rule } from "./rule";
import { Core } from "../core";
import { ParagraphToken, TokenType, InlineToken } from "../tokens";

class Paragraph implements Rule {
  process(core: Core, startLine: number) {
    let nextLine = startLine + 1;
    let endLine = core.maxLine;
    
    for (; nextLine < endLine && !core.isEmpty(nextLine); ++nextLine) {
      /// This would be a code block normally, but after paragraph
      /// it's considered a lazy continuation regardless of what's there.
      if (core.expandIndentMap[nextLine] - core.blockIndent >= 4) {
        continue;
      }
      /// Maybe I should allow following heading as a separate line later,
      /// but now, only empty line will separate paragraph.
    }

    core.line = nextLine;

    const paragraphOpen = new ParagraphToken(TokenType.ParagraphOpen, core.beginMap[startLine], 'p');
    paragraphOpen.lineMap = [startLine, core.line];
    core.push(paragraphOpen);

    const content = core.getLines(startLine, nextLine);
    const inlineToken = new InlineToken(core.beginMap[startLine], content);
    inlineToken.lineMap = [startLine, core.line];
    core.push(inlineToken);

    const paragraphClose = new ParagraphToken(TokenType.ParagraphClose, core.beginMap[nextLine], 'p');
    paragraphClose.lineMap = [startLine, core.line];
    core.push(paragraphClose);

    return true;
  }
};

export { Paragraph };
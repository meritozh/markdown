import { Tree, Repeat } from "../utils";
import {
  HeadingToken,
  BlockToken,
  FenceToken,
  HorizontalBreakToken,
  ParagraphToken,
  QuoteToken
} from "../tokens";
import { CSS } from "./css";

class CodeGenerator {
  style = "html";
  AST: Tree | undefined = undefined;

  initailize(AST: Tree) {
    this.AST = AST;
    return this;
  }

  generate() {
    let result = `<!DOCTYPE html>
    <head>${CSS.current()}</head>
    <html><body class="markdown-body">`;
    this.AST!.visit(node => {
      if (node instanceof HeadingToken) {
        result += `<${node.tag}>${node.content}</${node.tag}>\n`;
      } else if (node instanceof BlockToken || node instanceof FenceToken) {
        result += `<pre><code>${node.content}</code></pre>\n`;
      } else if (node instanceof HorizontalBreakToken) {
        result += `<${node.tag} />\n`;
      } else if (node instanceof ParagraphToken) {
        result += `<${node.tag}>${node.content}</${node.tag}>\n`;
      } else if (node instanceof QuoteToken) {
        let lastLevel = 0;
        node.content.forEach(kv => {
          result +=
            Repeat("<blockquote>", kv.level - lastLevel) +
            kv.content +
            Repeat("</blockquote>", kv.level - lastLevel);
            lastLevel = kv.level;
        });
        result += "\n";
      }
    });
    result += "</body></html>";
    return result;
  }
}

export { CodeGenerator };

enum Rule {
  Core,
  Block,
  Inline,
  Plugin,
}

enum Style {
  Default,
  Attach,
  Replace,
  After,
}

interface Chainable {
  input(content: string): void;
  output(content: string): void;
}

class Parser implements Chainable {
  rule: Rule
  style: Style

  constructor() {
    this.rule = Rule.Core;
    this.style = Style.Default;
  }

  process(str: string) {

  }

  input(content: string) {

  }

  output(content: string) {
    
  }
}

export {
  Parser
};
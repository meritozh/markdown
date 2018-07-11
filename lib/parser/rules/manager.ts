import { Rule } from "./rule";
import { RuleMatcher } from "./matcher";
import { StateManager } from "../../core/manager";
import { Block } from "./container/block";
import { Fence } from "./container/fence";
import { HorizonalBreak } from "./container/horizontal_break";
import { Heading } from "./container/heading";
import { Quote } from "./container/quote";
import { Paragraph } from "./container/paragraph";
import { Success } from "../../utils";

class RuleManager {
  matcher = new RuleMatcher();
  rules = Array<Rule>();
  current = -1;

  get length() {
    return this.rules.length;
  }

  restore() {
    this.current = 0;
  }

  initialize() {
    this.add(new Block());
    this.add(new Fence());
    this.add(new Quote());
    this.add(new HorizonalBreak());
    this.add(new Heading());
    this.add(new Paragraph());
  }

  add(rule: Rule) {
    this.rules.push(rule);
  }

  insert(rules: Rule[], after?: string) {
    if (!after || after.length) {
      this.rules = rules.concat(this.rules);
    } else {
      const idx = this.match(after);
      const front = this.rules.slice(0, idx);
      const behind = this.rules.slice(idx);
      this.rules = front.concat(rules, behind);
    }
  }

  process(state: StateManager, from?: number) {
    if (!this.length) {
      throw Error('Must add or insert rules before processing.');
    }

    this.current = from || this.current + 1;

    if (this.current >= this.length) {
      return new Success();
    }
    
    return this.rules[this.current].process(state);
  }

  match(t: string) {
    const l = this.length;
    for(let i = 0; i < l; ++i) {
      if (this.rules[i].isa(t)) {
        return i;
      }
    }
    throw Error('No matching rule.');
  }
}

export { RuleManager }
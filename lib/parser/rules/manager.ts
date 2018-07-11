import { Rule } from "./rule";

class CTRuleManager {
  rules = Array<Rule>();

  add(rule: Rule) {
    this.rules.push(rule);
  }

  insert(rule: Rule, after?: Rule) {
    if (!after) {
      this.rules.unshift(rule);
    } else {
      
    }
  }
}

class ILRuleManager {

}

export { CTRuleManager, ILRuleManager }
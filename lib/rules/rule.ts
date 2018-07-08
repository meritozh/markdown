import { StateManager } from '../core';

interface Rule {  
  process(core: StateManager, startLine: number): boolean;
};

export { Rule };
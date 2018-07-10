import { StateManager } from '../core';

interface Rule {  
  process(state: StateManager): boolean;
};

export { Rule };
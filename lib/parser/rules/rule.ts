import { StateManager } from '../../core';
import { R } from '../../utils';

interface Rule {
  isa(t: string): boolean;
  process(state: StateManager): R;
};

export { Rule };
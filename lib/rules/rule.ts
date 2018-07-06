import { Core } from '../core';

interface Rule {  
  process(core: Core, startLine: number): boolean;
};

export { Rule };
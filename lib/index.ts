import { Config } from './core/config';
import { State } from './core/state';

class Markdown {
  config: Config;
  state: State;

  constructor(config?: Config) {
    this.config = config || Config.getDefault();
    this.state = new State();
  }

  set(config: Config) {
    this.config = config;
  }

  tokenize(content: string) {
    this.state.process(content);
  }

  parse(content: string) {
    this.state.parse(content);
  }

  render(content: string) {
    this.state.render(content);
  }
};

export default Markdown;
import { Config } from './core/config';

class Markdown {
  config: Config;

  constructor(config?: Config) {
    this.config = config || Config.getDefault();
  }

  set(config: Config) {
    this.config = config;
  }
};

export default Markdown;
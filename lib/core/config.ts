enum OutputOption {
  /// default output
  html,
  /// transfer input to raw markdown compatible version
  markdown,
};

class Config {
  output?: OutputOption;

  constructor(output?: OutputOption) {
    this.output = output || OutputOption.html;
  }

  static getDefault() {
    return new Config();
  }
};

export { Config };
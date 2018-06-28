import Markdown from '../lib';

const md = new Markdown();

md.tokenize('####     h1 test lalala   ');

const tokens = md.state.tokenizer.tokens;
if (tokens) {
  tokens.forEach(token => {
    console.log(token);
  });
}

// const state = md.state;
// const content = '  asdfg   ';
// state.process(content);
// console.log(`skip spaces: ${state.skipSpaces(0)}`);
// console.log(`skip spaces back: ${state.skipSpacesBack(content.length, 0)}`);
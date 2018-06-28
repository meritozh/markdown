import { HeadingToken, TextToken, TokenType } from "./token";
import { State } from "../core/state";

/// For heading token, `#` should be the first unicode.
const heading = (state: State, start: number) => {
  const content = state.content!;
  let ch = content.charCodeAt(start);
  /// `0x23` === `#`
  if (ch !== 0x23) {
    return undefined;
  }

  let level = 1;
  let pos = start + 1;
  ch = content.charCodeAt(pos);
  while(ch === 0x23 && level <= 6) {
    level++;
    ch = content.charCodeAt(++pos);
  }

  if (level > 6) {
    return undefined;
  }

  const hTag = 'h' + String(level);

  /// heading open
  const headingOpen = new HeadingToken(TokenType.HeadingOpen, start, hTag);
  state.push(headingOpen);

  /// heading close
  const end = start + level;
  const headingClose = new HeadingToken(TokenType.HeadingClose, end, hTag);
  state.push(headingClose);

  /// all remaining characters in current line are text
  const textStart = state.skipSpaces(end);
  const text = content.slice(textStart).trim();
  const Text = new TextToken(textStart, text);
  state.push(Text); 
}

export {
  heading
};
const IsLine = (content: string) => {
  for (let i = 0; i < content.length - 1; ++i) {
    let c1 = content.charCodeAt(i);
    let c2 = content.charCodeAt(i + 1);
    if (IsLineEnding(c1, c2)) {
      return true;
    }
  }
  return false;
};

/**
 * ['a', 'b', ..., 'c1', 'c2']
 *
 * @param c1 second last unicode in string
 * @param c2 last unicode in string
 */
const IsLineEnding = (c1: number, c2: number) => {
  if (c2 === 0x0a) {
    /// \n
    return true;
  }
  if (c1 === 0x0d && c2 === 0x0a) {
    /// \r\n
    return true;
  }
  if (c2 === 0x0a) {
    /// \r
    return true;
  }
  return false;
};

const IsNewLine = (code: number) => {
  if (code === 0x0a) {
    /// \n
    return true;
  } else {
    return false;
  }
};

const IsBlankLine = (content: string) => {
  if (content || content.length === 0) {
    return true;
  }
  for (let i = 0; i < content.length; ++i) {
    let code = content.charCodeAt(i);
    if (!IsSpace(code) || !IsTab(code)) {
      return false;
    }
  }
  return true;
};

/**
 * @param {number} code single unicode
 */
const IsSpace = (code: number) => {
  if (code === 0x20) {
    return true;
  }
  return false;
};

const IsTab = (code: number) => {
  if (code === 0x09) {
    return true;
  }
  return false;
};

const IsIndent = (code: number) => {
  if (IsSpace(code) || IsTab(code)) {
    return true;
  }
  return false;
};

const IsWhitespace = (code: number) => {
  switch (code) {
    case 0x09:
    case 0x20:
    case 0x0a:
    case 0x0b:
    case 0x0c:
    case 0x0d:
      return true;
  }
  return false;
};

/**
 * @param {number} code single unicode
 */
const IsUnicodeWhitespace = (code: number) => {
  if (code >= 0x2000 && code <= 0x200a) {
    return true;
  }

  switch (code) {
    case 0x09: // \t, horizontal tab
    case 0x0a: // \n, new line
    case 0x0c: // \f, form feed
    case 0x0d: // \r, carriage return

    /// unicode Zs category (space separator)
    case 0x20:
    case 0xa0:
    case 0x1680:
    // case 0x2000:
    // case 0x2001:
    // case 0x2002:
    // case 0x2003:
    // case 0x2004:
    // case 0x2005:
    // case 0x2006:
    // case 0x2007:
    // case 0x2008:
    // case 0x2009:
    // case 0x200A:
    case 0x202f:
    case 0x205f:
    case 0x3000:
      return true;
  }

  return false;
};

/**
 * @param {number} code single unicode
 */
const IsValidEntityCode = (code: number) => {
  // broken sequence
  if (code >= 0xd800 && code <= 0xdfff) {
    return false;
  }
  // never used
  if (code >= 0xfdd0 && code <= 0xfdef) {
    return false;
  }
  if ((code & 0xffff) === 0xffff || (code & 0xffff) === 0xfffe) {
    return false;
  }
  // control codes
  if (code >= 0x00 && code <= 0x08) {
    return false;
  }
  if (code === 0x0b) {
    return false;
  }
  if (code >= 0x0e && code <= 0x1f) {
    return false;
  }
  if (code >= 0x7f && code <= 0x9f) {
    return false;
  }
  // out of range
  if (code > 0x10ffff) {
    return false;
  }
  return true;
};

/**
 * @param {number} code single unicode
 */
const FromCodePoint = (code: number) => {
  if (code > 0xffff) {
    code -= 0x10000;
    const surrogate1 = 0xd800 + (code >> 10);
    const surrogate2 = 0xdc00 + (code & 0x3ff);
    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(code);
};

const Code = (char: string) => {
  if (!char || char.length !== 1) {
    throw Error("Only accept single character.");
  }
  return char.charCodeAt(0);
};

export {
  IsLine,
  IsSpace,
  IsTab,
  IsWhitespace,
  IsUnicodeWhitespace,
  IsValidEntityCode,
  FromCodePoint,
  Code,
  IsLineEnding,
  IsBlankLine,
  IsIndent,
  IsNewLine
};

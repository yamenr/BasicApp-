import {syntax} from '../theme';

export type Token = {text: string; color: string; italic?: boolean};

const JAVA_KEYWORDS = new Set(
  (
    'abstract boolean break byte case catch char class continue default do double else enum ' +
    'extends final finally float for if implements import instanceof int interface long new ' +
    'null package private protected public return short static super switch synchronized this ' +
    'throw throws try void volatile while true false var'
  ).split(' '),
);

const GRADLE_KEYWORDS = new Set('plugins android dependencies implementation platform id apply true false'.split(' '));

// One regex per token kind. Order matters: the first match wins.
const JAVA_RULES: [RegExp, keyof typeof syntax | 'word'][] = [
  [/^\/\/.*/, 'comment'],
  [/^"(?:[^"\\]|\\.)*"?/, 'string'],
  [/^'(?:[^'\\]|\\.)*'?/, 'string'],
  [/^@[A-Za-z_]\w*/, 'annotation'],
  [/^\d+(\.\d+)?[fFdDlL]?/, 'number'],
  [/^[A-Za-z_$][\w$]*/, 'word'],
  [/^(->|::|[{}()[\];,.<>=+\-*/!?:&|])/, 'punctuation'],
  [/^\s+/, 'plain'],
  [/^./, 'plain'],
];

const tokenizeJavaLike = (line: string, keywords: Set<string>, state: {inComment: boolean}): Token[] => {
  const tokens: Token[] = [];
  let rest = line;

  while (rest.length > 0) {
    // Inside a /* ... */ comment that started on an earlier line
    if (state.inComment) {
      const end = rest.indexOf('*/');
      const text = end === -1 ? rest : rest.slice(0, end + 2);
      tokens.push({text, color: syntax.comment, italic: true});
      rest = rest.slice(text.length);
      if (end !== -1) state.inComment = false;
      continue;
    }
    if (rest.startsWith('/*')) {
      state.inComment = true;
      continue;
    }

    for (const [regex, kind] of JAVA_RULES) {
      const match = rest.match(regex);
      if (!match) continue;
      const text = match[0];
      rest = rest.slice(text.length);

      if (kind === 'word') {
        const next = rest.trimStart();
        if (keywords.has(text)) {
          tokens.push({text, color: syntax.keyword});
        } else if (next.startsWith('(')) {
          tokens.push({text, color: syntax.method});
        } else if (/^[A-Z]/.test(text) && !/^[A-Z0-9_]+$/.test(text)) {
          tokens.push({text, color: syntax.type});
        } else if (/^[A-Z0-9_]+$/.test(text) && text.length > 1) {
          tokens.push({text, color: syntax.number});
        } else {
          tokens.push({text, color: syntax.plain});
        }
      } else if (kind === 'comment') {
        tokens.push({text, color: syntax.comment, italic: true});
      } else {
        tokens.push({text, color: syntax[kind]});
      }
      break;
    }
  }
  return tokens;
};

const XML_RULES: [RegExp, keyof typeof syntax][] = [
  [/^<!--.*?-->/, 'comment'],
  [/^<\/?[\w.:-]+/, 'tag'],
  [/^\/?>/, 'tag'],
  [/^[\w:]+(?==)/, 'attr'],
  [/^"[^"]*"/, 'string'],
  [/^=/, 'punctuation'],
  [/^\s+/, 'plain'],
  [/^<\?xml[^>]*\?>/, 'comment'],
  [/^[^<"=\s]+/, 'plain'],
  [/^./, 'plain'],
];

const tokenizeXml = (line: string): Token[] => {
  const tokens: Token[] = [];
  let rest = line;
  while (rest.length > 0) {
    for (const [regex, kind] of XML_RULES) {
      const match = rest.match(regex);
      if (!match) continue;
      tokens.push({text: match[0], color: syntax[kind], italic: kind === 'comment'});
      rest = rest.slice(match[0].length);
      break;
    }
  }
  return tokens;
};

// Splits code into lines of coloured tokens
export const highlight = (code: string, language: 'java' | 'xml' | 'gradle'): Token[][] => {
  const state = {inComment: false};
  return code.split('\n').map((line) => {
    if (language === 'xml') return tokenizeXml(line);
    return tokenizeJavaLike(line, language === 'gradle' ? GRADLE_KEYWORDS : JAVA_KEYWORDS, state);
  });
};

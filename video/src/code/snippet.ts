import {SourceFile} from './sources';

/**
 * Code panels find lines by their text, not by line numbers,
 * so the video keeps working when the Android files change a little.
 */

export type Snippet = {
  file: SourceFile;
  lines: string[];
  // Line number (1-based) of the first line in the real file
  firstLine: number;
  // How many spaces were removed from the front of every line
  indent: number;
};

// Text that starts with "=" must match the whole line exactly (for example "=    }")
const matches = (line: string, text: string) =>
  text.startsWith('=') ? line.trimEnd() === text.slice(1) : line.includes(text);

const findLine = (lines: string[], text: string, from: number, fileName: string) => {
  for (let i = from; i < lines.length; i++) {
    if (matches(lines[i], text)) return i;
  }
  throw new Error(`Could not find "${text}" in ${fileName}. Did the Android code change?`);
};

/**
 * Cuts a part of a file: from the first line containing `startText`
 * down to the first line after it that is exactly `endLine` (for example "    }").
 * With `endAfter`, the end line is searched after the line containing that text.
 */
export const snippet = (file: SourceFile, startText?: string, endLine?: string, endAfter?: string): Snippet => {
  const all = file.text.replace(/\s+$/, '').split('\n');
  const start = startText ? findLine(all, startText, 0, file.name) : 0;
  let end = all.length - 1;
  if (endLine !== undefined) {
    const searchFrom = endAfter ? findLine(all, endAfter, start, file.name) : start + 1;
    end = findLine(all, `=${endLine}`, searchFrom, file.name);
  }
  const lines = all.slice(start, end + 1);
  const indent = Math.min(
    ...lines.filter((l) => l.trim().length > 0).map((l) => l.length - l.trimStart().length),
  );
  return {file, lines: lines.map((l) => l.slice(indent)), firstLine: start + 1, indent};
};

// A line (by its text) or a range of lines [first text, last text]
export type LineRef = string | [string, string];

// Returns the index (inside the snippet) of the first line containing `text`
export const lineIndex = (s: Snippet, text: string, from = 0) =>
  findLine(s.lines, text, from, s.file.name);

export const resolveLines = (s: Snippet, refs: LineRef[]): number[] => {
  const result: number[] = [];
  for (const ref of refs) {
    if (typeof ref === 'string') {
      result.push(lineIndex(s, ref));
    } else {
      const first = lineIndex(s, ref[0]);
      const last = lineIndex(s, ref[1], first);
      for (let i = first; i <= last; i++) result.push(i);
    }
  }
  return result;
};

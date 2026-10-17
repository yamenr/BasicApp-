import {loadFont} from '@remotion/fonts';
import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff2';
import inter500 from '@fontsource/inter/files/inter-latin-500-normal.woff2';
import inter600 from '@fontsource/inter/files/inter-latin-600-normal.woff2';
import inter700 from '@fontsource/inter/files/inter-latin-700-normal.woff2';
import inter800 from '@fontsource/inter/files/inter-latin-800-normal.woff2';
import mono400 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2';
import mono600 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2';
import mono700 from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2';

// Fonts are bundled from npm, so rendering works without an internet connection
const fontFiles: [string, string, string][] = [
  ['Inter', inter400, '400'],
  ['Inter', inter500, '500'],
  ['Inter', inter600, '600'],
  ['Inter', inter700, '700'],
  ['Inter', inter800, '800'],
  ['JetBrains Mono', mono400, '400'],
  ['JetBrains Mono', mono600, '600'],
  ['JetBrains Mono', mono700, '700'],
];
fontFiles.forEach(([family, url, weight]) => {
  loadFont({family, url, weight});
});

export const fonts = {
  sans: 'Inter, sans-serif',
  mono: '"JetBrains Mono", monospace',
};

export const colors = {
  bg: '#0B1020',
  bgGlow: '#13204A',
  panel: '#101829',
  surface: '#17223A',
  surfaceHi: '#1F2D4B',
  border: '#2A3A5E',
  text: '#EEF3FB',
  muted: '#9AA9C4',
  faint: '#5E6E8C',
  android: '#3DDC84',
  firebase: '#FFCA28',
  firebaseOrange: '#FF8F00',
  blue: '#5CC8FF',
  purple: '#B794F6',
  pink: '#FF7AA8',
  red: '#FF5C6C',
  // Colours of the mock phone app (matches the real app's theme)
  appGreen: '#2E7D5B',
  appGreenDark: '#1F5A41',
  appBg: '#F4F6F8',
  appText: '#1D2433',
  appMuted: '#5F6B7A',
};

// Syntax highlighting colours for the code panels
export const syntax = {
  plain: '#E6EDF7',
  keyword: '#C792EA',
  type: '#FFCB6B',
  method: '#82AAFF',
  string: '#C3E88D',
  number: '#F78C6C',
  comment: '#6F80A0',
  annotation: '#FF9CAC',
  punctuation: '#89DDFF',
  tag: '#F07178',
  attr: '#FFCB6B',
};

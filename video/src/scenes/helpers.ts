import {interpolate} from 'remotion';

// The part of `text` that has been "typed" between frames `from` and `to`
export const typed = (text: string, frame: number, from: number, to: number) => {
  const count = Math.round(
    interpolate(frame, [from, to], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
  return text.slice(0, count);
};

// 0 → 1 over a short tap animation that starts at `at`
export const tap = (frame: number, at: number, duration = 14) => (frame - at) / duration;

// A button press: 0 → 1 → 0 around the tap
export const press = (frame: number, at: number) =>
  interpolate(frame, [at, at + 4, at + 10], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// The frame that is `fraction` of the way through the beat starting at starts[beat]
export const within = (starts: number[], end: number, beat: number, fraction: number) => {
  const start = starts[beat];
  const stop = starts[beat + 1] ?? end;
  return Math.round(start + (stop - start) * fraction);
};

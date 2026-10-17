import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// 0 → 1 between frame `at` and `at + duration`
export const progress = (frame: number, at: number, duration = 15) =>
  interpolate(frame, [at, at + duration], [0, 1], {...clamp, easing: Easing.bezier(0.33, 1, 0.68, 1)});

// Smooth 0 → 1 spring that starts at frame `at`
export const usePop = (at: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: {damping: 16, stiffness: 140, mass: 0.7}});
};

type AppearProps = {
  at: number;
  // Frame where it starts to fade out (optional)
  out?: number;
  from?: 'up' | 'down' | 'left' | 'right' | 'none' | 'scale';
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

// Fades (and slides) its children in at `at`, and out at `out`
export const Appear: React.FC<AppearProps> = ({at, out, from = 'up', distance = 40, style, children}) => {
  const frame = useCurrentFrame();
  const inP = progress(frame, at, 16);
  const outP = out === undefined ? 0 : progress(frame, out, 12);
  const p = inP * (1 - outP);
  if (p <= 0) return null;

  const d = (1 - inP) * distance;
  const transform =
    from === 'up' ? `translateY(${d}px)`
    : from === 'down' ? `translateY(${-d}px)`
    : from === 'left' ? `translateX(${-d}px)`
    : from === 'right' ? `translateX(${d}px)`
    : from === 'scale' ? `scale(${0.85 + 0.15 * inP})`
    : undefined;

  return <div style={{position: 'absolute', opacity: p, transform, ...style}}>{children}</div>;
};

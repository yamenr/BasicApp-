import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {scriptFor} from '../lang';
import {useBeat} from '../timeline';
import {colors, fonts} from '../theme';
import {progress} from './anim';

// The stage area that every scene draws into (below the title, above the caption)
export const STAGE = {left: 80, top: 160, width: 1760, height: 740};

const Caption: React.FC = () => {
  const {beat, since, timing} = useBeat();
  const caption = scriptFor(timing.lang)[timing.index].beats[beat].caption;
  const p = progress(since, 0, 10);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 48,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        key={beat}
        dir={timing.lang === 'ar' ? 'rtl' : 'ltr'}
        style={{
          opacity: p,
          transform: `translateY(${(1 - p) * 16}px)`,
          maxWidth: 1500,
          padding: '18px 40px',
          borderRadius: 18,
          background: 'rgba(8, 12, 26, 0.82)',
          border: `1px solid ${colors.border}`,
          color: colors.text,
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 40,
          textAlign: 'center',
          lineHeight: 1.25,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

// Background, scene title, caption and fades shared by all scenes
export const SceneFrame: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {timing} = useBeat();
  const scene = scriptFor(timing.lang)[timing.index];
  // In Arabic the title sits on the right and reads right to left
  const rtl = timing.lang === 'ar';
  const fade = Math.min(
    interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [timing.durationInFrames - 10, timing.durationInFrames], [1, 0], {extrapolateLeft: 'clamp'}),
  );
  const titleP = progress(frame, 4, 18);

  return (
    <AbsoluteFill style={{background: colors.bg, fontFamily: fonts.sans, color: colors.text}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 15% 0%, ${colors.bgGlow} 0%, transparent 55%),
            radial-gradient(circle at 100% 100%, #1A1440 0%, transparent 50%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${colors.border}22 1px, transparent 1px),
            linear-gradient(90deg, ${colors.border}22 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      <AbsoluteFill style={{opacity: fade}}>
        <div
          style={{
            position: 'absolute',
            [rtl ? 'right' : 'left']: 80,
            top: 52,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            opacity: titleP,
            transform: `translateX(${(1 - titleP) * (rtl ? 30 : -30)}px)`,
          }}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          <div
            style={{
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 26,
              color: colors.bg,
              background: colors.android,
              borderRadius: 12,
              padding: '8px 16px',
            }}
          >
            {String(timing.index + 1).padStart(2, '0')}
          </div>
          <div style={{fontSize: 48, fontWeight: 800, letterSpacing: -0.5}}>{scene.title}</div>
        </div>
        <div
          style={{
            position: 'absolute',
            [rtl ? 'left' : 'right']: 80,
            top: 66,
            fontSize: 24,
            color: colors.muted,
            fontWeight: 500,
            opacity: titleP,
          }}
        >
          Android + Firebase · Restaurant Admin
        </div>
        <div style={{position: 'absolute', ...STAGE}}>{children}</div>
        <Caption />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

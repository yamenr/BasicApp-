import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {highlight} from '../code/highlight';
import {LineRef, Snippet, lineIndex, resolveLines} from '../code/snippet';
import {beatAt, SceneTiming, useSceneTiming} from '../timeline';
import {colors, fonts} from '../theme';

/**
 * What the code panel shows during one beat.
 * - reveal: show lines down to (and including) the next line with this text, or 'all'.
 *   [a, b] means: find a, then show down to the first line with b after it.
 * - highlight: lines to highlight (by text, or [first, last] ranges)
 * A beat with no step keeps the previous beat's step.
 */
export type CodeStep = {
  reveal?: LineRef | 'all';
  highlight?: LineRef[];
};

type Props = {
  snippet: Snippet;
  steps: Record<number, CodeStep>;
  style?: React.CSSProperties;
  width: number;
  height: number;
  maxFontSize?: number;
  accent?: string;
};

const FRAMES_PER_LINE = 4;
const SCROLL_SMOOTHING = 14;

type BeatState = {target: number; highlights: number[]};

// Works out, for every beat, how many lines are visible and which are highlighted
const buildBeatStates = (snippet: Snippet, steps: Record<number, CodeStep>, beatCount: number) => {
  const states: BeatState[] = [];
  let target = 0;
  let highlights: number[] = [];
  for (let b = 0; b < beatCount; b++) {
    const step = steps[b];
    if (step) {
      if (step.reveal === 'all') target = snippet.lines.length;
      else if (typeof step.reveal === 'string') target = Math.max(target, lineIndex(snippet, step.reveal, target) + 1);
      else if (step.reveal) {
        const first = lineIndex(snippet, step.reveal[0], target === 0 ? 0 : target - 1);
        target = Math.max(target, lineIndex(snippet, step.reveal[1], first) + 1);
      }
      highlights = step.highlight ? resolveLines(snippet, step.highlight) : [];
    }
    states.push({target, highlights});
  }
  return states;
};

const stateAt = (frame: number, timing: SceneTiming, states: BeatState[], visibleLines: number) => {
  const beat = beatAt(timing, frame);
  const start = timing.beatStarts[beat];
  const end = timing.beatStarts[beat + 1] ?? timing.durationInFrames;
  const prev = beat > 0 ? states[beat - 1] : {target: 0, highlights: []};
  const now = states[beat];

  const newLines = now.target - prev.target;
  const revealFrames = Math.max(1, Math.min(newLines * FRAMES_PER_LINE, (end - start) * 0.7));
  const revealed = interpolate(frame - start, [0, revealFrames], [prev.target, now.target], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sameHighlights =
    prev.highlights.length === now.highlights.length &&
    prev.highlights.every((line, i) => now.highlights[i] === line);
  const highlightAlpha = sameHighlights ? 1 : interpolate(frame - start, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  // Keep the highlighted lines in view. If they don't all fit, start at the first one.
  const first = Math.min(...now.highlights);
  const last = Math.max(...now.highlights);
  const focus = now.highlights.length === 0 ? revealed - 1
    : last - first < visibleLines - 2 ? (first + last) / 2
    : first - 2 + visibleLines * 0.45;

  return {revealed, target: now.target, highlights: now.highlights, highlightAlpha, focus};
};

export const CodePanel: React.FC<Props> = ({
  snippet,
  steps,
  style,
  width,
  height,
  maxFontSize = 26,
  accent = colors.firebase,
}) => {
  const frame = useCurrentFrame();
  const timing = useSceneTiming();

  const tokens = useMemo(() => highlight(snippet.lines.join('\n'), snippet.file.language), [snippet]);
  const states = useMemo(
    () => buildBeatStates(snippet, steps, timing.beatStarts.length),
    [snippet, steps, timing.beatStarts.length],
  );

  // Pick a font size so the longest line fits the panel
  const longest = Math.max(...snippet.lines.map((l) => l.length), 20);
  const lastLineNumber = snippet.firstLine + snippet.lines.length;
  const gutterChars = String(lastLineNumber).length;
  const fontSize = Math.max(15, Math.min(maxFontSize, (width - 72) / ((longest + gutterChars + 2) * 0.6)));
  const lineHeight = Math.round(fontSize * 1.55);
  const gutterWidth = (gutterChars + 1.5) * fontSize * 0.6;
  const headerHeight = 52;
  const visibleLines = Math.floor((height - headerHeight - 32) / lineHeight);

  const now = stateAt(frame, timing, states, visibleLines);

  // Scroll so the line we talk about stays in view (smoothed over a few frames),
  // but never past the last line this beat reveals
  let scroll = 0;
  for (let k = 0; k < SCROLL_SMOOTHING; k++) {
    const s = stateAt(Math.max(0, frame - k), timing, states, visibleLines);
    const maxScroll = Math.max(0, s.target - visibleLines);
    scroll += Math.min(maxScroll, Math.max(0, s.focus - visibleLines * 0.45));
  }
  scroll /= SCROLL_SMOOTHING;

  const hasHighlights = now.highlights.length > 0;

  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        background: colors.panel,
        borderRadius: 20,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          height: headerHeight,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 20px',
          background: colors.surface,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
        ))}
        <div
          style={{
            marginLeft: 16,
            fontFamily: fonts.mono,
            fontSize: 20,
            color: colors.text,
            background: colors.panel,
            padding: '6px 16px',
            borderRadius: 8,
          }}
        >
          {snippet.file.name}
        </div>
      </div>
      <div style={{position: 'relative', height: height - headerHeight, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 16, transform: `translateY(${-scroll * lineHeight}px)`}}>
          {tokens.map((lineTokens, i) => {
            const reveal = Math.min(1, Math.max(0, now.revealed - i));
            const isHighlighted = now.highlights.includes(i);
            const dim = hasHighlights && !isHighlighted ? interpolate(now.highlightAlpha, [0, 1], [1, 0.35]) : 1;
            return (
              <div
                key={i}
                style={{
                  height: lineHeight,
                  display: 'flex',
                  alignItems: 'center',
                  opacity: reveal * dim,
                  transform: `translateX(${(1 - reveal) * 24}px)`,
                  background: isHighlighted ? `${accent}${alphaHex(0.16 * now.highlightAlpha)}` : 'transparent',
                  borderLeft: `5px solid ${isHighlighted ? `${accent}${alphaHex(now.highlightAlpha)}` : 'transparent'}`,
                }}
              >
                <div
                  style={{
                    width: gutterWidth,
                    flexShrink: 0,
                    textAlign: 'right',
                    paddingRight: fontSize * 0.9,
                    fontFamily: fonts.mono,
                    fontSize: fontSize * 0.8,
                    color: colors.faint,
                  }}
                >
                  {snippet.firstLine + i}
                </div>
                <div style={{fontFamily: fonts.mono, fontSize, whiteSpace: 'pre'}}>
                  {lineTokens.map((t, j) => (
                    <span key={j} style={{color: t.color, fontStyle: t.italic ? 'italic' : 'normal'}}>
                      {t.text}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const alphaHex = (alpha: number) =>
  Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');

import React from 'react';
import {colors, fonts} from '../theme';

// A labelled box used in diagrams
export const Node: React.FC<{
  x: number;
  y: number;
  width: number;
  height?: number;
  label: string;
  sub?: string;
  color?: string;
  alpha?: number;
  glow?: number;
  dashed?: boolean;
  mono?: boolean;
  fontSize?: number;
}> = ({x, y, width, height = 96, label, sub, color = colors.blue, alpha = 1, glow = 0, dashed, mono, fontSize = 30}) =>
  alpha <= 0 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        borderRadius: 18,
        background: colors.surface,
        border: `3px ${dashed ? 'dashed' : 'solid'} ${color}`,
        boxShadow: `0 0 ${40 * glow}px ${color}${glow > 0 ? '88' : '00'}, 0 18px 40px rgba(0,0,0,0.35)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: alpha,
        transform: `scale(${0.9 + 0.1 * alpha})`,
        textAlign: 'center',
      }}
    >
      <div style={{fontFamily: mono ? fonts.mono : fonts.sans, fontWeight: 700, fontSize, color: colors.text}}>{label}</div>
      {sub && <div style={{fontSize: fontSize * 0.68, color, marginTop: 4, fontWeight: 600}}>{sub}</div>}
    </div>
  );

// An arrow from (x1, y1) to (x2, y2) that draws itself as `amount` goes 0 → 1
export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  amount: number;
  color?: string;
  width?: number;
  dashed?: boolean;
}> = ({x1, y1, x2, y2, amount, color = colors.muted, width = 4, dashed}) => {
  if (amount <= 0) return null;
  const ex = x1 + (x2 - x1) * amount;
  const ey = y1 + (y2 - y1) * amount;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 16;
  const left = 0;
  const top = 0;
  return (
    <svg style={{position: 'absolute', left, top, overflow: 'visible'}} width={1} height={1}>
      <line
        x1={x1}
        y1={y1}
        x2={ex}
        y2={ey}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? '10 10' : undefined}
      />
      {amount > 0.95 && (
        <polygon
          points={`${x2},${y2} ${x2 - head * Math.cos(angle - 0.45)},${y2 - head * Math.sin(angle - 0.45)} ${
            x2 - head * Math.cos(angle + 0.45)
          },${y2 - head * Math.sin(angle + 0.45)}`}
          fill={color}
        />
      )}
    </svg>
  );
};

// A small rounded label
export const Chip: React.FC<{label: string; color?: string; style?: React.CSSProperties; fontSize?: number}> = ({
  label,
  color = colors.android,
  style,
  fontSize = 26,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 22px',
      borderRadius: 999,
      background: `${color}22`,
      border: `2px solid ${color}`,
      color: colors.text,
      fontWeight: 600,
      fontSize,
      ...style,
    }}
  >
    <div style={{width: 12, height: 12, borderRadius: 6, background: color}} />
    {label}
  </div>
);

// A card with a title and some body content
export const InfoCard: React.FC<{
  title: string;
  color?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({title, color = colors.blue, style, children}) => (
  <div
    style={{
      background: colors.surface,
      border: `1px solid ${colors.border}`,
      borderTop: `5px solid ${color}`,
      borderRadius: 18,
      padding: '24px 28px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
      ...style,
    }}
  >
    <div style={{fontSize: 30, fontWeight: 800, marginBottom: 14}}>{title}</div>
    <div style={{fontSize: 26, color: colors.muted, lineHeight: 1.45}}>{children}</div>
  </div>
);

export const Mono: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = colors.firebase}) => (
  <span style={{fontFamily: fonts.mono, color, fontWeight: 600}}>{children}</span>
);

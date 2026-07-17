import React from 'react';

const TONES = {
  edem: { bg: 'var(--edem)', fg: '#ffffff' },
  lanzadera: { bg: 'var(--lanzadera)', fg: '#ffffff' },
  angels: { bg: 'var(--angels)', fg: '#ffffff' },
  neutral: { bg: 'var(--ink-100)', fg: 'var(--ink-700)' },
  teal: { bg: 'var(--edem-teal-50)', fg: 'var(--edem-teal-800)' },
};

/**
 * Category / ecosystem badge. Uppercase overline, pill by default.
 * tone: edem | lanzadera | angels | neutral | teal
 */
export function Badge({ children, tone = 'edem', solid = true, size = 'md', style = {}, ...rest }) {
  const t = TONES[tone] || TONES.edem;
  const pad = size === 'sm' ? '4px 10px' : '6px 13px';
  const fs = size === 'sm' ? 11 : 12;
  const soft = { background: 'transparent', color: t.bg, border: `1.5px solid ${t.bg}` };
  const filled = { background: t.bg, color: t.fg, border: '1.5px solid transparent' };
  return (
    <span
      className="edem-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-sans)',
        fontWeight: 700,
        fontSize: fs,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        lineHeight: 1,
        padding: pad,
        borderRadius: 'var(--radius-pill)',
        ...(solid ? filled : soft),
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

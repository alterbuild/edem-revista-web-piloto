import React from 'react';

/**
 * EDEM primary button. Editorial, squared corners, confident.
 * variant: 'primary' | 'secondary' | 'outline' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconLeft = null,
  iconRight = null,
  as = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const pads = {
    sm: '9px 16px',
    md: '13px 24px',
    lg: '17px 34px',
  };
  const fss = { sm: 14, md: 15, lg: 17 };

  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: fss[size],
    letterSpacing: '.01em',
    lineHeight: 1,
    padding: pads[size],
    borderRadius: 'var(--radius-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: '1.5px solid transparent',
    transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.45 : 1,
  };

  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: 'var(--color-on-primary)',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      background: 'var(--ink-900)',
      color: 'var(--paper)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-strong)',
    },
  };

  const hoverFor = {
    primary: { background: 'var(--color-primary-hover)' },
    secondary: { background: 'var(--ink-800)' },
    outline: { background: 'var(--color-primary-soft)' },
    ghost: { background: 'var(--ink-100)' },
  };

  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const composed = {
    ...base,
    ...variants[variant],
    ...(hover && !disabled ? hoverFor[variant] : {}),
    ...(press && !disabled ? { transform: 'translateY(1px)' } : {}),
    ...style,
  };

  const Tag = as;
  return (
    <Tag
      className="edem-button"
      style={composed}
      disabled={as === 'button' ? disabled : undefined}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}

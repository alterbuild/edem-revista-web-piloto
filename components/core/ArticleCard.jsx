import React from 'react';
import { Badge } from './Badge.jsx';

/**
 * Standard article card for the magazine grid.
 * Image on top, ecosystem badge, serif display title, excerpt, meta row.
 */
export function ArticleCard({
  image,
  imageAlt = '',
  tone = 'edem',
  category = 'EDEM',
  title,
  excerpt,
  meta,
  href = '#',
  style = {},
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      className="edem-article-card"
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hair)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
        transform: hover ? 'translateY(-6px)' : 'none',
        boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        ...style,
      }}
    >
      <div style={{ aspectRatio: '3 / 2', overflow: 'hidden', background: 'var(--ink-100)' }}>
        {image ? (
          <img
            src={image}
            alt={imageAlt}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transition: 'transform var(--dur-slow) var(--ease-out)',
              transform: hover ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'grid', placeItems: 'center',
            color: 'var(--ink-300)', fontFamily: 'var(--font-sans)', fontSize: 13, letterSpacing: '.1em',
          }}>IMAGEN</div>
        )}
      </div>
      <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <Badge tone={tone} size="sm">{category}</Badge>
        <h3 style={{
          margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 'var(--fs-h3)', lineHeight: 1.14, letterSpacing: 'var(--ls-tight)',
          color: 'var(--text-strong)',
        }}>{title}</h3>
        {excerpt && (
          <p style={{
            margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--fs-small)',
            lineHeight: 1.55, color: 'var(--text-muted)', flex: 1,
          }}>{excerpt}</p>
        )}
        {meta && (
          <div style={{
            marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border-hair)',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-caption)',
            color: 'var(--text-faint)', letterSpacing: '.02em',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              color: 'var(--text-link)', fontWeight: 600,
              transition: 'gap var(--dur) var(--ease-out)',
            }}>Leer artículo
              <span style={{ transform: hover ? 'translateX(4px)' : 'none', transition: 'transform var(--dur) var(--ease-out)' }}>→</span>
            </span>
            <span style={{ marginLeft: 'auto' }}>{meta}</span>
          </div>
        )}
      </div>
    </a>
  );
}

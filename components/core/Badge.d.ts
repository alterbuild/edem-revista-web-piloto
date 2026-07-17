import * as React from 'react';

/**
 * Category / ecosystem badge (EDEM · Lanzadera · Angels).
 *
 * @startingPoint section="Core" subtitle="Ecosystem category badges" viewport="700x140"
 */
export interface BadgeProps {
  children?: React.ReactNode;
  /** @default "edem" */
  tone?: 'edem' | 'lanzadera' | 'angels' | 'neutral' | 'teal';
  /** Filled vs outlined. @default true */
  solid?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;

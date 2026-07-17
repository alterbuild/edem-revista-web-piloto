import * as React from 'react';

/**
 * EDEM primary button — editorial, squared corners.
 *
 * @startingPoint section="Core" subtitle="Primary / secondary / outline / ghost button" viewport="700x220"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Icon element rendered before the label */
  iconLeft?: React.ReactNode;
  /** Icon element rendered after the label */
  iconRight?: React.ReactNode;
  /** Render as another element, e.g. "a". @default "button" */
  as?: keyof JSX.IntrinsicElements;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;

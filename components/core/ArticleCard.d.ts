import * as React from 'react';

/**
 * Standard magazine article card — image, ecosystem badge, serif title, excerpt, meta.
 *
 * @startingPoint section="Magazine" subtitle="Article card for the magazine grid" viewport="420x460"
 */
export interface ArticleCardProps {
  image?: string;
  imageAlt?: string;
  /** Ecosystem tone for the category badge. @default "edem" */
  tone?: 'edem' | 'lanzadera' | 'angels' | 'neutral' | 'teal';
  /** Badge label. @default "EDEM" */
  category?: string;
  title: React.ReactNode;
  excerpt?: React.ReactNode;
  /** Right-aligned meta (e.g. reading time / date) */
  meta?: React.ReactNode;
  href?: string;
  style?: React.CSSProperties;
}

export function ArticleCard(props: ArticleCardProps): JSX.Element;

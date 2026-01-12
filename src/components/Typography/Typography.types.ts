import type { ElementType } from 'react';
import type { PolymorphicProps } from '@/types';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'caption'
  | 'label';

export type TypographyAlign = 'left' | 'center' | 'right';

export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export interface TypographyBaseProps {
  variant?: TypographyVariant;
  align?: TypographyAlign;
  weight?: TypographyWeight;
  className?: string;
}

export type TypographyProps<E extends ElementType = 'p'> = TypographyBaseProps &
  PolymorphicProps<E>;

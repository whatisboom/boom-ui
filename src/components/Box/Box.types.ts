import type { ElementType, CSSProperties } from 'react';
import type { PolymorphicProps } from '@/types';

export interface BoxBaseProps {
  /**
   * CSS display property
   */
  display?: 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid';
  /**
   * Flexbox direction
   */
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /**
   * Flexbox align items
   */
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  /**
   * Flexbox justify content
   */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /**
   * Gap between children
   */
  gap?: number;
  /**
   * Padding (uses spacing scale)
   */
  padding?: number;
  /**
   * Margin (uses spacing scale)
   */
  margin?: number;
  /**
   * Width
   */
  width?: string | number;
  /**
   * Height
   */
  height?: string | number;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom inline styles
   */
  style?: CSSProperties;
}

export type BoxProps<E extends ElementType = 'div'> = BoxBaseProps & PolymorphicProps<E>;

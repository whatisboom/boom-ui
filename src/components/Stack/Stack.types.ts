import type { ElementType, HTMLAttributes, ReactNode } from 'react';

export interface StackProps<E extends ElementType = 'div'> extends HTMLAttributes<HTMLElement> {
  /**
   * Stack direction
   */
  direction?: 'row' | 'column';
  /**
   * Gap between items (uses spacing scale)
   */
  spacing?: number;
  /**
   * Align items
   */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  /**
   * Justify content
   */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  /**
   * Custom className
   */
  className?: string;
  /**
   * Element to render as
   */
  as?: E;
  /**
   * Children elements
   */
  children?: ReactNode;
}

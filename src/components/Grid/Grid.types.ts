import type { ElementType, CSSProperties, ComponentPropsWithoutRef } from 'react';

export interface GridOwnProps {
  /**
   * Number of columns in the grid (fixed)
   * Cannot be used with minColumnWidth
   */
  columns?: number;

  /**
   * Minimum column width for responsive grids
   * Cannot be used with columns
   * Example: "250px", "15rem"
   */
  minColumnWidth?: string;

  /**
   * Gap between grid items (spacing token)
   * Uses design token system: 4 = 1rem, 6 = 1.5rem, etc.
   * @default 4
   */
  gap?: number;

  /**
   * Use CSS Grid auto-fit (columns adjust to container width)
   * Only works with minColumnWidth
   * @default false
   */
  autoFit?: boolean;

  /**
   * Use CSS Grid auto-fill (fills row with empty columns)
   * Only works with minColumnWidth
   * @default false
   */
  autoFill?: boolean;

  /**
   * Custom CSS styles
   */
  style?: CSSProperties;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Grid items
   */
  children: React.ReactNode;
}

export type GridProps<E extends ElementType = 'div'> = GridOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof GridOwnProps | 'as'>;

export type GridBaseProps = GridOwnProps;

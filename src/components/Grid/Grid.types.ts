import type { ElementType, CSSProperties, ComponentPropsWithoutRef } from 'react';

/**
 * Responsive value type for breakpoint-based properties
 */
export interface ResponsiveValue<T> {
  /**
   * Base value (mobile-first, applies to all breakpoints unless overridden)
   */
  base?: T;
  /**
   * Small screens (640px and up)
   */
  sm?: T;
  /**
   * Medium screens (768px and up)
   */
  md?: T;
  /**
   * Large screens (1024px and up)
   */
  lg?: T;
  /**
   * Extra large screens (1280px and up)
   */
  xl?: T;
}

export interface GridOwnProps {
  /**
   * Number of columns in the grid (fixed or responsive)
   * Cannot be used with minColumnWidth
   * @example columns={3}
   * @example columns={{ base: 1, md: 2, lg: 3 }}
   */
  columns?: number | ResponsiveValue<number>;

  /**
   * Minimum column width for responsive grids
   * Cannot be used with columns
   * Example: "250px", "15rem"
   */
  minColumnWidth?: string;

  /**
   * Gap between grid items (spacing token or responsive)
   * Uses design token system: 4 = 1rem, 6 = 1.5rem, etc.
   * @default 4
   * @example gap={4}
   * @example gap={{ base: 2, md: 4, lg: 6 }}
   */
  gap?: number | ResponsiveValue<number>;

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

/**
 * Breakpoint definitions matching Container component
 */
export const GRID_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

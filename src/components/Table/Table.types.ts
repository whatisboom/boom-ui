import { ReactNode, HTMLAttributes } from 'react';

/**
 * Column definition for table
 */
export interface ColumnDef<T = unknown> {
  /**
   * Unique column identifier
   */
  id: string;

  /**
   * Header label
   */
  header: ReactNode | ((column: ColumnDef<T>) => ReactNode);

  /**
   * Accessor for cell data (supports nested paths like 'user.name')
   */
  accessorKey?: keyof T | string;

  /**
   * Custom accessor function
   */
  accessorFn?: (row: T) => unknown;

  /**
   * Custom cell renderer
   */
  cell?: (props: CellContext<T>) => ReactNode;

  /**
   * Column width (CSS value)
   */
  width?: string | number;

  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Additional CSS class for cells in this column
   */
  className?: string;

  /**
   * Additional CSS class for header cell
   */
  headerClassName?: string;
}

/**
 * Cell render context
 */
export interface CellContext<T> {
  row: T;
  value: unknown;
  rowIndex: number;
  columnId: string;
}

/**
 * Table density options
 */
export type TableDensity = 'compact' | 'normal' | 'comfortable';

/**
 * Table layout mode
 */
export type TableLayout = 'auto' | 'fixed';

/**
 * Table root component props
 */
export interface TableProps<T = unknown> {
  /**
   * Column definitions
   */
  columns: ColumnDef<T>[];

  /**
   * Data array
   */
  data: T[];

  /**
   * Unique key extractor for rows
   */
  getRowId: (row: T, index: number) => string;

  /**
   * Table layout mode
   * @default 'auto'
   */
  layout?: TableLayout;

  /**
   * Table density
   * @default 'normal'
   */
  density?: TableDensity;

  /**
   * Enable sticky header
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Stripe rows for better readability
   * @default false
   */
  striped?: boolean;

  /**
   * Highlight rows on hover
   * @default true
   */
  hoverable?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Empty state element
   */
  emptyState?: ReactNode;

  /**
   * Disable all animations
   */
  disableAnimation?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * ARIA label
   */
  'aria-label'?: string;

  /**
   * ARIA labelledby
   */
  'aria-labelledby'?: string;

  /**
   * Children (table structure)
   */
  children?: ReactNode;
}

/**
 * Table context value
 */
export interface TableContextValue<T = unknown> {
  columns: ColumnDef<T>[];
  data: T[];
  getRowId: (row: T, index: number) => string;
  layout: TableLayout;
  density: TableDensity;
  stickyHeader: boolean;
  striped: boolean;
  hoverable: boolean;
  loading: boolean;
  emptyState?: ReactNode;
  disableAnimation: boolean;
}

/**
 * TableHead props
 */
export interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

/**
 * TableBody props
 */
export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children?: ReactNode;
}

/**
 * TableRow props
 */
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children?: ReactNode;
}

/**
 * TableCell props
 */
export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  /**
   * Align cell content
   */
  align?: 'left' | 'center' | 'right';

  children?: ReactNode;
}

/**
 * TableHeaderCell props
 */
export interface TableHeaderCellProps extends HTMLAttributes<HTMLTableCellElement> {
  /**
   * Align header content
   */
  align?: 'left' | 'center' | 'right';

  children?: ReactNode;
}

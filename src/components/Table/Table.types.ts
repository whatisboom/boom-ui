import { ReactNode, HTMLAttributes } from 'react';
import { TextAlign } from '@/types';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc' | false;

/**
 * Sort state for a column
 */
export interface SortState {
  /**
   * Column ID being sorted
   */
  columnId: string;

  /**
   * Sort direction
   */
  direction: 'asc' | 'desc';
}

/**
 * Callback for sort changes
 */
export type OnSortChange = (sorting: SortState[]) => void;

/**
 * Custom sorting function
 */
export type SortingFn<T = unknown> = (rowA: T, rowB: T, columnId: string) => number;

/**
 * Row selection state (maps row IDs to selection status)
 */
export type RowSelectionState = Record<string, boolean>;

/**
 * Callback for row selection changes
 */
export type OnRowSelectionChange = (rowSelection: RowSelectionState) => void;

/**
 * Selection mode
 */
export type SelectionMode = 'single' | 'multiple';

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
  align?: TextAlign;

  /**
   * Additional CSS class for cells in this column
   */
  className?: string;

  /**
   * Additional CSS class for header cell
   */
  headerClassName?: string;

  /**
   * Enable sorting for this column
   * @default false
   */
  enableSorting?: boolean;

  /**
   * Custom sorting function
   */
  sortingFn?: SortingFn<T>;
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
   * Current sort state
   */
  sorting?: SortState[];

  /**
   * Callback when sort changes
   */
  onSortChange?: OnSortChange;

  /**
   * Enable multi-column sorting
   * @default false
   */
  enableMultiSort?: boolean;

  /**
   * Current row selection state
   */
  rowSelection?: RowSelectionState;

  /**
   * Callback when row selection changes
   */
  onRowSelectionChange?: OnRowSelectionChange;

  /**
   * Enable row selection
   * @default false
   */
  enableRowSelection?: boolean;

  /**
   * Selection mode (single or multiple)
   * @default 'multiple'
   */
  selectionMode?: SelectionMode;

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
  sorting: SortState[];
  onSortChange?: OnSortChange;
  enableMultiSort: boolean;
  rowSelection: RowSelectionState;
  onRowSelectionChange?: OnRowSelectionChange;
  enableRowSelection: boolean;
  selectionMode: SelectionMode;
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
  /**
   * Is this row selected
   */
  selected?: boolean;

  /**
   * Callback when selection changes for this row
   */
  onSelectionChange?: (selected: boolean) => void;

  children?: ReactNode;
}

/**
 * TableCell props
 */
export interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  /**
   * Align cell content
   */
  align?: TextAlign;

  children?: ReactNode;
}

/**
 * TableHeaderCell props
 */
export interface TableHeaderCellProps extends HTMLAttributes<HTMLTableCellElement> {
  /**
   * Align header content
   */
  align?: TextAlign;

  /**
   * Is this column sortable
   */
  sortable?: boolean;

  /**
   * Current sort direction for this column
   */
  sortDirection?: SortDirection;

  /**
   * Callback when sort is triggered
   */
  onSort?: () => void;

  children?: ReactNode;
}

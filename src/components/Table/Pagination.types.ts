export interface PaginationProps {
  /** Current page (0-indexed) */
  pageIndex: number;
  /** Rows per page */
  pageSize: number;
  /** Total pages */
  pageCount: number;
  /** Total rows */
  rowCount: number;
  /** Page change callback */
  onPageChange: (pageIndex: number) => void;
  /** Page size change callback */
  onPageSizeChange: (pageSize: number) => void;
  /** Available page sizes */
  pageSizeOptions?: number[];
  /** Show page size dropdown */
  showPageSizeSelector?: boolean;
  /** Additional CSS class */
  className?: string;
}

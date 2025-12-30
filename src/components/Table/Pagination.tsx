import { forwardRef } from 'react';
import type { PaginationProps } from './Pagination.types';
import styles from './Table.module.css';

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      pageIndex,
      pageSize,
      pageCount,
      rowCount,
      onPageChange,
      onPageSizeChange,
      pageSizeOptions = [10, 20, 50, 100],
      showPageSizeSelector = true,
      className,
      ...props
    },
    ref
  ) => {
    // Calculate range of rows being displayed
    const startRow = pageIndex * pageSize + 1;
    const endRow = Math.min((pageIndex + 1) * pageSize, rowCount);

    // Generate page numbers with ellipsis
    const getPageNumbers = (): (number | 'ellipsis')[] => {
      // If 7 or fewer pages, show all
      if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, i) => i);
      }

      const pages: (number | 'ellipsis')[] = [];

      // Always show first page
      pages.push(0);

      // Determine range around current page
      if (pageIndex <= 2) {
        // Near start: show 1, 2, 3, ..., last
        pages.push(1, 2);
        pages.push('ellipsis');
      } else if (pageIndex >= pageCount - 3) {
        // Near end: show 1, ..., n-2, n-1, n
        pages.push('ellipsis');
        pages.push(pageCount - 3, pageCount - 2);
      } else {
        // Middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push('ellipsis');
        pages.push(pageIndex - 1, pageIndex, pageIndex + 1);
        pages.push('ellipsis');
      }

      // Always show last page (if not already included)
      if (!pages.includes(pageCount - 1)) {
        pages.push(pageCount - 1);
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    const handlePrevious = () => {
      if (pageIndex > 0) {
        onPageChange(pageIndex - 1);
      }
    };

    const handleNext = () => {
      if (pageIndex < pageCount - 1) {
        onPageChange(pageIndex + 1);
      }
    };

    const handlePageClick = (page: number) => {
      onPageChange(page);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onPageSizeChange(Number(event.target.value));
    };

    return (
      <div
        ref={ref}
        className={`${styles.pagination} ${className || ''}`}
        {...props}
      >
        {/* Page info */}
        <div className={styles.paginationInfo}>
          Showing {startRow}-{endRow} of {rowCount} rows
        </div>

        {/* Page size selector */}
        {showPageSizeSelector && (
          <div className={styles.paginationPageSize}>
            <label htmlFor="page-size-select" className={styles.paginationLabel}>
              Rows per page:
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={handlePageSizeChange}
              className={styles.paginationSelect}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page navigation */}
        <div className={styles.paginationNav}>
          {/* Previous button */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={pageIndex === 0}
            className={styles.paginationButton}
            aria-label="Previous page"
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className={styles.paginationPages}>
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>
                    ...
                  </span>
                );
              }

              const isCurrentPage = page === pageIndex;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageClick(page)}
                  className={`${styles.paginationButton} ${
                    isCurrentPage ? styles.paginationButtonActive : ''
                  }`}
                  aria-label={`${page + 1}`}
                  aria-current={isCurrentPage ? 'page' : undefined}
                >
                  {page + 1}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={pageIndex === pageCount - 1}
            className={styles.paginationButton}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';

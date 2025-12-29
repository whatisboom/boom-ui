import { forwardRef } from 'react';
import styles from './Table.module.css';
import { SortIndicatorProps } from './SortIndicator.types';

/**
 * SortIndicator displays sort direction icons for table columns
 */
export const SortIndicator = forwardRef<SVGSVGElement, SortIndicatorProps>(
  ({ direction, className }, ref) => {
    const classes = [
      styles.sortIcon,
      direction === 'asc' && styles.sortIconAsc,
      direction === 'desc' && styles.sortIconDesc,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Ascending: upward triangle
    if (direction === 'asc') {
      return (
        <svg
          ref={ref}
          className={classes}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 4l4 6H4l4-6z" />
        </svg>
      );
    }

    // Descending: downward triangle
    if (direction === 'desc') {
      return (
        <svg
          ref={ref}
          className={classes}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 12l-4-6h8l-4 6z" />
        </svg>
      );
    }

    // Inactive: both arrows with reduced opacity
    return (
      <svg
        ref={ref}
        className={classes}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 3l3 4H5l3-4z" opacity="0.3" />
        <path d="M8 13l-3-4h6l-3 4z" opacity="0.3" />
      </svg>
    );
  }
);

SortIndicator.displayName = 'SortIndicator';

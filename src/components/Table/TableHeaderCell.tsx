import { forwardRef, KeyboardEvent, MouseEvent } from 'react';
import { cn } from '@/utils/classnames';
import { TableHeaderCellProps } from './Table.types';
import { SortIndicator } from './SortIndicator';
import styles from './Table.module.css';

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ align = 'left', className, children, sortable, sortDirection, onSort, ...props }, ref) => {
    const handleClick = (e: MouseEvent<HTMLTableCellElement>) => {
      if (sortable && onSort) {
        onSort();
      }
      props.onClick?.(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTableCellElement>) => {
      if (sortable && onSort && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault(); // Prevent page scroll on Space
        onSort();
      }
      props.onKeyDown?.(e);
    };

    const getAriaSort = (): 'ascending' | 'descending' | 'none' | undefined => {
      if (!sortable) return undefined;
      if (sortDirection === 'asc') return 'ascending';
      if (sortDirection === 'desc') return 'descending';
      return 'none';
    };

    return (
      <th
        ref={ref}
        className={cn(
          styles.headerCell,
          styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`],
          sortable && styles.sortable,
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={sortable ? 0 : undefined}
        aria-sort={getAriaSort()}
        {...props}
      >
        {children}
        {sortable && <SortIndicator direction={sortDirection ?? false} />}
      </th>
    );
  }
);

TableHeaderCell.displayName = 'TableHeaderCell';

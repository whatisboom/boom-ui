import { forwardRef, KeyboardEvent, MouseEvent, useEffect, useRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableHeaderCellProps } from './Table.types';
import { SortIndicator } from './SortIndicator';
import { Checkbox } from '../Checkbox';
import styles from './Table.module.css';

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({
    align = 'left',
    className,
    children,
    sortable,
    sortDirection,
    onSort,
    isSelectAll,
    allSelected,
    someSelected,
    onSelectAllChange,
    ...props
  }, ref) => {
    const checkboxRef = useRef<HTMLInputElement>(null);

    // Set indeterminate state on checkbox
    useEffect(() => {
      if (checkboxRef.current && isSelectAll) {
        checkboxRef.current.indeterminate = Boolean(someSelected && !allSelected);
      }
    }, [isSelectAll, someSelected, allSelected]);

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
          sortable && !isSelectAll && styles.sortable,
          className
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={sortable && !isSelectAll ? 0 : undefined}
        aria-sort={getAriaSort()}
        {...props}
      >
        {isSelectAll ? (
          <Checkbox
            ref={checkboxRef}
            checked={allSelected ?? false}
            onChange={(checked) => onSelectAllChange?.(checked)}
            aria-label="Select all rows"
            className={styles.selectAllCheckbox}
          />
        ) : (
          <>
            {children}
            {sortable && <SortIndicator direction={sortDirection ?? false} />}
          </>
        )}
      </th>
    );
  }
);

TableHeaderCell.displayName = 'TableHeaderCell';

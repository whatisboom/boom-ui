import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableHeaderCellProps } from './Table.types';
import styles from './Table.module.css';

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  ({ align = 'left', className, children, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          styles.headerCell,
          styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`],
          className
        )}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHeaderCell.displayName = 'TableHeaderCell';

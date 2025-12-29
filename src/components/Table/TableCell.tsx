import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableCellProps } from './Table.types';
import styles from './Table.module.css';

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = 'left', className, children, ...props }, ref) => {
    return (
      <td
        ref={ref}
        role="cell"
        className={cn(
          styles.cell,
          styles[`align${align.charAt(0).toUpperCase()}${align.slice(1)}`],
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

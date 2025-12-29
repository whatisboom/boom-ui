import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableRowProps } from './Table.types';
import styles from './Table.module.css';

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(styles.row, className)}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

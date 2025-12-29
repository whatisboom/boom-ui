import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import { TableBodyProps } from './Table.types';
import styles from './Table.module.css';

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn(styles.tbody, className)}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

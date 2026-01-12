import { forwardRef } from 'react';
import { cn } from '@/utils/classnames';
import type { TableHeadProps } from './Table.types';
import styles from './Table.module.css';

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn(styles.thead, className)}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHead.displayName = 'TableHead';

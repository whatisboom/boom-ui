import { forwardRef, useMemo } from 'react';
import { cn } from '@/utils/classnames';
import { TableContext } from './TableContext';
import { TableProps } from './Table.types';
import styles from './Table.module.css';

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      columns,
      data,
      getRowId,
      layout = 'auto',
      density = 'normal',
      stickyHeader = false,
      striped = false,
      hoverable = true,
      loading = false,
      emptyState,
      disableAnimation = false,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = useMemo(
      () => ({
        columns,
        data,
        getRowId,
        layout,
        density,
        stickyHeader,
        striped,
        hoverable,
        loading,
        emptyState,
        disableAnimation,
      }),
      [
        columns,
        data,
        getRowId,
        layout,
        density,
        stickyHeader,
        striped,
        hoverable,
        loading,
        emptyState,
        disableAnimation,
      ]
    );

    return (
      <TableContext.Provider value={contextValue}>
        <div
          className={cn(
            styles.tableContainer,
            styles[`density${density.charAt(0).toUpperCase()}${density.slice(1)}`],
            styles[`layout${layout.charAt(0).toUpperCase()}${layout.slice(1)}`],
            stickyHeader && styles.stickyHeader,
            striped && styles.striped,
            hoverable && styles.hoverable,
            className
          )}
        >
          <table
            ref={ref}
            role="table"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-rowcount={data.length}
            aria-colcount={columns.length}
            aria-busy={loading}
            className={styles.table}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  }
);

Table.displayName = 'Table';

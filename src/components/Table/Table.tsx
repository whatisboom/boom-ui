import { forwardRef, useMemo, ReactElement } from 'react';
import { cn } from '@/utils/classnames';
import { TableContext } from './TableContext';
import { TableProps, TableContextValue } from './Table.types';
import styles from './Table.module.css';

const TableImpl = forwardRef(
  <T,>(
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
      sorting,
      onSortChange,
      enableMultiSort,
      rowSelection,
      onRowSelectionChange,
      enableRowSelection,
      selectionMode,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      children,
      ...props
    }: TableProps<T>,
    ref: React.ForwardedRef<HTMLTableElement>
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
        sorting: sorting ?? [],
        onSortChange,
        enableMultiSort: enableMultiSort ?? false,
        rowSelection: rowSelection ?? {},
        onRowSelectionChange,
        enableRowSelection: enableRowSelection ?? false,
        selectionMode: selectionMode ?? 'multiple',
      } as unknown as TableContextValue<unknown>),
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
        sorting,
        onSortChange,
        enableMultiSort,
        rowSelection,
        onRowSelectionChange,
        enableRowSelection,
        selectionMode,
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

TableImpl.displayName = 'Table';

// Export as generic component type
export const Table = TableImpl as unknown as {
  <T,>(props: TableProps<T> & React.RefAttributes<HTMLTableElement>): ReactElement;
  displayName: string;
};

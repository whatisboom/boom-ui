import type { ReactElement } from 'react';
import { forwardRef, useMemo } from 'react';
import { cn } from '@/utils/classnames';
import { TableContext } from './TableContext';
import type { TableProps, TableContextValue } from './Table.types';
import { Pagination } from './Pagination';
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
      pagination,
      onPaginationChange,
      manualPagination,
      rowCount,
      pageCount,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      children,
      ...props
    }: TableProps<T>,
    ref: React.ForwardedRef<HTMLTableElement>
  ) => {
    // Determine if pagination should be shown
    const showPagination = Boolean(pagination || onPaginationChange);

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
        pagination: pagination ?? { pageIndex: 0, pageSize: 10 },
        onPaginationChange,
        manualPagination: manualPagination ?? false,
        rowCount: rowCount ?? data.length,
        pageCount: pageCount ?? Math.ceil((rowCount ?? data.length) / (pagination?.pageSize ?? 10)),
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
        pagination,
        onPaginationChange,
        manualPagination,
        rowCount,
        pageCount,
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
          {showPagination && onPaginationChange && (
            <Pagination
              pageIndex={contextValue.pagination.pageIndex}
              pageSize={contextValue.pagination.pageSize}
              pageCount={contextValue.pageCount}
              rowCount={contextValue.rowCount}
              onPageChange={(newIndex) =>
                onPaginationChange({ pageIndex: newIndex, pageSize: contextValue.pagination.pageSize })
              }
              onPageSizeChange={(newSize) => onPaginationChange({ pageIndex: 0, pageSize: newSize })}
            />
          )}
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

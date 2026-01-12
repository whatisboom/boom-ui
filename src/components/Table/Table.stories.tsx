import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, useRef } from 'react';
import { Table } from './Table';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableHeaderCell } from './TableHeaderCell';
import type { ColumnDef, SortState, SortDirection, RowSelectionState, PaginationState } from './Table.types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'email', header: 'Email', accessorKey: 'email' },
  { id: 'role', header: 'Role', accessorKey: 'role' },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' },
  { id: 6, name: 'David Lee', email: 'david@example.com', role: 'Manager' },
  { id: 7, name: 'Emma Wilson', email: 'emma@example.com', role: 'Admin' },
  { id: 8, name: 'Frank Miller', email: 'frank@example.com', role: 'User' },
  { id: 9, name: 'Grace Davis', email: 'grace@example.com', role: 'Manager' },
  { id: 10, name: 'Henry Taylor', email: 'henry@example.com', role: 'User' },
  { id: 11, name: 'Ivy Anderson', email: 'ivy@example.com', role: 'Admin' },
  { id: 12, name: 'Jack Thomas', email: 'jack@example.com', role: 'User' },
];

const meta: Meta<typeof Table> = {
  title: 'Data & Content/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component:
          'Accessible data table component with support for sorting, selection, and pagination. Built with semantic HTML and comprehensive keyboard navigation.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Basic: Story = {
  render: () => (
    <Table columns={columns} data={data} getRowId={(row) => String(row.id)} aria-label="Users">
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.id}>
              {typeof col.header === 'function' ? col.header(col) : col.header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {String(row[col.accessorKey as keyof User])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Compact: Story = {
  render: () => (
    <Table
      columns={columns}
      data={data}
      getRowId={(row) => String(row.id)}
      density="compact"
      aria-label="Users (compact)"
    >
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.id}>
              {typeof col.header === 'function' ? col.header(col) : col.header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {String(row[col.accessorKey as keyof User])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Comfortable: Story = {
  render: () => (
    <Table
      columns={columns}
      data={data}
      getRowId={(row) => String(row.id)}
      density="comfortable"
      aria-label="Users (comfortable)"
    >
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.id}>
              {typeof col.header === 'function' ? col.header(col) : col.header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {String(row[col.accessorKey as keyof User])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Striped: Story = {
  render: () => (
    <Table
      columns={columns}
      data={data}
      getRowId={(row) => String(row.id)}
      striped
      aria-label="Users (striped)"
    >
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.id}>
              {typeof col.header === 'function' ? col.header(col) : col.header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.id}>
                {String(row[col.accessorKey as keyof User])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const StickyHeader: Story = {
  render: () => (
    <div style={{ height: '300px', overflow: 'auto' }}>
      <Table
        columns={columns}
        data={[...data, ...data, ...data]}
        getRowId={(_row, index) => String(index)}
        stickyHeader
        aria-label="Users (sticky header)"
      >
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableHeaderCell key={col.id}>
                {typeof col.header === 'function' ? col.header(col) : col.header}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...data, ...data, ...data].map((_row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {String(_row[col.accessorKey as keyof User])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

/**
 * Helper function to sort data based on SortState
 */
function sortData<T>(data: T[], sorting: SortState[], columns: ColumnDef<T>[]): T[] {
  if (!sorting.length) {return data;}

  return [...data].sort((a, b) => {
    for (const sort of sorting) {
      const column = columns.find((col) => col.id === sort.columnId);
      if (!column) {continue;}

      let aValue: unknown;
      let bValue: unknown;

      if (column.accessorFn) {
        aValue = column.accessorFn(a);
        bValue = column.accessorFn(b);
      } else if (column.accessorKey) {
        aValue = a[column.accessorKey as keyof T];
        bValue = b[column.accessorKey as keyof T];
      }

      // Custom sorting function
      if (column.sortingFn) {
        const result = column.sortingFn(a, b, column.id);
        if (result !== 0) {
          return sort.direction === 'asc' ? result : -result;
        }
        continue;
      }

      // Default sorting
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) {
        return sort.direction === 'asc' ? -1 : 1;
      }
      if (aStr > bStr) {
        return sort.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });
}

export const SingleColumnSort: Story = {
  render: () => {
    const [sorting, setSorting] = useState<SortState[]>([]);

    const sortableColumns: ColumnDef<User>[] = columns.map((col) => ({
      ...col,
      enableSorting: true,
    }));

    const sortedData = sortData(data, sorting, sortableColumns);

    const getSortDirection = (columnId: string): SortDirection => {
      const sortState = sorting.find((s) => s.columnId === columnId);
      return sortState ? sortState.direction : false;
    };

    const handleSort = (columnId: string) => {
      const currentSort = sorting.find((s) => s.columnId === columnId);
      let newSorting: SortState[];

      if (!currentSort) {
        // No sort on this column - set to ascending
        newSorting = [{ columnId, direction: 'asc' }];
      } else if (currentSort.direction === 'asc') {
        // Currently ascending - change to descending
        newSorting = [{ columnId, direction: 'desc' }];
      } else {
        // Currently descending - remove sort
        newSorting = [];
      }

      setSorting(newSorting);
    };

    return (
      <Table
        columns={sortableColumns}
        data={sortedData}
        getRowId={(row) => String(row.id)}
        sorting={sorting}
        onSortChange={setSorting}
        aria-label="Users (sortable)"
      >
        <TableHead>
          <TableRow>
            {sortableColumns.map((col) => (
              <TableHeaderCell
                key={col.id}
                sortable={col.enableSorting}
                sortDirection={getSortDirection(col.id)}
                onSort={() => handleSort(col.id)}
              >
                {typeof col.header === 'function' ? col.header(col) : col.header}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.id}>
              {sortableColumns.map((col) => (
                <TableCell key={col.id}>
                  {String(row[col.accessorKey as keyof User])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const MultiColumnSort: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Multi-column sorting allows sorting by multiple columns with priority order. **Try this:** ' +
          '(1) Click "Role" to sort by role. ' +
          '(2) Then click "Name" - now data is sorted by Role first, then Name within each role group. ' +
          '(3) Click a column again to toggle between ascending/descending/unsorted. ' +
          'Notice how each column shows a sort arrow when active.',
      },
    },
  },
  render: () => {
    const [sorting, setSorting] = useState<SortState[]>([]);

    const sortableColumns: ColumnDef<User>[] = columns.map((col) => ({
      ...col,
      enableSorting: true,
    }));

    const sortedData = sortData(data, sorting, sortableColumns);

    const getSortDirection = (columnId: string): SortDirection => {
      const sortState = sorting.find((s) => s.columnId === columnId);
      return sortState ? sortState.direction : false;
    };

    const handleSort = (columnId: string) => {
      const existingIndex = sorting.findIndex((s) => s.columnId === columnId);

      let newSorting: SortState[];

      if (existingIndex === -1) {
        // Column not currently sorted - add as ascending
        newSorting = [...sorting, { columnId, direction: 'asc' }];
      } else {
        const currentSort = sorting[existingIndex];
        if (currentSort.direction === 'asc') {
          // Currently ascending - change to descending
          newSorting = [
            ...sorting.slice(0, existingIndex),
            { columnId, direction: 'desc' },
            ...sorting.slice(existingIndex + 1),
          ];
        } else {
          // Currently descending - remove this sort
          newSorting = sorting.filter((s) => s.columnId !== columnId);
        }
      }

      setSorting(newSorting);
    };

    return (
      <Table
        columns={sortableColumns}
        data={sortedData}
        getRowId={(row) => String(row.id)}
        sorting={sorting}
        onSortChange={setSorting}
        enableMultiSort
        aria-label="Users (multi-column sortable)"
      >
        <TableHead>
          <TableRow>
            {sortableColumns.map((col) => (
              <TableHeaderCell
                key={col.id}
                sortable={col.enableSorting}
                sortDirection={getSortDirection(col.id)}
                onSort={() => handleSort(col.id)}
              >
                {typeof col.header === 'function' ? col.header(col) : col.header}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <TableRow key={row.id}>
              {sortableColumns.map((col) => (
                <TableCell key={col.id}>
                  {String(row[col.accessorKey as keyof User])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const SingleRowSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Single-row selection mode allows only one row to be selected at a time. ' +
          'Clicking a row selects it and deselects any previously selected row. ' +
          'The selected row count is displayed below the table.',
      },
    },
  },
  render: () => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const handleRowSelectionChange = (rowId: string, selected: boolean) => {
      if (selected) {
        // In single mode, clear all other selections
        setRowSelection({ [rowId]: true });
      } else {
        // Deselect this row
        setRowSelection({});
      }
    };

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;

    return (
      <div>
        <Table
          columns={columns}
          data={data}
          getRowId={(row) => String(row.id)}
          selectionMode="single"
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          enableRowSelection
          aria-label="Users (single row selection)"
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableHeaderCell key={col.id}>
                  {typeof col.header === 'function' ? col.header(col) : col.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const rowId = String(row.id);
              const isSelected = rowSelection[rowId] ?? false;
              return (
                <TableRow
                  key={row.id}
                  selected={isSelected}
                  onSelectionChange={(selected) => handleRowSelectionChange(rowId, selected)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      {String(row[col.accessorKey as keyof User])}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Selected rows: {selectedCount}
        </div>
      </div>
    );
  },
};

export const MultipleRowSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Multiple-row selection mode (default) allows selecting multiple rows independently. ' +
          'Each row shows a checkbox. Use the select-all checkbox in the header to select/deselect all rows at once. ' +
          'The header checkbox shows an indeterminate state when some (but not all) rows are selected.',
      },
    },
  },
  render: () => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const handleRowSelectionChange = (rowId: string, selected: boolean) => {
      setRowSelection((prev) => ({
        ...prev,
        [rowId]: selected,
      }));
    };

    const handleSelectAll = (selected: boolean) => {
      if (selected) {
        // Select all rows
        const allSelected: RowSelectionState = {};
        data.forEach((row) => {
          allSelected[String(row.id)] = true;
        });
        setRowSelection(allSelected);
      } else {
        // Deselect all rows
        setRowSelection({});
      }
    };

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;
    const allSelected = selectedCount === data.length && data.length > 0;
    const someSelected = selectedCount > 0 && selectedCount < data.length;

    return (
      <div>
        <Table
          columns={columns}
          data={data}
          getRowId={(row) => String(row.id)}
          selectionMode="multiple"
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          enableRowSelection
          aria-label="Users (multiple row selection)"
        >
          <TableHead>
            <TableRow>
              <TableHeaderCell
                isSelectAll={true}
                allSelected={allSelected}
                someSelected={someSelected}
                onSelectAllChange={handleSelectAll}
              />
              {columns.map((col) => (
                <TableHeaderCell key={col.id}>
                  {typeof col.header === 'function' ? col.header(col) : col.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => {
              const rowId = String(row.id);
              const isSelected = rowSelection[rowId] ?? false;
              return (
                <TableRow
                  key={row.id}
                  selected={isSelected}
                  onSelectionChange={(selected) => handleRowSelectionChange(rowId, selected)}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      {String(row[col.accessorKey as keyof User])}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Selected rows: {selectedCount} of {data.length}
        </div>
      </div>
    );
  },
};

export const ShiftClickRangeSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates shift-click range selection in multiple-row selection mode. ' +
          '**How to use:** ' +
          '(1) Click a row to select it. ' +
          '(2) Hold Shift and click another row - all rows between the first and second click will be selected. ' +
          '(3) You can continue shift-clicking to select different ranges. ' +
          'This is useful for quickly selecting large groups of rows.',
      },
    },
  },
  render: () => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const lastSelectedIndexRef = useRef<number | null>(null);

    const handleRowSelectionChange = (
      rowId: string,
      selected: boolean,
      rowIndex: number,
      event?: React.MouseEvent
    ) => {
      if (event?.shiftKey && lastSelectedIndexRef.current !== null) {
        // Shift-click: select range
        const start = Math.min(lastSelectedIndexRef.current, rowIndex);
        const end = Math.max(lastSelectedIndexRef.current, rowIndex);

        const newSelection: RowSelectionState = { ...rowSelection };
        for (let i = start; i <= end; i++) {
          const rangeRowId = String(data[i].id);
          newSelection[rangeRowId] = true;
        }
        setRowSelection(newSelection);
      } else {
        // Normal click: toggle individual row
        setRowSelection((prev) => ({
          ...prev,
          [rowId]: selected,
        }));
        lastSelectedIndexRef.current = selected ? rowIndex : null;
      }
    };

    const handleSelectAll = (selected: boolean) => {
      if (selected) {
        const allSelected: RowSelectionState = {};
        data.forEach((row) => {
          allSelected[String(row.id)] = true;
        });
        setRowSelection(allSelected);
      } else {
        setRowSelection({});
      }
      lastSelectedIndexRef.current = null;
    };

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;
    const allSelected = selectedCount === data.length && data.length > 0;
    const someSelected = selectedCount > 0 && selectedCount < data.length;

    return (
      <div>
        <Table
          columns={columns}
          data={data}
          getRowId={(row) => String(row.id)}
          selectionMode="multiple"
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          enableRowSelection
          aria-label="Users (shift-click range selection)"
        >
          <TableHead>
            <TableRow>
              <TableHeaderCell
                isSelectAll={true}
                allSelected={allSelected}
                someSelected={someSelected}
                onSelectAllChange={handleSelectAll}
              />
              {columns.map((col) => (
                <TableHeaderCell key={col.id}>
                  {typeof col.header === 'function' ? col.header(col) : col.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const rowId = String(row.id);
              const isSelected = rowSelection[rowId] ?? false;
              return (
                <TableRow
                  key={row.id}
                  selected={isSelected}
                  onSelectionChange={(selected) => handleRowSelectionChange(rowId, selected, index)}
                  rowIndex={index}
                  onClick={(e) => {
                    // Handle shift-click on row (not just checkbox)
                    if (e.shiftKey) {
                      e.preventDefault();
                      handleRowSelectionChange(rowId, true, index, e);
                    }
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      {String(row[col.accessorKey as keyof User])}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Selected rows: {selectedCount} of {data.length}
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
          Tip: Click a row, then hold Shift and click another row to select a range
        </div>
      </div>
    );
  },
};

/**
 * Helper function to get paginated data
 */
function getPaginatedData<T>(data: T[], pagination: PaginationState): T[] {
  const start = pagination.pageIndex * pagination.pageSize;
  const end = start + pagination.pageSize;
  return data.slice(start, end);
}

export const ClientSidePagination: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Client-side pagination where the Table component handles data slicing automatically. ' +
          'All data is loaded at once, and pagination controls allow navigating through pages. ' +
          'This is ideal for smaller datasets that can be loaded entirely into memory. ' +
          'The component shows the current page (e.g., "Page 1 of 3") and provides previous/next navigation.',
      },
    },
  },
  render: () => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });

    // Client-side pagination: slice the data based on current page
    const paginatedData = getPaginatedData(data, pagination);

    return (
      <div>
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Showing page {pagination.pageIndex + 1} of {Math.ceil(data.length / pagination.pageSize)} (
          {data.length} total rows, {pagination.pageSize} per page)
        </div>
        <Table
          columns={columns}
          data={paginatedData}
          getRowId={(row) => String(row.id)}
          pagination={pagination}
          onPaginationChange={setPagination}
          manualPagination={false}
          rowCount={data.length}
          aria-label="Users (client-side pagination)"
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableHeaderCell key={col.id}>
                  {typeof col.header === 'function' ? col.header(col) : col.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {String(row[col.accessorKey as keyof User])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};

export const ManualPagination: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Server-side/manual pagination where data fetching is controlled externally. ' +
          'The Table component only receives the current page of data, while the total row count ' +
          'and page count are provided separately. This is ideal for large datasets that cannot ' +
          'be loaded entirely into memory. This example simulates an API call with a loading state ' +
          'when changing pages.',
      },
    },
  },
  render: () => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });
    const [loading, setLoading] = useState(false);

    // Simulate server-side data - only current page's rows
    const serverTotalRows = 100; // Total rows on "server"
    const serverPageData = getPaginatedData(data, pagination);

    const handlePaginationChange = (newPagination: PaginationState) => {
      // Simulate API call
      setLoading(true);
      setTimeout(() => {
        setPagination(newPagination);
        setLoading(false);
      }, 500);
    };

    return (
      <div>
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Server-side pagination: Showing page {pagination.pageIndex + 1} of{' '}
          {Math.ceil(serverTotalRows / pagination.pageSize)} ({serverTotalRows} total rows on server)
          {loading && ' - Loading...'}
        </div>
        <Table
          columns={columns}
          data={serverPageData}
          getRowId={(row) => String(row.id)}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          manualPagination={true}
          rowCount={serverTotalRows}
          pageCount={Math.ceil(serverTotalRows / pagination.pageSize)}
          loading={loading}
          aria-label="Users (server-side pagination)"
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableHeaderCell key={col.id}>
                  {typeof col.header === 'function' ? col.header(col) : col.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {serverPageData.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {String(row[col.accessorKey as keyof User])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};

export const PaginationWithCustomPageSizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates custom page size options allowing users to control how many rows are displayed per page. ' +
          'Users can choose from predefined page sizes (5, 10, 25, 50). ' +
          'When the page size changes, the table automatically resets to page 0 to prevent showing an empty page. ' +
          'This is useful for giving users control over data density.',
      },
    },
  },
  render: () => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

    const paginatedData = getPaginatedData(data, pagination);
    const pageSizeOptions = [5, 10, 25, 50];

    const handlePageSizeChange = (newPageSize: number) => {
      setPagination({
        pageIndex: 0, // Reset to first page when changing page size
        pageSize: newPageSize,
      });
    };

    return (
      <div>
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label htmlFor="page-size-select" style={{ fontSize: '0.875rem', color: '#666' }}>
            Rows per page:
          </label>
          <select
            id="page-size-select"
            value={pagination.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.875rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span style={{ fontSize: '0.875rem', color: '#666' }}>
            (Page {pagination.pageIndex + 1} of {Math.ceil(data.length / pagination.pageSize)})
          </span>
        </div>
        <Table
          columns={columns}
          data={paginatedData}
          getRowId={(row) => String(row.id)}
          pagination={pagination}
          onPaginationChange={setPagination}
          manualPagination={false}
          rowCount={data.length}
          aria-label="Users (custom page sizes)"
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableHeaderCell key={col.id}>
                  {typeof col.header === 'function' ? col.header(col) : col.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    {String(row[col.accessorKey as keyof User])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};

export const PaginationWithSortingAndSelection: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates all Table features working together: pagination, sorting, and multi-row selection. ' +
          'This example shows how the Table component can handle complex data interactions: ' +
          '(1) Sort by any column (click column headers). ' +
          '(2) Select rows using checkboxes (with select-all support). ' +
          '(3) Navigate through pages while maintaining sort order and selection state. ' +
          'Selected rows persist across pages, and sorting applies to the entire dataset.',
      },
    },
  },
  render: () => {
    const [sorting, setSorting] = useState<SortState[]>([]);
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });

    const sortableColumns: ColumnDef<User>[] = columns.map((col) => ({
      ...col,
      enableSorting: true,
    }));

    // Apply sorting first, then pagination
    const sortedData = sortData(data, sorting, sortableColumns);
    const paginatedData = getPaginatedData(sortedData, pagination);

    const getSortDirection = (columnId: string): SortDirection => {
      const sortState = sorting.find((s) => s.columnId === columnId);
      return sortState ? sortState.direction : false;
    };

    const handleSort = (columnId: string) => {
      const currentSort = sorting.find((s) => s.columnId === columnId);
      let newSorting: SortState[];

      if (!currentSort) {
        newSorting = [{ columnId, direction: 'asc' }];
      } else if (currentSort.direction === 'asc') {
        newSorting = [{ columnId, direction: 'desc' }];
      } else {
        newSorting = [];
      }

      setSorting(newSorting);
      // Reset to first page when sorting changes
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    };

    const handleRowSelectionChange = (rowId: string, selected: boolean) => {
      setRowSelection((prev) => ({
        ...prev,
        [rowId]: selected,
      }));
    };

    const handleSelectAll = (selected: boolean) => {
      if (selected) {
        const allSelected: RowSelectionState = {};
        data.forEach((row) => {
          allSelected[String(row.id)] = true;
        });
        setRowSelection(allSelected);
      } else {
        setRowSelection({});
      }
    };

    const selectedCount = Object.values(rowSelection).filter(Boolean).length;
    const allSelected = selectedCount === data.length && data.length > 0;
    const someSelected = selectedCount > 0 && selectedCount < data.length;

    return (
      <div>
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Page {pagination.pageIndex + 1} of {Math.ceil(data.length / pagination.pageSize)} | Selected:{' '}
          {selectedCount} of {data.length} rows
        </div>
        <Table
          columns={sortableColumns}
          data={paginatedData}
          getRowId={(row) => String(row.id)}
          sorting={sorting}
          onSortChange={setSorting}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          enableRowSelection
          selectionMode="multiple"
          pagination={pagination}
          onPaginationChange={setPagination}
          manualPagination={false}
          rowCount={data.length}
          aria-label="Users (pagination with sorting and selection)"
        >
          <TableHead>
            <TableRow>
              <TableHeaderCell
                isSelectAll={true}
                allSelected={allSelected}
                someSelected={someSelected}
                onSelectAllChange={handleSelectAll}
              />
              {sortableColumns.map((col) => (
                <TableHeaderCell
                  key={col.id}
                  sortable={col.enableSorting}
                  sortDirection={getSortDirection(col.id)}
                  onSort={() => handleSort(col.id)}
                >
                  {typeof col.header === 'function' ? col.header(col) : col.header}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => {
              const rowId = String(row.id);
              const isSelected = rowSelection[rowId] ?? false;
              return (
                <TableRow
                  key={row.id}
                  selected={isSelected}
                  onSelectionChange={(selected) => handleRowSelectionChange(rowId, selected)}
                >
                  {sortableColumns.map((col) => (
                    <TableCell key={col.id}>
                      {String(row[col.accessorKey as keyof User])}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  },
};

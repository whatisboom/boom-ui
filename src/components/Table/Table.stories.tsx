import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Table } from './Table';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableHeaderCell } from './TableHeaderCell';
import { ColumnDef, SortState, SortDirection } from './Table.types';

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
  title: 'Components/Table',
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
  if (!sorting.length) return data;

  return [...data].sort((a, b) => {
    for (const sort of sorting) {
      const column = columns.find((col) => col.id === sort.columnId);
      if (!column) continue;

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

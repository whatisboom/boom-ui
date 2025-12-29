import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableHeaderCell } from './TableHeaderCell';
import { ColumnDef } from './Table.types';

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

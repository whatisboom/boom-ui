import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Table } from './Table';
import { TableHead } from './TableHead';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import { TableHeaderCell } from './TableHeaderCell';
import type { ColumnDef } from './Table.types';
import styles from './Table.module.css';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: ColumnDef<User>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'email', header: 'Email', accessorKey: 'email' },
];

const data: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

describe('Table', () => {
  it('should render table with columns and data', () => {
    render(
      <Table<User> columns={columns} data={data} getRowId={(row) => String(row.id)}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableHeaderCell key={col.id}>{typeof col.header === 'function' ? col.header(col) : col.header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {String(row[col.accessorKey as keyof User])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should have role="table"', () => {
    render(
      <Table<User> columns={columns} data={data} getRowId={(row) => String(row.id)} aria-label="Users">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>John</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = screen.getByRole('table', { name: 'Users' });
    expect(table).toBeInTheDocument();
  });

  it('should apply density classes', () => {
    const { rerender } = render(
      <Table<User> columns={columns} data={data} getRowId={(row) => String(row.id)} density="compact">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>
    );

    let container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass(styles.densityCompact);

    rerender(
      <Table<User> columns={columns} data={data} getRowId={(row) => String(row.id)} density="comfortable">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>
    );

    container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass(styles.densityComfortable);
  });

  it('should apply striped class when striped prop is true', () => {
    render(
      <Table<User> columns={columns} data={data} getRowId={(row) => String(row.id)} striped>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>
    );

    const container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass(styles.striped);
  });

  it('should apply sticky header class when stickyHeader is true', () => {
    render(
      <Table<User> columns={columns} data={data} getRowId={(row) => String(row.id)} stickyHeader>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>
    );

    const container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass(styles.stickyHeader);
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Table<User> columns={columns} data={data} getRowId={(row) => String(row.id)} aria-label="Users">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableHeaderCell key={col.id}>{typeof col.header === 'function' ? col.header(col) : col.header}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {String(row[col.accessorKey as keyof User])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  describe('Pagination Integration', () => {
    it('should render Pagination when pagination prop and onPaginationChange are provided', () => {
      const onPaginationChange = vi.fn();

      render(
        <Table<User>
          columns={columns}
          data={data}
          getRowId={(row) => String(row.id)}
          pagination={{ pageIndex: 0, pageSize: 10 }}
          onPaginationChange={onPaginationChange}
          aria-label="Users"
        >
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      // Pagination component should be visible
      expect(screen.getByText(/Showing 1-2 of 2 rows/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    it('should not render Pagination when pagination prop is not provided', () => {
      render(
        <Table<User> columns={columns} data={data} getRowId={(row) => String(row.id)} aria-label="Users">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      // Pagination should not be present
      expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
    });

    it('should not render Pagination when onPaginationChange is not provided', () => {
      render(
        <Table<User>
          columns={columns}
          data={data}
          getRowId={(row) => String(row.id)}
          pagination={{ pageIndex: 0, pageSize: 10 }}
          aria-label="Users"
        >
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      // Pagination should not be present (onPaginationChange is required)
      expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
    });

    it('should pass correct props to Pagination component', () => {
      const onPaginationChange = vi.fn();

      render(
        <Table<User>
          columns={columns}
          data={data}
          getRowId={(row) => String(row.id)}
          pagination={{ pageIndex: 1, pageSize: 10 }}
          onPaginationChange={onPaginationChange}
          rowCount={100}
          aria-label="Users"
        >
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      // Check that Pagination receives correct values
      expect(screen.getByText(/Showing 11-20 of 100 rows/i)).toBeInTheDocument();

      // Page 2 button (pageIndex 1) should be active
      const page2Button = screen.getByLabelText('2');
      expect(page2Button).toHaveAttribute('aria-current', 'page');
    });
  });
});

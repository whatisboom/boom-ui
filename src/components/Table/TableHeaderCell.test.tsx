import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { TableHeaderCell } from './TableHeaderCell';
import styles from './Table.module.css';

describe('TableHeaderCell', () => {
  it('should render header content', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should have role="columnheader"', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    const header = screen.getByRole('columnheader');
    expect(header).toBeInTheDocument();
  });

  it('should apply alignment classes', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell align="center">Name</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    const header = screen.getByRole('columnheader');
    expect(header).toHaveClass(styles.alignCenter);
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell>Name</TableHeaderCell>
          </tr>
        </thead>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  describe('Sorting', () => {
    it('should apply sortable class when sortable is true', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable>Name</TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      const header = screen.getByRole('columnheader');
      expect(header).toHaveClass(styles.sortable);
    });

    it('should call onSort when clicked', async () => {
      const user = userEvent.setup();
      const onSort = vi.fn();

      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable onSort={onSort}>
                Name
              </TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      const header = screen.getByRole('columnheader');
      await user.click(header);

      expect(onSort).toHaveBeenCalledTimes(1);
    });

    it('should call onSort when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const onSort = vi.fn();

      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable onSort={onSort}>
                Name
              </TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      const header = screen.getByRole('columnheader');
      header.focus();
      await user.keyboard('{Enter}');

      expect(onSort).toHaveBeenCalledTimes(1);
    });

    it('should call onSort when Space key is pressed', async () => {
      const user = userEvent.setup();
      const onSort = vi.fn();

      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable onSort={onSort}>
                Name
              </TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      const header = screen.getByRole('columnheader');
      header.focus();
      await user.keyboard(' ');

      expect(onSort).toHaveBeenCalledTimes(1);
    });

    it('should have tabIndex={0} when sortable', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable>Name</TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      const header = screen.getByRole('columnheader');
      expect(header).toHaveAttribute('tabIndex', '0');
    });

    it('should have aria-sort="ascending" when sortDirection is "asc"', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable sortDirection="asc">
                Name
              </TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      const header = screen.getByRole('columnheader');
      expect(header).toHaveAttribute('aria-sort', 'ascending');
    });

    it('should have aria-sort="descending" when sortDirection is "desc"', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable sortDirection="desc">
                Name
              </TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      const header = screen.getByRole('columnheader');
      expect(header).toHaveAttribute('aria-sort', 'descending');
    });

    it('should have aria-sort="none" when sortDirection is false', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable sortDirection={false}>
                Name
              </TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      const header = screen.getByRole('columnheader');
      expect(header).toHaveAttribute('aria-sort', 'none');
    });

    it('should have aria-sort="none" when sortDirection is undefined', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable>Name</TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      const header = screen.getByRole('columnheader');
      expect(header).toHaveAttribute('aria-sort', 'none');
    });
  });
});

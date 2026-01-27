import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
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

    it('should render SortIndicator when sortable', () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell sortable>Name</TableHeaderCell>
            </tr>
          </thead>
        </table>
      );

      // SortIndicator renders an SVG
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass(styles.sortIcon);
    });

    it('should pass correct direction to SortIndicator', () => {
      const { container, rerender } = render(
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

      // Check for ascending indicator
      let svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass(styles.sortIconAsc);

      // Rerender with descending
      rerender(
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

      svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass(styles.sortIconDesc);
    });
  });

  describe('Select All', () => {
    it('should render checkbox when isSelectAll prop is provided', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell isSelectAll />
            </tr>
          </thead>
        </table>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should have checkbox checked when allSelected is true', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell isSelectAll allSelected={true} />
            </tr>
          </thead>
        </table>
      );

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('should have checkbox indeterminate when someSelected is true and allSelected is false', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell isSelectAll someSelected={true} allSelected={false} />
            </tr>
          </thead>
        </table>
      );

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('should call onSelectAllChange when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const onSelectAllChange = vi.fn();

      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell isSelectAll onSelectAllChange={onSelectAllChange} />
            </tr>
          </thead>
        </table>
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onSelectAllChange).toHaveBeenCalledTimes(1);
      expect(onSelectAllChange).toHaveBeenCalledWith(true);
    });

    it('should have proper aria-label for select-all checkbox', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell isSelectAll />
            </tr>
          </thead>
        </table>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAccessibleName('Select all rows');
    });

    it('should have no accessibility violations with select-all enabled', async () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell isSelectAll />
            </tr>
          </thead>
        </table>
      );

      expect(await axe(container)).toHaveNoViolations();
    });

    it('should not render sort indicator when isSelectAll is true', () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHeaderCell isSelectAll sortable sortDirection="asc" />
            </tr>
          </thead>
        </table>
      );

      // SortIndicator has the sortIcon class, should not be present
      const sortIndicator = container.querySelector('[class*="sortIcon"]');
      expect(sortIndicator).not.toBeInTheDocument();
    });
  });
});

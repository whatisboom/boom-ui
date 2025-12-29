import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';
import styles from './Table.module.css';

describe('TableRow', () => {
  it('should render row with cells', () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Cell 1</TableCell>
            <TableCell>Cell 2</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
  });

  it('should have role="row"', () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    const row = screen.getByRole('row');
    expect(row).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <tbody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </tbody>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  describe('selection', () => {
    it('should render checkbox when selected prop is provided', () => {
      render(
        <table>
          <tbody>
            <TableRow selected={false}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      );

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should have checkbox checked when selected={true}', () => {
      render(
        <table>
          <tbody>
            <TableRow selected={true}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should have checkbox unchecked when selected={false}', () => {
      render(
        <table>
          <tbody>
            <TableRow selected={false}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should call onSelectionChange when checkbox clicked', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <table>
          <tbody>
            <TableRow selected={false} onSelectionChange={onSelectionChange}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onSelectionChange).toHaveBeenCalledWith(true);
    });

    it('should apply rowSelected class when selected={true}', () => {
      render(
        <table>
          <tbody>
            <TableRow selected={true}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      );

      const row = screen.getByRole('row');
      expect(row).toHaveClass(styles.rowSelected);
    });

    it('should apply rowSelectable class when onSelectionChange is provided', () => {
      const onSelectionChange = vi.fn();

      render(
        <table>
          <tbody>
            <TableRow selected={false} onSelectionChange={onSelectionChange}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      );

      const row = screen.getByRole('row');
      expect(row).toHaveClass(styles.rowSelectable);
    });

    it('should not trigger row click handler when checkbox clicked', async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();
      const onSelectionChange = vi.fn();

      render(
        <table>
          <tbody>
            <TableRow selected={false} onSelectionChange={onSelectionChange} onClick={onRowClick}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      );

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(onSelectionChange).toHaveBeenCalledWith(true);
      expect(onRowClick).not.toHaveBeenCalled();
    });

    it('should have no accessibility violations with selection enabled', async () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow selected={true} onSelectionChange={vi.fn()}>
              <TableCell>Content</TableCell>
            </TableRow>
          </tbody>
        </table>
      );

      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

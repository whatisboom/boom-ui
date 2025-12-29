import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

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
});

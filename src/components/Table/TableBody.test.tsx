import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { TableBody } from './TableBody';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

describe('TableBody', () => {
  it('should render body section', () => {
    render(
      <table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );

    expect(screen.getByText('Data')).toBeInTheDocument();
  });

  it('should have implicit role="rowgroup"', () => {
    render(
      <table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );

    // tbody has implicit role="rowgroup" so we can query by role
    const rowgroup = screen.getByRole('rowgroup');
    expect(rowgroup).toBeInTheDocument();
    expect(rowgroup.tagName.toLowerCase()).toBe('tbody');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

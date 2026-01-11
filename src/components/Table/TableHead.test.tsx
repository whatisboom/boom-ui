import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { TableHead } from './TableHead';
import { TableRow } from './TableRow';
import { TableHeaderCell } from './TableHeaderCell';

describe('TableHead', () => {
  it('should render header section', () => {
    render(
      <table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should have implicit role="rowgroup"', () => {
    render(
      <table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </table>
    );

    // thead has implicit role="rowgroup" so we can query by role
    const rowgroup = screen.getByRole('rowgroup');
    expect(rowgroup).toBeInTheDocument();
    expect(rowgroup.tagName.toLowerCase()).toBe('thead');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
          </TableRow>
        </TableHead>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

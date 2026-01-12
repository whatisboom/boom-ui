import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { TableCell } from './TableCell';
import styles from './Table.module.css';

describe('TableCell', () => {
  it('should render cell content', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should have role="cell"', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const cell = screen.getByRole('cell');
    expect(cell).toBeInTheDocument();
  });

  it('should apply alignment classes', () => {
    const { rerender } = render(
      <table>
        <tbody>
          <tr>
            <TableCell align="left">Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    let cell = screen.getByRole('cell');
    expect(cell).toHaveClass(styles.alignLeft);

    rerender(
      <table>
        <tbody>
          <tr>
            <TableCell align="center">Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    cell = screen.getByRole('cell');
    expect(cell).toHaveClass(styles.alignCenter);
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

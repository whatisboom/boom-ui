import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});

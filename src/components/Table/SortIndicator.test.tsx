import { describe, it, expect } from 'vitest';
import { render } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { SortIndicator } from './SortIndicator';
import styles from './Table.module.css';

describe('SortIndicator', () => {
  it('renders ascending arrow when direction="asc"', () => {
    const { container } = render(<SortIndicator direction="asc" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass(styles.sortIcon);
    expect(svg).toHaveClass(styles.sortIconAsc);
  });

  it('renders descending arrow when direction="desc"', () => {
    const { container } = render(<SortIndicator direction="desc" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass(styles.sortIcon);
    expect(svg).toHaveClass(styles.sortIconDesc);
  });

  it('renders both arrows (inactive) when direction={false}', () => {
    const { container } = render(<SortIndicator direction={false} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass(styles.sortIcon);
    expect(svg).not.toHaveClass(styles.sortIconAsc);
    expect(svg).not.toHaveClass(styles.sortIconDesc);
  });

  it('applies correct CSS classes for each direction', () => {
    const { container: ascContainer } = render(<SortIndicator direction="asc" />);
    const { container: descContainer } = render(<SortIndicator direction="desc" />);
    const { container: inactiveContainer } = render(<SortIndicator direction={false} />);

    const ascSvg = ascContainer.querySelector('svg');
    const descSvg = descContainer.querySelector('svg');
    const inactiveSvg = inactiveContainer.querySelector('svg');

    expect(ascSvg).toHaveClass(styles.sortIconAsc);
    expect(descSvg).toHaveClass(styles.sortIconDesc);
    expect(inactiveSvg).not.toHaveClass(styles.sortIconAsc);
    expect(inactiveSvg).not.toHaveClass(styles.sortIconDesc);
  });

  it('has proper aria-hidden attribute (decorative icon)', () => {
    const { container } = render(<SortIndicator direction="asc" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SortIndicator direction="asc" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<SortIndicator direction="asc" className="custom-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-class');
  });
});

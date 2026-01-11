import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Header } from './Header';
import styles from './Header.module.css';

describe('Header', () => {
  it('should render header with logo', () => {
    render(
      <Header logo={<div>Logo</div>}>
        <div>Content</div>
      </Header>
    );

    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should have semantic header element', () => {
    render(<Header>Content</Header>);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should apply sticky class when enabled', () => {
    render(<Header sticky>Content</Header>);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(styles.sticky);
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Header logo={<img src="/logo.png" alt="Company Logo" />}>
        <nav>Navigation</nav>
      </Header>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';
import styles from './Spinner.module.css';

describe('Spinner', () => {
  it('should render with default props', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct ARIA attributes', () => {
    render(<Spinner label="Loading content" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading content');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
  });

  it('should render different sizes', () => {
    const { rerender } = render(<Spinner size="sm" />);
    let spinner = screen.getByRole('status');
    expect(spinner.firstChild).toHaveClass(styles.sm);

    rerender(<Spinner size="lg" />);
    spinner = screen.getByRole('status');
    expect(spinner.firstChild).toHaveClass(styles.lg);
  });

  it('should disable animation when disableAnimation is true', () => {
    render(<Spinner disableAnimation />);
    const spinnerElement = screen.getByRole('status').firstChild;
    expect(spinnerElement).toHaveClass(styles.noAnimation);
  });

  it('should render with overlay', () => {
    render(<Spinner overlay />);
    // Portal renders outside container
    expect(document.body.querySelector('[role="status"]')).toBeInTheDocument();
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

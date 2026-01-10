import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from './Button';
import styles from './Button.module.css';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should not trigger onClick when disabled', async () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(<Button disabled onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(false);
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.primary);

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.secondary);
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.sm);

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass(styles.lg);
  });

  it('should render with leftIcon', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon">←</span>}>
        With Icon
      </Button>
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('should render with rightIcon', () => {
    render(
      <Button rightIcon={<span data-testid="right-icon">→</span>}>
        With Icon
      </Button>
    );
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('should add aria-label when loading with string children', () => {
    render(<Button loading>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Submit - Loading');
  });

  it('should disable animation when disableAnimation is true', () => {
    const { container } = render(<Button disableAnimation>No Animation</Button>);
    const button = container.querySelector('button');
    expect(button?.tagName).toBe('BUTTON');
    // Verify it's a regular button, not a motion.button (which would have additional motion props)
    expect(button).not.toHaveAttribute('data-framer-component');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.css';

describe('Skeleton', () => {
  it('should render with default props', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should render multiple lines when lines prop is provided', () => {
    const { container } = render(<Skeleton lines={3} />);
    const skeletons = container.querySelectorAll('[role="status"]');
    expect(skeletons).toHaveLength(3);
  });

  it('should apply variant classes', () => {
    const { rerender } = render(<Skeleton variant="text" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass(styles.text);

    rerender(<Skeleton variant="circle" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass(styles.circle);
  });

  it('should apply custom dimensions', () => {
    render(<Skeleton width={100} height={50} data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '100px', height: '50px' });
  });

  it('should disable animation when disableAnimation is true', () => {
    render(<Skeleton disableAnimation data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass(styles.noAnimation);
  });

  it('should have aria-busy and aria-live attributes', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(skeleton).toHaveAttribute('role', 'status');
  });

  it('should render circle variant without inline border-radius override', () => {
    render(<Skeleton variant="circle" width={48} height={48} data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');

    // Circle variant should have the circle class (which applies border-radius: 50%)
    expect(skeleton).toHaveClass(styles.circle);

    // Verify inline style doesn't contain border-radius
    // This ensures CSS class's border-radius: 50% won't be overridden
    const inlineStyle = skeleton.getAttribute('style') || '';
    expect(inlineStyle).not.toContain('border-radius');
  });
});

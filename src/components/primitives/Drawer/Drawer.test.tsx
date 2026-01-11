import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../../tests/test-utils';
import { Drawer } from './Drawer';
import styles from './Drawer.module.css';

describe('Drawer', () => {
  it('should render drawer from left', () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()} side="left">
        <div>Drawer Content</div>
      </Drawer>
    );

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveClass(styles.left);
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('should render drawer from right', () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()} side="right">
        <div>Drawer Content</div>
      </Drawer>
    );

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveClass(styles.right);
  });

  it('should apply custom width', () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()} width="400px">
        <div>Content</div>
      </Drawer>
    );

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveStyle({ width: '400px' });
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
  });
});

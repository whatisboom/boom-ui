import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Modal } from './Modal';
import styles from './Modal.module.css';

describe('Modal', () => {
  it('should render modal with title', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Test Modal"
        description="Test Description"
      >
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('should render different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} size="sm">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass(styles.sm);

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="lg">
        <div>Content</div>
      </Modal>
    );

    expect(dialog).toHaveClass(styles.lg);
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Accessible Modal">
        <div>Content</div>
      </Modal>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

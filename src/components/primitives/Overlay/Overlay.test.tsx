import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../../tests/test-utils';
import { Overlay } from './Overlay';

describe('Overlay', () => {
  it('should render children when open', () => {
    render(
      <Overlay isOpen={true} onClose={vi.fn()}>
        <div>Overlay Content</div>
      </Overlay>
    );

    expect(screen.getByText('Overlay Content')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <Overlay isOpen={false} onClose={vi.fn()}>
        <div>Overlay Content</div>
      </Overlay>
    );

    expect(screen.queryByText('Overlay Content')).not.toBeInTheDocument();
  });

  it('should call onClose on escape key', () => {
    const onClose = vi.fn();
    render(
      <Overlay isOpen={true} onClose={onClose} closeOnEscape={true}>
        <div>Content</div>
      </Overlay>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose on backdrop click', () => {
    const onClose = vi.fn();
    render(
      <Overlay isOpen={true} onClose={onClose} closeOnClickOutside={true}>
        <div>Content</div>
      </Overlay>
    );

    const backdrop = screen.getByTestId('overlay-backdrop');
    fireEvent.mouseDown(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not close on content click', () => {
    const onClose = vi.fn();
    render(
      <Overlay isOpen={true} onClose={onClose} closeOnClickOutside={true}>
        <div data-testid="content">Content</div>
      </Overlay>
    );

    fireEvent.mouseDown(screen.getByTestId('content'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should lock scroll when enabled', () => {
    render(
      <Overlay isOpen={true} onClose={vi.fn()} lockScroll={true}>
        <div>Content</div>
      </Overlay>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });
});

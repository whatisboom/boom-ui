import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef, act } from 'react';
import { Popover } from './Popover';

describe('Popover', () => {
  it('should render popover when open', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const anchorRef = createRef<HTMLElement>();
    (anchorRef as { current: HTMLElement }).current = anchor;

    render(
      <Popover isOpen={true} onClose={vi.fn()} anchorEl={anchorRef}>
        <div>Popover Content</div>
      </Popover>
    );

    expect(screen.getByText('Popover Content')).toBeInTheDocument();

    document.body.removeChild(anchor);
  });

  it('should not render when closed', () => {
    const anchor = document.createElement('button');
    const anchorRef = createRef<HTMLElement>();
    (anchorRef as { current: HTMLElement }).current = anchor;

    render(
      <Popover isOpen={false} onClose={vi.fn()} anchorEl={anchorRef}>
        <div>Popover Content</div>
      </Popover>
    );

    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
  });

  it('should close on escape key', () => {
    const onClose = vi.fn();
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    const anchorRef = createRef<HTMLElement>();
    (anchorRef as { current: HTMLElement }).current = anchor;

    render(
      <Popover isOpen={true} onClose={onClose} anchorEl={anchorRef}>
        <div>Content</div>
      </Popover>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);

    document.body.removeChild(anchor);
  });

  it('should position popover correctly based on placement', async () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);

    // Mock getBoundingClientRect for anchor
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      left: 200,
      bottom: 140,
      right: 300,
      width: 100,
      height: 40,
      x: 200,
      y: 100,
      toJSON: () => {},
    });

    const anchorRef = createRef<HTMLElement>();
    (anchorRef as { current: HTMLElement }).current = anchor;

    const { rerender } = render(
      <Popover isOpen={true} onClose={vi.fn()} anchorEl={anchorRef} placement="bottom">
        <div>Content</div>
      </Popover>
    );

    // Wait for requestAnimationFrame to complete
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });

    // Test bottom placement
    let popover = screen.getByText('Content').parentElement;
    // Verify position styles are applied
    expect(popover?.style.top).not.toBe('');
    expect(popover?.style.left).not.toBe('');

    // Test top placement
    rerender(
      <Popover isOpen={true} onClose={vi.fn()} anchorEl={anchorRef} placement="top">
        <div>Content</div>
      </Popover>
    );
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
    popover = screen.getByText('Content').parentElement;
    expect(popover?.style.top).not.toBe('');
    expect(popover?.style.left).not.toBe('');

    // Test left placement
    rerender(
      <Popover isOpen={true} onClose={vi.fn()} anchorEl={anchorRef} placement="left">
        <div>Content</div>
      </Popover>
    );
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
    popover = screen.getByText('Content').parentElement;
    expect(popover?.style.top).not.toBe('');
    expect(popover?.style.left).not.toBe('');

    // Test right placement
    rerender(
      <Popover isOpen={true} onClose={vi.fn()} anchorEl={anchorRef} placement="right">
        <div>Content</div>
      </Popover>
    );
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
    popover = screen.getByText('Content').parentElement;
    expect(popover?.style.top).not.toBe('');
    expect(popover?.style.left).not.toBe('');

    document.body.removeChild(anchor);
  });
});

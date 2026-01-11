import { vi } from 'vitest';
import React, { Fragment, createElement, ReactNode } from 'react';

// Mock motion.div to render as plain div (fixes event propagation)
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => {
        const { initial, animate, exit, transition, variants, ...restProps } = props;
        return <div {...restProps}>{children}</div>;
      },
    },
    AnimatePresence: ({ children }: { children: ReactNode }) => {
      // Render children directly without animation delays
      return children ? createElement(Fragment, null, children) : null;
    },
  };
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
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

  it('should call onClose on backdrop click', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup({ delay: null });

    render(
      <Overlay isOpen={true} onClose={onClose} closeOnClickOutside={true}>
        <div>Content</div>
      </Overlay>
    );

    // Wait for portal to render
    const backdrop = await screen.findByTestId('overlay-backdrop');

    // userEvent.click generates proper mousedown/mouseup/click sequence
    await user.click(backdrop);

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

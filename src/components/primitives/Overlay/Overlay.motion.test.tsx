import { vi } from 'vitest';
import React, { Fragment, createElement, ReactNode } from 'react';

// Mock motion components to render as plain elements
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');

  const motionProxy = new Proxy({}, {
    get: (_target, prop: string) => {
      const Component = React.forwardRef((props: any, ref) => {
        return createElement(prop, { ...props, ref });
      });
      Component.displayName = `motion.${prop}`;
      return Component;
    }
  });

  return {
    ...actual,
    motion: motionProxy,
    AnimatePresence: ({ children }: { children: ReactNode }) => {
      return children ? createElement(Fragment, null, children) : null;
    },
  };
});

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../../../tests/test-utils';
import { Overlay } from './Overlay';

describe('Overlay - Motion Tests', () => {
  it('should call onClose on backdrop click', async () => {
    const onClose = vi.fn();

    render(
      <Overlay isOpen={true} onClose={onClose} closeOnClickOutside={true}>
        <div>Content</div>
      </Overlay>
    );

    // Wait for portal to render
    const backdrop = await screen.findByTestId('overlay-backdrop');

    // Fire mouseDown event directly on backdrop
    fireEvent.mouseDown(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

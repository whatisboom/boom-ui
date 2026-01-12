import { vi } from 'vitest';
import type { ReactNode } from 'react';
import React, { Fragment, createElement } from 'react';
import type * as FramerMotion from 'framer-motion';

// Mock motion components to render as plain elements
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof FramerMotion>('framer-motion');

  // Cache components to maintain referential equality across re-renders
  const componentCache = new Map<string, React.ForwardRefExoticComponent<Record<string, unknown>>>();

  const motionProxy = new Proxy({}, {
    get: (_target, prop: string) => {
      if (!componentCache.has(prop)) {
        const Component = React.forwardRef((props: Record<string, unknown>, ref) => {
          // Filter out Framer Motion props before passing to DOM element
          const motionProps = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileFocus', 'whileInView'];
          const domProps = Object.fromEntries(
            Object.entries(props).filter(([key]) => !motionProps.includes(key))
          );
          return createElement(prop, { ...domProps, ref });
        });
        Component.displayName = `motion.${prop}`;
        componentCache.set(prop, Component);
      }
      return componentCache.get(prop);
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

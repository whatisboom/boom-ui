import { vi } from 'vitest';
import React, { Fragment, createElement, ReactNode } from 'react';

// Mock motion components to render as plain elements
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');

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
import { render, screen, waitFor } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

// Test component that uses the toast hook
const ToastTester = () => {
  const { toast } = useToast();

  return (
    <div>
      <button
        onClick={() => {
          toast('Test message');
        }}
      >
        Show Toast
      </button>
    </div>
  );
};

describe('Toast - Motion Tests', () => {
  it('should dismiss when close button clicked', async () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Toast'));

    expect(screen.getByText('Test message')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close notification/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });
  });
});

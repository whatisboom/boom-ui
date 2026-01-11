import { vi } from 'vitest';
import React, { Fragment, createElement, ReactNode } from 'react';

// Mock motion.div to render as plain div (fixes event handler issues)
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

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, waitFor } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

// Test component that uses the toast hook
const ToastTester = ({ onToastCreated }: { onToastCreated?: (id: string) => void }) => {
  const { toast, dismiss, dismissAll } = useToast();

  return (
    <div>
      <button
        onClick={() => {
          const id = toast('Test message');
          onToastCreated?.(id);
        }}
      >
        Show Toast
      </button>
      <button onClick={() => toast({ message: 'Success!', variant: 'success' })}>
        Show Success
      </button>
      <button onClick={() => toast({ message: 'Error!', variant: 'error', duration: 1000 })}>
        Show Error
      </button>
      <button onClick={() => dismiss('test-id')}>Dismiss Toast</button>
      <button onClick={dismissAll}>Dismiss All</button>
    </div>
  );
};

describe('Toast', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Provider Rendering
  it('should render children', () => {
    render(
      <ToastProvider>
        <div>Test Content</div>
      </ToastProvider>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  // Toast Creation
  it('should show toast when toast() is called', async () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Toast'));

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should show toast with string parameter', async () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Toast'));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should show toast with options object', async () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Success'));

    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  // Variants
  it('should apply correct variant class', async () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Error'));

    const toast = screen.getByRole('alert');
    expect(toast.className).toContain('error');
  });

  // Auto-dismiss
  it('should auto-dismiss after duration', async () => {
    // Use a short duration for testing (100ms)
    const TestButton = () => {
      const { toast } = useToast();
      return (
        <button onClick={() => toast({ message: 'Auto-dismiss test', duration: 100 })}>
          Show Toast
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestButton />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Toast'));

    expect(screen.getByText('Auto-dismiss test')).toBeInTheDocument();

    // Wait for auto-dismiss
    await waitFor(
      () => {
        expect(screen.queryByText('Auto-dismiss test')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  // Manual dismiss
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

  // Multiple toasts
  it('should show multiple toasts', async () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Toast'));
    await user.click(screen.getByText('Show Success'));

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  // Max toasts limit
  it('should respect maxToasts limit', async () => {
    render(
      <ToastProvider maxToasts={2}>
        <ToastTester />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Toast'));
    await user.click(screen.getByText('Show Success'));
    await user.click(screen.getByText('Show Error'));

    // Wait for animations to settle
    await waitFor(() => {
      // Only the last 2 toasts should be visible (Success and Error)
      // Test message should have been removed
      expect(screen.queryByText('Test message')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  // useToast hook error
  it('should throw error when useToast used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ToastTester />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });

  // Accessibility
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Toast'));

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have role="alert" and aria-live="polite"', async () => {
    render(
      <ToastProvider>
        <ToastTester />
      </ToastProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByText('Show Toast'));

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('aria-atomic', 'true');
  });
});

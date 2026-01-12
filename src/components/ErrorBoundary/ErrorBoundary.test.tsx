import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for error boundary tests
  const consoleError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = consoleError;
  });

  describe('Error Catching', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should catch errors and show default fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should call onError callback when error is caught', () => {
      const onError = vi.fn();
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
      expect(onError.mock.calls[0][0].message).toBe('Test error');
    });
  });

  describe('Fallback UI Options', () => {
    it('should render custom fallback ReactNode', () => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    });

    it('should render custom fallbackRender function', () => {
      render(
        <ErrorBoundary
          fallbackRender={({ error, resetError }) => (
            <div>
              <p>Error: {error.message}</p>
              <button onClick={resetError}>Reset</button>
            </div>
          )}
        >
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.getByText('Error: Test error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });

    it('should prioritize fallback prop over fallbackRender', () => {
      render(
        <ErrorBoundary
          fallback={<div>Simple fallback</div>}
          fallbackRender={() => <div>Render fallback</div>}
        >
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.getByText('Simple fallback')).toBeInTheDocument();
      expect(screen.queryByText('Render fallback')).not.toBeInTheDocument();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset error state when reset button clicked', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;
      const { rerender } = render(
        <ErrorBoundary key={shouldThrow ? 'error' : 'no-error'}>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      // Error should be showing
      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Click reset and update the prop
      shouldThrow = false;
      await user.click(screen.getByRole('button', { name: /try again/i }));

      // Re-render with no error and new key to force remount
      rerender(
        <ErrorBoundary key={shouldThrow ? 'error' : 'no-error'}>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should call onReset callback when reset', async () => {
      const user = userEvent.setup();
      const onReset = vi.fn();
      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      await user.click(screen.getByRole('button', { name: /try again/i }));
      expect(onReset).toHaveBeenCalledTimes(1);
    });

    it('should auto-reset when resetKey changes', () => {
      const { rerender } = render(
        <ErrorBoundary resetKey="key1">
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();

      // Change resetKey
      rerender(
        <ErrorBoundary resetKey="key2">
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations with default fallback', async () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('should have role="alert" on error display', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow />
        </ErrorBoundary>
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});

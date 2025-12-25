import { ReactNode } from 'react';

export interface FallbackProps {
  /**
   * The error that was caught
   */
  error: Error;

  /**
   * Error info with component stack
   * May be null if accessed before componentDidCatch completes
   */
  errorInfo: React.ErrorInfo | null;

  /**
   * Function to reset the error boundary and retry
   */
  resetError: () => void;
}

export interface ErrorBoundaryProps {
  /**
   * The content to render when there's no error
   */
  children: ReactNode;

  /**
   * Custom fallback UI as ReactNode
   * Takes precedence over fallbackRender
   */
  fallback?: ReactNode;

  /**
   * Custom fallback UI as render function
   * Receives error, errorInfo, and resetError
   */
  fallbackRender?: (props: FallbackProps) => ReactNode;

  /**
   * Callback fired when an error is caught
   * Use for logging to external services (e.g., Sentry)
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;

  /**
   * Callback fired when error boundary is reset
   */
  onReset?: () => void;

  /**
   * When this key changes, the error boundary will reset
   * Useful for resetting on route changes or data changes
   */
  resetKey?: string | number;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

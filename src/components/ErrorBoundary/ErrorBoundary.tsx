import type { ReactNode } from 'react';
import { Component } from 'react';
import { cn } from '@/utils/classnames';
import type { ErrorBoundaryProps, ErrorBoundaryState, FallbackProps } from './ErrorBoundary.types';
import { DefaultErrorFallback } from './DefaultErrorFallback';
import styles from './ErrorBoundary.module.css';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = 'ErrorBoundary';

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Call onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Store errorInfo in state
    this.setState({ errorInfo });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKey } = this.props;
    const { hasError } = this.state;

    // Auto-reset when resetKey changes
    if (hasError && resetKey !== prevProps.resetKey) {
      this.reset();
    }
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, fallbackRender, className } = this.props;

    if (!hasError) {
      return children;
    }

    // Priority order: fallback prop > fallbackRender > default UI
    if (fallback !== undefined) {
      return <div className={cn(styles.errorBoundary, className)}>{fallback}</div>;
    }

    const fallbackProps: FallbackProps = {
      error: error!,
      errorInfo,
      resetError: this.reset,
    };

    if (fallbackRender) {
      return (
        <div className={cn(styles.errorBoundary, className)}>
          {fallbackRender(fallbackProps)}
        </div>
      );
    }

    // Default fallback UI
    return (
      <div className={cn(styles.errorBoundary, className)}>
        <DefaultErrorFallback {...fallbackProps} />
      </div>
    );
  }
}

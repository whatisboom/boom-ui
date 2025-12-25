import { FallbackProps } from './ErrorBoundary.types';
import styles from './ErrorBoundary.module.css';

const ErrorIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const DefaultErrorFallback = ({ error, errorInfo, resetError }: FallbackProps) => {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className={styles.defaultFallback} role="alert">
      <div className={styles.icon}>
        <ErrorIcon />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.message}>
          An unexpected error occurred. Please try refreshing the page.
        </p>

        {isDevelopment && (
          <details className={styles.details}>
            <summary>Error details (development only)</summary>
            <pre className={styles.errorStack}>
              <strong>Error:</strong> {error.message}
              {errorInfo?.componentStack && (
                <>
                  {'\n\n'}
                  <strong>Component Stack:</strong>
                  {errorInfo.componentStack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>

      <button
        type="button"
        onClick={resetError}
        className={styles.resetButton}
      >
        Try again
      </button>
    </div>
  );
};

DefaultErrorFallback.displayName = 'DefaultErrorFallback';

import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { Button } from '../Button';
import type { FallbackProps } from './ErrorBoundary.types';
import styles from './ErrorBoundary.module.css';

const ErrorIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
    className={styles.icon}
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
    <div className={styles.container} role="alert">
      <Stack spacing={4} align="center">
        <div className={styles.illustration} aria-hidden="true">
          <ErrorIcon />
        </div>

        <Stack spacing={2} align="center">
          <Typography variant="h2" weight="semibold">
            Something went wrong
          </Typography>

          <Typography variant="body" className={styles.description}>
            An unexpected error occurred. Please try refreshing the page.
          </Typography>
        </Stack>

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

        <Button onClick={resetError} variant="primary" size="md">
          Try again
        </Button>
      </Stack>
    </div>
  );
};

DefaultErrorFallback.displayName = 'DefaultErrorFallback';

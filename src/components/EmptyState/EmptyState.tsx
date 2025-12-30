import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { EmptyStateProps } from './EmptyState.types';
import styles from './EmptyState.module.css';

export function EmptyState({
  illustration,
  title,
  description,
  action,
  size = 'md',
  className = '',
}: EmptyStateProps) {
  const spacingMap = {
    sm: 2,
    md: 4,
    lg: 6,
  };

  const illustrationSizeClass = {
    sm: styles.illustrationSm,
    md: styles.illustrationMd,
    lg: styles.illustrationLg,
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <Stack spacing={spacingMap[size]} align="center">
        {illustration && (
          <div
            className={`${styles.illustration} ${illustrationSizeClass[size]}`}
            aria-hidden="true"
          >
            {illustration}
          </div>
        )}

        <Stack spacing={2} align="center">
          <Typography variant="h2" weight="semibold">
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body"
              className={styles.description}
            >
              {description}
            </Typography>
          )}
        </Stack>

        {action && (
          <div>
            {action}
          </div>
        )}
      </Stack>
    </div>
  );
}

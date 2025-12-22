import { cn } from '@/utils/classnames';
import { ProgressProps } from './Progress.types';
import styles from './Progress.module.css';

export const Progress = ({
  value,
  variant = 'linear',
  size = 'md',
  showLabel = false,
  label,
  className,
  'aria-label': ariaLabel,
}: ProgressProps) => {
  // Clamp value between 0 and 100
  const clampedValue = value !== undefined ? Math.max(0, Math.min(100, value)) : undefined;
  const isIndeterminate = clampedValue === undefined;

  // Determine label text
  const labelText = label || (showLabel && clampedValue !== undefined ? `${Math.round(clampedValue)}%` : null);

  // Common ARIA attributes
  const ariaProps = {
    role: 'progressbar',
    'aria-label': ariaLabel,
    ...(clampedValue !== undefined && {
      'aria-valuenow': clampedValue,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
    }),
  };

  if (variant === 'circular') {
    // Circular progress with SVG
    const size_px = size === 'sm' ? 32 : size === 'lg' ? 64 : 48;
    const strokeWidth = size === 'sm' ? 3 : size === 'lg' ? 5 : 4;
    const radius = (size_px - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = isIndeterminate
      ? 0
      : circumference - (clampedValue / 100) * circumference;

    return (
      <div
        className={cn(
          styles.progress,
          isIndeterminate && styles.circularIndeterminate,
          className
        )}
      >
        <svg
          className={cn(styles.circularSvg, styles.circular, styles[size])}
          viewBox={`0 0 ${size_px} ${size_px}`}
          {...ariaProps}
        >
          {/* Background circle */}
          <circle
            className={styles.circularTrack}
            cx={size_px / 2}
            cy={size_px / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            className={styles.circularFill}
            cx={size_px / 2}
            cy={size_px / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        {labelText && <div className={styles.label}>{labelText}</div>}
      </div>
    );
  }

  // Linear progress
  return (
    <div
      className={cn(
        styles.progress,
        styles.linear,
        styles[size],
        styles.fullWidth,
        className
      )}
      {...ariaProps}
    >
      <div className={cn(styles.linearTrack, styles[size], isIndeterminate && styles.linearIndeterminate)}>
        <div
          className={styles.linearFill}
          style={{ width: isIndeterminate ? undefined : `${clampedValue}%` }}
        />
      </div>
      {labelText && <div className={styles.label}>{labelText}</div>}
    </div>
  );
};

Progress.displayName = 'Progress';

import type { CSSProperties } from 'react';
import type { SkeletonProps } from './Skeleton.types';
import styles from './Skeleton.module.css';

export function Skeleton({
  variant = 'text',
  width,
  height,
  borderRadius = '3px',
  lines = 1,
  disableAnimation = false,
  className = '',
  ...restProps
}: SkeletonProps) {
  const formatDimension = (value: string | number | undefined): string | undefined => {
    if (value === undefined) {return undefined;}
    return typeof value === 'number' ? `${value}px` : value;
  };

  const style: CSSProperties = {
    width: formatDimension(width),
    height: formatDimension(height),
    borderRadius: formatDimension(borderRadius),
  };

  // Add random width variation for text variant
  const getTextWidth = (index: number): string | undefined => {
    if (variant !== 'text' || width !== undefined) {return undefined;}
    const widths = ['100%', '95%', '98%', '92%', '97%'];
    return widths[index % widths.length];
  };

  const skeletonClasses = [
    styles.skeleton,
    styles[variant],
    disableAnimation && styles.noAnimation,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (lines > 1) {
    return (
      <div className={styles.container}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={skeletonClasses}
            style={{
              ...style,
              width: getTextWidth(index) || style.width,
              marginBottom: index < lines - 1 ? '0.5em' : undefined,
            }}
            role="status"
            aria-busy="true"
            aria-live="polite"
            aria-label="Loading"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={skeletonClasses}
      style={style}
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading"
      {...restProps}
    />
  );
}

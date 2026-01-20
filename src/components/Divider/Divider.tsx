import { cn } from '@/utils/classnames';
import type { DividerProps } from './Divider.types';
import styles from './Divider.module.css';

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  labelPosition = 'center',
  className,
  style,
}: DividerProps) {
  // If no label, use semantic <hr> element
  if (!label) {
    return (
      <hr
        className={cn(
          styles.divider,
          styles[orientation],
          styles[variant],
          className
        )}
        style={style}
        aria-orientation={orientation}
      />
    );
  }

  // For vertical dividers with labels, labels are not supported
  if (orientation === 'vertical') {
    console.warn('Divider: Labels are not supported for vertical orientation. Rendering without label.');
    return (
      <div
        className={cn(
          styles.divider,
          styles[orientation],
          styles[variant],
          className
        )}
        style={style}
        role="separator"
        aria-orientation={orientation}
      />
    );
  }

  // Horizontal divider with label
  return (
    <div
      className={cn(
        styles.dividerWithLabel,
        styles[orientation],
        styles[labelPosition],
        className
      )}
      style={style}
      role="separator"
      aria-orientation={orientation}
    >
      <div className={cn(styles.line, styles[variant])} />
      <span className={styles.label}>{label}</span>
      <div className={cn(styles.line, styles[variant])} />
    </div>
  );
}

Divider.displayName = 'Divider';

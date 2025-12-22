import { cn } from '@/utils/classnames';
import { BadgeProps } from './Badge.types';
import styles from './Badge.module.css';

export const Badge = ({
  children,
  content,
  variant = 'primary',
  size = 'md',
  dot = false,
  position = 'top-right',
  max = 99,
  className,
}: BadgeProps) => {
  // Calculate display content
  const displayContent = dot
    ? undefined
    : typeof content === 'number' && content > max
    ? `${max}+`
    : content;

  // Position class mapping
  const getPositionClass = () => {
    switch (position) {
      case 'top-right':
        return styles.topRight;
      case 'top-left':
        return styles.topLeft;
      case 'bottom-right':
        return styles.bottomRight;
      case 'bottom-left':
        return styles.bottomLeft;
      default:
        return styles.topRight;
    }
  };

  const badgeElement = (
    <span
      className={cn(
        styles.badge,
        styles[variant],
        styles[size],
        dot && styles.dot,
        children ? styles.positioned : styles.standalone,
        className
      )}
    >
      {displayContent}
    </span>
  );

  // If wrapping children, add wrapper
  if (children) {
    return (
      <span className={cn(styles.wrapper, getPositionClass())}>
        {children}
        {badgeElement}
      </span>
    );
  }

  // Standalone badge
  return badgeElement;
};

Badge.displayName = 'Badge';

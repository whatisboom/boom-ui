import { cn } from '@/utils/classnames';
import { BadgeProps } from './Badge.types';
import styles from './Badge.module.css';

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        styles.badge,
        styles[variant],
        styles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

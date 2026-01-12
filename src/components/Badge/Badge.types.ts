import type { ReactNode } from 'react';
import type { Size } from '@/types';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface BadgeProps {
  /**
   * Badge content (text or number)
   */
  children: ReactNode;

  /**
   * Visual variant
   * @default 'primary'
   */
  variant?: BadgeVariant;

  /**
   * Size of the badge
   * @default 'md'
   */
  size?: Size;

  /**
   * Additional CSS class name
   */
  className?: string;
}

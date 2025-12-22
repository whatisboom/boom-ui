import { ReactNode } from 'react';
import { Size } from '@/types';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface BadgeProps {
  /**
   * Content to wrap (if provided, badge will be positioned relative to this)
   */
  children?: ReactNode;

  /**
   * Badge content (number or text)
   */
  content?: string | number;

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
   * Show as a dot instead of content
   * @default false
   */
  dot?: boolean;

  /**
   * Position when wrapping children
   * @default 'top-right'
   */
  position?: BadgePosition;

  /**
   * Maximum number to display (shows "max+" when exceeded)
   * @default 99
   */
  max?: number;

  /**
   * Additional CSS class name
   */
  className?: string;
}

import type { Size } from '@/types';

export type ProgressVariant = 'linear' | 'circular';

export interface ProgressProps {
  /**
   * The progress value (0-100). If undefined, shows indeterminate state
   */
  value?: number;

  /**
   * The visual variant of the progress indicator
   * @default 'linear'
   */
  variant?: ProgressVariant;

  /**
   * Size of the progress indicator
   * @default 'md'
   */
  size?: Size;

  /**
   * Whether to show the percentage label
   * @default false
   */
  showLabel?: boolean;

  /**
   * Custom label to display instead of percentage
   */
  label?: string;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;
}

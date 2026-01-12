import type { ReactNode } from 'react';

export interface EmptyStateProps {
  /**
   * Illustration or icon element
   */
  illustration?: ReactNode;

  /**
   * Title text (required)
   */
  title: string;

  /**
   * Optional description text
   */
  description?: string;

  /**
   * Optional action element (typically a Button)
   */
  action?: ReactNode;

  /**
   * Controls sizing and spacing
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS class name
   */
  className?: string;
}

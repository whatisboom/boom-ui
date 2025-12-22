import { ReactNode, ReactElement } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /**
   * Tooltip content
   */
  content: ReactNode;

  /**
   * Element to attach tooltip to (must be a single React element)
   */
  children: ReactElement;

  /**
   * Placement of tooltip relative to child
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * Delay in milliseconds before showing tooltip
   * @default 0
   */
  delay?: number;

  /**
   * Distance from the child element in pixels
   * @default 8
   */
  offset?: number;

  /**
   * Additional CSS class name
   */
  className?: string;
}

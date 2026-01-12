import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { Size, Variant, MotionProps } from '@/types';

// Omit conflicting event handlers that Framer Motion overrides
type ButtonHTMLProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onAnimationStart'
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragStart'
>;

export interface ButtonProps extends ButtonHTMLProps, MotionProps {
  /**
   * Visual variant
   */
  variant?: Variant;
  /**
   * Size variant
   */
  size?: Size;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Icon to display before children
   */
  leftIcon?: ReactNode;
  /**
   * Icon to display after children
   */
  rightIcon?: ReactNode;
}

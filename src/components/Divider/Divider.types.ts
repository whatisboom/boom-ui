import type { ReactNode, CSSProperties } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerLabelPosition = 'left' | 'center' | 'right';

export interface DividerBaseProps {
  /**
   * Orientation of the divider
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;
  /**
   * Style variant for the divider line
   * @default 'solid'
   */
  variant?: DividerVariant;
  /**
   * Optional text or icon label
   */
  label?: ReactNode;
  /**
   * Position of the label (only applies to horizontal orientation)
   * @default 'center'
   */
  labelPosition?: DividerLabelPosition;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom inline styles
   */
  style?: CSSProperties;
}

export type DividerProps = DividerBaseProps;

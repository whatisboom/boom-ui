export interface SkeletonProps {
  /**
   * Visual variant of the skeleton
   * @default 'rect'
   */
  variant?: 'text' | 'circle' | 'rect' | 'custom';

  /**
   * Width of skeleton (CSS value or number in px)
   */
  width?: string | number;

  /**
   * Height of skeleton (CSS value or number in px)
   */
  height?: string | number;

  /**
   * Border radius (CSS value or number in px)
   */
  borderRadius?: string | number;

  /**
   * Number of skeleton lines to render
   * @default 1
   */
  lines?: number;

  /**
   * Disable shimmer animation
   * @default false
   */
  disableAnimation?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}

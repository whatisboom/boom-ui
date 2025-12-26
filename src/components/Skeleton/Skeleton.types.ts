import { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant of the skeleton
   * @default 'text'
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
   * @default '3px'
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

export interface SkeletonTextProps {
  /**
   * Number of text lines
   * @default 3
   */
  lines?: number;

  /**
   * Width of the last line (for realistic paragraph ending)
   * @default '75%'
   */
  lastLineWidth?: string;

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

export interface SkeletonAvatarProps {
  /**
   * Avatar size (matches Avatar component)
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Show text lines beside avatar
   * @default false
   */
  withText?: boolean;

  /**
   * Number of text lines when withText is true
   * @default 2
   */
  textLines?: number;

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

export interface SkeletonCardProps {
  /**
   * Card variant (matches Card component)
   * @default 'raised'
   */
  variant?: 'flat' | 'raised' | 'elevated';

  /**
   * Show image placeholder at top
   * @default false
   */
  hasImage?: boolean;

  /**
   * Show action button placeholders
   * @default false
   */
  hasActions?: boolean;

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

import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react';

/**
 * Common size variants
 */
export type Size = 'sm' | 'md' | 'lg';

/**
 * Common color variants
 */
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

/**
 * Polymorphic component props
 * Allows components to render as different HTML elements
 */
export type PolymorphicProps<E extends ElementType = ElementType> = {
  as?: E;
} & ComponentPropsWithoutRef<E>;

/**
 * Props with children
 */
export type PropsWithChildrenAndClassName = PropsWithChildren<{
  className?: string;
}>;

/**
 * Text alignment
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Animation preferences
 */
export interface MotionProps {
  /**
   * Disable animations (respects prefers-reduced-motion)
   */
  disableAnimation?: boolean;
}

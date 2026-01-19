import type { ElementType, CSSProperties, ReactNode } from 'react';
import type { PolymorphicProps } from '@/types';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerBaseProps {
  /**
   * Maximum width variant
   * - sm: 640px
   * - md: 768px
   * - lg: 1024px
   * - xl: 1280px
   * - full: 100%
   * @default 'lg'
   */
  size?: ContainerSize;
  /**
   * Padding (uses spacing scale 0-12)
   * @default 4
   */
  padding?: number;
  /**
   * Center content horizontally
   * @default true
   */
  centered?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom inline styles
   */
  style?: CSSProperties;
  /**
   * Child content
   */
  children?: ReactNode;
}

export type ContainerProps<E extends ElementType = 'div'> = ContainerBaseProps & PolymorphicProps<E>;

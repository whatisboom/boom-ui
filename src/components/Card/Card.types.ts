import { ElementType, CSSProperties, ReactNode } from 'react';
import { PolymorphicProps } from '@/types';

export type CardVariant = 'flat' | 'raised' | 'elevated';

export interface CardBaseProps {
  /**
   * Visual variant for elevation/shadow
   */
  variant?: CardVariant;
  /**
   * Padding (uses spacing scale 0-12)
   */
  padding?: number;
  /**
   * Enable hover lift and shadow effects
   */
  hoverable?: boolean;
  /**
   * Disable Framer Motion animations
   */
  disableAnimation?: boolean;
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

export type CardProps<E extends ElementType = 'div'> = CardBaseProps & PolymorphicProps<E>;

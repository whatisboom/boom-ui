import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react';

export interface NavOwnProps {
  /**
   * Navigation items
   */
  children: ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Orientation of the navigation
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Spacing between nav items (spacing token)
   * @default 1
   */
  spacing?: number;
}

export type NavProps<E extends ElementType = 'nav'> = NavOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof NavOwnProps | 'as'>;

export interface NavItemOwnProps {
  /**
   * Navigation item content
   */
  children: ReactNode;

  /**
   * Whether this item is currently active
   */
  isActive?: boolean;

  /**
   * Optional icon to display before the label
   */
  icon?: ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Click handler
   */
  onClick?: () => void;
}

export type NavItemProps<E extends ElementType = 'a'> = NavItemOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof NavItemOwnProps | 'as'>;

export type NavBaseProps = NavOwnProps;
export type NavItemBaseProps = NavItemOwnProps;

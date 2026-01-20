import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react';

export interface BreadcrumbsOwnProps {
  /**
   * Breadcrumb items
   */
  children: ReactNode;

  /**
   * Custom separator between items
   * @default '/'
   */
  separator?: ReactNode;

  /**
   * Maximum number of items to display (rest collapsed into ellipsis). Minimum effective value is 3.
   */
  maxItems?: number;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Aria label for navigation
   * @default 'breadcrumb'
   */
  'aria-label'?: string;
}

export type BreadcrumbsProps<E extends ElementType = 'nav'> = BreadcrumbsOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof BreadcrumbsOwnProps | 'as'>;

export interface BreadcrumbItemOwnProps {
  /**
   * Item content
   */
  children: ReactNode;

  /**
   * Link href. If not provided, renders as a non-interactive span element.
   */
  href?: string;

  /**
   * Whether this is the current page
   */
  current?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Click handler
   */
  onClick?: () => void;
}

export type BreadcrumbItemProps<E extends ElementType = 'a'> = BreadcrumbItemOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof BreadcrumbItemOwnProps | 'as'>;

export type BreadcrumbsBaseProps = BreadcrumbsOwnProps;
export type BreadcrumbItemBaseProps = BreadcrumbItemOwnProps;

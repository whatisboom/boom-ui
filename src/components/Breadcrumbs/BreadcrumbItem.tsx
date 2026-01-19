import type { ElementType } from 'react';
import { cn } from '@/utils/classnames';
import type { BreadcrumbItemProps } from './Breadcrumbs.types';
import styles from './Breadcrumbs.module.css';

export function BreadcrumbItem<E extends ElementType = 'a'>({
  children,
  href,
  current = false,
  className,
  as,
  ...rest
}: BreadcrumbItemProps<E>) {
  const Component = as || (href ? 'a' : 'span');

  const itemClassName = cn(
    styles.item,
    current && styles.current,
    !href && !current && styles.plain,
    className
  );

  return (
    <Component
      href={href}
      className={itemClassName}
      aria-current={current ? 'page' : undefined}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Component>
  );
}

BreadcrumbItem.displayName = 'BreadcrumbItem';

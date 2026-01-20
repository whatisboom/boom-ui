import type { ElementType } from 'react';
import { Children, Fragment } from 'react';
import { cn } from '@/utils/classnames';
import type { BreadcrumbsProps } from './Breadcrumbs.types';
import styles from './Breadcrumbs.module.css';

export function Breadcrumbs<E extends ElementType = 'nav'>({
  children,
  separator = '/',
  maxItems,
  className,
  'aria-label': ariaLabel = 'breadcrumb',
  as,
  ...rest
}: BreadcrumbsProps<E>) {
  const Component = as || 'nav';
  const childrenArray = Children.toArray(children);
  const totalItems = childrenArray.length;

  // Determine which items to show
  let displayItems = childrenArray;

  if (maxItems && totalItems > maxItems) {
    // Ensure at least first and last items are shown (minimum effective maxItems = 3)
    const effectiveMaxItems = Math.max(maxItems, 3);
    const itemsToShow = effectiveMaxItems - 1; // Reserve one spot for ellipsis
    const firstItems = childrenArray.slice(0, Math.ceil(itemsToShow / 2));
    const lastItems = childrenArray.slice(
      totalItems - Math.floor(itemsToShow / 2),
      totalItems
    );

    displayItems = [
      ...firstItems,
      <span key="ellipsis" className={styles.ellipsis} aria-hidden="true">
        …
      </span>,
      ...lastItems,
    ];
  }

  return (
    <Component
      className={cn(styles.breadcrumbs, className)}
      aria-label={ariaLabel}
      {...(rest as Record<string, unknown>)}
    >
      <ol className={styles.list}>
        {displayItems.map((child, index) => (
          <Fragment key={index}>
            <li className={styles.listItem}>{child}</li>
            {index < displayItems.length - 1 && (
              <li className={styles.separator} aria-hidden="true">
                {separator}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </Component>
  );
}

Breadcrumbs.displayName = 'Breadcrumbs';

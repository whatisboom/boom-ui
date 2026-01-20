import type { ElementType, ReactNode } from 'react';
import React, { Children, Fragment } from 'react';
import { cn } from '@/utils/classnames';
import type { BreadcrumbsProps } from './Breadcrumbs.types';
import styles from './Breadcrumbs.module.css';

/**
 * Generates a stable key for a breadcrumb item based on its properties
 */
function generateItemKey(child: ReactNode, index: number): string | number {
  if (React.isValidElement(child) && child.key != null) {
    // Use explicit key if provided
    return child.key;
  }

  if (
    React.isValidElement(child) &&
    typeof child.props === 'object' &&
    child.props !== null &&
    'href' in child.props &&
    typeof child.props.href === 'string'
  ) {
    // Generate key from href + index for stability
    return `${child.props.href}-${index}`;
  }

  // Fall back to index-based key (only for non-link items like ellipsis)
  return `item-${index}`;
}

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
          <Fragment key={generateItemKey(child, index)}>
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

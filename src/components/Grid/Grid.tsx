import type { ElementType } from 'react';
import { Box } from '@/components/Box';
import type { GridProps } from './Grid.types';
import styles from './Grid.module.css';
import { cn } from '@/utils/classnames';

export function Grid<E extends ElementType = 'div'>({
  columns,
  minColumnWidth,
  gap = 4,
  autoFit = false,
  autoFill = false,
  className,
  style,
  as,
  children,
  ...rest
}: GridProps<E>) {
  // Validate props
  if (columns && minColumnWidth) {
    console.warn('Grid: Cannot use both "columns" and "minColumnWidth" props. Using "columns".');
  }

  if ((autoFit || autoFill) && !minColumnWidth) {
    console.warn('Grid: "autoFit" and "autoFill" only work with "minColumnWidth". Ignoring.');
  }

  // Build grid-template-columns value
  let gridTemplateColumns: string;

  if (columns) {
    // Fixed columns
    gridTemplateColumns = `repeat(${columns}, 1fr)`;
  } else if (minColumnWidth) {
    // Responsive grid with minimum column width
    const repeatMode = autoFit ? 'auto-fit' : autoFill ? 'auto-fill' : 'auto-fit';
    gridTemplateColumns = `repeat(${repeatMode}, minmax(${minColumnWidth}, 1fr))`;
  } else {
    // Default: single column
    gridTemplateColumns = '1fr';
  }

  return (
    <Box
      as={as as ElementType}
      display="grid"
      gap={gap}
      className={cn(styles.grid, className)}
      style={{
        gridTemplateColumns,
        ...style,
      }}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Box>
  );
}

Grid.displayName = 'Grid';

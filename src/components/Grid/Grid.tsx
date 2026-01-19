import type { ElementType, CSSProperties } from 'react';
import { cn } from '@/utils/classnames';
import type { GridProps, ResponsiveValue } from './Grid.types';
import styles from './Grid.module.css';

// Helper function to check if a value is a responsive object
function isResponsiveValue<T>(value: T | ResponsiveValue<T>): value is ResponsiveValue<T> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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
  const Component = as || 'div';

  // Validate props
  if (columns && minColumnWidth) {
    console.warn('Grid: Cannot use both "columns" and "minColumnWidth" props. Using "columns".');
  }

  if ((autoFit || autoFill) && !minColumnWidth) {
    console.warn('Grid: "autoFit" and "autoFill" only work with "minColumnWidth". Ignoring.');
  }

  // Determine if we're using responsive values
  const hasResponsiveColumns = isResponsiveValue(columns);
  const hasResponsiveGap = isResponsiveValue(gap);

  // Build inline styles
  const gridStyle: CSSProperties = {
    display: 'grid',
    ...style,
  };

  // Handle non-responsive columns
  if (!hasResponsiveColumns) {
    const columnValue = columns;
    let gridTemplateColumns: string;

    if (typeof columnValue === 'number') {
      gridTemplateColumns = `repeat(${columnValue}, 1fr)`;
    } else if (minColumnWidth) {
      const repeatMode = autoFit ? 'auto-fit' : autoFill ? 'auto-fill' : 'auto-fit';
      gridTemplateColumns = `repeat(${repeatMode}, minmax(${minColumnWidth}, 1fr))`;
    } else {
      gridTemplateColumns = '1fr';
    }

    gridStyle.gridTemplateColumns = gridTemplateColumns;
  }

  // Handle non-responsive gap
  if (!hasResponsiveGap) {
    const gapValue = gap;
    gridStyle.gap = `var(--boom-spacing-${gapValue})`;
  }

  // Build className with responsive classes
  const responsiveColumns = hasResponsiveColumns && typeof columns === 'object' ? columns : null;
  const responsiveGap = hasResponsiveGap && typeof gap === 'object' ? gap : null;

  const gridClassName = cn(
    styles.grid,
    // Add responsive column classes
    responsiveColumns?.base !== undefined && styles[`cols-base-${responsiveColumns.base}`],
    responsiveColumns?.sm !== undefined && styles[`cols-sm-${responsiveColumns.sm}`],
    responsiveColumns?.md !== undefined && styles[`cols-md-${responsiveColumns.md}`],
    responsiveColumns?.lg !== undefined && styles[`cols-lg-${responsiveColumns.lg}`],
    responsiveColumns?.xl !== undefined && styles[`cols-xl-${responsiveColumns.xl}`],
    // Add responsive gap classes
    responsiveGap?.base !== undefined && styles[`gap-base-${responsiveGap.base}`],
    responsiveGap?.sm !== undefined && styles[`gap-sm-${responsiveGap.sm}`],
    responsiveGap?.md !== undefined && styles[`gap-md-${responsiveGap.md}`],
    responsiveGap?.lg !== undefined && styles[`gap-lg-${responsiveGap.lg}`],
    responsiveGap?.xl !== undefined && styles[`gap-xl-${responsiveGap.xl}`],
    className
  );

  return (
    <Component
      className={gridClassName}
      style={gridStyle}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Component>
  );
}

Grid.displayName = 'Grid';

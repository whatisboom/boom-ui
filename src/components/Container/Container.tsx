import type { ElementType } from 'react';
import { cn } from '@/utils/classnames';
import type { ContainerProps } from './Container.types';
import styles from './Container.module.css';

export function Container<E extends ElementType = 'div'>({
  as,
  size = 'lg',
  padding = 4,
  centered = true,
  className,
  style,
  children,
  ...props
}: ContainerProps<E>) {
  const Component = as || 'div';

  const containerStyle = {
    padding: `var(--boom-spacing-${padding})`,
    ...style,
  };

  const containerClassName = cn(
    styles.container,
    styles[size],
    centered && styles.centered,
    className
  );

  return (
    <Component className={containerClassName} style={containerStyle} {...props}>
      {children}
    </Component>
  );
}

Container.displayName = 'Container';

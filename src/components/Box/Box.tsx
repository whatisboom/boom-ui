import type { ElementType, CSSProperties } from 'react';
import { cn } from '@/utils/classnames';
import type { BoxProps } from './Box.types';
import styles from './Box.module.css';

export function Box<E extends ElementType = 'div'>({
  as,
  display,
  flexDirection,
  alignItems,
  justifyContent,
  gap,
  padding,
  margin,
  width,
  height,
  className,
  style,
  children,
  ...props
}: BoxProps<E>) {
  const Component = as || 'div';

  const spacingToVar = (value: number) => `var(--boom-spacing-${value})`;

  const boxStyle: CSSProperties = {
    ...(display && { display }),
    ...(flexDirection && { flexDirection }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(gap !== undefined && { gap: spacingToVar(gap) }),
    ...(padding !== undefined && { padding: spacingToVar(padding) }),
    ...(margin !== undefined && { margin: spacingToVar(margin) }),
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...style,
  };

  return (
    <Component className={cn(styles.box, className)} style={boxStyle} {...props}>
      {children}
    </Component>
  );
}

Box.displayName = 'Box';

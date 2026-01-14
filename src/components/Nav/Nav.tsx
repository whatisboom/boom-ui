import type { ElementType } from 'react';
import { Stack } from '@/components/Stack';
import type { NavProps } from './Nav.types';
import styles from './Nav.module.css';
import { cn } from '@/utils/classnames';

export function Nav<E extends ElementType = 'nav'>({
  children,
  className,
  orientation = 'vertical',
  spacing = 1,
  as,
  ...rest
}: NavProps<E>) {
  return (
    <Stack
      as={as as ElementType}
      direction={orientation === 'vertical' ? 'column' : 'row'}
      spacing={spacing}
      className={cn(styles.nav, className)}
      role="navigation"
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Stack>
  );
}

Nav.displayName = 'Nav';

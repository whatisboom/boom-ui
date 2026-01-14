import type { ElementType } from 'react';
import { Box } from '@/components/Box';
import { Stack } from '@/components/Stack';
import type { NavItemProps } from './Nav.types';
import styles from './NavItem.module.css';
import { cn } from '@/utils/classnames';

export function NavItem<E extends ElementType = 'a'>({
  children,
  isActive = false,
  icon,
  className,
  as,
  ...rest
}: NavItemProps<E>) {
  return (
    <Box
      as={as as ElementType}
      className={cn(
        styles.navItem,
        isActive && styles.navItemActive,
        className
      )}
      aria-current={isActive ? 'page' : undefined}
      {...(rest as Record<string, unknown>)}
    >
      {icon || children ? (
        <Stack direction="row" spacing={2} align="center">
          {icon && <span className={styles.navItemIcon}>{icon}</span>}
          <span className={styles.navItemLabel}>{children}</span>
        </Stack>
      ) : (
        children
      )}
    </Box>
  );
}

NavItem.displayName = 'NavItem';

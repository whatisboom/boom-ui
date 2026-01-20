import type { SidebarNavProps } from './Sidebar.types';
import { cn } from '@/utils/classnames';
import styles from './Sidebar.module.css';

export function SidebarNav({ children, className }: SidebarNavProps) {
  return (
    <ul className={cn(styles.nav, className)}>
      {children}
    </ul>
  );
}

SidebarNav.displayName = 'Sidebar.Nav';

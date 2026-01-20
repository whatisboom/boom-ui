import { useSidebarContext } from './SidebarContext';
import type { SidebarHeaderProps } from './Sidebar.types';
import { cn } from '@/utils/classnames';
import styles from './Sidebar.module.css';

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  const { collapsed } = useSidebarContext();

  return (
    <div className={cn(styles.header, collapsed && styles.collapsed, className)}>
      {children}
    </div>
  );
}

SidebarHeader.displayName = 'Sidebar.Header';

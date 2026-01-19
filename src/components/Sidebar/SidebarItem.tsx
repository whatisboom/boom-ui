import { useSidebarContext } from './SidebarContext';
import type { SidebarItemProps } from './Sidebar.types';
import { cn } from '@/utils/classnames';
import styles from './Sidebar.module.css';

export function SidebarItem({
  icon,
  label,
  isActive = false,
  disabled = false,
  onClick,
  href,
  badge,
  className,
}: SidebarItemProps) {
  const { collapsed, close, isMobile } = useSidebarContext();

  const handleClick = () => {
    if (disabled) {
      return;
    }
    onClick?.();
    // Close sidebar on mobile when item is clicked
    if (isMobile) {
      close();
    }
  };

  const content = (
    <>
      {icon && <span className={styles.itemIcon}>{icon}</span>}
      <span className={cn(styles.itemLabel, collapsed && styles.collapsed)}>
        {label}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className={cn(styles.itemBadge, collapsed && styles.collapsed)}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </>
  );

  const itemClassName = cn(
    styles.item,
    isActive && styles.active,
    disabled && styles.disabled,
    collapsed && styles.collapsed,
    className
  );

  return (
    <li className={styles.navItem}>
      {href ? (
        <a
          href={href}
          className={itemClassName}
          onClick={disabled ? undefined : handleClick}
          aria-current={isActive ? 'page' : undefined}
          aria-disabled={disabled}
          title={collapsed ? label : undefined}
        >
          {content}
        </a>
      ) : (
        <button
          className={itemClassName}
          onClick={handleClick}
          disabled={disabled}
          aria-current={isActive ? 'page' : undefined}
          title={collapsed ? label : undefined}
        >
          {content}
        </button>
      )}
    </li>
  );
}

SidebarItem.displayName = 'Sidebar.Item';

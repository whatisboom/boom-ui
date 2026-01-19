import { useEffect, useRef, useState } from 'react';
import { useMenuContext } from './MenuContext';
import type { MenuItemProps } from './Menu.types';
import { cn } from '@/utils/classnames';
import styles from './Menu.module.css';

let itemIndexCounter = 0;

export const MenuItem = ({
  children,
  onSelect,
  disabled = false,
  variant = 'default',
  icon,
  shortcut,
  className,
}: MenuItemProps) => {
  const { closeMenu, registerItem, unregisterItem, setItemCount } = useMenuContext();
  const itemRef = useRef<HTMLButtonElement>(null);
  const [itemIndex] = useState(() => itemIndexCounter++);

  useEffect(() => {
    if (itemRef.current) {
      registerItem(itemIndex, itemRef.current);
      setItemCount((prev: number) => prev + 1);
    }

    return () => {
      unregisterItem(itemIndex);
      setItemCount((prev: number) => prev - 1);
    };
  }, [itemIndex, registerItem, unregisterItem, setItemCount]);

  const handleClick = () => {
    if (disabled) {return;}
    onSelect?.();
    closeMenu();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      ref={itemRef}
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        styles.menuItem,
        styles[variant],
        disabled && styles.disabled,
        className
      )}
      aria-disabled={disabled}
    >
      {icon && <span className={styles.menuItemIcon}>{icon}</span>}
      <span className={styles.menuItemLabel}>{children}</span>
      {shortcut && <span className={styles.menuItemShortcut}>{shortcut}</span>}
    </button>
  );
};

MenuItem.displayName = 'Menu.Item';

// Reset counter when component unmounts to prevent counter overflow
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    itemIndexCounter = 0;
  });
}

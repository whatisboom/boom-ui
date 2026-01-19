import type { MenuSeparatorProps } from './Menu.types';
import { cn } from '@/utils/classnames';
import styles from './Menu.module.css';

export const MenuSeparator = ({ className }: MenuSeparatorProps) => {
  return (
    <div
      role="separator"
      className={cn(styles.menuSeparator, className)}
      aria-orientation="horizontal"
    />
  );
};

MenuSeparator.displayName = 'Menu.Separator';

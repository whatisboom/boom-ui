import { HeaderProps } from './Header.types';
import { cn } from '@/utils/classnames';
import styles from './Header.module.css';

export function Header({ logo, children, sticky = false, className }: HeaderProps) {
  return (
    <header className={cn(styles.header, sticky && styles.sticky, className)}>
      {logo && <div className={styles.logo}>{logo}</div>}
      <div className={styles.content}>{children}</div>
    </header>
  );
}

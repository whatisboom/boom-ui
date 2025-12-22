import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationProps, NavItem } from './Navigation.types';
import { cn } from '@/utils/classnames';
import styles from './Navigation.module.css';

function NavItemComponent({ item }: { item: NavItem }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const hasDropdown = item.dropdown && item.dropdown.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasDropdown) {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    } else if (item.onClick) {
      e.preventDefault();
      item.onClick();
    }
  };

  const content = (
    <>
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      <span>{item.label}</span>
      {item.badge !== undefined && (
        <span className={styles.badge}>{item.badge}</span>
      )}
      {hasDropdown && (
        <svg
          className={cn(styles.dropdownIcon, isDropdownOpen && styles.open)}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M6 8L2 4h8L6 8z" />
        </svg>
      )}
    </>
  );

  const className = cn(
    item.href ? styles.navLink : styles.navButton,
    item.isActive && styles.active
  );

  return (
    <li className={styles.navItem}>
      {item.href ? (
        <a
          href={item.href}
          className={className}
          onClick={hasDropdown ? handleClick : undefined}
          aria-current={item.isActive ? 'page' : undefined}
          aria-expanded={hasDropdown ? isDropdownOpen : undefined}
          aria-haspopup={hasDropdown ? 'menu' : undefined}
        >
          {content}
        </a>
      ) : (
        <button
          className={className}
          onClick={handleClick}
          aria-expanded={hasDropdown ? isDropdownOpen : undefined}
          aria-haspopup={hasDropdown ? 'menu' : undefined}
        >
          {content}
        </button>
      )}

      {hasDropdown && (
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className={styles.dropdown}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ul className={styles.dropdownList} role="menu">
                {item.dropdown!.map((dropdownItem, idx) => (
                  <li key={idx} className={styles.dropdownItem} role="none">
                    {dropdownItem.href ? (
                      <a
                        href={dropdownItem.href}
                        className={cn(
                          styles.navLink,
                          dropdownItem.isActive && styles.active
                        )}
                        onClick={
                          dropdownItem.onClick
                            ? (e) => {
                                e.preventDefault();
                                dropdownItem.onClick!();
                              }
                            : undefined
                        }
                        role="menuitem"
                      >
                        {dropdownItem.icon && (
                          <span className={styles.icon}>{dropdownItem.icon}</span>
                        )}
                        <span>{dropdownItem.label}</span>
                        {dropdownItem.badge !== undefined && (
                          <span className={styles.badge}>{dropdownItem.badge}</span>
                        )}
                      </a>
                    ) : (
                      <button
                        className={styles.navButton}
                        onClick={dropdownItem.onClick}
                        role="menuitem"
                      >
                        {dropdownItem.icon && (
                          <span className={styles.icon}>{dropdownItem.icon}</span>
                        )}
                        <span>{dropdownItem.label}</span>
                        {dropdownItem.badge !== undefined && (
                          <span className={styles.badge}>{dropdownItem.badge}</span>
                        )}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

export function Navigation({
  items,
  orientation = 'horizontal',
  className,
}: NavigationProps) {
  return (
    <nav className={cn(styles.nav, styles[orientation], className)}>
      <ul className={styles.navList}>
        {items.map((item, index) => (
          <NavItemComponent key={index} item={item} />
        ))}
      </ul>
    </nav>
  );
}

import { createContext, useContext, useState, useRef, useEffect, useMemo } from 'react';
import type {
  NotificationMenuProps,
  NotificationMenuTriggerProps,
  NotificationMenuPanelProps,
  NotificationMenuItemProps,
} from './NotificationMenu.types';
import { Popover } from '../primitives/Popover';
import styles from './NotificationMenu.module.css';

interface NotificationMenuContextValue {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const NotificationMenuContext = createContext<NotificationMenuContextValue | undefined>(
  undefined
);

function useNotificationMenu() {
  const context = useContext(NotificationMenuContext);
  if (!context) {
    throw new Error(
      'NotificationMenu components must be used within NotificationMenu'
    );
  }
  return context;
}

export function NotificationMenu({ children }: NotificationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const value = useMemo(
    () => ({ isOpen, setIsOpen, triggerRef }),
    [isOpen]
  );

  return (
    <NotificationMenuContext.Provider value={value}>
      {children}
    </NotificationMenuContext.Provider>
  );
}

export function NotificationMenuTrigger({
  unreadCount = 0,
  onClick,
}: NotificationMenuTriggerProps) {
  const { triggerRef, isOpen, setIsOpen } = useNotificationMenu();

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick();
  };

  return (
    <button
      ref={triggerRef}
      className={styles.trigger}
      onClick={handleClick}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
      {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
    </button>
  );
}

export function NotificationMenuItem({
  notification,
  onClick,
}: NotificationMenuItemProps) {
  const handleClick = () => {
    onClick?.(notification);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    notification.action?.onClick();
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) {return 'Just now';}
    if (minutes < 60) {return `${minutes}m ago`;}
    if (hours < 24) {return `${hours}h ago`;}
    return `${days}d ago`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <li
      className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      // Notification items are list items semantically, but need button role for interactivity
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="button"
      tabIndex={0}
    >
      <div className={styles.notificationHeader}>
        {notification.icon && (
          <div className={styles.notificationIcon}>{notification.icon}</div>
        )}
        <div className={styles.notificationContent}>
          <h4 className={styles.notificationTitle}>{notification.title}</h4>
          <p className={styles.notificationMessage}>{notification.message}</p>
          <div className={styles.notificationTimestamp}>
            {formatTimestamp(notification.timestamp)}
          </div>
          {notification.action && (
            <div className={styles.notificationAction}>
              <button
                className={styles.actionButton}
                onClick={handleActionClick}
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function NotificationMenuPanel({
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onSeeAll,
  emptyMessage = 'No notifications',
  children,
}: NotificationMenuPanelProps) {
  const { isOpen, setIsOpen, triggerRef } = useNotificationMenu();
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle click outside - exclude both panel and trigger from detection
  useEffect(() => {
    if (!isOpen) {return;}

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Don't close if clicking inside panel or on trigger
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, setIsOpen, triggerRef]);

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      anchorEl={triggerRef}
      placement="bottom"
      offset={8}
    >
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.header}>
          <h3 className={styles.headerTitle}>Notifications</h3>
        </div>

        {notifications.length === 0 ? (
          <div className={styles.empty}>{emptyMessage}</div>
        ) : (
          <ul className={styles.notificationsList}>
            {notifications.map((notification) => (
              <NotificationMenuItem
                key={notification.id}
                notification={notification}
                onClick={onNotificationClick}
              />
            ))}
          </ul>
        )}

        {children}

        {(onMarkAllRead || onSeeAll) && (
          <div className={styles.footer}>
            {onMarkAllRead && (
              <button className={styles.footerButton} onClick={onMarkAllRead}>
                Mark all read
              </button>
            )}
            {onSeeAll && (
              <button className={styles.footerButton} onClick={onSeeAll}>
                See all
              </button>
            )}
          </div>
        )}
      </div>
    </Popover>
  );
}

NotificationMenu.Trigger = NotificationMenuTrigger;
NotificationMenu.Panel = NotificationMenuPanel;
NotificationMenu.Item = NotificationMenuItem;

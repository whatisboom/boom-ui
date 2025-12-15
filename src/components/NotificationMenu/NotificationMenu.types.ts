import { ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationMenuTriggerProps {
  unreadCount?: number;
  onClick: () => void;
}

export interface NotificationMenuPanelProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onSeeAll?: () => void;
  emptyMessage?: string;
  children?: ReactNode;
}

export interface NotificationMenuItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
}

export interface NotificationMenuProps {
  children: ReactNode;
}

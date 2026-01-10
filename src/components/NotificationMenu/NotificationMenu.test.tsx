import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../tests/test-utils';
import {
  NotificationMenu,
  NotificationMenuTrigger,
  NotificationMenuPanel,
  NotificationMenuItem,
} from './NotificationMenu';
import { Notification } from './NotificationMenu.types';
import styles from './NotificationMenu.module.css';

describe('NotificationMenu', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'New Comment',
      message: 'John commented on your post',
      timestamp: new Date('2024-01-01'),
      read: false,
    },
    {
      id: '2',
      title: 'Update Available',
      message: 'Version 2.0 is ready',
      timestamp: new Date('2024-01-02'),
      read: true,
    },
  ];

  describe('NotificationMenuTrigger', () => {
    it('should render bell icon with badge', () => {
      render(
        <NotificationMenu>
          <NotificationMenuTrigger unreadCount={5} onClick={vi.fn()} />
        </NotificationMenu>
      );

      expect(screen.getByLabelText(/notifications/i)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should not show badge when count is 0', () => {
      render(
        <NotificationMenu>
          <NotificationMenuTrigger unreadCount={0} onClick={vi.fn()} />
        </NotificationMenu>
      );

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(
        <NotificationMenu>
          <NotificationMenuTrigger onClick={onClick} />
        </NotificationMenu>
      );

      fireEvent.click(screen.getByLabelText(/notifications/i));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should toggle menu open and closed when clicked', async () => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Test Notification',
          message: 'Test message',
          timestamp: new Date(),
          read: false,
        },
      ];

      render(
        <NotificationMenu>
          <NotificationMenuTrigger onClick={vi.fn()} />
          <NotificationMenuPanel notifications={mockNotifications} />
        </NotificationMenu>
      );

      const trigger = screen.getByLabelText(/notifications/i);

      // Initially closed - notification should not be visible
      expect(screen.queryByText('Test Notification')).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(trigger);
      expect(screen.getByText('Test Notification')).toBeInTheDocument();

      // Click again to close
      fireEvent.click(trigger);

      // Wait for exit animation to complete
      await waitFor(() => {
        expect(screen.queryByText('Test Notification')).not.toBeInTheDocument();
      });
    });
  });

  describe('NotificationMenuItem', () => {
    it('should render notification details', () => {
      render(
        <NotificationMenuItem notification={mockNotifications[0]} />
      );

      expect(screen.getByText('New Comment')).toBeInTheDocument();
      expect(screen.getByText('John commented on your post')).toBeInTheDocument();
    });

    it('should show unread indicator', () => {
      const { container } = render(
        <NotificationMenuItem notification={mockNotifications[0]} />
      );

      const unreadElement = container.querySelector(`.${styles.unread}`);
      expect(unreadElement).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(
        <NotificationMenuItem
          notification={mockNotifications[0]}
          onClick={onClick}
        />
      );

      fireEvent.click(screen.getByText('New Comment'));
      expect(onClick).toHaveBeenCalledWith(mockNotifications[0]);
    });
  });

  describe('NotificationMenuPanel', () => {
    it('should render all notifications', () => {
      render(
        <NotificationMenu>
          <NotificationMenuTrigger onClick={vi.fn()} />
          <NotificationMenuPanel notifications={mockNotifications} />
        </NotificationMenu>
      );

      fireEvent.click(screen.getByLabelText(/notifications/i));

      expect(screen.getByText('New Comment')).toBeInTheDocument();
      expect(screen.getByText('Update Available')).toBeInTheDocument();
    });

    it('should show empty message when no notifications', () => {
      render(
        <NotificationMenu>
          <NotificationMenuTrigger onClick={vi.fn()} />
          <NotificationMenuPanel
            notifications={[]}
            emptyMessage="No notifications"
          />
        </NotificationMenu>
      );

      fireEvent.click(screen.getByLabelText(/notifications/i));

      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });

    it('should render footer actions', () => {
      render(
        <NotificationMenu>
          <NotificationMenuTrigger onClick={vi.fn()} />
          <NotificationMenuPanel
            notifications={mockNotifications}
            onMarkAllRead={vi.fn()}
            onSeeAll={vi.fn()}
          />
        </NotificationMenu>
      );

      fireEvent.click(screen.getByLabelText(/notifications/i));

      expect(screen.getByText(/mark all read/i)).toBeInTheDocument();
      expect(screen.getByText(/see all/i)).toBeInTheDocument();
    });
  });

  describe('NotificationMenu composition', () => {
    it('should compose trigger and panel', () => {
      const { container } = render(
        <NotificationMenu>
          <NotificationMenuTrigger unreadCount={2} onClick={vi.fn()} />
          <NotificationMenuPanel notifications={mockNotifications} />
        </NotificationMenu>
      );

      expect(container.querySelector('[aria-label*="notification"]')).toBeInTheDocument();
    });
  });
});

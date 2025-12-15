import type { Meta, StoryObj } from '@storybook/react';
import {
  NotificationMenu,
  NotificationMenuTrigger,
  NotificationMenuPanel,
} from './NotificationMenu';
import { Notification } from './NotificationMenu.types';

const meta = {
  title: 'Components/NotificationMenu',
  component: NotificationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Comment',
    message: 'John Doe commented on your post "Getting Started with React"',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    icon: '💬',
    action: {
      label: 'Reply',
      onClick: () => console.log('Reply clicked'),
    },
  },
  {
    id: '2',
    title: 'System Update',
    message: 'New version 2.0 is available. Update now to get the latest features.',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: false,
    icon: '🔄',
  },
  {
    id: '3',
    title: 'Welcome!',
    message: 'Thanks for joining our platform. Check out our getting started guide.',
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
    icon: '👋',
    action: {
      label: 'View Guide',
      onClick: () => console.log('View guide clicked'),
    },
  },
];

export const Default: Story = {
  render: () => (
    <NotificationMenu>
      <NotificationMenuTrigger unreadCount={2} onClick={() => {}} />
      <NotificationMenuPanel
        notifications={mockNotifications}
        onNotificationClick={(notification) => console.log('Clicked:', notification)}
        onMarkAllRead={() => console.log('Mark all read')}
        onSeeAll={() => console.log('See all')}
      />
    </NotificationMenu>
  ),
};

export const NoNotifications: Story = {
  render: () => (
    <NotificationMenu>
      <NotificationMenuTrigger unreadCount={0} onClick={() => {}} />
      <NotificationMenuPanel notifications={[]} />
    </NotificationMenu>
  ),
};

export const ManyNotifications: Story = {
  render: () => {
    const manyNotifications: Notification[] = Array.from(
      { length: 10 },
      (_, i) => ({
        id: String(i),
        title: `Notification ${i + 1}`,
        message: `This is notification message number ${i + 1}`,
        timestamp: new Date(Date.now() - i * 3600000),
        read: i > 5,
        icon: '🔔',
      })
    );

    return (
      <NotificationMenu>
        <NotificationMenuTrigger unreadCount={6} onClick={() => {}} />
        <NotificationMenuPanel
          notifications={manyNotifications}
          onMarkAllRead={() => console.log('Mark all read')}
          onSeeAll={() => console.log('See all')}
        />
      </NotificationMenu>
    );
  },
};

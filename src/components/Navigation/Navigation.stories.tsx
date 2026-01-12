import type { Meta, StoryObj } from '@storybook/react-vite';
import { Navigation } from './Navigation';
import type { NavItem } from './Navigation.types';

const meta = {
  title: 'Navigation & Menus/Navigation',
  component: Navigation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: NavItem[] = [
  { label: 'Dashboard', href: '/', isActive: true },
  { label: 'Projects', href: '/projects' },
  { label: 'Team', href: '/team' },
  { label: 'Settings', href: '/settings' },
];

export const Horizontal: Story = {
  args: {
    items,
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    items,
    orientation: 'vertical',
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', href: '/', icon: '🏠', isActive: true },
      { label: 'Messages', href: '/messages', icon: '💬', badge: 3 },
      { label: 'Notifications', href: '/notifications', icon: '🔔', badge: 12 },
      { label: 'Profile', href: '/profile', icon: '👤' },
    ],
    orientation: 'horizontal',
  },
};

export const WithDropdowns: Story = {
  args: {
    items: [
      { label: 'Home', href: '/', isActive: true },
      {
        label: 'Products',
        dropdown: [
          { label: 'All Products', href: '/products' },
          { label: 'New Arrivals', href: '/products/new' },
          { label: 'Best Sellers', href: '/products/bestsellers' },
        ],
      },
      {
        label: 'Resources',
        dropdown: [
          { label: 'Documentation', href: '/docs' },
          { label: 'Blog', href: '/blog' },
          { label: 'Support', href: '/support' },
        ],
      },
      { label: 'About', href: '/about' },
    ],
    orientation: 'horizontal',
  },
};

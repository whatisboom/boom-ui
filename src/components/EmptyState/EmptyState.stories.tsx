import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';

const meta = {
  title: 'Feedback & Alerts/Empty State',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No results found',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for',
  },
};

export const WithIllustration: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>🔍</span>,
    title: 'No results found',
    description: 'Try adjusting your search or filters',
  },
};

export const WithAction: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>📭</span>,
    title: 'No messages',
    description: 'Your inbox is empty',
    action: <Button variant="primary">Compose message</Button>,
  },
};

export const NoData: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>📦</span>,
    title: 'No items yet',
    description: 'Get started by creating your first item',
    action: <Button variant="primary">Create item</Button>,
  },
};

export const ErrorState: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>⚠️</span>,
    title: 'Something went wrong',
    description: 'We couldn\'t load your data. Please try again.',
    action: <Button>Try again</Button>,
  },
};

export const SmallSize: Story = {
  args: {
    illustration: <span style={{ fontSize: '2rem' }}>🔍</span>,
    title: 'No results',
    description: 'Try different keywords',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    illustration: <span style={{ fontSize: '4rem' }}>📭</span>,
    title: 'Your inbox is empty',
    description: 'Messages from your contacts will appear here',
    action: <Button variant="primary" size="lg">Compose message</Button>,
    size: 'lg',
  },
};

export const MultipleActions: Story = {
  args: {
    illustration: <span style={{ fontSize: '3rem' }}>🎯</span>,
    title: 'Get started',
    description: 'Choose an action below to begin',
    action: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="primary">Primary action</Button>
        <Button variant="secondary">Secondary action</Button>
      </div>
    ),
  },
};

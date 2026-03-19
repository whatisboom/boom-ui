import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';
import { Stack } from '../Stack';
import { Button } from '../Button';
import { useState } from 'react';

const meta = {
  title: 'Feedback & Status/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const AllSizes: Story = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <Stack direction="row" spacing={4} align="center">
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </Stack>
  ),
};

export const NoAnimation: Story = {
  args: {
    disableAnimation: true,
  },
};

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner size="sm" /> Processing...
    </Button>
  ),
};

export const WithOverlay: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);

    return (
      <>
        <Button onClick={() => setLoading(true)}>
          Show Loading Overlay
        </Button>
        {loading && (
          <Spinner
            overlay
            label="Loading application"
          />
        )}
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Note: Refresh page to dismiss overlay in Storybook
        </div>
      </>
    );
  },
};

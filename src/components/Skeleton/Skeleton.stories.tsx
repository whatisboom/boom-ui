import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';
import { SkeletonText } from './SkeletonText';
import { SkeletonAvatar } from './SkeletonAvatar';
import { SkeletonCard } from './SkeletonCard';
import { Stack } from '../Stack';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Text: Story = {
  args: {
    variant: 'text',
  },
};

export const TextMultipleLines: Story = {
  args: {
    variant: 'text',
    lines: 5,
  },
};

export const Circle: Story = {
  args: {
    variant: 'circle',
    width: 48,
    height: 48,
  },
};

export const Rectangle: Story = {
  args: {
    variant: 'rect',
    width: '100%',
    height: 200,
  },
};

export const CustomDimensions: Story = {
  args: {
    variant: 'custom',
    width: 300,
    height: 100,
    borderRadius: 16,
  },
};

export const NoAnimation: Story = {
  args: {
    variant: 'text',
    lines: 3,
    disableAnimation: true,
  },
};

export const CompositePattern: Story = {
  render: () => (
    <Stack spacing={4}>
      <Skeleton variant="circle" width={64} height={64} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="rect" height={200} />
    </Stack>
  ),
};

export const SkeletonTextExample: Story = {
  render: () => <SkeletonText lines={5} />,
};

export const SkeletonAvatarExample: Story = {
  render: () => <SkeletonAvatar size="lg" withText textLines={2} />,
};

export const SkeletonCardExample: Story = {
  render: () => <SkeletonCard hasImage hasActions />,
};

export const SkeletonCardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} hasImage hasActions />
      ))}
    </div>
  ),
};

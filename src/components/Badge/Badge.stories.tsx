import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { Stack } from '../Stack';

const meta: Meta<typeof Badge> = {
  title: 'Data & Content/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'success', 'warning', 'error', 'info', 'neutral'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: '5',
  },
};

export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="row" spacing={3} style={{ alignItems: 'center' }}>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </Stack>
  ),
};

export const NumericContent: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Badge>5</Badge>
      <Badge>99</Badge>
      <Badge variant="error">999</Badge>
      <Badge variant="success">1234</Badge>
    </Stack>
  ),
};

export const StringContent: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Badge variant="info">New</Badge>
      <Badge variant="warning">Beta</Badge>
      <Badge variant="error">Hot</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="neutral">Draft</Badge>
    </Stack>
  ),
};

export const InlineUsage: Story = {
  render: () => (
    <Stack direction="column" spacing={3}>
      <h2 style={{ margin: 0 }}>
        New Feature <Badge variant="info">New</Badge>
      </h2>

      <p style={{ margin: 0 }}>
        This feature is currently in{' '}
        <Badge variant="warning">Beta</Badge> and may change.
      </p>

      <div>
        Status: <Badge variant="success">Active</Badge>
      </div>

      <div>
        Messages: <Badge variant="error">5</Badge>
      </div>
    </Stack>
  ),
};

export const AllSizesAllVariants: Story = {
  render: () => (
    <Stack direction="column" spacing={3}>
      <Stack direction="row" spacing={2}>
        <Badge size="sm" variant="primary">
          Small
        </Badge>
        <Badge size="sm" variant="success">
          Small
        </Badge>
        <Badge size="sm" variant="warning">
          Small
        </Badge>
        <Badge size="sm" variant="error">
          Small
        </Badge>
        <Badge size="sm" variant="info">
          Small
        </Badge>
        <Badge size="sm" variant="neutral">
          Small
        </Badge>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Badge size="md" variant="primary">
          Medium
        </Badge>
        <Badge size="md" variant="success">
          Medium
        </Badge>
        <Badge size="md" variant="warning">
          Medium
        </Badge>
        <Badge size="md" variant="error">
          Medium
        </Badge>
        <Badge size="md" variant="info">
          Medium
        </Badge>
        <Badge size="md" variant="neutral">
          Medium
        </Badge>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Badge size="lg" variant="primary">
          Large
        </Badge>
        <Badge size="lg" variant="success">
          Large
        </Badge>
        <Badge size="lg" variant="warning">
          Large
        </Badge>
        <Badge size="lg" variant="error">
          Large
        </Badge>
        <Badge size="lg" variant="info">
          Large
        </Badge>
        <Badge size="lg" variant="neutral">
          Large
        </Badge>
      </Stack>
    </Stack>
  ),
};

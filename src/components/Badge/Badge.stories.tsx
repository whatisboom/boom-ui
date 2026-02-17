import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { Stack } from '../Stack';

const meta: Meta<typeof Badge> = {
  title: 'Core/Badge',
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
  args: { size: 'md' },
  argTypes: { variant: { control: false } },
  render: (args) => (
    <Stack direction="row" spacing={2}>
      <Badge variant="primary" size={args.size}>Primary</Badge>
      <Badge variant="success" size={args.size}>Success</Badge>
      <Badge variant="warning" size={args.size}>Warning</Badge>
      <Badge variant="error" size={args.size}>Error</Badge>
      <Badge variant="info" size={args.size}>Info</Badge>
      <Badge variant="neutral" size={args.size}>Neutral</Badge>
    </Stack>
  ),
};

export const Sizes: Story = {
  args: {
    variant: 'primary',
  },
  argTypes: { size: { control: false } },
  render: (args) => (
    <Stack direction="row" spacing={3} style={{ alignItems: 'center' }}>
      <Badge size="sm" variant={args.variant}>Small</Badge>
      <Badge size="md" variant={args.variant}>Medium</Badge>
      <Badge size="lg" variant={args.variant}>Large</Badge>
    </Stack>
  ),
};

export const NumericContent: Story = {
  args: { size: 'md' },
  argTypes: { variant: { control: false } },
  render: (args) => (
    <Stack direction="row" spacing={2}>
      <Badge size={args.size}>5</Badge>
      <Badge size={args.size}>99</Badge>
      <Badge variant="error" size={args.size}>999</Badge>
      <Badge variant="success" size={args.size}>1234</Badge>
    </Stack>
  ),
};

export const StringContent: Story = {
  args: { size: 'md' },
  argTypes: { variant: { control: false } },
  render: (args) => (
    <Stack direction="row" spacing={2}>
      <Badge variant="info" size={args.size}>New</Badge>
      <Badge variant="warning" size={args.size}>Beta</Badge>
      <Badge variant="error" size={args.size}>Hot</Badge>
      <Badge variant="success" size={args.size}>Active</Badge>
      <Badge variant="neutral" size={args.size}>Draft</Badge>
    </Stack>
  ),
};

export const InlineUsage: Story = {
  argTypes: {
    variant: { control: false },
    size: { control: false },
  },
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
  argTypes: {
    size: { control: false },
    variant: { control: false },
  },
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';
import { Button } from '../Button';
import { Stack } from '../Stack';

const meta: Meta<typeof Badge> = {
  title: 'Components/Display/Badge',
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
    position: {
      control: 'radio',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Standalone: Story = {
  args: {
    content: '5',
  },
};

export const OnButton: Story = {
  render: () => (
    <Badge content="3">
      <Button>Notifications</Button>
    </Badge>
  ),
};

export const Variants: Story = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <Badge content="5" variant="primary" />
      <Badge content="5" variant="success" />
      <Badge content="5" variant="warning" />
      <Badge content="5" variant="error" />
      <Badge content="5" variant="info" />
      <Badge content="5" variant="neutral" />
    </Stack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="column" spacing={4}>
      <Stack direction="row" spacing={4} style={{ alignItems: 'center' }}>
        <Badge content="99+" size="sm" />
        <Badge content="99+" size="md" />
        <Badge content="99+" size="lg" />
      </Stack>

      <Stack direction="row" spacing={4} style={{ alignItems: 'center' }}>
        <Badge content="99+" size="sm">
          <Button size="sm">Small</Button>
        </Badge>
        <Badge content="99+" size="md">
          <Button size="md">Medium</Button>
        </Badge>
        <Badge content="99+" size="lg">
          <Button size="lg">Large</Button>
        </Badge>
      </Stack>
    </Stack>
  ),
};

export const MaxValue: Story = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <Badge content={5}>
        <Button>Messages</Button>
      </Badge>
      <Badge content={50}>
        <Button>Messages</Button>
      </Badge>
      <Badge content={100}>
        <Button>Messages</Button>
      </Badge>
      <Badge content={1000} max={999}>
        <Button>Messages</Button>
      </Badge>
    </Stack>
  ),
};

export const Positions: Story = {
  render: () => (
    <Stack direction="row" spacing={6}>
      <Badge content="1" position="top-right">
        <Button>Top Right</Button>
      </Badge>
      <Badge content="2" position="top-left">
        <Button>Top Left</Button>
      </Badge>
      <Badge content="3" position="bottom-right">
        <Button>Bottom Right</Button>
      </Badge>
      <Badge content="4" position="bottom-left">
        <Button>Bottom Left</Button>
      </Badge>
    </Stack>
  ),
};

export const DotBadge: Story = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <Badge dot variant="primary">
        <Button>Primary</Button>
      </Badge>
      <Badge dot variant="success">
        <Button>Success</Button>
      </Badge>
      <Badge dot variant="error">
        <Button>Error</Button>
      </Badge>
      <Badge dot variant="warning">
        <Button>Warning</Button>
      </Badge>
    </Stack>
  ),
};

export const DotSizes: Story = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <Badge dot size="sm" variant="error">
        <Button size="sm">Small</Button>
      </Badge>
      <Badge dot size="md" variant="error">
        <Button size="md">Medium</Button>
      </Badge>
      <Badge dot size="lg" variant="error">
        <Button size="lg">Large</Button>
      </Badge>
    </Stack>
  ),
};

export const StringContent: Story = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <Badge content="NEW">
        <Button>Feature</Button>
      </Badge>
      <Badge content="BETA" variant="warning">
        <Button>Beta Feature</Button>
      </Badge>
      <Badge content="!" variant="error">
        <Button>Important</Button>
      </Badge>
    </Stack>
  ),
};

export const AllVariantsOnButtons: Story = {
  render: () => (
    <Stack direction="column" spacing={3}>
      <Badge content="5" variant="primary">
        <Button>Primary Badge</Button>
      </Badge>
      <Badge content="10" variant="success">
        <Button>Success Badge</Button>
      </Badge>
      <Badge content="3" variant="warning">
        <Button>Warning Badge</Button>
      </Badge>
      <Badge content="99+" variant="error">
        <Button>Error Badge</Button>
      </Badge>
      <Badge content="2" variant="info">
        <Button>Info Badge</Button>
      </Badge>
      <Badge content="7" variant="neutral">
        <Button>Neutral Badge</Button>
      </Badge>
    </Stack>
  ),
};

export const MultipleElements: Story = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <Badge content="12">
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--boom-theme-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          JD
        </div>
      </Badge>

      <Badge dot variant="success" position="bottom-right">
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--boom-theme-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          AB
        </div>
      </Badge>
    </Stack>
  ),
};

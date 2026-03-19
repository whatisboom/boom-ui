import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { Stack } from '../Stack';

const meta: Meta<typeof Avatar> = {
  title: 'Core/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: 'radio',
      options: ['online', 'offline', 'away', 'busy'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

const SAMPLE_IMAGE = 'https://i.pravatar.cc/150?img=1';

export const WithImage: Story = {
  args: {
    src: SAMPLE_IMAGE,
    alt: 'User Avatar',
  },
};

export const WithInitials: Story = {
  args: {
    alt: 'John Doe',
    name: 'John Doe',
  },
};

export const Sizes: Story = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <Stack direction="row" spacing={3} style={{ alignItems: 'center' }}>
      <Avatar src={SAMPLE_IMAGE} alt="User" size="sm" status={args.status} showStatus={args.showStatus} />
      <Avatar src={SAMPLE_IMAGE} alt="User" size="md" status={args.status} showStatus={args.showStatus} />
      <Avatar src={SAMPLE_IMAGE} alt="User" size="lg" status={args.status} showStatus={args.showStatus} />
      <Avatar src={SAMPLE_IMAGE} alt="User" size="xl" status={args.status} showStatus={args.showStatus} />
    </Stack>
  ),
};

export const InitialsSizes: Story = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <Stack direction="row" spacing={3} style={{ alignItems: 'center' }}>
      <Avatar alt="User" name="John Doe" size="sm" status={args.status} showStatus={args.showStatus} />
      <Avatar alt="User" name="Jane Smith" size="md" status={args.status} showStatus={args.showStatus} />
      <Avatar alt="User" name="Bob Wilson" size="lg" status={args.status} showStatus={args.showStatus} />
      <Avatar alt="User" name="Alice Brown" size="xl" status={args.status} showStatus={args.showStatus} />
    </Stack>
  ),
};

export const WithStatus: Story = {
  argTypes: { status: { control: false } },
  render: (args) => (
    <Stack direction="row" spacing={4} style={{ alignItems: 'center' }}>
      <Avatar
        src={SAMPLE_IMAGE}
        alt="Online User"
        status="online"
        showStatus
        size={args.size}
      />
      <Avatar
        src={SAMPLE_IMAGE}
        alt="Offline User"
        status="offline"
        showStatus
        size={args.size}
      />
      <Avatar src={SAMPLE_IMAGE} alt="Away User" status="away" showStatus size={args.size} />
      <Avatar src={SAMPLE_IMAGE} alt="Busy User" status="busy" showStatus size={args.size} />
    </Stack>
  ),
};

export const WithStatusAndInitials: Story = {
  argTypes: { status: { control: false } },
  render: (args) => (
    <Stack direction="row" spacing={4} style={{ alignItems: 'center' }}>
      <Avatar
        alt="User"
        name="Online User"
        status="online"
        showStatus
        size={args.size}
      />
      <Avatar
        alt="User"
        name="Offline User"
        status="offline"
        showStatus
        size={args.size}
      />
      <Avatar alt="User" name="Away User" status="away" showStatus size={args.size} />
      <Avatar alt="User" name="Busy User" status="busy" showStatus size={args.size} />
    </Stack>
  ),
};

export const StatusSizes: Story = {
  argTypes: { size: { control: false }, status: { control: false } },
  render: () => (
    <Stack direction="row" spacing={4} style={{ alignItems: 'center' }}>
      <Avatar
        src={SAMPLE_IMAGE}
        alt="User"
        size="sm"
        status="online"
        showStatus
      />
      <Avatar
        src={SAMPLE_IMAGE}
        alt="User"
        size="md"
        status="online"
        showStatus
      />
      <Avatar
        src={SAMPLE_IMAGE}
        alt="User"
        size="lg"
        status="online"
        showStatus
      />
      <Avatar
        src={SAMPLE_IMAGE}
        alt="User"
        size="xl"
        status="online"
        showStatus
      />
    </Stack>
  ),
};

export const Group: Story = {
  render: () => (
    <Stack direction="row" spacing={-2}>
      <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" />
      <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" />
      <Avatar src="https://i.pravatar.cc/150?img=4" alt="User 4" />
      <Avatar alt="User 5" name="+2" />
    </Stack>
  ),
};

export const DifferentNames: Story = {
  render: () => (
    <Stack direction="row" spacing={3} style={{ alignItems: 'center' }}>
      <Avatar alt="User" name="John Doe" />
      <Avatar alt="User" name="Jane" />
      <Avatar alt="User" name="AB" />
      <Avatar alt="User" name="Michael Christopher Thompson" />
      <Avatar alt="User" name="" />
    </Stack>
  ),
};

export const ImageFallback: Story = {
  render: () => (
    <Stack direction="row" spacing={3} style={{ alignItems: 'center' }}>
      <Avatar src="https://invalid-url.com/broken.jpg" alt="User" name="John Doe" />
      <Avatar
        src="https://invalid-url.com/broken.jpg"
        alt="User"
        name="Jane Smith"
        size="lg"
      />
    </Stack>
  ),
};

export const AllStatusStates: Story = {
  argTypes: { status: { control: false } },
  render: (args) => (
    <Stack direction="column" spacing={3}>
      <Stack direction="row" spacing={4} style={{ alignItems: 'center' }}>
        <Avatar alt="User" name="Online" status="online" showStatus size={args.size} />
        <div>
          <strong>Online</strong>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            User is actively available
          </p>
        </div>
      </Stack>

      <Stack direction="row" spacing={4} style={{ alignItems: 'center' }}>
        <Avatar alt="User" name="Away" status="away" showStatus size={args.size} />
        <div>
          <strong>Away</strong>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            User is temporarily unavailable
          </p>
        </div>
      </Stack>

      <Stack direction="row" spacing={4} style={{ alignItems: 'center' }}>
        <Avatar alt="User" name="Busy" status="busy" showStatus size={args.size} />
        <div>
          <strong>Busy</strong>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            User is in do not disturb mode
          </p>
        </div>
      </Stack>

      <Stack direction="row" spacing={4} style={{ alignItems: 'center' }}>
        <Avatar alt="User" name="Offline" status="offline" showStatus size={args.size} />
        <div>
          <strong>Offline</strong>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            User is not available
          </p>
        </div>
      </Stack>
    </Stack>
  ),
};

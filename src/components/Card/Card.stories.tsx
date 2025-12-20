import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Typography } from '../Typography';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Box } from '../Box';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['flat', 'raised', 'elevated'],
    },
    padding: {
      control: { type: 'number', min: 0, max: 12, step: 1 },
    },
    hoverable: {
      control: 'boolean',
    },
    disableAnimation: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a card with default settings.',
  },
};

export const Flat: Story = {
  args: {
    variant: 'flat',
    children: 'This is a flat card with no shadow.',
  },
};

export const Raised: Story = {
  args: {
    variant: 'raised',
    children: 'This is a raised card with subtle shadow (default).',
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: 'This is an elevated card with pronounced shadow.',
  },
};

export const WithCustomPadding: Story = {
  args: {
    padding: 8,
    children: 'This card has larger padding (8).',
  },
};

export const NoPadding: Story = {
  args: {
    padding: 0,
    children: (
      <div>
        <img
          src="https://placehold.co/400x200"
          alt="Placeholder"
          style={{ width: '100%', display: 'block' }}
        />
        <Box padding={4}>
          <Typography variant="h4">Edge-to-Edge Image</Typography>
          <Typography>Image touches the card edges, content has padding.</Typography>
        </Box>
      </div>
    ),
  },
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: 'Hover over this card to see the lift effect.',
  },
};

export const HoverableLink: Story = {
  render: () => (
    <Card as="a" href="#" hoverable style={{ textDecoration: 'none', color: 'inherit' }}>
      <Typography variant="h4">Clickable Card</Typography>
      <Typography>This card is a link. Hover to see the effect.</Typography>
    </Card>
  ),
};

export const HoverableButton: Story = {
  render: () => (
    <Card as="button" onClick={() => alert('Card clicked!')} hoverable>
      <Typography variant="h4">Button Card</Typography>
      <Typography>This card triggers an action when clicked.</Typography>
    </Card>
  ),
};

export const BlogPost: Story = {
  render: () => (
    <Card as="article" style={{ maxWidth: '600px' }}>
      <Stack spacing={3}>
        <Typography variant="h3">Understanding React Hooks</Typography>
        <Typography variant="caption">Published on December 14, 2025</Typography>
        <Typography>
          React Hooks revolutionized how we write components by allowing us to use
          state and lifecycle features in functional components...
        </Typography>
        <Button variant="link" style={{ alignSelf: 'flex-start' }}>
          Read more →
        </Button>
      </Stack>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card hoverable style={{ maxWidth: '300px' }}>
      <Stack spacing={3}>
        <img
          src="https://placehold.co/300x200"
          alt="Product"
          style={{ width: '100%', borderRadius: 'var(--boom-radius-md)' }}
        />
        <Stack spacing={2}>
          <Typography variant="h4">Premium Headphones</Typography>
          <Typography variant="body">
            High-quality wireless headphones with noise cancellation.
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h3">$299</Typography>
            <Button size="sm">Add to Cart</Button>
          </Box>
        </Stack>
      </Stack>
    </Card>
  ),
};

export const MetricCard: Story = {
  render: () => (
    <Card variant="elevated" padding={6} style={{ maxWidth: '250px' }}>
      <Stack spacing={2}>
        <Typography variant="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total Revenue
        </Typography>
        <Typography variant="h2" style={{ color: 'var(--boom-color-primary-600)' }}>
          $1.2M
        </Typography>
        <Typography variant="body" style={{ color: 'var(--boom-color-success-600)' }}>
          ↑ 12% from last month
        </Typography>
      </Stack>
    </Card>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <Card padding={6} style={{ maxWidth: '400px' }}>
      <Stack spacing={4}>
        <Box display="flex" gap={3} alignItems="center">
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--boom-color-primary-600)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            JD
          </div>
          <Stack spacing={1}>
            <Typography variant="h4">John Doe</Typography>
            <Typography variant="caption">Software Engineer</Typography>
          </Stack>
        </Box>
        <Typography>
          Passionate about building great user experiences and scalable systems.
        </Typography>
        <Box display="flex" gap={2}>
          <Button size="sm" variant="outline" style={{ flex: 1 }}>
            Message
          </Button>
          <Button size="sm" style={{ flex: 1 }}>
            Follow
          </Button>
        </Box>
      </Stack>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={4}>
      <Card variant="flat">
        <Typography variant="h4">Flat Card</Typography>
        <Typography>Border only, no shadow</Typography>
      </Card>
      <Card variant="raised">
        <Typography variant="h4">Raised Card</Typography>
        <Typography>Subtle shadow (default)</Typography>
      </Card>
      <Card variant="elevated">
        <Typography variant="h4">Elevated Card</Typography>
        <Typography>Pronounced shadow</Typography>
      </Card>
    </Stack>
  ),
};

export const DifferentPadding: Story = {
  render: () => (
    <Stack spacing={4}>
      <Card padding={2}>
        <Typography>Padding: 2 (small)</Typography>
      </Card>
      <Card padding={4}>
        <Typography>Padding: 4 (default)</Typography>
      </Card>
      <Card padding={8}>
        <Typography>Padding: 8 (large)</Typography>
      </Card>
    </Stack>
  ),
};

export const InteractiveCards: Story = {
  render: () => (
    <Box display="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--boom-spacing-4)' }}>
      <Card as="a" href="#" hoverable style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography variant="h4">Link Card</Typography>
        <Typography>Navigates to a new page</Typography>
      </Card>
      <Card as="button" onClick={() => console.log('clicked')} hoverable>
        <Typography variant="h4">Button Card</Typography>
        <Typography>Triggers an action</Typography>
      </Card>
      <Card hoverable disableAnimation>
        <Typography variant="h4">No Animation</Typography>
        <Typography>Hoverable but animations disabled</Typography>
      </Card>
    </Box>
  ),
};

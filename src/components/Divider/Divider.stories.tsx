import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';
import { Typography } from '../Typography';
import { Stack } from '../Stack';
import { Box } from '../Box';
import { Card } from '../Card';
import { Button } from '../Button';

const meta = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <Typography>Content above the divider</Typography>
      <Divider />
      <Typography>Content below the divider</Typography>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack spacing={4}>
      <Typography>First section</Typography>
      <Divider orientation="horizontal" />
      <Typography>Second section</Typography>
      <Divider orientation="horizontal" />
      <Typography>Third section</Typography>
    </Stack>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Box display="flex" gap={4} alignItems="center" style={{ height: '100px' }}>
      <Typography>Left</Typography>
      <Divider orientation="vertical" />
      <Typography>Middle</Typography>
      <Divider orientation="vertical" />
      <Typography>Right</Typography>
    </Box>
  ),
};

export const SolidVariant: Story = {
  render: () => (
    <Stack spacing={4}>
      <Typography>Solid divider (default)</Typography>
      <Divider variant="solid" />
      <Typography>Content below</Typography>
    </Stack>
  ),
};

export const DashedVariant: Story = {
  render: () => (
    <Stack spacing={4}>
      <Typography>Dashed divider</Typography>
      <Divider variant="dashed" />
      <Typography>Content below</Typography>
    </Stack>
  ),
};

export const DottedVariant: Story = {
  render: () => (
    <Stack spacing={4}>
      <Typography>Dotted divider</Typography>
      <Divider variant="dotted" />
      <Typography>Content below</Typography>
    </Stack>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={6}>
      <div>
        <Typography variant="caption" style={{ marginBottom: '8px', display: 'block' }}>
          Solid
        </Typography>
        <Divider variant="solid" />
      </div>

      <div>
        <Typography variant="caption" style={{ marginBottom: '8px', display: 'block' }}>
          Dashed
        </Typography>
        <Divider variant="dashed" />
      </div>

      <div>
        <Typography variant="caption" style={{ marginBottom: '8px', display: 'block' }}>
          Dotted
        </Typography>
        <Divider variant="dotted" />
      </div>
    </Stack>
  ),
};

export const WithTextLabel: Story = {
  render: () => (
    <Stack spacing={4}>
      <Typography>Sign in with your account</Typography>
      <Divider label="OR" />
      <Typography>Continue with social media</Typography>
    </Stack>
  ),
};

export const WithIconLabel: Story = {
  render: () => (
    <Stack spacing={4}>
      <Typography>Previous content</Typography>
      <Divider label={<span>⭐</span>} />
      <Typography>Next content</Typography>
    </Stack>
  ),
};

export const LabelPositions: Story = {
  render: () => (
    <Stack spacing={6}>
      <div>
        <Typography variant="caption" style={{ marginBottom: '8px', display: 'block' }}>
          Left-aligned label
        </Typography>
        <Divider label="Left" labelPosition="left" />
      </div>

      <div>
        <Typography variant="caption" style={{ marginBottom: '8px', display: 'block' }}>
          Center-aligned label (default)
        </Typography>
        <Divider label="Center" labelPosition="center" />
      </div>

      <div>
        <Typography variant="caption" style={{ marginBottom: '8px', display: 'block' }}>
          Right-aligned label
        </Typography>
        <Divider label="Right" labelPosition="right" />
      </div>
    </Stack>
  ),
};

export const InCard: Story = {
  render: () => (
    <Card style={{ maxWidth: '400px' }}>
      <Stack spacing={4}>
        <Typography variant="h3">Card Title</Typography>

        <Divider />

        <Typography>
          This is some content inside a card. The divider helps separate different
          sections.
        </Typography>

        <Divider label="Details" labelPosition="left" />

        <Stack spacing={2}>
          <Typography variant="caption">Name: John Doe</Typography>
          <Typography variant="caption">Email: john@example.com</Typography>
          <Typography variant="caption">Role: Developer</Typography>
        </Stack>
      </Stack>
    </Card>
  ),
};

export const BetweenSections: Story = {
  render: () => (
    <Stack spacing={6}>
      <div>
        <Typography variant="h2">Introduction</Typography>
        <Typography>
          This is the introduction section with some text content that explains the
          topic.
        </Typography>
      </div>

      <Divider />

      <div>
        <Typography variant="h2">Main Content</Typography>
        <Typography>
          This is the main content section with more detailed information about the
          subject matter.
        </Typography>
      </div>

      <Divider variant="dashed" />

      <div>
        <Typography variant="h2">Conclusion</Typography>
        <Typography>
          This is the conclusion section that wraps up the content and provides final
          thoughts.
        </Typography>
      </div>
    </Stack>
  ),
};

export const LoginForm: Story = {
  render: () => (
    <Card style={{ maxWidth: '400px' }}>
      <Stack spacing={4}>
        <Typography variant="h3">Sign In</Typography>

        <Stack spacing={3}>
          <input
            type="email"
            placeholder="Email"
            style={{
              padding: '8px 12px',
              border: '1px solid var(--boom-theme-border-default)',
              borderRadius: '4px',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            style={{
              padding: '8px 12px',
              border: '1px solid var(--boom-theme-border-default)',
              borderRadius: '4px',
            }}
          />
          <Button style={{ width: '100%' }}>Sign In</Button>
        </Stack>

        <Divider label="OR" />

        <Stack spacing={2}>
          <Button variant="outline" style={{ width: '100%' }}>
            Continue with Google
          </Button>
          <Button variant="outline" style={{ width: '100%' }}>
            Continue with GitHub
          </Button>
        </Stack>
      </Stack>
    </Card>
  ),
};

export const VerticalLayout: Story = {
  render: () => (
    <Box
      display="flex"
      gap={4}
      style={{
        height: '200px',
        padding: '16px',
        border: '1px solid var(--boom-theme-border-default)',
        borderRadius: '8px',
      }}
    >
      <Box display="flex" flexDirection="column" justifyContent="center" style={{ flex: 1 }}>
        <Typography variant="h4">Left Panel</Typography>
        <Typography>Content for the left side</Typography>
      </Box>

      <Divider orientation="vertical" />

      <Box display="flex" flexDirection="column" justifyContent="center" style={{ flex: 1 }}>
        <Typography variant="h4">Middle Panel</Typography>
        <Typography>Content for the middle</Typography>
      </Box>

      <Divider orientation="vertical" variant="dashed" />

      <Box display="flex" flexDirection="column" justifyContent="center" style={{ flex: 1 }}>
        <Typography variant="h4">Right Panel</Typography>
        <Typography>Content for the right side</Typography>
      </Box>
    </Box>
  ),
};

export const ToolbarSeparator: Story = {
  render: () => (
    <Box
      display="flex"
      gap={2}
      alignItems="center"
      padding={2}
      style={{
        border: '1px solid var(--boom-theme-border-default)',
        borderRadius: '8px',
      }}
    >
      <Button size="sm" variant="ghost">
        Cut
      </Button>
      <Button size="sm" variant="ghost">
        Copy
      </Button>
      <Button size="sm" variant="ghost">
        Paste
      </Button>

      <Divider orientation="vertical" style={{ height: '24px' }} />

      <Button size="sm" variant="ghost">
        Undo
      </Button>
      <Button size="sm" variant="ghost">
        Redo
      </Button>

      <Divider orientation="vertical" style={{ height: '24px' }} />

      <Button size="sm" variant="ghost">
        Bold
      </Button>
      <Button size="sm" variant="ghost">
        Italic
      </Button>
    </Box>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <Stack spacing={6}>
      <div>
        <Typography variant="caption" style={{ marginBottom: '8px', display: 'block' }}>
          Default divider
        </Typography>
        <Divider />
      </div>

      <div>
        <Typography variant="caption" style={{ marginBottom: '8px', display: 'block' }}>
          Custom margin
        </Typography>
        <Divider style={{ margin: '24px 0' }} />
      </div>

      <div>
        <Typography variant="caption" style={{ marginBottom: '8px', display: 'block' }}>
          Custom className
        </Typography>
        <Divider className="my-custom-divider" />
      </div>
    </Stack>
  ),
};

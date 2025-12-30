import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';
import { Box } from './Box';

const meta = {
  title: 'Getting Started/Layout Basics',
  component: Stack,
  tags: ['autodocs'],
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

// Demo Box component for visualization
const DemoBox = ({ children, color = 'primary' }: { children: React.ReactNode; color?: string }) => (
  <Box
    padding={4}
    style={{
      backgroundColor: color === 'primary' ? 'var(--boom-color-primary-100)' : 'var(--boom-color-neutral-100)',
      border: `1px solid ${color === 'primary' ? 'var(--boom-color-primary-300)' : 'var(--boom-color-neutral-300)'}`,
      borderRadius: 'var(--boom-radius-md)',
      textAlign: 'center',
    }}
  >
    {children}
  </Box>
);

export const VerticalStack: Story = {
  render: () => (
    <Stack spacing={4}>
      <DemoBox>Item 1</DemoBox>
      <DemoBox>Item 2</DemoBox>
      <DemoBox>Item 3</DemoBox>
    </Stack>
  ),
};

export const HorizontalStack: Story = {
  render: () => (
    <Stack direction="row" spacing={4}>
      <DemoBox>Item 1</DemoBox>
      <DemoBox>Item 2</DemoBox>
      <DemoBox>Item 3</DemoBox>
    </Stack>
  ),
};

export const CenteredStack: Story = {
  render: () => (
    <Stack spacing={4} align="center">
      <DemoBox>Centered Item 1</DemoBox>
      <DemoBox>Centered Item 2</DemoBox>
      <DemoBox>Centered Item 3</DemoBox>
    </Stack>
  ),
};

export const StackWithSpaceBetween: Story = {
  render: () => (
    <Stack direction="row" justify="space-between" style={{ width: '100%' }}>
      <DemoBox>Left</DemoBox>
      <DemoBox>Center</DemoBox>
      <DemoBox>Right</DemoBox>
    </Stack>
  ),
};

export const DifferentSpacing: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Spacing: 1</h3>
        <Stack spacing={1}>
          <DemoBox color="neutral">Item 1</DemoBox>
          <DemoBox color="neutral">Item 2</DemoBox>
          <DemoBox color="neutral">Item 3</DemoBox>
        </Stack>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Spacing: 4</h3>
        <Stack spacing={4}>
          <DemoBox>Item 1</DemoBox>
          <DemoBox>Item 2</DemoBox>
          <DemoBox>Item 3</DemoBox>
        </Stack>
      </div>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Spacing: 8</h3>
        <Stack spacing={8}>
          <DemoBox color="neutral">Item 1</DemoBox>
          <DemoBox color="neutral">Item 2</DemoBox>
          <DemoBox color="neutral">Item 3</DemoBox>
        </Stack>
      </div>
    </div>
  ),
};

export const FlexBox: Story = {
  render: () => (
    <Box display="flex" gap={4} justifyContent="space-between">
      <DemoBox>Left</DemoBox>
      <DemoBox>Center</DemoBox>
      <DemoBox>Right</DemoBox>
    </Box>
  ),
};

export const BoxWithPadding: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Box
        padding={2}
        style={{
          backgroundColor: 'var(--boom-color-neutral-100)',
          border: '1px solid var(--boom-color-neutral-300)',
        }}
      >
        Padding: 2
      </Box>
      <Box
        padding={4}
        style={{
          backgroundColor: 'var(--boom-color-neutral-100)',
          border: '1px solid var(--boom-color-neutral-300)',
        }}
      >
        Padding: 4
      </Box>
      <Box
        padding={8}
        style={{
          backgroundColor: 'var(--boom-color-neutral-100)',
          border: '1px solid var(--boom-color-neutral-300)',
        }}
      >
        Padding: 8
      </Box>
    </div>
  ),
};

export const ResponsiveCard: Story = {
  render: () => (
    <Box
      padding={6}
      style={{
        maxWidth: '400px',
        backgroundColor: 'var(--boom-color-bg-primary)',
        border: '1px solid var(--boom-color-border)',
        borderRadius: 'var(--boom-radius-lg)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      }}
    >
      <Stack spacing={4}>
        <Box>
          <h2 style={{ fontSize: 'var(--boom-font-size-2xl)', fontWeight: 'var(--boom-font-weight-bold)', margin: 0 }}>
            Card Title
          </h2>
          <p style={{ color: 'var(--boom-color-text-secondary)', margin: '0.5rem 0 0' }}>
            Subtitle or description
          </p>
        </Box>
        <Box>
          <p style={{ margin: 0, lineHeight: '1.6' }}>
            This is a card built with Box and Stack components. It demonstrates
            how to compose layouts using the primitive components.
          </p>
        </Box>
        <Box display="flex" gap={2} justifyContent="flex-end">
          <button style={{ padding: '0.5rem 1rem', border: '1px solid var(--boom-color-border)', borderRadius: 'var(--boom-radius-md)', background: 'transparent', cursor: 'pointer' }}>
            Cancel
          </button>
          <button style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: 'var(--boom-radius-md)', background: 'var(--boom-color-primary-600)', color: 'white', cursor: 'pointer' }}>
            Confirm
          </button>
        </Box>
      </Stack>
    </Box>
  ),
};

export const NestedLayouts: Story = {
  render: () => (
    <Stack spacing={6}>
      <Box
        padding={4}
        style={{
          backgroundColor: 'var(--boom-color-neutral-50)',
          border: '1px solid var(--boom-color-neutral-300)',
          borderRadius: 'var(--boom-radius-md)',
        }}
      >
        <Stack spacing={3}>
          <h3 style={{ margin: 0 }}>Nested Stack in Box</h3>
          <Stack direction="row" spacing={2}>
            <DemoBox>Child 1</DemoBox>
            <DemoBox>Child 2</DemoBox>
            <DemoBox>Child 3</DemoBox>
          </Stack>
        </Stack>
      </Box>

      <Stack direction="row" spacing={4}>
        <Box
          padding={4}
          style={{
            flex: 1,
            backgroundColor: 'var(--boom-color-primary-50)',
            border: '1px solid var(--boom-color-primary-300)',
            borderRadius: 'var(--boom-radius-md)',
          }}
        >
          <h4 style={{ margin: '0 0 1rem 0' }}>Column 1</h4>
          <Stack spacing={2}>
            <DemoBox>Item A</DemoBox>
            <DemoBox>Item B</DemoBox>
          </Stack>
        </Box>

        <Box
          padding={4}
          style={{
            flex: 1,
            backgroundColor: 'var(--boom-color-primary-50)',
            border: '1px solid var(--boom-color-primary-300)',
            borderRadius: 'var(--boom-radius-md)',
          }}
        >
          <h4 style={{ margin: '0 0 1rem 0' }}>Column 2</h4>
          <Stack spacing={2}>
            <DemoBox>Item C</DemoBox>
            <DemoBox>Item D</DemoBox>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  ),
};

export const GridLikeLayout: Story = {
  render: () => (
    <Box display="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--boom-spacing-4)' }}>
      <DemoBox>Grid 1</DemoBox>
      <DemoBox>Grid 2</DemoBox>
      <DemoBox>Grid 3</DemoBox>
      <DemoBox>Grid 4</DemoBox>
      <DemoBox>Grid 5</DemoBox>
      <DemoBox>Grid 6</DemoBox>
    </Box>
  ),
};

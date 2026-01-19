import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';
import { Typography } from '../Typography';
import { Card } from '../Card';
import { Box } from '../Box';
import { Stack } from '../Stack';

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    padding: {
      control: { type: 'number', min: 0, max: 12, step: 1 },
    },
    centered: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Box padding={4} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '8px' }}>
        <Typography>
          This is a Container with default settings (large size, centered, padding 4).
        </Typography>
      </Box>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: (
      <Box padding={4} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '8px' }}>
        <Typography variant="h4">Small Container (640px)</Typography>
        <Typography>Ideal for narrow content like forms or single-column text.</Typography>
      </Box>
    ),
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: (
      <Box padding={4} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '8px' }}>
        <Typography variant="h4">Medium Container (768px)</Typography>
        <Typography>Good for tablet-sized layouts and medium content.</Typography>
      </Box>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: (
      <Box padding={4} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '8px' }}>
        <Typography variant="h4">Large Container (1024px)</Typography>
        <Typography>The default size, suitable for most desktop content.</Typography>
      </Box>
    ),
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: (
      <Box padding={4} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '8px' }}>
        <Typography variant="h4">Extra Large Container (1280px)</Typography>
        <Typography>For wide layouts and large-screen displays.</Typography>
      </Box>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    size: 'full',
    children: (
      <Box padding={4} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '8px' }}>
        <Typography variant="h4">Full Width Container</Typography>
        <Typography>Takes up 100% of the available width, useful for full-bleed layouts.</Typography>
      </Box>
    ),
  },
};

export const WithCustomPadding: Story = {
  args: {
    padding: 8,
    children: (
      <Box padding={4} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '8px' }}>
        <Typography variant="h4">Large Padding (8)</Typography>
        <Typography>Container has generous spacing around content.</Typography>
      </Box>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    padding: 0,
    children: (
      <Card>
        <Typography variant="h4">No Container Padding</Typography>
        <Typography>The Card component provides its own padding inside the Container.</Typography>
      </Card>
    ),
  },
};

export const NotCentered: Story = {
  args: {
    centered: false,
    children: (
      <Box padding={4} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '8px' }}>
        <Typography variant="h4">Left-Aligned Container</Typography>
        <Typography>This container is not centered horizontally.</Typography>
      </Box>
    ),
  },
};

export const PageLayout: Story = {
  render: () => (
    <Container as="main" size="lg" padding={6}>
      <Stack spacing={6}>
        <div>
          <Typography variant="h1">Page Title</Typography>
          <Typography variant="caption">Subtitle or description goes here</Typography>
        </div>

        <Card>
          <Stack spacing={3}>
            <Typography variant="h3">Section One</Typography>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
          </Stack>
        </Card>

        <Card>
          <Stack spacing={3}>
            <Typography variant="h3">Section Two</Typography>
            <Typography>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
              ut aliquip ex ea commodo consequat.
            </Typography>
          </Stack>
        </Card>

        <Card>
          <Stack spacing={3}>
            <Typography variant="h3">Section Three</Typography>
            <Typography>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
              dolore eu fugiat nulla pariatur.
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Container>
  ),
};

export const ArticleLayout: Story = {
  render: () => (
    <Container as="article" size="md" padding={6}>
      <Stack spacing={4}>
        <div>
          <Typography variant="h1">Understanding Responsive Design</Typography>
          <Typography variant="caption">Published on December 14, 2025</Typography>
        </div>

        <Typography>
          Responsive web design is an approach that ensures web pages render well on a
          variety of devices and window or screen sizes. It&apos;s about creating a flexible
          and adaptive layout that adjusts seamlessly.
        </Typography>

        <Typography variant="h3">Key Principles</Typography>

        <Typography>
          The foundation of responsive design includes fluid grids, flexible images,
          and media queries. These elements work together to create an optimal viewing
          experience across different devices.
        </Typography>

        <Card padding={6}>
          <Typography variant="h4">Pro Tip</Typography>
          <Typography>
            Start with mobile-first design and progressively enhance for larger screens.
          </Typography>
        </Card>

        <Typography variant="h3">Conclusion</Typography>

        <Typography>
          Mastering responsive design is essential for modern web development, ensuring
          your content is accessible and beautiful on any device.
        </Typography>
      </Stack>
    </Container>
  ),
};

export const NestedContainers: Story = {
  render: () => (
    <Container size="xl" padding={6}>
      <Stack spacing={4}>
        <Typography variant="h2">Outer Container (XL)</Typography>

        <Container size="lg" padding={4} style={{ backgroundColor: 'var(--boom-color-neutral-100)' }}>
          <Stack spacing={3}>
            <Typography variant="h3">Inner Container (LG)</Typography>
            <Typography>
              You can nest containers, though this is usually not necessary.
              It&apos;s shown here to demonstrate the sizing differences.
            </Typography>

            <Container size="sm" padding={3} style={{ backgroundColor: 'var(--boom-color-neutral-200)' }}>
              <Typography variant="h4">Innermost Container (SM)</Typography>
              <Typography>The smallest container, demonstrating the size hierarchy.</Typography>
            </Container>
          </Stack>
        </Container>
      </Stack>
    </Container>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <Stack spacing={6}>
      <Container size="sm">
        <Box padding={3} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '4px' }}>
          <Typography>Small (640px)</Typography>
        </Box>
      </Container>

      <Container size="md">
        <Box padding={3} style={{ backgroundColor: 'var(--boom-color-secondary-100)', borderRadius: '4px' }}>
          <Typography>Medium (768px)</Typography>
        </Box>
      </Container>

      <Container size="lg">
        <Box padding={3} style={{ backgroundColor: 'var(--boom-color-success-100)', borderRadius: '4px' }}>
          <Typography>Large (1024px)</Typography>
        </Box>
      </Container>

      <Container size="xl">
        <Box padding={3} style={{ backgroundColor: 'var(--boom-color-warning-100)', borderRadius: '4px' }}>
          <Typography>Extra Large (1280px)</Typography>
        </Box>
      </Container>

      <Container size="full">
        <Box padding={3} style={{ backgroundColor: 'var(--boom-color-error-100)', borderRadius: '4px' }}>
          <Typography>Full Width (100%)</Typography>
        </Box>
      </Container>
    </Stack>
  ),
};

export const DifferentPadding: Story = {
  render: () => (
    <Container size="md">
      <Stack spacing={4}>
        <Card>
          <Typography variant="h4">Container padding: 0</Typography>
          <Typography>Card provides padding instead.</Typography>
        </Card>

        <Box style={{ backgroundColor: 'var(--boom-color-primary-100)', padding: 'var(--boom-spacing-4)', borderRadius: '4px' }}>
          <Typography>Default container padding: 4</Typography>
        </Box>

        <Box style={{ backgroundColor: 'var(--boom-color-secondary-100)', padding: 'var(--boom-spacing-8)', borderRadius: '4px' }}>
          <Typography>Large container padding: 8</Typography>
        </Box>
      </Stack>
    </Container>
  ),
};

export const SemanticHTML: Story = {
  render: () => (
    <Stack spacing={4}>
      <Container as="main" size="md" padding={4}>
        <Box padding={3} style={{ backgroundColor: 'var(--boom-color-primary-100)', borderRadius: '4px' }}>
          <Typography>&lt;main&gt; Container</Typography>
        </Box>
      </Container>

      <Container as="section" size="md" padding={4}>
        <Box padding={3} style={{ backgroundColor: 'var(--boom-color-secondary-100)', borderRadius: '4px' }}>
          <Typography>&lt;section&gt; Container</Typography>
        </Box>
      </Container>

      <Container as="article" size="md" padding={4}>
        <Box padding={3} style={{ backgroundColor: 'var(--boom-color-success-100)', borderRadius: '4px' }}>
          <Typography>&lt;article&gt; Container</Typography>
        </Box>
      </Container>
    </Stack>
  ),
};

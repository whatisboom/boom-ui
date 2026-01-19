import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';
import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { Box } from '@/components/Box';

const meta: Meta<typeof Grid> = {
  title: 'Page Layouts/Grid',
  component: Grid,
  parameters: {
    docs: {
      description: {
        component: `
**Grid component for multi-column layouts** - eliminates need for inline grid styles.

## Key Features

- **Fixed columns**: Set number of columns with \`columns\` prop
- **Responsive**: Use \`minColumnWidth\` for auto-adjusting layouts
- **Spacing tokens**: Use numbers for gap (4 = 1rem, 6 = 1.5rem)
- **Auto-fit/fill**: Control how columns fill available space
- **Polymorphic**: Render as any HTML element

## When to Use Grid

✅ **Use Grid for:**
- Dashboard stat cards
- Product galleries
- Image grids
- Multi-column content layouts

❌ **Don't use Grid for:**
- Vertical stacks (use Stack)
- Single-column layouts (use Stack or Box)
- Complex grid layouts (use Box with CSS Grid)

## Migration from Inline Styles

\`\`\`tsx
// ❌ Before: Inline grid styles
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem'
}}>

// ✅ After: Grid component
<Grid columns={4} gap={4}>
\`\`\`

## Responsive Grids

Use \`minColumnWidth\` for grids that automatically adjust columns based on available space:

\`\`\`tsx
// Columns auto-adjust, minimum 250px each
<Grid minColumnWidth="250px" gap={4}>
  <Card />
  <Card />
  <Card />
</Grid>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: { type: 'number', min: 1, max: 12, step: 1 },
      description: 'Fixed number of columns',
    },
    gap: {
      control: { type: 'number', min: 0, max: 20, step: 1 },
      description: 'Gap between items (spacing token)',
    },
    minColumnWidth: {
      control: 'text',
      description: 'Minimum column width for responsive grids',
    },
    autoFit: {
      control: 'boolean',
      description: 'Use auto-fit (adjusts columns to width)',
    },
    autoFill: {
      control: 'boolean',
      description: 'Use auto-fill (fills with empty columns)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

const DemoCard = ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
  <Card
    style={{
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--boom-theme-bg-elevated)',
      border: '2px solid var(--boom-theme-border-default)',
    }}
    {...props}
  >
    <Typography>{children}</Typography>
  </Card>
);

/**
 * Default 4-column grid layout
 */
export const Default: Story = {
  args: {
    columns: 4,
    gap: 4,
    children: (
      <>
        <DemoCard>Item 1</DemoCard>
        <DemoCard>Item 2</DemoCard>
        <DemoCard>Item 3</DemoCard>
        <DemoCard>Item 4</DemoCard>
      </>
    ),
  },
};

/**
 * Two-column layout for side-by-side content
 */
export const TwoColumns: Story = {
  args: {
    columns: 2,
    gap: 6,
    children: (
      <>
        <DemoCard>Left Column</DemoCard>
        <DemoCard>Right Column</DemoCard>
        <DemoCard>Bottom Left</DemoCard>
        <DemoCard>Bottom Right</DemoCard>
      </>
    ),
  },
};

/**
 * Three-column layout for product grids
 */
export const ThreeColumns: Story = {
  args: {
    columns: 3,
    gap: 4,
    children: (
      <>
        <DemoCard>Product 1</DemoCard>
        <DemoCard>Product 2</DemoCard>
        <DemoCard>Product 3</DemoCard>
        <DemoCard>Product 4</DemoCard>
        <DemoCard>Product 5</DemoCard>
        <DemoCard>Product 6</DemoCard>
      </>
    ),
  },
};

/**
 * Dashboard with 4-column stat grid - perfect for metrics
 */
export const DashboardStats: Story = {
  args: {
    columns: 4,
    gap: 4,
    children: (
      <>
        <DemoCard>
          <Box>
            <Typography variant="h2" weight="bold">1,234</Typography>
            <Typography variant="caption" color="textSecondary">Total Users</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h2" weight="bold">567</Typography>
            <Typography variant="caption" color="textSecondary">Active Today</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h2" weight="bold">89%</Typography>
            <Typography variant="caption" color="textSecondary">Satisfaction</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h2" weight="bold">$45k</Typography>
            <Typography variant="caption" color="textSecondary">Revenue</Typography>
          </Box>
        </DemoCard>
      </>
    ),
  },
};

/**
 * Responsive grid that auto-adjusts columns based on minimum width.
 * Try resizing the window to see columns adjust automatically.
 */
export const ResponsiveAutoFit: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Grid automatically adjusts number of columns based on available space. Minimum column width is 250px.',
      },
    },
  },
  args: {
    minColumnWidth: '250px',
    gap: 4,
    children: (
      <>
        <DemoCard>Item 1</DemoCard>
        <DemoCard>Item 2</DemoCard>
        <DemoCard>Item 3</DemoCard>
        <DemoCard>Item 4</DemoCard>
        <DemoCard>Item 5</DemoCard>
        <DemoCard>Item 6</DemoCard>
      </>
    ),
  },
};

/**
 * Auto-fill creates empty columns to fill the row
 */
export const ResponsiveAutoFill: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Auto-fill creates empty column slots to fill the row, unlike auto-fit which collapses empty slots.',
      },
    },
  },
  args: {
    minColumnWidth: '200px',
    autoFill: true,
    gap: 4,
    children: (
      <>
        <DemoCard>Item 1</DemoCard>
        <DemoCard>Item 2</DemoCard>
        <DemoCard>Item 3</DemoCard>
      </>
    ),
  },
};

/**
 * Dense grid with minimal spacing for compact layouts
 */
export const CompactGrid: Story = {
  args: {
    columns: 6,
    gap: 2,
    children: (
      <>
        <DemoCard>1</DemoCard>
        <DemoCard>2</DemoCard>
        <DemoCard>3</DemoCard>
        <DemoCard>4</DemoCard>
        <DemoCard>5</DemoCard>
        <DemoCard>6</DemoCard>
        <DemoCard>7</DemoCard>
        <DemoCard>8</DemoCard>
        <DemoCard>9</DemoCard>
        <DemoCard>10</DemoCard>
        <DemoCard>11</DemoCard>
        <DemoCard>12</DemoCard>
      </>
    ),
  },
};

/**
 * Spacious grid with large gaps between items
 */
export const SpaciousGrid: Story = {
  args: {
    columns: 3,
    gap: 8,
    children: (
      <>
        <DemoCard>Card 1</DemoCard>
        <DemoCard>Card 2</DemoCard>
        <DemoCard>Card 3</DemoCard>
        <DemoCard>Card 4</DemoCard>
        <DemoCard>Card 5</DemoCard>
        <DemoCard>Card 6</DemoCard>
      </>
    ),
  },
};

/**
 * Image gallery grid with different sized content
 */
export const ImageGallery: Story = {
  args: {
    columns: 3,
    gap: 3,
    children: (
      <>
        <Box
          style={{
            aspectRatio: '1',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Typography>Image 1</Typography>
        </Box>
        <Box
          style={{
            aspectRatio: '1',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Typography>Image 2</Typography>
        </Box>
        <Box
          style={{
            aspectRatio: '1',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Typography>Image 3</Typography>
        </Box>
        <Box
          style={{
            aspectRatio: '1',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Typography>Image 4</Typography>
        </Box>
        <Box
          style={{
            aspectRatio: '1',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Typography>Image 5</Typography>
        </Box>
        <Box
          style={{
            aspectRatio: '1',
            background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Typography>Image 6</Typography>
        </Box>
      </>
    ),
  },
};

/**
 * Grid rendered as a section element with semantic HTML
 */
export const SemanticElement: Story = {
  args: {
    as: 'section',
    columns: 2,
    gap: 4,
    'aria-label': 'Product Features',
    children: (
      <>
        <DemoCard>
          <Typography variant="h6" weight="bold">Fast</Typography>
          <Typography variant="caption">Lightning-fast performance</Typography>
        </DemoCard>
        <DemoCard>
          <Typography variant="h6" weight="bold">Secure</Typography>
          <Typography variant="caption">Enterprise-grade security</Typography>
        </DemoCard>
        <DemoCard>
          <Typography variant="h6" weight="bold">Scalable</Typography>
          <Typography variant="caption">Grows with your needs</Typography>
        </DemoCard>
        <DemoCard>
          <Typography variant="h6" weight="bold">Reliable</Typography>
          <Typography variant="caption">99.9% uptime guarantee</Typography>
        </DemoCard>
      </>
    ),
  },
};

/**
 * Grid with custom styles for special cases
 */
export const WithCustomStyles: Story = {
  args: {
    columns: 3,
    gap: 4,
    style: {
      padding: '2rem',
      background: 'var(--boom-theme-bg-secondary)',
      borderRadius: '12px',
      border: '2px solid var(--boom-theme-border-default)',
    },
    children: (
      <>
        <DemoCard>Item 1</DemoCard>
        <DemoCard>Item 2</DemoCard>
        <DemoCard>Item 3</DemoCard>
      </>
    ),
  },
};

/**
 * Responsive columns that adjust at different breakpoints.
 * Resize your browser to see the grid adapt from 1 column on mobile
 * to 2 columns on tablets to 4 columns on desktop.
 */
export const ResponsiveBreakpoints: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Grid automatically adjusts column count at different screen sizes using responsive values. Try resizing the window to see the grid adapt.',
      },
    },
  },
  args: {
    columns: { base: 1, md: 2, lg: 4 },
    gap: 4,
    children: (
      <>
        <DemoCard>Item 1</DemoCard>
        <DemoCard>Item 2</DemoCard>
        <DemoCard>Item 3</DemoCard>
        <DemoCard>Item 4</DemoCard>
        <DemoCard>Item 5</DemoCard>
        <DemoCard>Item 6</DemoCard>
        <DemoCard>Item 7</DemoCard>
        <DemoCard>Item 8</DemoCard>
      </>
    ),
  },
};

/**
 * Responsive gap that increases on larger screens for better spacing.
 */
export const ResponsiveGap: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Gap size increases on larger screens to maintain visual balance with more columns.',
      },
    },
  },
  args: {
    columns: 3,
    gap: { base: 2, md: 4, lg: 6 },
    children: (
      <>
        <DemoCard>Item 1</DemoCard>
        <DemoCard>Item 2</DemoCard>
        <DemoCard>Item 3</DemoCard>
        <DemoCard>Item 4</DemoCard>
        <DemoCard>Item 5</DemoCard>
        <DemoCard>Item 6</DemoCard>
      </>
    ),
  },
};

/**
 * Product grid that adapts from single column on mobile to multi-column on larger screens.
 */
export const ResponsiveProductGrid: Story = {
  args: {
    columns: { base: 1, sm: 2, md: 3, lg: 4 },
    gap: { base: 3, md: 4 },
    children: (
      <>
        <DemoCard>
          <Box>
            <Typography variant="h4" weight="bold">Product 1</Typography>
            <Typography variant="caption">$29.99</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h4" weight="bold">Product 2</Typography>
            <Typography variant="caption">$39.99</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h4" weight="bold">Product 3</Typography>
            <Typography variant="caption">$49.99</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h4" weight="bold">Product 4</Typography>
            <Typography variant="caption">$59.99</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h4" weight="bold">Product 5</Typography>
            <Typography variant="caption">$69.99</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h4" weight="bold">Product 6</Typography>
            <Typography variant="caption">$79.99</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h4" weight="bold">Product 7</Typography>
            <Typography variant="caption">$89.99</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h4" weight="bold">Product 8</Typography>
            <Typography variant="caption">$99.99</Typography>
          </Box>
        </DemoCard>
      </>
    ),
  },
};

/**
 * Dashboard that stacks vertically on mobile and spreads horizontally on desktop.
 */
export const ResponsiveDashboard: Story = {
  args: {
    columns: { base: 1, sm: 2, lg: 4 },
    gap: { base: 3, lg: 4 },
    children: (
      <>
        <DemoCard>
          <Box>
            <Typography variant="h2" weight="bold">2,543</Typography>
            <Typography variant="caption">Total Sales</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h2" weight="bold">$12.5k</Typography>
            <Typography variant="caption">Revenue</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h2" weight="bold">342</Typography>
            <Typography variant="caption">New Customers</Typography>
          </Box>
        </DemoCard>
        <DemoCard>
          <Box>
            <Typography variant="h2" weight="bold">94%</Typography>
            <Typography variant="caption">Satisfaction</Typography>
          </Box>
        </DemoCard>
      </>
    ),
  },
};

/**
 * All breakpoints demonstration showing how the grid responds at each screen size.
 */
export const AllBreakpoints: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all available breakpoints: base (mobile), sm (640px+), md (768px+), lg (1024px+), xl (1280px+).',
      },
    },
  },
  args: {
    columns: { base: 1, sm: 2, md: 3, lg: 4, xl: 6 },
    gap: { base: 2, sm: 3, md: 4, lg: 4, xl: 6 },
    children: (
      <>
        <DemoCard>1 col mobile</DemoCard>
        <DemoCard>2 col sm</DemoCard>
        <DemoCard>3 col md</DemoCard>
        <DemoCard>4 col lg</DemoCard>
        <DemoCard>6 col xl</DemoCard>
        <DemoCard>Item 6</DemoCard>
        <DemoCard>Item 7</DemoCard>
        <DemoCard>Item 8</DemoCard>
        <DemoCard>Item 9</DemoCard>
        <DemoCard>Item 10</DemoCard>
        <DemoCard>Item 11</DemoCard>
        <DemoCard>Item 12</DemoCard>
      </>
    ),
  },
};

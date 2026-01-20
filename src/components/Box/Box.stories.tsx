import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Layout/Box',
  component: Box,
  parameters: {
    docs: {
      description: {
        component: `
**Box is your layout utility component** - use it instead of inline styles for layout and spacing.

## Key Features

- **Spacing tokens**: Use numbers (4, 6, 8) instead of CSS units ('1rem', '1.5rem')
- **Layout props**: Control display, flex, alignment without inline styles
- **Polymorphic**: Render as any HTML element via \`as\` prop
- **Type-safe**: Full TypeScript support with autocomplete

## Spacing Token System

Box props accept numbers that map to design tokens:

| Prop Value | CSS Variable | Pixels | Rems |
|------------|--------------|--------|------|
| 0 | --boom-spacing-0 | 0 | 0 |
| 1 | --boom-spacing-1 | 4px | 0.25rem |
| 2 | --boom-spacing-2 | 8px | 0.5rem |
| 3 | --boom-spacing-3 | 12px | 0.75rem |
| 4 | --boom-spacing-4 | 16px | 1rem |
| 5 | --boom-spacing-5 | 20px | 1.25rem |
| 6 | --boom-spacing-6 | 24px | 1.5rem |
| 8 | --boom-spacing-8 | 32px | 2rem |
| 10 | --boom-spacing-10 | 40px | 2.5rem |
| 12 | --boom-spacing-12 | 48px | 3rem |
| 16 | --boom-spacing-16 | 64px | 4rem |
| 20 | --boom-spacing-20 | 80px | 5rem |

## When to Use Box

✅ **Use Box for:**
- Layout containers with padding/margin
- Flex/grid containers
- Custom spacing between elements
- Polymorphic components (render as different elements)

❌ **Don't use Box for:**
- Simple inline text (use Typography)
- Stacked vertical layouts (use Stack)
- Grid layouts (use Grid component)
- Card-like containers (use Card)

## Migration from Inline Styles

\`\`\`tsx
// ❌ Before: Inline styles
<div style={{
  display: 'flex',
  padding: '1.5rem',
  gap: '1rem'
}}>

// ✅ After: Box with spacing tokens
<Box display="flex" padding={6} gap={4}>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    display: {
      control: 'select',
      options: ['block', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid'],
    },
    flexDirection: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    alignItems: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    justifyContent: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    },
    gap: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
    },
    padding: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
    },
    margin: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Box>;

const DemoItem = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    padding: '1rem',
    background: 'var(--boom-color-primary)',
    color: 'white',
    borderRadius: '4px',
    textAlign: 'center'
  }}>
    {children}
  </div>
);

export const Default: Story = {
  args: {
    children: <DemoItem>Box content</DemoItem>,
  },
};

export const FlexRow: Story = {
  args: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    children: (
      <>
        <DemoItem>Item 1</DemoItem>
        <DemoItem>Item 2</DemoItem>
        <DemoItem>Item 3</DemoItem>
      </>
    ),
  },
};

export const FlexColumn: Story = {
  args: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    children: (
      <>
        <DemoItem>Item 1</DemoItem>
        <DemoItem>Item 2</DemoItem>
        <DemoItem>Item 3</DemoItem>
      </>
    ),
  },
};

export const CenteredContent: Story = {
  args: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    style: { border: '2px dashed var(--boom-color-border)' },
    children: <DemoItem>Centered content</DemoItem>,
  },
};

export const SpaceBetween: Story = {
  args: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
    style: { border: '2px dashed var(--boom-color-border)' },
    children: (
      <>
        <DemoItem>Left</DemoItem>
        <DemoItem>Center</DemoItem>
        <DemoItem>Right</DemoItem>
      </>
    ),
  },
};

export const WithPadding: Story = {
  args: {
    padding: 4,
    style: { border: '2px solid var(--boom-color-border)' },
    children: <DemoItem>Content with padding</DemoItem>,
  },
};

export const WithMargin: Story = {
  args: {
    margin: 4,
    style: { border: '2px solid var(--boom-color-primary)' },
    children: <DemoItem>Content with margin</DemoItem>,
  },
};

export const CustomDimensions: Story = {
  args: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '300px',
    height: '150px',
    style: { border: '2px dashed var(--boom-color-border)' },
    children: <DemoItem>300px × 150px</DemoItem>,
  },
};

export const NestedBoxes: Story = {
  args: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    padding: 3,
    style: { border: '2px solid var(--boom-color-border)' },
    children: (
      <>
        <Box display="flex" gap={2}>
          <DemoItem>Row 1 - Item 1</DemoItem>
          <DemoItem>Row 1 - Item 2</DemoItem>
        </Box>
        <Box display="flex" gap={2}>
          <DemoItem>Row 2 - Item 1</DemoItem>
          <DemoItem>Row 2 - Item 2</DemoItem>
        </Box>
      </>
    ),
  },
};

export const AsSection: Story = {
  args: {
    as: 'section',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: 4,
    children: (
      <>
        <h2 style={{ margin: 0 }}>Section Heading</h2>
        <p style={{ margin: 0 }}>This Box is rendered as a section element.</p>
        <DemoItem>Content inside section</DemoItem>
      </>
    ),
  },
};

/**
 * Demonstrates the spacing token system - use numbers instead of CSS units.
 * All spacing props (padding, margin, gap) accept the same token values.
 */
export const SpacingTokens: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Compare different spacing values. Box uses design tokens for consistent spacing across your app.',
      },
    },
  },
  render: () => (
    <Box display="flex" flexDirection="column" gap={4}>
      <div>
        <p style={{ margin: '0 0 0.5rem' }}><strong>padding={1}</strong> (4px / 0.25rem)</p>
        <Box padding={1} style={{ border: '2px solid var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}>
          <DemoItem>Small padding</DemoItem>
        </Box>
      </div>

      <div>
        <p style={{ margin: '0 0 0.5rem' }}><strong>padding={4}</strong> (16px / 1rem)</p>
        <Box padding={4} style={{ border: '2px solid var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}>
          <DemoItem>Medium padding</DemoItem>
        </Box>
      </div>

      <div>
        <p style={{ margin: '0 0 0.5rem' }}><strong>padding={8}</strong> (32px / 2rem)</p>
        <Box padding={8} style={{ border: '2px solid var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}>
          <DemoItem>Large padding</DemoItem>
        </Box>
      </div>

      <div>
        <p style={{ margin: '0 0 0.5rem' }}><strong>padding={12}</strong> (48px / 3rem)</p>
        <Box padding={12} style={{ border: '2px solid var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}>
          <DemoItem>Extra large padding</DemoItem>
        </Box>
      </div>
    </Box>
  ),
};

/**
 * Shows how to replace common inline style patterns with Box props.
 * Box provides a cleaner, more maintainable API for layouts.
 */
export const MigrationExamples: Story = {
  parameters: {
    docs: {
      description: {
        story: `
### Before (inline styles):
\`\`\`tsx
<div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem' }}>
  <span>Left</span>
  <span>Right</span>
</div>
\`\`\`

### After (Box with tokens):
\`\`\`tsx
<Box display="flex" justifyContent="space-between" padding={6}>
  <span>Left</span>
  <span>Right</span>
</Box>
\`\`\`

**Benefits:**
- Type-safe with autocomplete
- Consistent spacing from design system
- Easier to maintain and refactor
- No magic CSS strings
        `,
      },
    },
  },
  render: () => (
    <Box display="flex" flexDirection="column" gap={6}>
      {/* Example 1: Flex row with space between */}
      <Box>
        <p style={{ margin: '0 0 0.5rem' }}><strong>Flex row with space-between</strong></p>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding={6}
          style={{ border: '2px solid var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}
        >
          <DemoItem>Left</DemoItem>
          <DemoItem>Right</DemoItem>
        </Box>
        <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: 'var(--boom-color-bg-tertiary)', borderRadius: '4px', fontSize: '0.875rem' }}>
          {`<Box display="flex" justifyContent="space-between" padding={6}>`}
        </code>
      </Box>

      {/* Example 2: Centered content */}
      <Box>
        <p style={{ margin: '0 0 0.5rem' }}><strong>Centered content</strong></p>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="120px"
          style={{ border: '2px dashed var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}
        >
          <DemoItem>Centered</DemoItem>
        </Box>
        <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: 'var(--boom-color-bg-tertiary)', borderRadius: '4px', fontSize: '0.875rem' }}>
          {`<Box display="flex" alignItems="center" justifyContent="center" height="120px">`}
        </code>
      </Box>

      {/* Example 3: Flex column with gap */}
      <Box>
        <p style={{ margin: '0 0 0.5rem' }}><strong>Flex column with gap</strong></p>
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          padding={4}
          style={{ border: '2px solid var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}
        >
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Box>
        <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: 'var(--boom-color-bg-tertiary)', borderRadius: '4px', fontSize: '0.875rem' }}>
          {`<Box display="flex" flexDirection="column" gap={3} padding={4}>`}
        </code>
      </Box>
    </Box>
  ),
};

/**
 * Box can render as any HTML element while maintaining layout props.
 * Use the `as` prop to change the underlying element.
 */
export const PolymorphicRendering: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Box can render as any HTML element (div, section, article, nav, header, footer, etc.) while keeping all layout props.',
      },
    },
  },
  render: () => (
    <Box display="flex" flexDirection="column" gap={4}>
      <Box as="header" padding={4} style={{ border: '2px solid var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}>
        <code style={{ marginBottom: '0.5rem', display: 'block' }}>{`<Box as="header" padding={4}>`}</code>
        <p style={{ margin: 0 }}>Rendered as &lt;header&gt; element</p>
      </Box>

      <Box as="article" padding={4} style={{ border: '2px solid var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}>
        <code style={{ marginBottom: '0.5rem', display: 'block' }}>{`<Box as="article" padding={4}>`}</code>
        <p style={{ margin: 0 }}>Rendered as &lt;article&gt; element</p>
      </Box>

      <Box as="nav" padding={4} style={{ border: '2px solid var(--boom-color-border)', background: 'var(--boom-color-bg-secondary)' }}>
        <code style={{ marginBottom: '0.5rem', display: 'block' }}>{`<Box as="nav" padding={4}>`}</code>
        <p style={{ margin: 0 }}>Rendered as &lt;nav&gt; element</p>
      </Box>
    </Box>
  ),
};

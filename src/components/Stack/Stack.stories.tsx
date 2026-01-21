import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  parameters: {
    docs: {
      description: {
        component: `
**Flexbox container with semantic spacing** - replaces inline flex styles.

## When to Use Stack

✅ **Use Stack instead of:**
- \`<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>\`
- \`<div style={{ display: 'flex', justifyContent: 'space-between' }}>\`
- Manual margin/padding on each child element

❌ **Don't use Stack for:**
- Grid layouts (use Grid component)
- Single items that need padding (use Box component)
- Complex nested layouts (consider composition of Stack + Box + Grid)

## Key Benefits

- **Semantic spacing**: Uses spacing tokens (\`spacing={4}\` = 16px)
- **Consistent gaps**: No manual margins on children
- **Readable code**: \`<Stack direction="row" justify="space-between">\` is clearer than inline styles
- **Theme-aware**: Respects spacing scale

## Common Patterns

**Vertical list of items:**
\`\`\`tsx
<Stack spacing={4}>
  <Item1 />
  <Item2 />
  <Item3 />
</Stack>
\`\`\`

**Horizontal row with space-between:**
\`\`\`tsx
<Stack direction="row" justify="space-between">
  <LeftContent />
  <RightContent />
</Stack>
\`\`\`

**Form fields with consistent spacing:**
\`\`\`tsx
<Stack spacing={6}>
  <TextField label="Name" />
  <TextField label="Email" />
  <Stack direction="row" spacing={2} justify="flex-end">
    <Button variant="outline">Cancel</Button>
    <Button>Submit</Button>
  </Stack>
</Stack>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['row', 'column'],
    },
    spacing: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const DemoItem = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    padding: '1rem',
    background: 'var(--boom-color-primary)',
    color: 'white',
    borderRadius: '4px',
    textAlign: 'center',
    minWidth: '60px',
  }}>
    {children}
  </div>
);

/**
 * Before/After comparison showing Stack vs inline flex styles.
 * Both render identically, but Stack uses semantic spacing tokens.
 */
export const BeforeAfter: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      {/* Before: Inline styles */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--boom-theme-text-secondary)' }}>
          ❌ Before (Inline Styles)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </div>
        <pre style={{
          marginTop: '1rem',
          padding: '0.5rem',
          background: 'var(--boom-theme-bg-secondary)',
          fontSize: '0.75rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
}}>
  <Item1 />
  <Item2 />
  <Item3 />
</div>`}
        </pre>
      </div>

      {/* After: Stack component */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--boom-theme-text-secondary)' }}>
          ✅ After (Stack Component)
        </h3>
        <Stack spacing={4}>
          <DemoItem>Item 1</DemoItem>
          <DemoItem>Item 2</DemoItem>
          <DemoItem>Item 3</DemoItem>
        </Stack>
        <pre style={{
          marginTop: '1rem',
          padding: '0.5rem',
          background: 'var(--boom-theme-bg-secondary)',
          fontSize: '0.75rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`<Stack spacing={4}>
  <Item1 />
  <Item2 />
  <Item3 />
</Stack>`}
        </pre>
      </div>
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: (
      <>
        <DemoItem>Item 1</DemoItem>
        <DemoItem>Item 2</DemoItem>
        <DemoItem>Item 3</DemoItem>
      </>
    ),
  },
};

export const VerticalStack: Story = {
  args: {
    direction: 'column',
    spacing: 3,
    children: (
      <>
        <DemoItem>Item 1</DemoItem>
        <DemoItem>Item 2</DemoItem>
        <DemoItem>Item 3</DemoItem>
        <DemoItem>Item 4</DemoItem>
      </>
    ),
  },
};

export const HorizontalStack: Story = {
  args: {
    direction: 'row',
    spacing: 3,
    children: (
      <>
        <DemoItem>Item 1</DemoItem>
        <DemoItem>Item 2</DemoItem>
        <DemoItem>Item 3</DemoItem>
        <DemoItem>Item 4</DemoItem>
      </>
    ),
  },
};

export const CenteredItems: Story = {
  args: {
    direction: 'column',
    spacing: 2,
    align: 'center',
    children: (
      <>
        <DemoItem>Short</DemoItem>
        <DemoItem>Medium Length</DemoItem>
        <DemoItem>Very Long Item Text</DemoItem>
      </>
    ),
  },
};

/**
 * Common pattern: Header/toolbar with items spread across.
 * Replaces inline flex with justify-content: space-between.
 */
export const SpaceBetweenComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Before: Inline styles */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--boom-theme-text-secondary)' }}>
          ❌ Before (Inline Styles)
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '1rem', border: '2px dashed var(--boom-color-border)' }}>
          <DemoItem>Title</DemoItem>
          <DemoItem>Actions</DemoItem>
        </div>
        <pre style={{
          marginTop: '1rem',
          padding: '0.5rem',
          background: 'var(--boom-theme-bg-secondary)',
          fontSize: '0.75rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}}>
  <Title />
  <Actions />
</div>`}
        </pre>
      </div>

      {/* After: Stack component */}
      <div>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--boom-theme-text-secondary)' }}>
          ✅ After (Stack Component)
        </h3>
        <Stack direction="row" justify="space-between" align="center" style={{ width: '100%', padding: '1rem', border: '2px dashed var(--boom-color-border)' }}>
          <DemoItem>Title</DemoItem>
          <DemoItem>Actions</DemoItem>
        </Stack>
        <pre style={{
          marginTop: '1rem',
          padding: '0.5rem',
          background: 'var(--boom-theme-bg-secondary)',
          fontSize: '0.75rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
{`<Stack
  direction="row"
  justify="space-between"
  align="center"
>
  <Title />
  <Actions />
</Stack>`}
        </pre>
      </div>
    </div>
  ),
};

export const SpaceBetween: Story = {
  args: {
    direction: 'row',
    justify: 'space-between',
    style: { width: '100%', padding: '1rem', border: '2px dashed var(--boom-color-border)' },
    children: (
      <>
        <DemoItem>Left</DemoItem>
        <DemoItem>Center</DemoItem>
        <DemoItem>Right</DemoItem>
      </>
    ),
  },
};

export const SpaceEvenly: Story = {
  args: {
    direction: 'row',
    justify: 'space-evenly',
    style: { width: '100%', padding: '1rem', border: '2px dashed var(--boom-color-border)' },
    children: (
      <>
        <DemoItem>1</DemoItem>
        <DemoItem>2</DemoItem>
        <DemoItem>3</DemoItem>
        <DemoItem>4</DemoItem>
      </>
    ),
  },
};

export const TightSpacing: Story = {
  args: {
    direction: 'column',
    spacing: 1,
    children: (
      <>
        <DemoItem>Item 1</DemoItem>
        <DemoItem>Item 2</DemoItem>
        <DemoItem>Item 3</DemoItem>
      </>
    ),
  },
};

export const LargeSpacing: Story = {
  args: {
    direction: 'column',
    spacing: 6,
    children: (
      <>
        <DemoItem>Item 1</DemoItem>
        <DemoItem>Item 2</DemoItem>
        <DemoItem>Item 3</DemoItem>
      </>
    ),
  },
};

export const FormLayout: Story = {
  args: {
    direction: 'column',
    spacing: 4,
    children: (
      <>
        <div>
          <label htmlFor="form-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Name
          </label>
          <input
            id="form-name"
            type="text"
            placeholder="Enter your name"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--boom-color-border)',
              borderRadius: '4px',
            }}
          />
        </div>
        <div>
          <label htmlFor="form-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Email
          </label>
          <input
            id="form-email"
            type="email"
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--boom-color-border)',
              borderRadius: '4px',
            }}
          />
        </div>
        <Stack direction="row" spacing={2} justify="flex-end">
          <button style={{
            padding: '0.5rem 1rem',
            border: '1px solid var(--boom-color-border)',
            borderRadius: '4px',
            background: 'transparent',
            cursor: 'pointer',
          }}>
            Cancel
          </button>
          <button style={{
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            background: 'var(--boom-color-primary)',
            color: 'white',
            cursor: 'pointer',
          }}>
            Submit
          </button>
        </Stack>
      </>
    ),
  },
};

export const NestedStacks: Story = {
  args: {
    direction: 'column',
    spacing: 4,
    children: (
      <>
        <Stack direction="row" spacing={2}>
          <DemoItem>Row 1 - Item 1</DemoItem>
          <DemoItem>Row 1 - Item 2</DemoItem>
          <DemoItem>Row 1 - Item 3</DemoItem>
        </Stack>
        <Stack direction="row" spacing={2}>
          <DemoItem>Row 2 - Item 1</DemoItem>
          <DemoItem>Row 2 - Item 2</DemoItem>
        </Stack>
        <Stack direction="row" spacing={2}>
          <DemoItem>Row 3 - Item 1</DemoItem>
          <DemoItem>Row 3 - Item 2</DemoItem>
          <DemoItem>Row 3 - Item 3</DemoItem>
          <DemoItem>Row 3 - Item 4</DemoItem>
        </Stack>
      </>
    ),
  },
};

export const AsNav: Story = {
  args: {
    as: 'nav',
    direction: 'row',
    spacing: 3,
    children: (
      <>
        <a href="/home" style={{ color: 'var(--boom-color-primary)', textDecoration: 'none' }}>Home</a>
        <a href="/about" style={{ color: 'var(--boom-color-primary)', textDecoration: 'none' }}>About</a>
        <a href="/services" style={{ color: 'var(--boom-color-primary)', textDecoration: 'none' }}>Services</a>
        <a href="/contact" style={{ color: 'var(--boom-color-primary)', textDecoration: 'none' }}>Contact</a>
      </>
    ),
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Components/Layout/Box',
  component: Box,
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

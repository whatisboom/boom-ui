import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography';

const meta = {
  title: 'Components/Data Display/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption', 'label'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading 1',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading 2',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: 'Heading 3',
  },
};

export const Heading4: Story = {
  args: {
    variant: 'h4',
    children: 'Heading 4',
  },
};

export const Heading5: Story = {
  args: {
    variant: 'h5',
    children: 'Heading 5',
  },
};

export const Heading6: Story = {
  args: {
    variant: 'h6',
    children: 'Heading 6',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children: 'This is body text with normal styling.',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'This is caption text, typically smaller and secondary.',
  },
};

export const Label: Story = {
  args: {
    variant: 'label',
    children: 'Label Text',
  },
};

export const AllHeadings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h1">Heading 1 - The largest heading</Typography>
      <Typography variant="h2">Heading 2 - Second level heading</Typography>
      <Typography variant="h3">Heading 3 - Third level heading</Typography>
      <Typography variant="h4">Heading 4 - Fourth level heading</Typography>
      <Typography variant="h5">Heading 5 - Fifth level heading</Typography>
      <Typography variant="h6">Heading 6 - Sixth level heading</Typography>
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography align="left">Left aligned text (default)</Typography>
      <Typography align="center">Center aligned text</Typography>
      <Typography align="right">Right aligned text</Typography>
    </div>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography weight="normal">Normal weight text</Typography>
      <Typography weight="medium">Medium weight text</Typography>
      <Typography weight="semibold">Semibold weight text</Typography>
      <Typography weight="bold">Bold weight text</Typography>
    </div>
  ),
};

export const TypographyHierarchy: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Typography variant="h1">Article Title</Typography>
      <Typography variant="caption" style={{ display: 'block', marginTop: '0.5rem', marginBottom: '2rem' }}>
        Published on December 14, 2023
      </Typography>

      <Typography variant="h2" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        Introduction
      </Typography>
      <Typography variant="body" style={{ marginBottom: '1rem' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </Typography>

      <Typography variant="h3" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Subsection
      </Typography>
      <Typography variant="body">
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </Typography>
    </div>
  ),
};

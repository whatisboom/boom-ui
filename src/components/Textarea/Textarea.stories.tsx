import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';
import { Stack } from '../Stack';

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    resize: {
      control: 'radio',
      options: ['none', 'vertical', 'horizontal', 'both', 'auto'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <Textarea value={value} onChange={setValue} label="Comment" size={args.size} resize={args.resize} />;
  },
};

export const WithValue: Story = {
  render: (args) => {
    const [value, setValue] = useState('This is a multi-line\ntext area with\nexisting content.');
    return <Textarea value={value} onChange={setValue} label="Description" size={args.size} resize={args.resize} />;
  },
};

export const WithPlaceholder: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        value={value}
        onChange={setValue}
        label="Feedback"
        placeholder="Tell us what you think..."
        size={args.size}
        resize={args.resize}
      />
    );
  },
};

export const Sizes: Story = {
  argTypes: { size: { control: false } },
  render: (args) => {
    const [value, setValue] = useState('Sample text');
    return (
      <Stack direction="column" spacing={4}>
        <Textarea value={value} onChange={setValue} label="Small" size="sm" resize={args.resize} />
        <Textarea value={value} onChange={setValue} label="Medium (default)" size="md" resize={args.resize} />
        <Textarea value={value} onChange={setValue} label="Large" size="lg" resize={args.resize} />
      </Stack>
    );
  },
};

export const WithHelperText: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        value={value}
        onChange={setValue}
        label="Bio"
        helperText="Tell us about yourself (max 500 characters)"
        size={args.size}
        resize={args.resize}
      />
    );
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        value={value}
        onChange={setValue}
        label="Message"
        error="This field is required"
        required
        size={args.size}
        resize={args.resize}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Textarea
      value="This textarea is disabled"
      onChange={() => {}}
      label="Disabled textarea"
      disabled
    />
  ),
};

export const ReadOnly: Story = {
  render: () => (
    <Textarea
      value="This textarea is read-only"
      onChange={() => {}}
      label="Read-only textarea"
      readOnly
    />
  ),
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <Textarea value={value} onChange={setValue} label="Required field" required size={args.size} resize={args.resize} />;
  },
};

export const AutoResize: Story = {
  render: () => {
    const [value, setValue] = useState('Type here and watch it grow...');
    return (
      <Textarea
        value={value}
        onChange={setValue}
        label="Auto-resizing textarea"
        resize="auto"
        minRows={2}
        maxRows={10}
        helperText="This textarea will automatically resize as you type"
      />
    );
  },
};

export const ResizeOptions: Story = {
  argTypes: { resize: { control: false } },
  render: (args) => {
    const [value, setValue] = useState('Drag the corner to resize');
    return (
      <Stack direction="column" spacing={4}>
        <Textarea value={value} onChange={setValue} label="No resize" resize="none" size={args.size} />
        <Textarea value={value} onChange={setValue} label="Vertical resize" resize="vertical" size={args.size} />
        <Textarea value={value} onChange={setValue} label="Horizontal resize" resize="horizontal" size={args.size} />
        <Textarea value={value} onChange={setValue} label="Both directions" resize="both" size={args.size} />
      </Stack>
    );
  },
};

export const FullWidth: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div style={{ border: '2px dashed var(--boom-theme-border-default)', padding: '1rem' }}>
        <Textarea
          value={value}
          onChange={setValue}
          label="Full width textarea"
          fullWidth
          size={args.size}
          resize={args.resize}
        />
      </div>
    );
  },
};

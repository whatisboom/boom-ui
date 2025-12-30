import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';
import { Stack } from '../Stack';

const meta: Meta<typeof Textarea> = {
  title: 'Forms & Validation/Textarea',
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
  render: () => {
    const [value, setValue] = useState('');
    return <Textarea value={value} onChange={setValue} label="Comment" />;
  },
};

export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState('This is a multi-line\ntext area with\nexisting content.');
    return <Textarea value={value} onChange={setValue} label="Description" />;
  },
};

export const WithPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        value={value}
        onChange={setValue}
        label="Feedback"
        placeholder="Tell us what you think..."
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState('Sample text');
    return (
      <Stack direction="column" spacing={4}>
        <Textarea value={value} onChange={setValue} label="Small" size="sm" />
        <Textarea value={value} onChange={setValue} label="Medium (default)" size="md" />
        <Textarea value={value} onChange={setValue} label="Large" size="lg" />
      </Stack>
    );
  },
};

export const WithHelperText: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        value={value}
        onChange={setValue}
        label="Bio"
        helperText="Tell us about yourself (max 500 characters)"
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Textarea
        value={value}
        onChange={setValue}
        label="Message"
        error="This field is required"
        required
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
  render: () => {
    const [value, setValue] = useState('');
    return <Textarea value={value} onChange={setValue} label="Required field" required />;
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
  render: () => {
    const [value, setValue] = useState('Drag the corner to resize');
    return (
      <Stack direction="column" spacing={4}>
        <Textarea value={value} onChange={setValue} label="No resize" resize="none" />
        <Textarea value={value} onChange={setValue} label="Vertical resize" resize="vertical" />
        <Textarea value={value} onChange={setValue} label="Horizontal resize" resize="horizontal" />
        <Textarea value={value} onChange={setValue} label="Both directions" resize="both" />
      </Stack>
    );
  },
};

export const FullWidth: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ border: '2px dashed var(--boom-theme-border-default)', padding: '1rem' }}>
        <Textarea
          value={value}
          onChange={setValue}
          label="Full width textarea"
          fullWidth
        />
      </div>
    );
  },
};

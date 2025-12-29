import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';
import { Stack } from '../Stack';

const meta: Meta<typeof Select> = {
  title: 'Forms & Validation/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('us');
    return (
      <Select
        value={value}
        onChange={setValue}
        options={countryOptions}
        label="Country"
      />
    );
  },
};

export const WithPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select
        value={value}
        onChange={setValue}
        options={countryOptions}
        label="Country"
        placeholder="Select a country"
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState('medium');
    return (
      <Stack direction="column" spacing={4}>
        <Select
          value={value}
          onChange={setValue}
          options={priorityOptions}
          label="Small"
          size="sm"
        />
        <Select
          value={value}
          onChange={setValue}
          options={priorityOptions}
          label="Medium (default)"
          size="md"
        />
        <Select
          value={value}
          onChange={setValue}
          options={priorityOptions}
          label="Large"
          size="lg"
        />
      </Stack>
    );
  },
};

export const WithHelperText: Story = {
  render: () => {
    const [value, setValue] = useState('us');
    return (
      <Select
        value={value}
        onChange={setValue}
        options={countryOptions}
        label="Country"
        helperText="Select your country of residence"
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select
        value={value}
        onChange={setValue}
        options={countryOptions}
        label="Country"
        error="Please select a country"
        required
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Select
      value="us"
      onChange={() => {}}
      options={countryOptions}
      label="Country"
      disabled
    />
  ),
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const options = [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium (Coming Soon)', disabled: true },
      { value: 'high', label: 'High' },
      { value: 'urgent', label: 'Urgent (Premium Only)', disabled: true },
    ];
    return (
      <Select
        value={value}
        onChange={setValue}
        options={options}
        label="Priority"
        placeholder="Select priority"
      />
    );
  },
};

export const Required: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select
        value={value}
        onChange={setValue}
        options={countryOptions}
        label="Country"
        placeholder="Select a country"
        required
      />
    );
  },
};

export const FullWidth: Story = {
  render: () => {
    const [value, setValue] = useState('us');
    return (
      <div style={{ border: '2px dashed var(--boom-theme-border-default)', padding: '1rem' }}>
        <Select
          value={value}
          onChange={setValue}
          options={countryOptions}
          label="Country"
          fullWidth
        />
      </div>
    );
  },
};

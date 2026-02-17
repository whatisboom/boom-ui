import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';
import { Stack } from '../Stack';

const meta: Meta<typeof RadioGroup> = {
  title: 'Forms/Radio Group',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const sizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const planOptions = [
  { value: 'free', label: 'Free Plan' },
  { value: 'pro', label: 'Pro Plan' },
  { value: 'enterprise', label: 'Enterprise Plan' },
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('medium');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={sizeOptions}
        label="Choose a size"
        orientation={args.orientation}
        size={args.size}
      />
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    const [value, setValue] = useState('medium');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={sizeOptions}
        label="Choose a size"
        orientation="horizontal"
      />
    );
  },
};

export const Sizes: Story = {
  argTypes: { size: { control: false } },
  render: (args) => {
    const [value, setValue] = useState('medium');
    return (
      <Stack direction="column" spacing={4}>
        <RadioGroup
          value={value}
          onChange={setValue}
          options={sizeOptions}
          label="Small size"
          size="sm"
          orientation={args.orientation}
        />
        <RadioGroup
          value={value}
          onChange={setValue}
          options={sizeOptions}
          label="Medium size (default)"
          size="md"
          orientation={args.orientation}
        />
        <RadioGroup
          value={value}
          onChange={setValue}
          options={sizeOptions}
          label="Large size"
          size="lg"
          orientation={args.orientation}
        />
      </Stack>
    );
  },
};

export const WithHelperText: Story = {
  render: (args) => {
    const [value, setValue] = useState('pro');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={planOptions}
        label="Select your plan"
        helperText="You can change your plan at any time"
        orientation={args.orientation}
        size={args.size}
      />
    );
  },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={planOptions}
        label="Select your plan"
        error={!value ? "Please select a plan to continue" : undefined}
        required
        orientation={args.orientation}
        size={args.size}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup
      value="pro"
      onChange={() => {}}
      options={planOptions}
      label="Your current plan"
      disabled
      helperText="Contact support to change your plan"
    />
  ),
};

export const WithDisabledOption: Story = {
  render: (args) => {
    const [value, setValue] = useState('free');
    const options = [
      { value: 'free', label: 'Free Plan' },
      { value: 'pro', label: 'Pro Plan (Coming Soon)', disabled: true },
      { value: 'enterprise', label: 'Enterprise Plan' },
    ];
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={options}
        label="Select your plan"
        orientation={args.orientation}
        size={args.size}
      />
    );
  },
};

export const Required: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={planOptions}
        label="Select your plan"
        required
        orientation={args.orientation}
        size={args.size}
      />
    );
  },
};

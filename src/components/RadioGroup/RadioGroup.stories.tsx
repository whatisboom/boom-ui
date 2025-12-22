import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';
import { Stack } from '../Stack';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Inputs/RadioGroup',
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
  render: () => {
    const [value, setValue] = useState('medium');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={sizeOptions}
        label="Choose a size"
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
  render: () => {
    const [value, setValue] = useState('medium');
    return (
      <Stack direction="column" spacing={4}>
        <RadioGroup
          value={value}
          onChange={setValue}
          options={sizeOptions}
          label="Small size"
          size="sm"
        />
        <RadioGroup
          value={value}
          onChange={setValue}
          options={sizeOptions}
          label="Medium size (default)"
          size="md"
        />
        <RadioGroup
          value={value}
          onChange={setValue}
          options={sizeOptions}
          label="Large size"
          size="lg"
        />
      </Stack>
    );
  },
};

export const WithHelperText: Story = {
  render: () => {
    const [value, setValue] = useState('pro');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={planOptions}
        label="Select your plan"
        helperText="You can change your plan at any time"
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={planOptions}
        label="Select your plan"
        error={!value ? "Please select a plan to continue" : undefined}
        required
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
  render: () => {
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
      />
    );
  },
};

export const Required: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioGroup
        value={value}
        onChange={setValue}
        options={planOptions}
        label="Select your plan"
        required
      />
    );
  },
};

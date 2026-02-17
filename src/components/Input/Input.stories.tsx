import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    disabled: {
      control: 'boolean',
    },
    required: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    helperText: "We'll never share your email with anyone else",
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    error: 'Please enter a valid email address',
  },
};

export const Required: Story = {
  args: {
    label: 'Password',
    type: 'password',
    required: true,
    helperText: 'This field is required',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Read Only',
    value: 'This value cannot be changed',
    readOnly: true,
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: 'Search',
    type: 'search',
    placeholder: 'Search...',
    leftIcon: '🔍',
  },
};

export const WithRightIcon: Story = {
  args: {
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
    rightIcon: '✓',
  },
};

export const Small: Story = {
  args: {
    label: 'Small Input',
    size: 'sm',
    placeholder: 'Small size',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Input',
    size: 'md',
    placeholder: 'Medium size (default)',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Input',
    size: 'lg',
    placeholder: 'Large size',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    placeholder: 'This input spans the full width',
    fullWidth: true,
  },
};

export const PasswordInput: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    helperText: 'Must be at least 8 characters',
  },
};

export const NumberInput: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
  },
};

export const PhoneInput: Story = {
  args: {
    label: 'Phone',
    type: 'tel',
    placeholder: '+1 (555) 123-4567',
    leftIcon: '📞',
  },
};

export const LoginForm: Story = {
  render: (args) => (
    <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Input
        {...args}
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        leftIcon="📧"
      />
      <Input
        {...args}
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
        helperText="Must be at least 8 characters"
      />
    </div>
  ),
};

export const ValidationStates: Story = {
  render: (args) => (
    <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Input
        {...args}
        label="Valid Input"
        placeholder="This is valid"
        helperText="This field is valid"
        rightIcon="✓"
      />
      <Input
        {...args}
        label="Invalid Input"
        placeholder="This has an error"
        error="This field is required"
      />
      <Input
        {...args}
        label="Warning Input"
        placeholder="This might need attention"
        helperText="This value seems unusual"
      />
    </div>
  ),
};

export const AllSizes: Story = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <Input
        {...args}
        label="Small"
        size="sm"
        placeholder="Small input"
      />
      <Input
        {...args}
        label="Medium"
        size="md"
        placeholder="Medium input (default)"
      />
      <Input
        {...args}
        label="Large"
        size="lg"
        placeholder="Large input"
      />
    </div>
  ),
};

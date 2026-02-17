import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';
import { Stack } from '../Stack';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    labelPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="Accept terms"
        size={args.size}
        labelPosition={args.labelPosition}
      />
    );
  },
};

export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="Subscribed"
        size={args.size}
        labelPosition={args.labelPosition}
      />
    );
  },
};

export const WithoutLabel: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox checked={checked} onChange={setChecked} size={args.size} />;
  },
};

export const Sizes: Story = {
  argTypes: { size: { control: false } },
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <Stack direction="column" spacing={3}>
        <Checkbox
          checked={checked}
          onChange={setChecked}
          label="Small checkbox"
          size="sm"
          labelPosition={args.labelPosition}
        />
        <Checkbox
          checked={checked}
          onChange={setChecked}
          label="Medium checkbox (default)"
          size="md"
          labelPosition={args.labelPosition}
        />
        <Checkbox
          checked={checked}
          onChange={setChecked}
          label="Large checkbox"
          size="lg"
          labelPosition={args.labelPosition}
        />
      </Stack>
    );
  },
};

export const LabelPositions: Story = {
  argTypes: { labelPosition: { control: false } },
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return (
      <Stack direction="column" spacing={3}>
        <Checkbox
          checked={checked}
          onChange={setChecked}
          label="Label on right (default)"
          labelPosition="right"
          size={args.size}
        />
        <Checkbox
          checked={checked}
          onChange={setChecked}
          label="Label on left"
          labelPosition="left"
          size={args.size}
        />
      </Stack>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Stack direction="column" spacing={3}>
      <Checkbox
        checked={false}
        onChange={() => {}}
        label="Disabled unchecked"
        disabled
      />
      <Checkbox
        checked={true}
        onChange={() => {}}
        label="Disabled checked"
        disabled
      />
    </Stack>
  ),
};

export const Required: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="Accept terms and conditions"
        required
        size={args.size}
        labelPosition={args.labelPosition}
      />
    );
  },
};

export const WithHelperText: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="Subscribe to newsletter"
        helperText="Receive weekly updates about new features and products"
        size={args.size}
        labelPosition={args.labelPosition}
      />
    );
  },
};

export const WithError: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label="I agree to the terms and conditions"
        error="You must accept the terms to continue"
        required
        size={args.size}
        labelPosition={args.labelPosition}
      />
    );
  },
};

export const FullWidth: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ border: '2px dashed var(--boom-color-border)', padding: '1rem' }}>
        <Checkbox
          checked={checked}
          onChange={setChecked}
          label="Full width checkbox"
          fullWidth
          helperText="This checkbox takes up the full width of its container"
          size={args.size}
          labelPosition={args.labelPosition}
        />
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [formState, setFormState] = useState({
      newsletter: true,
      updates: false,
      terms: false,
    });

    return (
      <Stack direction="column" spacing={4}>
        <h3 style={{ margin: 0 }}>Preferences</h3>
        <Checkbox
          checked={formState.newsletter}
          onChange={(checked) => setFormState({ ...formState, newsletter: checked })}
          label="Email newsletter"
          helperText="Receive our weekly newsletter with the latest updates"
        />
        <Checkbox
          checked={formState.updates}
          onChange={(checked) => setFormState({ ...formState, updates: checked })}
          label="Product updates"
          helperText="Get notified when we release new features"
        />
        <Checkbox
          checked={formState.terms}
          onChange={(checked) => setFormState({ ...formState, terms: checked })}
          label="I agree to the terms and conditions"
          error={!formState.terms ? 'You must accept the terms to continue' : undefined}
          required
        />
      </Stack>
    );
  },
};

export const MultipleCheckboxes: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(['javascript']);

    const options = [
      { id: 'javascript', label: 'JavaScript' },
      { id: 'typescript', label: 'TypeScript' },
      { id: 'python', label: 'Python' },
      { id: 'rust', label: 'Rust' },
      { id: 'go', label: 'Go' },
    ];

    const toggleOption = (id: string) => {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    return (
      <Stack direction="column" spacing={3}>
        <h3 style={{ margin: 0 }}>Select your favorite languages</h3>
        {options.map((option) => (
          <Checkbox
            key={option.id}
            checked={selected.includes(option.id)}
            onChange={() => toggleOption(option.id)}
            label={option.label}
            size={args.size}
          />
        ))}
        <div style={{ marginTop: '1rem', color: 'var(--boom-color-text-secondary)' }}>
          Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
        </div>
      </Stack>
    );
  },
};

export const AllSizesWithStates: Story = {
  argTypes: { size: { control: false }, labelPosition: { control: false } },
  render: () => {
    const [checked, setChecked] = useState(true);

    return (
      <Stack direction="column" spacing={4}>
        <div>
          <h4 style={{ margin: '0 0 1rem 0' }}>Small</h4>
          <Stack direction="column" spacing={2}>
            <Checkbox
              checked={checked}
              onChange={setChecked}
              label="Normal"
              size="sm"
            />
            <Checkbox
              checked={checked}
              onChange={setChecked}
              label="With helper text"
              helperText="This is helper text"
              size="sm"
            />
            <Checkbox
              checked={false}
              onChange={() => {}}
              label="Disabled"
              disabled
              size="sm"
            />
          </Stack>
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem 0' }}>Medium (default)</h4>
          <Stack direction="column" spacing={2}>
            <Checkbox
              checked={checked}
              onChange={setChecked}
              label="Normal"
              size="md"
            />
            <Checkbox
              checked={checked}
              onChange={setChecked}
              label="With helper text"
              helperText="This is helper text"
              size="md"
            />
            <Checkbox
              checked={false}
              onChange={() => {}}
              label="Disabled"
              disabled
              size="md"
            />
          </Stack>
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem 0' }}>Large</h4>
          <Stack direction="column" spacing={2}>
            <Checkbox
              checked={checked}
              onChange={setChecked}
              label="Normal"
              size="lg"
            />
            <Checkbox
              checked={checked}
              onChange={setChecked}
              label="With helper text"
              helperText="This is helper text"
              size="lg"
            />
            <Checkbox
              checked={false}
              onChange={() => {}}
              label="Disabled"
              disabled
              size="lg"
            />
          </Stack>
        </div>
      </Stack>
    );
  },
};

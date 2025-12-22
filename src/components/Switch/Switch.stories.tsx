import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';
import { Stack } from '../Stack';

const meta: Meta<typeof Switch> = {
  title: 'Components/Inputs/Switch',
  component: Switch,
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
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onChange={setChecked} label="Enable notifications" />;
  },
};

export const Checked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return <Switch checked={checked} onChange={setChecked} label="Notifications enabled" />;
  },
};

export const WithoutLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} onChange={setChecked} />;
  },
};

export const Sizes: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Stack direction="column" spacing={3}>
        <Switch
          checked={checked}
          onChange={setChecked}
          label="Small switch"
          size="sm"
        />
        <Switch
          checked={checked}
          onChange={setChecked}
          label="Medium switch (default)"
          size="md"
        />
        <Switch
          checked={checked}
          onChange={setChecked}
          label="Large switch"
          size="lg"
        />
      </Stack>
    );
  },
};

export const LabelPositions: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Stack direction="column" spacing={3}>
        <Switch
          checked={checked}
          onChange={setChecked}
          label="Label on right (default)"
          labelPosition="right"
        />
        <Switch
          checked={checked}
          onChange={setChecked}
          label="Label on left"
          labelPosition="left"
        />
      </Stack>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Stack direction="column" spacing={3}>
      <Switch
        checked={false}
        onChange={() => {}}
        label="Disabled off"
        disabled
      />
      <Switch
        checked={true}
        onChange={() => {}}
        label="Disabled on"
        disabled
      />
    </Stack>
  ),
};

export const Required: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="Accept terms and conditions"
        required
      />
    );
  },
};

export const WithHelperText: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="Email notifications"
        helperText="Receive email updates about your account activity"
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="I agree to the terms and conditions"
        error="You must accept the terms to continue"
        required
      />
    );
  },
};

export const FullWidth: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ border: '2px dashed var(--boom-color-border)', padding: '1rem' }}>
        <Switch
          checked={checked}
          onChange={setChecked}
          label="Full width switch"
          fullWidth
          helperText="This switch takes up the full width of its container"
        />
      </div>
    );
  },
};

export const SettingsExample: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      darkMode: false,
      autoSave: true,
      analytics: false,
    });

    return (
      <Stack direction="column" spacing={4}>
        <h3 style={{ margin: 0 }}>Settings</h3>
        <Switch
          checked={settings.notifications}
          onChange={(checked) => setSettings({ ...settings, notifications: checked })}
          label="Push notifications"
          helperText="Receive push notifications for important updates"
        />
        <Switch
          checked={settings.darkMode}
          onChange={(checked) => setSettings({ ...settings, darkMode: checked })}
          label="Dark mode"
          helperText="Switch between light and dark themes"
        />
        <Switch
          checked={settings.autoSave}
          onChange={(checked) => setSettings({ ...settings, autoSave: checked })}
          label="Auto-save"
          helperText="Automatically save your work"
        />
        <Switch
          checked={settings.analytics}
          onChange={(checked) => setSettings({ ...settings, analytics: checked })}
          label="Analytics"
          helperText="Help us improve by sharing anonymous usage data"
        />
      </Stack>
    );
  },
};

export const AllSizesWithStates: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);

    return (
      <Stack direction="column" spacing={4}>
        <div>
          <h4 style={{ margin: '0 0 1rem 0' }}>Small</h4>
          <Stack direction="column" spacing={2}>
            <Switch
              checked={checked}
              onChange={setChecked}
              label="Normal"
              size="sm"
            />
            <Switch
              checked={checked}
              onChange={setChecked}
              label="With helper text"
              helperText="This is helper text"
              size="sm"
            />
            <Switch
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
            <Switch
              checked={checked}
              onChange={setChecked}
              label="Normal"
              size="md"
            />
            <Switch
              checked={checked}
              onChange={setChecked}
              label="With helper text"
              helperText="This is helper text"
              size="md"
            />
            <Switch
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
            <Switch
              checked={checked}
              onChange={setChecked}
              label="Normal"
              size="lg"
            />
            <Switch
              checked={checked}
              onChange={setChecked}
              label="With helper text"
              helperText="This is helper text"
              size="lg"
            />
            <Switch
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

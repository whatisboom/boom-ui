import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['single', 'range'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
    showMarkers: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

// Single Mode Stories
export const SingleValue: Story = {
  argTypes: { mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <Slider
        label="Volume"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        size={args.size}
        disabled={args.disabled}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const WithStep: Story = {
  argTypes: { mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <Slider
        label="Brightness"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={10}
        size={args.size}
        disabled={args.disabled}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const WithMarkers: Story = {
  argTypes: { mode: { control: false }, showMarkers: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <Slider
        label="Volume"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={25}
        showMarkers
        size={args.size}
        disabled={args.disabled}
        readOnly={args.readOnly}
      />
    );
  },
};

export const CustomFormatting: Story = {
  argTypes: { mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <Slider
        label="Discount"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        formatValue={(v) => `${v}%`}
        size={args.size}
        disabled={args.disabled}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const SmallSize: Story = {
  argTypes: { size: { control: false }, mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(30);
    return (
      <Slider
        label="Small Slider"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        size="sm"
        disabled={args.disabled}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const LargeSize: Story = {
  argTypes: { size: { control: false }, mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(70);
    return (
      <Slider
        label="Large Slider"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        size="lg"
        disabled={args.disabled}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const Disabled: Story = {
  argTypes: { disabled: { control: false }, mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <Slider
        label="Disabled Slider"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        disabled
        size={args.size}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const ReadOnly: Story = {
  argTypes: { readOnly: { control: false }, mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <Slider
        label="Read-only Slider"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        readOnly
        size={args.size}
        disabled={args.disabled}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const WithError: Story = {
  argTypes: { mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(30);
    return (
      <Slider
        label="Temperature"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        error="Value must be at least 50"
        size={args.size}
        disabled={args.disabled}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const WithHelperText: Story = {
  argTypes: { mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState(50);
    return (
      <Slider
        label="Volume"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        helperText="Adjust the volume level"
        size={args.size}
        disabled={args.disabled}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

// Range Mode Stories
export const RangeValue: Story = {
  argTypes: { mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState<[number, number]>([20, 80]);
    return (
      <Slider
        mode="range"
        label="Price Range"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        size={args.size}
        disabled={args.disabled}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const RangeWithFormatting: Story = {
  argTypes: { mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState<[number, number]>([250, 750]);
    return (
      <Slider
        mode="range"
        label="Price Range"
        value={value}
        onChange={setValue}
        min={0}
        max={1000}
        step={50}
        formatValue={(v) => `$${v}`}
        size={args.size}
        disabled={args.disabled}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

export const RangeWithMarkers: Story = {
  argTypes: { mode: { control: false }, showMarkers: { control: false } },
  render: (args) => {
    const [value, setValue] = useState<[number, number]>([25, 75]);
    return (
      <Slider
        mode="range"
        label="Temperature Range"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        step={25}
        showMarkers
        formatValue={(v) => `${v}°F`}
        size={args.size}
        disabled={args.disabled}
        readOnly={args.readOnly}
      />
    );
  },
};

export const RangeDisabled: Story = {
  argTypes: { disabled: { control: false }, mode: { control: false } },
  render: (args) => {
    const [value, setValue] = useState<[number, number]>([30, 70]);
    return (
      <Slider
        mode="range"
        label="Disabled Range"
        value={value}
        onChange={setValue}
        min={0}
        max={100}
        disabled
        size={args.size}
        readOnly={args.readOnly}
        showMarkers={args.showMarkers}
      />
    );
  },
};

// Playground
export const Playground: Story = {
  render: (args) => {
    const [singleValue, setSingleValue] = useState(50);
    const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80]);

    const {
      label,
      min,
      max,
      step,
      size,
      disabled,
      readOnly,
      showMarkers,
      fullWidth,
      error,
      helperText,
      formatValue,
      markers,
    } = args;

    const mode = (args as { mode?: 'single' | 'range' }).mode || 'single';

    if (mode === 'range') {
      return (
        <Slider
          mode="range"
          value={rangeValue}
          onChange={setRangeValue}
          label={label}
          min={min}
          max={max}
          step={step}
          size={size}
          disabled={disabled}
          readOnly={readOnly}
          showMarkers={showMarkers}
          fullWidth={fullWidth}
          error={error}
          helperText={helperText}
          formatValue={formatValue}
          markers={markers}
        />
      );
    }

    return (
      <Slider
        value={singleValue}
        onChange={setSingleValue}
        label={label}
        min={min}
        max={max}
        step={step}
        size={size}
        disabled={disabled}
        readOnly={readOnly}
        showMarkers={showMarkers}
        fullWidth={fullWidth}
        error={error}
        helperText={helperText}
        formatValue={formatValue}
        markers={markers}
      />
    );
  },
  args: {
    label: 'Slider',
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    disabled: false,
    readOnly: false,
    showMarkers: false,
    fullWidth: false,
  },
};

// Theme Customization Example
export const ThemeCustomization: Story = {
  render: () => {
    const [hue, setHue] = useState(213);
    const [saturation, setSaturation] = useState(94);
    const [lightness, setLightness] = useState(68);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Slider
          label="Hue"
          value={hue}
          onChange={setHue}
          min={0}
          max={360}
        />
        <Slider
          label="Saturation"
          value={saturation}
          onChange={setSaturation}
          min={0}
          max={100}
          formatValue={(v) => `${v}%`}
        />
        <Slider
          label="Lightness"
          value={lightness}
          onChange={setLightness}
          min={0}
          max={100}
          formatValue={(v) => `${v}%`}
        />
        <div
          style={{
            width: '100%',
            height: '100px',
            backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            borderRadius: '8px',
            border: '1px solid var(--boom-theme-border-default)',
          }}
        />
      </div>
    );
  },
};

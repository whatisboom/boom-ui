import { useState, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Popover } from './Popover';
import { Button } from '../../Button';
import { Typography } from '../../Typography';

const meta: Meta<typeof Popover> = {
  title: 'Overlays & Dialogs/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
    offset: {
      control: { type: 'number', min: 0, max: 50, step: 4 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Popover
        </Button>
        <Popover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          anchorEl={buttonRef}
          placement={args.placement}
          offset={args.offset}
        >
          <div style={{ padding: '1rem', minWidth: '200px' }}>
            <Typography>This is a popover with default placement (bottom).</Typography>
          </div>
        </Popover>
      </div>
    );
  },
};

export const TopPlacement: Story = {
  argTypes: { placement: { control: false } },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <div style={{ padding: '150px', display: 'flex', justifyContent: 'center' }}>
        <Button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Popover (Top)
        </Button>
        <Popover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          anchorEl={buttonRef}
          placement="top"
          offset={args.offset}
        >
          <div style={{ padding: '1rem', minWidth: '200px' }}>
            <Typography>This popover appears above the button.</Typography>
          </div>
        </Popover>
      </div>
    );
  },
};

export const LeftPlacement: Story = {
  argTypes: { placement: { control: false } },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Popover (Left)
        </Button>
        <Popover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          anchorEl={buttonRef}
          placement="left"
          offset={args.offset}
        >
          <div style={{ padding: '1rem', minWidth: '200px' }}>
            <Typography>This popover appears to the left of the button.</Typography>
          </div>
        </Popover>
      </div>
    );
  },
};

export const RightPlacement: Story = {
  argTypes: { placement: { control: false } },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Popover (Right)
        </Button>
        <Popover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          anchorEl={buttonRef}
          placement="right"
          offset={args.offset}
        >
          <div style={{ padding: '1rem', minWidth: '200px' }}>
            <Typography>This popover appears to the right of the button.</Typography>
          </div>
        </Popover>
      </div>
    );
  },
};

export const CustomOffset: Story = {
  argTypes: { offset: { control: false } },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Popover (Large Offset)
        </Button>
        <Popover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          anchorEl={buttonRef}
          placement={args.placement}
          offset={24}
        >
          <div style={{ padding: '1rem', minWidth: '200px' }}>
            <Typography>This popover has a larger offset (24px) from the button.</Typography>
          </div>
        </Popover>
      </div>
    );
  },
};

export const WithMenu: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const menuItems = [
      { label: 'Edit', icon: '✏️' },
      { label: 'Duplicate', icon: '📋' },
      { label: 'Archive', icon: '📦' },
      { label: 'Delete', icon: '🗑️' },
    ];

    return (
      <div style={{ padding: '100px', display: 'flex', justifyContent: 'center' }}>
        <Button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          Options
        </Button>
        <Popover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          anchorEl={buttonRef}
          placement={args.placement}
          offset={args.offset}
        >
          <div style={{ minWidth: '180px' }}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setIsOpen(false)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </Popover>
      </div>
    );
  },
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Drawer } from './Drawer';
import { Button } from '../../Button';
import { Typography } from '../../Typography';

const meta: Meta<typeof Drawer> = {
  title: 'Primitives/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'radio',
      options: ['left', 'right'],
    },
    width: {
      control: 'text',
    },
    closeOnClickOutside: {
      control: 'boolean',
    },
    closeOnEscape: {
      control: 'boolean',
    },
    lockScroll: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ padding: '1.5rem' }}>
            <Typography variant="h3">Drawer Content</Typography>
            <Typography style={{ marginTop: '1rem' }}>
              This is a default drawer that slides in from the left side.
            </Typography>
          </div>
        </Drawer>
      </>
    );
  },
};

export const RightSide: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Right Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} side="right">
          <div style={{ padding: '1.5rem' }}>
            <Typography variant="h3">Right Drawer</Typography>
            <Typography style={{ marginTop: '1rem' }}>
              This drawer slides in from the right side.
            </Typography>
          </div>
        </Drawer>
      </>
    );
  },
};

export const CustomWidth: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Wide Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} width="400px">
          <div style={{ padding: '1.5rem' }}>
            <Typography variant="h3">Wide Drawer</Typography>
            <Typography style={{ marginTop: '1rem' }}>
              This drawer has a custom width of 400px.
            </Typography>
          </div>
        </Drawer>
      </>
    );
  },
};

export const WithNavigation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Navigation Drawer</Button>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div style={{ padding: '1.5rem' }}>
            <Typography variant="h3" style={{ marginBottom: '1.5rem' }}>
              Navigation
            </Typography>
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Dashboard', 'Projects', 'Team', 'Settings', 'Help'].map((item) => (
                  <li key={item} style={{ marginBottom: '0.5rem' }}>
                    <a
                      href={`/${item.toLowerCase()}`}
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        textDecoration: 'none',
                        color: 'inherit',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Drawer>
      </>
    );
  },
};

export const NonDismissible: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Non-Dismissible Drawer</Button>
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          closeOnClickOutside={false}
          closeOnEscape={false}
        >
          <div style={{ padding: '1.5rem' }}>
            <Typography variant="h3">Non-Dismissible Drawer</Typography>
            <Typography style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              This drawer can only be closed by clicking the button below.
            </Typography>
            <Button onClick={() => setIsOpen(false)}>Close Drawer</Button>
          </div>
        </Drawer>
      </>
    );
  },
};

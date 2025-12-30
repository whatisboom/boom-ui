import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Overlay } from './Overlay';
import { Button } from '../../Button';
import { Typography } from '../../Typography';

const meta: Meta<typeof Overlay> = {
  title: 'Overlays & Dialogs/Overlay',
  component: Overlay,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '⚠️ Low-level primitive component. Most developers should use Modal, Drawer, or Popover instead.',
      },
    },
  },
  argTypes: {
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
type Story = StoryObj<typeof Overlay>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Overlay</Button>
        <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '2rem',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              zIndex: 1000,
            }}
          >
            <Typography variant="h4" style={{ marginBottom: '1rem' }}>
              Overlay Content
            </Typography>
            <Typography style={{ marginBottom: '1.5rem' }}>
              Click outside or press Escape to close.
            </Typography>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </Overlay>
      </>
    );
  },
};

export const NonDismissible: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Non-Dismissible Overlay</Button>
        <Overlay
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          closeOnClickOutside={false}
          closeOnEscape={false}
        >
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '2rem',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              zIndex: 1000,
            }}
          >
            <Typography variant="h4" style={{ marginBottom: '1rem' }}>
              Non-Dismissible Overlay
            </Typography>
            <Typography style={{ marginBottom: '1.5rem' }}>
              This overlay cannot be closed by clicking outside or pressing Escape.
              You must use the button.
            </Typography>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </Overlay>
      </>
    );
  },
};

export const WithScrollLock: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={() => setIsOpen(true)}>Open Overlay (Scroll Locked)</Button>
        </div>

        <div style={{ height: '200vh', padding: '2rem', background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)' }}>
          <Typography variant="h5" style={{ marginBottom: '1rem' }}>
            Scroll Down
          </Typography>
          <Typography>
            This page has a lot of content. When you open the overlay with scroll lock,
            the page behind will not be scrollable.
          </Typography>
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i} style={{ marginTop: '1rem' }}>
              Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          ))}
        </div>

        <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)} lockScroll={true}>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '2rem',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              zIndex: 1000,
              maxWidth: '500px',
            }}
          >
            <Typography variant="h4" style={{ marginBottom: '1rem' }}>
              Scroll Locked
            </Typography>
            <Typography style={{ marginBottom: '1.5rem' }}>
              The background page is not scrollable while this overlay is open.
              Try scrolling - it will not work!
            </Typography>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </Overlay>
      </div>
    );
  },
};

export const WithoutScrollLock: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={() => setIsOpen(true)}>Open Overlay (No Scroll Lock)</Button>
        </div>

        <div style={{ height: '200vh', padding: '2rem', background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)' }}>
          <Typography variant="h5" style={{ marginBottom: '1rem' }}>
            Scroll Down
          </Typography>
          <Typography>
            This page has a lot of content. When you open the overlay without scroll lock,
            you can still scroll the background.
          </Typography>
          {Array.from({ length: 50 }).map((_, i) => (
            <p key={i} style={{ marginTop: '1rem' }}>
              Line {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          ))}
        </div>

        <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)} lockScroll={false}>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '2rem',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              zIndex: 1000,
              maxWidth: '500px',
            }}
          >
            <Typography variant="h4" style={{ marginBottom: '1rem' }}>
              No Scroll Lock
            </Typography>
            <Typography style={{ marginBottom: '1.5rem' }}>
              The background page can still be scrolled while this overlay is open.
            </Typography>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </Overlay>
      </div>
    );
  },
};

export const CustomStyledContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Custom Styled Overlay</Button>
        <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '12px',
              boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
              zIndex: 1000,
              maxWidth: '400px',
            }}
          >
            <Typography variant="h4" style={{ marginBottom: '0.5rem', color: 'white' }}>
              Custom Notification
            </Typography>
            <Typography style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.9)' }}>
              This overlay has custom positioning and styling.
            </Typography>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Dismiss
            </Button>
          </div>
        </Overlay>
      </>
    );
  },
};

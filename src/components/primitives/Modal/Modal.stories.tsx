import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from './Modal';
import { Button } from '../../Button';

const meta: Meta<typeof Modal> = {
  title: 'Overlays & Dialogs/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
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
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    size: 'md',
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size={args.size}
          closeOnClickOutside={args.closeOnClickOutside}
          closeOnEscape={args.closeOnEscape}
          lockScroll={args.lockScroll}
        >
          <p>This is a basic modal with default settings.</p>
        </Modal>
      </>
    );
  },
};

export const WithTitle: Story = {
  args: {
    size: 'md',
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Modal Title"
          size={args.size}
          closeOnClickOutside={args.closeOnClickOutside}
          closeOnEscape={args.closeOnEscape}
          lockScroll={args.lockScroll}
        >
          <p>This modal has a title.</p>
        </Modal>
      </>
    );
  },
};

export const WithTitleAndDescription: Story = {
  args: {
    size: 'md',
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Confirm Action"
          description="Are you sure you want to proceed with this action?"
          size={args.size}
          closeOnClickOutside={args.closeOnClickOutside}
          closeOnEscape={args.closeOnEscape}
          lockScroll={args.lockScroll}
        >
          <p>This modal has both a title and description.</p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <Button variant="primary">Confirm</Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      </>
    );
  },
};

export const SmallSize: Story = {
  args: {
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
  },
  argTypes: { size: { control: false } },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Small Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size="sm"
          title="Small Modal"
          closeOnClickOutside={args.closeOnClickOutside}
          closeOnEscape={args.closeOnEscape}
          lockScroll={args.lockScroll}
        >
          <p>This is a small modal.</p>
        </Modal>
      </>
    );
  },
};

export const LargeSize: Story = {
  args: {
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
  },
  argTypes: { size: { control: false } },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Large Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size="lg"
          title="Large Modal"
          closeOnClickOutside={args.closeOnClickOutside}
          closeOnEscape={args.closeOnEscape}
          lockScroll={args.lockScroll}
        >
          <p>This is a large modal with more content space.</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </Modal>
      </>
    );
  },
};

export const FullSize: Story = {
  args: {
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
  },
  argTypes: { size: { control: false } },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Full Screen Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size="full"
          title="Full Screen Modal"
          closeOnClickOutside={args.closeOnClickOutside}
          closeOnEscape={args.closeOnEscape}
          lockScroll={args.lockScroll}
        >
          <p>This modal takes up the full screen.</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
        </Modal>
      </>
    );
  },
};

export const NonDismissible: Story = {
  args: {
    size: 'md',
    lockScroll: true,
  },
  argTypes: {
    closeOnClickOutside: { control: false },
    closeOnEscape: { control: false },
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Non-Dismissible Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          closeOnClickOutside={false}
          closeOnEscape={false}
          title="Non-Dismissible Modal"
          description="This modal can only be closed by clicking the close button or Cancel."
          size={args.size}
          lockScroll={args.lockScroll}
        >
          <p>You must click a button to close this modal.</p>
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
          </div>
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  args: {
    size: 'md',
    closeOnClickOutside: true,
    closeOnEscape: true,
    lockScroll: true,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Contact Form"
          description="Please fill out the form below"
          size={args.size}
          closeOnClickOutside={args.closeOnClickOutside}
          closeOnEscape={args.closeOnEscape}
          lockScroll={args.lockScroll}
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.25rem' }}>
                Name
              </label>
              <input
                type="text"
                id="name"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.25rem' }}>
                Email
              </label>
              <input
                type="email"
                id="email"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label htmlFor="message" style={{ display: 'block', marginBottom: '0.25rem' }}>
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary">Submit</Button>
            </div>
          </form>
        </Modal>
      </>
    );
  },
};

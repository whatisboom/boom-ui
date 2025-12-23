import { useState, useRef, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Portal } from './Portal';
import { Button } from '../../Button';
import { Typography } from '../../Typography';

const meta: Meta<typeof Portal> = {
  title: 'Primitives/Portal',
  component: Portal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Portal renders children into a different part of the DOM tree, outside the parent component hierarchy. Useful for modals, tooltips, and other overlays that need to break out of overflow/z-index constraints.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Portal>;

export const Default: Story = {
  render: () => {
    const [show, setShow] = useState(false);

    return (
      <div>
        <div
          style={{
            padding: '2rem',
            border: '2px dashed #ccc',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography variant="h4" style={{ marginBottom: '1rem' }}>
            Parent Container (overflow: hidden)
          </Typography>
          <Typography style={{ marginBottom: '1rem' }}>
            This container has overflow: hidden, but the portal content will render outside of it.
          </Typography>
          <Button onClick={() => setShow(!show)}>
            {show ? 'Hide' : 'Show'} Portal Content
          </Button>

          {show && (
            <Portal>
              <div
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  padding: '2rem',
                  background: 'var(--boom-color-surface)',
                  border: '2px solid var(--boom-color-primary)',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  zIndex: 1000,
                }}
              >
                <Typography variant="h4" style={{ marginBottom: '0.5rem' }}>
                  Portaled Content
                </Typography>
                <Typography>
                  This content is rendered via Portal, so it appears outside the parent&apos;s overflow constraint.
                </Typography>
                <Typography style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
                  Check the DOM - this is rendered as a direct child of document.body!
                </Typography>
              </div>
            </Portal>
          )}
        </div>
      </div>
    );
  },
};

export const CustomContainer: Story = {
  render: () => {
    const [show, setShow] = useState(false);
    const [customContainer, setCustomContainer] = useState<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setCustomContainer(containerRef.current);
    }, []);

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <Button onClick={() => setShow(!show)}>
            {show ? 'Hide' : 'Show'} Portal Content
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <div
            style={{
              flex: 1,
              padding: '1.5rem',
              border: '2px dashed #999',
              borderRadius: '8px',
            }}
          >
            <Typography variant="h5" style={{ marginBottom: '0.5rem' }}>
              Source Container
            </Typography>
            <Typography>The portal is created from this component.</Typography>
          </div>

          <div
            ref={containerRef}
            style={{
              flex: 1,
              padding: '1.5rem',
              border: '2px solid var(--boom-color-primary)',
              borderRadius: '8px',
              position: 'relative',
              minHeight: '150px',
            }}
          >
            <Typography variant="h5" style={{ marginBottom: '0.5rem' }}>
              Custom Portal Container
            </Typography>
            <Typography>Portal content will render here:</Typography>

            {show && customContainer && (
              <Portal container={customContainer}>
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'var(--boom-color-surface-variant)',
                    borderRadius: '4px',
                  }}
                >
                  <Typography>
                    ✨ This content was portaled into the custom container!
                  </Typography>
                </div>
              </Portal>
            )}
          </div>
        </div>
      </div>
    );
  },
};

export const MultiplePortals: Story = {
  render: () => {
    const [showPortal1, setShowPortal1] = useState(false);
    const [showPortal2, setShowPortal2] = useState(false);
    const [showPortal3, setShowPortal3] = useState(false);

    return (
      <div>
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <Button onClick={() => setShowPortal1(!showPortal1)}>
            Portal 1
          </Button>
          <Button onClick={() => setShowPortal2(!showPortal2)}>
            Portal 2
          </Button>
          <Button onClick={() => setShowPortal3(!showPortal3)}>
            Portal 3
          </Button>
        </div>

        <Typography style={{ marginBottom: '1rem' }}>
          Multiple portals can coexist. They all render to document.body by default.
        </Typography>

        {showPortal1 && (
          <Portal>
            <div
              style={{
                position: 'fixed',
                top: '20%',
                left: '20%',
                padding: '1.5rem',
                background: '#e3f2fd',
                border: '2px solid #2196f3',
                borderRadius: '8px',
                zIndex: 1000,
              }}
            >
              <Typography>Portal 1 Content</Typography>
              <Button size="sm" onClick={() => setShowPortal1(false)} style={{ marginTop: '0.5rem' }}>
                Close
              </Button>
            </div>
          </Portal>
        )}

        {showPortal2 && (
          <Portal>
            <div
              style={{
                position: 'fixed',
                top: '40%',
                left: '40%',
                padding: '1.5rem',
                background: '#f3e5f5',
                border: '2px solid #9c27b0',
                borderRadius: '8px',
                zIndex: 1001,
              }}
            >
              <Typography>Portal 2 Content</Typography>
              <Button size="sm" onClick={() => setShowPortal2(false)} style={{ marginTop: '0.5rem' }}>
                Close
              </Button>
            </div>
          </Portal>
        )}

        {showPortal3 && (
          <Portal>
            <div
              style={{
                position: 'fixed',
                top: '60%',
                left: '60%',
                padding: '1.5rem',
                background: '#fff3e0',
                border: '2px solid #ff9800',
                borderRadius: '8px',
                zIndex: 1002,
              }}
            >
              <Typography>Portal 3 Content</Typography>
              <Button size="sm" onClick={() => setShowPortal3(false)} style={{ marginTop: '0.5rem' }}>
                Close
              </Button>
            </div>
          </Portal>
        )}
      </div>
    );
  },
};

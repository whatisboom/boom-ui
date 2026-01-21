import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast } from './';
import { Button } from '../Button';
import { Stack } from '../Stack';

const meta: Meta<typeof ToastProvider> = {
  title: 'Feedback & Status/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

// Demo component that uses toast
const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <Stack direction="column" spacing={3}>
      <Stack direction="row" spacing={3}>
        <Button onClick={() => toast('This is a default info toast')}>Show Info</Button>
        <Button onClick={() => toast({ message: 'Operation completed!', variant: 'success' })}>
          Show Success
        </Button>
        <Button onClick={() => toast({ message: 'Please review this warning', variant: 'warning' })}>
          Show Warning
        </Button>
        <Button onClick={() => toast({ message: 'Something went wrong!', variant: 'error' })}>
          Show Error
        </Button>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Button onClick={() => toast({ message: 'Quick toast!', duration: 1000 })}>
          1s Duration
        </Button>
        <Button onClick={() => toast({ message: 'Default duration (3s)' })}>3s Duration</Button>
        <Button onClick={() => toast({ message: 'Long toast', duration: 10000 })}>
          10s Duration
        </Button>
      </Stack>

      <Button
        onClick={() => {
          toast({ message: 'First toast', variant: 'info' });
          setTimeout(() => toast({ message: 'Second toast', variant: 'success' }), 500);
          setTimeout(() => toast({ message: 'Third toast', variant: 'warning' }), 1000);
        }}
      >
        Show Multiple Toasts
      </Button>
    </Stack>
  );
};

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <div style={{ padding: '2rem' }}>
        <h2>Toast Notifications</h2>
        <p>Click the buttons below to trigger toast notifications</p>
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

export const TopLeft: Story = {
  render: () => (
    <ToastProvider position="top-left">
      <div style={{ padding: '2rem' }}>
        <h2>Top Left Position</h2>
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

export const TopCenter: Story = {
  render: () => (
    <ToastProvider position="top-center">
      <div style={{ padding: '2rem' }}>
        <h2>Top Center Position</h2>
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

export const BottomRight: Story = {
  render: () => (
    <ToastProvider position="bottom-right">
      <div style={{ padding: '2rem' }}>
        <h2>Bottom Right Position</h2>
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

export const BottomLeft: Story = {
  render: () => (
    <ToastProvider position="bottom-left">
      <div style={{ padding: '2rem' }}>
        <h2>Bottom Left Position</h2>
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

export const BottomCenter: Story = {
  render: () => (
    <ToastProvider position="bottom-center">
      <div style={{ padding: '2rem' }}>
        <h2>Bottom Center Position</h2>
        <ToastDemo />
      </div>
    </ToastProvider>
  ),
};

export const MaxToasts: Story = {
  render: () => {
    const MaxToastsDemo = () => {
      const { toast } = useToast();

      return (
        <Button
          onClick={() => {
            for (let i = 1; i <= 8; i++) {
              setTimeout(() => {
                toast({ message: `Toast #${i}`, variant: i % 4 === 0 ? 'error' : i % 3 === 0 ? 'warning' : i % 2 === 0 ? 'success' : 'info' });
              }, i * 200);
            }
          }}
        >
          Trigger 8 Toasts (Max 5)
        </Button>
      );
    };

    return (
      <ToastProvider maxToasts={5}>
        <div style={{ padding: '2rem' }}>
          <h2>Max Toasts Limit</h2>
          <p>Only 5 toasts will be shown at once. Older toasts are removed when the limit is reached.</p>
          <MaxToastsDemo />
        </div>
      </ToastProvider>
    );
  },
};

export const AllVariants: Story = {
  render: () => {
    const AllVariantsDemo = () => {
      const { toast } = useToast();

      return (
        <Stack direction="column" spacing={2}>
          <Button onClick={() => toast({ message: 'Info: System update available', variant: 'info' })}>
            Info Toast
          </Button>
          <Button onClick={() => toast({ message: 'Success: Profile updated', variant: 'success' })}>
            Success Toast
          </Button>
          <Button onClick={() => toast({ message: 'Warning: Storage almost full', variant: 'warning' })}>
            Warning Toast
          </Button>
          <Button onClick={() => toast({ message: 'Error: Failed to load data', variant: 'error' })}>
            Error Toast
          </Button>
        </Stack>
      );
    };

    return (
      <ToastProvider>
        <div style={{ padding: '2rem' }}>
          <h2>All Toast Variants</h2>
          <AllVariantsDemo />
        </div>
      </ToastProvider>
    );
  },
};

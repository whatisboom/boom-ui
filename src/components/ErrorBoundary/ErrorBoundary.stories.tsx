import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

// Error-throwing component for demos
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('This is a demo error!');
  }
  return <div>Everything is working fine!</div>;
};

const meta = {
  title: 'Layout/Error Boundary',
  component: ErrorBoundary,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ErrorBoundary catches JavaScript errors in child components, logs errors, and displays a fallback UI instead of crashing the entire component tree.',
      },
    },
  },
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {} as never,
  render: () => {
    const [shouldThrow, setShouldThrow] = useState(false);
    return (
      <div style={{ padding: '2rem' }}>
        <button onClick={() => setShouldThrow(true)}>
          Trigger Error
        </button>
        <div style={{ marginTop: '1rem' }}>
          <ErrorBoundary onReset={() => setShouldThrow(false)}>
            <BuggyComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>
      </div>
    );
  },
};

export const CustomFallback: Story = {
  args: {} as never,
  render: () => (
    <ErrorBoundary
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Oops! Custom fallback UI</h2>
          <p>This is a custom fallback message.</p>
        </div>
      }
    >
      <BuggyComponent shouldThrow />
    </ErrorBoundary>
  ),
};

export const CustomFallbackRender: Story = {
  args: {} as never,
  render: () => (
    <ErrorBoundary
      fallbackRender={({ error, resetError }) => (
        <div style={{ padding: '2rem', border: '2px solid red' }}>
          <h2>Custom Render Fallback</h2>
          <p>Error: {error.message}</p>
          <button onClick={resetError}>Try Again</button>
        </div>
      )}
    >
      <BuggyComponent shouldThrow />
    </ErrorBoundary>
  ),
};

export const WithErrorLogging: Story = {
  args: {} as never,
  render: () => (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.log('Error logged:', error);
        console.log('Error info:', errorInfo);
        // In real app: send to Sentry, LogRocket, etc.
      }}
    >
      <BuggyComponent shouldThrow />
    </ErrorBoundary>
  ),
};

export const WithAutoReset: Story = {
  args: {} as never,
  render: () => {
    const [resetKey, setResetKey] = useState(0);
    const [shouldThrow, setShouldThrow] = useState(false);

    const handleResetKeyChange = () => {
      setResetKey((k) => k + 1);
      setShouldThrow(false);
    };

    return (
      <div style={{ padding: '2rem' }}>
        <button onClick={handleResetKeyChange}>
          Change Reset Key (Auto-reset)
        </button>
        <p>Reset key: {resetKey}</p>
        <ErrorBoundary resetKey={resetKey}>
          <BuggyComponent shouldThrow={shouldThrow} />
        </ErrorBoundary>
      </div>
    );
  },
};

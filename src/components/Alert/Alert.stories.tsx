import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { Stack } from '../Stack';

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'This is an informational alert. It provides helpful context or tips.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Your changes have been saved successfully!',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning: This action may have unintended consequences. Please review before proceeding.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Error: Unable to process your request. Please try again later.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack direction="column" spacing={4}>
      <Alert variant="info">
        This is an informational alert. It provides helpful context or tips.
      </Alert>
      <Alert variant="success">
        Your changes have been saved successfully!
      </Alert>
      <Alert variant="warning">
        Warning: This action may have unintended consequences.
      </Alert>
      <Alert variant="error">
        Error: Unable to process your request. Please try again later.
      </Alert>
    </Stack>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Stack direction="column" spacing={4}>
      <Alert variant="info" title="Did you know?">
        You can customize your dashboard by dragging and dropping widgets.
      </Alert>
      <Alert variant="success" title="Success">
        Your profile has been updated with the new information.
      </Alert>
      <Alert variant="warning" title="Attention Required">
        Your trial period will expire in 3 days. Please upgrade to continue.
      </Alert>
      <Alert variant="error" title="Authentication Error">
        Your session has expired. Please log in again to continue.
      </Alert>
    </Stack>
  ),
};

export const Dismissible: Story = {
  render: () => {
    const DismissibleExample = () => {
      const [showInfo, setShowInfo] = useState(true);
      const [showSuccess, setShowSuccess] = useState(true);
      const [showWarning, setShowWarning] = useState(true);
      const [showError, setShowError] = useState(true);

      return (
        <Stack direction="column" spacing={4}>
          {showInfo && (
            <Alert
              variant="info"
              title="Information"
              onClose={() => setShowInfo(false)}
            >
              This alert can be dismissed by clicking the close button.
            </Alert>
          )}
          {showSuccess && (
            <Alert variant="success" onClose={() => setShowSuccess(false)}>
              You can close this alert to remove it from view.
            </Alert>
          )}
          {showWarning && (
            <Alert
              variant="warning"
              title="Warning"
              onClose={() => setShowWarning(false)}
            >
              Be careful with this action.
            </Alert>
          )}
          {showError && (
            <Alert variant="error" onClose={() => setShowError(false)}>
              Something went wrong. Click to dismiss.
            </Alert>
          )}
        </Stack>
      );
    };

    return <DismissibleExample />;
  },
};

export const CustomIcon: Story = {
  render: () => (
    <Stack direction="column" spacing={4}>
      <Alert
        variant="info"
        icon={<span style={{ fontSize: '20px' }}>💡</span>}
      >
        You can use custom icons to personalize your alerts.
      </Alert>
      <Alert
        variant="success"
        icon={<span style={{ fontSize: '20px' }}>🎉</span>}
      >
        Congratulations on completing the tutorial!
      </Alert>
      <Alert
        variant="warning"
        icon={<span style={{ fontSize: '20px' }}>⚠️</span>}
      >
        Custom icons can make alerts more engaging.
      </Alert>
      <Alert
        variant="error"
        icon={<span style={{ fontSize: '20px' }}>🚫</span>}
      >
        Access denied. Please contact your administrator.
      </Alert>
    </Stack>
  ),
};

export const NoIcon: Story = {
  render: () => (
    <Stack direction="column" spacing={4}>
      <Alert variant="info" icon={null}>
        This alert has no icon, just the message.
      </Alert>
      <Alert variant="success" icon={null} title="Success">
        Sometimes you don't need an icon.
      </Alert>
      <Alert variant="warning" icon={null}>
        The message can stand on its own.
      </Alert>
      <Alert variant="error" icon={null} title="Error">
        Icons are optional in the Alert component.
      </Alert>
    </Stack>
  ),
};

export const LongContent: Story = {
  args: {
    variant: 'warning',
    title: 'Terms and Conditions Update',
    children: (
      <>
        We have updated our Terms and Conditions. Please review the changes carefully.
        The new terms include updates to our privacy policy, data retention practices,
        and user responsibilities. By continuing to use our service, you agree to these
        updated terms. If you have any questions or concerns, please contact our support
        team at support@example.com. Your continued use of the service constitutes
        acceptance of these terms.
      </>
    ),
    onClose: () => alert('Alert dismissed'),
  },
};

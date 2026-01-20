import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';
import { Stack } from '../Stack';

const meta: Meta<typeof Progress> = {
  title: 'Feedback & Status/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['linear', 'circular'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const LinearDeterminate: Story = {
  args: {
    value: 60,
    variant: 'linear',
    'aria-label': 'Loading progress',
  },
};

export const LinearWithLabel: Story = {
  args: {
    value: 75,
    variant: 'linear',
    showLabel: true,
    'aria-label': 'Loading progress',
  },
};

export const LinearIndeterminate: Story = {
  args: {
    variant: 'linear',
    'aria-label': 'Loading',
  },
};

export const CircularDeterminate: Story = {
  args: {
    value: 60,
    variant: 'circular',
    'aria-label': 'Loading progress',
  },
};

export const CircularWithLabel: Story = {
  args: {
    value: 85,
    variant: 'circular',
    showLabel: true,
    'aria-label': 'Loading progress',
  },
};

export const CircularIndeterminate: Story = {
  args: {
    variant: 'circular',
    'aria-label': 'Loading',
  },
};

export const Sizes: Story = {
  render: () => (
    <Stack direction="column" spacing={6}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Linear Sizes</h3>
        <Stack direction="column" spacing={3}>
          <Progress value={60} size="sm" aria-label="Small progress" />
          <Progress value={60} size="md" aria-label="Medium progress" />
          <Progress value={60} size="lg" aria-label="Large progress" />
        </Stack>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>Circular Sizes</h3>
        <Stack direction="row" spacing={4}>
          <Progress value={60} variant="circular" size="sm" aria-label="Small progress" />
          <Progress value={60} variant="circular" size="md" aria-label="Medium progress" />
          <Progress value={60} variant="circular" size="lg" aria-label="Large progress" />
        </Stack>
      </div>
    </Stack>
  ),
};

export const WithCustomLabel: Story = {
  render: () => (
    <Stack direction="column" spacing={4}>
      <Progress value={33} label="Uploading..." aria-label="Upload progress" />
      <Progress value={66} label="Processing..." aria-label="Processing progress" />
      <Progress value={100} label="Complete!" aria-label="Completion status" />
    </Stack>
  ),
};

export const AnimatedProgress: Story = {
  render: () => {
    const LinearAnimated = () => {
      const [progress, setProgress] = useState(0);

      useEffect(() => {
        const timer = setInterval(() => {
          setProgress((oldProgress) => {
            if (oldProgress >= 100) {
              return 0;
            }
            const diff = Math.random() * 10;
            return Math.min(oldProgress + diff, 100);
          });
        }, 500);

        return () => {
          clearInterval(timer);
        };
      }, []);

      return <Progress value={progress} showLabel aria-label="Animated progress" />;
    };

    return (
      <Stack direction="column" spacing={4}>
        <div>
          <h3 style={{ marginBottom: '0.5rem' }}>Animated Linear Progress</h3>
          <LinearAnimated />
        </div>
      </Stack>
    );
  },
};

export const CircularAnimated: Story = {
  render: () => {
    const CircularAnimatedDemo = () => {
      const [progress, setProgress] = useState(0);

      useEffect(() => {
        const timer = setInterval(() => {
          setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 800);

        return () => {
          clearInterval(timer);
        };
      }, []);

      return (
        <Stack direction="row" spacing={4}>
          <Progress value={progress} variant="circular" showLabel aria-label="Circular progress" />
          <Progress variant="circular" aria-label="Loading" />
        </Stack>
      );
    };

    return <CircularAnimatedDemo />;
  },
};

export const AllVariants: Story = {
  render: () => (
    <Stack direction="column" spacing={6}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Linear Progress</h3>
        <Stack direction="column" spacing={3}>
          <Progress value={25} aria-label="25% complete" />
          <Progress value={50} showLabel aria-label="50% complete" />
          <Progress value={75} label="Almost done..." aria-label="75% complete" />
          <Progress aria-label="Loading" />
        </Stack>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>Circular Progress</h3>
        <Stack direction="row" spacing={4}>
          <Progress value={25} variant="circular" aria-label="25% complete" />
          <Progress value={50} variant="circular" showLabel aria-label="50% complete" />
          <Progress value={75} variant="circular" label="75%" aria-label="75% complete" />
          <Progress variant="circular" aria-label="Loading" />
        </Stack>
      </div>
    </Stack>
  ),
};

export const ValueBoundaries: Story = {
  render: () => (
    <Stack direction="column" spacing={3}>
      <div>
        <p style={{ marginBottom: '0.5rem' }}>0% Progress</p>
        <Progress value={0} showLabel aria-label="No progress" />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem' }}>50% Progress</p>
        <Progress value={50} showLabel aria-label="Half complete" />
      </div>
      <div>
        <p style={{ marginBottom: '0.5rem' }}>100% Progress</p>
        <Progress value={100} showLabel aria-label="Complete" />
      </div>
    </Stack>
  ),
};

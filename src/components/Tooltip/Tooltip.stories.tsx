import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '../Button';
import { Stack } from '../Stack';
import { Badge } from '../Badge';

const meta: Meta<typeof Tooltip> = {
  title: 'Overlays & Dialogs/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'radio',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: { content: 'This is a tooltip', placement: 'top' },
  render: (args) => (
    <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
      <Tooltip content={args.content} placement={args.placement}>
        <Button>Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const Placements: Story = {
  argTypes: { placement: { control: false } },
  render: () => (
    <div style={{ padding: '8rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
      <Tooltip content="Top tooltip" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
};

export const WithDelay: Story = {
  args: { placement: 'top' },
  render: (args) => (
    <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
      <Tooltip content="No delay" placement={args.placement}>
        <Button>No Delay</Button>
      </Tooltip>
      <Tooltip content="500ms delay" delay={500} placement={args.placement}>
        <Button>500ms Delay</Button>
      </Tooltip>
      <Tooltip content="1 second delay" delay={1000} placement={args.placement}>
        <Button>1s Delay</Button>
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    content:
      'This is a longer tooltip with more content that demonstrates how the tooltip wraps text when it exceeds the maximum width.',
    placement: 'top',
  },
  render: (args) => (
    <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}>
      <Tooltip content={args.content} placement={args.placement}>
        <Button>Hover for long content</Button>
      </Tooltip>
    </div>
  ),
};

export const OnDifferentElements: Story = {
  render: () => (
    <div style={{ padding: '4rem' }}>
      <Stack direction="column" spacing={4}>
        <Tooltip content="Tooltip on button">
          <Button>Button</Button>
        </Tooltip>

        <Tooltip content="Tooltip on text">
          <span style={{ cursor: 'help', borderBottom: '1px dotted currentColor' }}>
            Hover over this text
          </span>
        </Tooltip>

        <Tooltip content="You have 3 notifications">
          <Badge variant="error">3</Badge>
        </Tooltip>

        <Tooltip content="Click to perform action">
          <button
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--boom-theme-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Native Button
          </button>
        </Tooltip>
      </Stack>
    </div>
  ),
};

export const InteractiveExample: Story = {
  render: () => (
    <div style={{ padding: '4rem' }}>
      <h3>Form with Tooltips</h3>
      <Stack direction="column" spacing={3}>
        <div>
          <Tooltip content="Enter your full name as it appears on your ID">
            <label
              htmlFor="tooltip-name"
              style={{
                display: 'inline-block',
                cursor: 'help',
                borderBottom: '1px dotted currentColor',
              }}
            >
              Full Name
            </label>
          </Tooltip>
          <input
            id="tooltip-name"
            type="text"
            style={{
              display: 'block',
              marginTop: '0.5rem',
              padding: '0.5rem',
              border: '1px solid var(--boom-theme-border-default)',
              borderRadius: '4px',
              width: '300px',
            }}
          />
        </div>

        <div>
          <Tooltip content="Your email will be used for account recovery and notifications">
            <label
              htmlFor="tooltip-email"
              style={{
                display: 'inline-block',
                cursor: 'help',
                borderBottom: '1px dotted currentColor',
              }}
            >
              Email Address
            </label>
          </Tooltip>
          <input
            id="tooltip-email"
            type="email"
            style={{
              display: 'block',
              marginTop: '0.5rem',
              padding: '0.5rem',
              border: '1px solid var(--boom-theme-border-default)',
              borderRadius: '4px',
              width: '300px',
            }}
          />
        </div>

        <Tooltip content="Submit the form to create your account">
          <Button>Create Account</Button>
        </Tooltip>
      </Stack>
    </div>
  ),
};

export const AllPlacements: Story = {
  argTypes: { placement: { control: false } },
  render: () => (
    <div
      style={{
        padding: '8rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '4rem',
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      <div />
      <Tooltip content="Top placement" placement="top">
        <Button>Top</Button>
      </Tooltip>
      <div />

      <Tooltip content="Left placement" placement="left">
        <Button>Left</Button>
      </Tooltip>
      <div style={{ textAlign: 'center' }}>
        <p>Hover over the buttons to see tooltips in different positions</p>
      </div>
      <Tooltip content="Right placement" placement="right">
        <Button>Right</Button>
      </Tooltip>

      <div />
      <Tooltip content="Bottom placement" placement="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <div />
    </div>
  ),
};

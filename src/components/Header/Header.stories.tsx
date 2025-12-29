import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';
import { Button } from '../Button';

const meta = {
  title: 'Navigation & Menus/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo: <div style={{ fontWeight: 'bold', fontSize: '20px' }}>MyApp</div>,
    children: (
      <>
        <Button variant="ghost">Features</Button>
        <Button variant="ghost">Pricing</Button>
        <Button variant="primary">Sign In</Button>
      </>
    ),
  },
};

export const Sticky: Story = {
  args: {
    ...Default.args,
    sticky: true,
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div style={{ height: '200vh', padding: '20px' }}>
          Scroll down to see sticky header
        </div>
      </div>
    ),
  ],
};

export const WithLogo: Story = {
  args: {
    logo: (
      <img
        src="https://placehold.co/200x40/000000/FFF?text=Logo"
        alt="Logo"
        style={{ height: '40px' }}
      />
    ),
    children: (
      <>
        <Button variant="ghost">Dashboard</Button>
        <Button variant="ghost">Settings</Button>
      </>
    ),
  },
};

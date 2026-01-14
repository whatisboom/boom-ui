import type { Meta, StoryObj } from '@storybook/react-vite';
import { Nav } from './Nav';
import { NavItem } from './NavItem';
import { Box } from '@/components/Box';

const meta: Meta<typeof Nav> = {
  title: 'Navigation/Nav',
  component: Nav,
  parameters: {
    docs: {
      description: {
        component: `
**Navigation component with automatic theme integration** - eliminates hardcoded nav colors.

## Key Features

- **Theme-aware**: Uses theme tokens for colors (respects light/dark mode)
- **Active state**: Automatic styling for current page with \`isActive\` prop
- **Icons**: Optional icons for nav items
- **Orientation**: Vertical or horizontal layout
- **Accessibility**: Built-in ARIA attributes (\`aria-current\`)
- **Polymorphic**: Render items as links, buttons, or any element

## Theme Integration

NavItem automatically uses theme colors:
- **Inactive**: \`--boom-theme-text-secondary\`
- **Hover**: \`--boom-theme-bg-secondary\` + \`--boom-theme-text-primary\`
- **Active**: \`--boom-theme-accent-subtle\` + \`--boom-theme-primary\`

This means navigation respects light/dark mode without any extra code.

## When to Use Nav

✅ **Use Nav for:**
- Main app navigation
- Sidebar menus
- Tab-like navigation
- Section navigation

❌ **Don't use Nav for:**
- Breadcrumbs (use different component)
- Pagination (use Pagination component)
- Action buttons (use Button)

## Router Integration

Nav is router-agnostic. You control the \`isActive\` state:

\`\`\`tsx
import { useLocation } from 'react-router-dom';

function AppNav() {
  const location = useLocation();

  return (
    <Nav>
      <NavItem
        as={Link}
        to="/"
        isActive={location.pathname === '/'}
      >
        Home
      </NavItem>
    </Nav>
  );
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Navigation orientation',
    },
    spacing: {
      control: { type: 'number', min: 0, max: 10, step: 1 },
      description: 'Spacing between items (spacing token)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Nav>;

/**
 * Default vertical navigation with active state
 */
export const Default: Story = {
  args: {
    children: (
      <>
        <NavItem isActive>Dashboard</NavItem>
        <NavItem>Users</NavItem>
        <NavItem>Settings</NavItem>
      </>
    ),
  },
};

/**
 * Horizontal navigation for top bars
 */
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 2,
    children: (
      <>
        <NavItem isActive>Home</NavItem>
        <NavItem>About</NavItem>
        <NavItem>Services</NavItem>
        <NavItem>Contact</NavItem>
      </>
    ),
  },
};

/**
 * Navigation with icons for better visual hierarchy
 */
export const WithIcons: Story = {
  args: {
    children: (
      <>
        <NavItem isActive icon={<span>🏠</span>}>
          Home
        </NavItem>
        <NavItem icon={<span>👥</span>}>Users</NavItem>
        <NavItem icon={<span>📊</span>}>Analytics</NavItem>
        <NavItem icon={<span>⚙️</span>}>Settings</NavItem>
      </>
    ),
  },
};

/**
 * Compact navigation with minimal spacing
 */
export const Compact: Story = {
  args: {
    spacing: 0,
    children: (
      <>
        <NavItem isActive>Dashboard</NavItem>
        <NavItem>Projects</NavItem>
        <NavItem>Tasks</NavItem>
        <NavItem>Calendar</NavItem>
        <NavItem>Settings</NavItem>
      </>
    ),
  },
};

/**
 * Spacious navigation with larger gaps
 */
export const Spacious: Story = {
  args: {
    spacing: 3,
    children: (
      <>
        <NavItem isActive icon={<span>📱</span>}>
          Mobile
        </NavItem>
        <NavItem icon={<span>💻</span>}>Desktop</NavItem>
        <NavItem icon={<span>🌐</span>}>Web</NavItem>
      </>
    ),
  },
};

/**
 * Sidebar navigation in a container
 */
export const SidebarLayout: Story = {
  render: () => (
    <Box
      style={{
        width: '240px',
        padding: '1rem',
        background: 'var(--boom-theme-bg-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--boom-theme-border-default)',
      }}
    >
      <Nav spacing={1}>
        <NavItem isActive icon={<span>🏠</span>}>
          Dashboard
        </NavItem>
        <NavItem icon={<span>📊</span>}>Analytics</NavItem>
        <NavItem icon={<span>👥</span>}>Team</NavItem>
        <NavItem icon={<span>📁</span>}>Projects</NavItem>
        <NavItem icon={<span>📅</span>}>Calendar</NavItem>
        <NavItem icon={<span>⚙️</span>}>Settings</NavItem>
      </Nav>
    </Box>
  ),
};

/**
 * Navigation as buttons for interactive menus
 */
export const AsButtons: Story = {
  render: () => (
    <Nav>
      <NavItem as="button" type="button" isActive>
        Tab 1
      </NavItem>
      <NavItem as="button" type="button">
        Tab 2
      </NavItem>
      <NavItem as="button" type="button">
        Tab 3
      </NavItem>
    </Nav>
  ),
};

/**
 * Navigation with href for links
 */
export const AsLinks: Story = {
  render: () => (
    <Nav>
      <NavItem href="/" isActive>
        Home
      </NavItem>
      <NavItem href="/about">About</NavItem>
      <NavItem href="/services">Services</NavItem>
      <NavItem href="/contact">Contact</NavItem>
    </Nav>
  ),
};

/**
 * Header navigation with horizontal layout
 */
export const HeaderLayout: Story = {
  render: () => (
    <Box
      style={{
        padding: '1rem 2rem',
        background: 'var(--boom-theme-bg-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--boom-theme-border-default)',
      }}
    >
      <Nav orientation="horizontal" spacing={4}>
        <NavItem isActive>Products</NavItem>
        <NavItem>Solutions</NavItem>
        <NavItem>Resources</NavItem>
        <NavItem>Pricing</NavItem>
        <NavItem>Company</NavItem>
      </Nav>
    </Box>
  ),
};

/**
 * Multi-section navigation
 */
export const MultiSection: Story = {
  render: () => (
    <Box
      style={{
        width: '240px',
        padding: '1rem',
        background: 'var(--boom-theme-bg-secondary)',
        borderRadius: '8px',
        border: '1px solid var(--boom-theme-border-default)',
      }}
    >
      <Box style={{ marginBottom: '1.5rem' }}>
        <Box
          as="h3"
          style={{
            margin: '0 0 0.5rem',
            padding: '0 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            color: 'var(--boom-theme-text-tertiary)',
          }}
        >
          Main
        </Box>
        <Nav spacing={1}>
          <NavItem isActive icon={<span>🏠</span>}>
            Dashboard
          </NavItem>
          <NavItem icon={<span>📊</span>}>Analytics</NavItem>
          <NavItem icon={<span>👥</span>}>Team</NavItem>
        </Nav>
      </Box>

      <Box>
        <Box
          as="h3"
          style={{
            margin: '0 0 0.5rem',
            padding: '0 0.75rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            color: 'var(--boom-theme-text-tertiary)',
          }}
        >
          Settings
        </Box>
        <Nav spacing={1}>
          <NavItem icon={<span>👤</span>}>Profile</NavItem>
          <NavItem icon={<span>🔔</span>}>Notifications</NavItem>
          <NavItem icon={<span>⚙️</span>}>Preferences</NavItem>
        </Nav>
      </Box>
    </Box>
  ),
};

/**
 * Navigation with mixed states
 */
export const MixedStates: Story = {
  render: () => (
    <Box style={{ width: '240px' }}>
      <Nav spacing={1}>
        <NavItem isActive icon={<span>🏠</span>}>
          Active Item
        </NavItem>
        <NavItem icon={<span>📊</span>}>Normal Item</NavItem>
        <NavItem icon={<span>👥</span>}>Hover to See</NavItem>
        <NavItem icon={<span>⚙️</span>}>Another Item</NavItem>
      </Nav>
    </Box>
  ),
};

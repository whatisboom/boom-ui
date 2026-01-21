import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell } from './AppShell';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { Button } from '../Button';
import { Box } from '../Box';
import { Stack } from '../Stack';
import { Input } from '../Input';
import { Card } from '../Card';
import { Grid } from '../Grid';
import { Typography } from '../Typography';

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    // Hide React element props from controls - they're not editable in Storybook
    header: {
      control: false,
      description: 'Optional header component (typically Header component)',
      table: {
        type: { summary: 'ReactElement<HeaderProps>' },
      },
    },
    sidebar: {
      control: false,
      description: 'Optional sidebar component (typically Sidebar component)',
      table: {
        type: { summary: 'ReactElement<SidebarProps>' },
      },
    },
    children: {
      control: false,
      description: 'Main content area',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content for stories
const SampleContent = () => (
  <Box padding={8}>
    <Stack spacing={6}>
      <h1>Main Content Area</h1>
      <p>
        This is the main content area. It scrolls independently when content overflows while the
        header and sidebar remain fixed.
      </p>
      <Box>
        <h2>Section 1</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </p>
      </Box>
      <Box>
        <h2>Section 2</h2>
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
      </Box>
      <Box>
        <h2>Section 3</h2>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
      </Box>
      <Box>
        <h2>Section 4</h2>
        <p>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>
      </Box>
    </Stack>
  </Box>
);

export const Default: Story = {
  args: {
    header: (
      <Header logo={<div style={{ fontWeight: 'bold', fontSize: '20px' }}>MyApp</div>}>
        <Button variant="ghost">Features</Button>
        <Button variant="ghost">Pricing</Button>
        <Button variant="primary">Sign In</Button>
      </Header>
    ),
    sidebar: (
      <Sidebar>
        <Sidebar.Header>Navigation</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Dashboard" isActive />
          <Sidebar.Item label="Projects" />
          <Sidebar.Item label="Team" />
          <Sidebar.Item label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    ),
    children: <SampleContent />,
  },
};

export const HeaderOnly: Story = {
  args: {
    header: (
      <Header logo={<div style={{ fontWeight: 'bold', fontSize: '20px' }}>MyApp</div>}>
        <Button variant="ghost">Home</Button>
        <Button variant="ghost">About</Button>
        <Button variant="ghost">Contact</Button>
      </Header>
    ),
    children: (
      <Box padding={8}>
        <h1>Header Only Layout</h1>
        <p>This layout has a header but no sidebar. The main content spans the full width.</p>
      </Box>
    ),
  },
};

export const SidebarOnly: Story = {
  args: {
    sidebar: (
      <Sidebar>
        <Sidebar.Header>Menu</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" isActive />
          <Sidebar.Item label="Profile" />
          <Sidebar.Item label="Messages" badge={3} />
          <Sidebar.Item label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    ),
    children: (
      <Box padding={8}>
        <h1>Sidebar Only Layout</h1>
        <p>This layout has a sidebar but no header. The content area starts from the top.</p>
      </Box>
    ),
  },
};

export const ContentOnly: Story = {
  args: {
    children: (
      <Box padding={8}>
        <h1>Content Only Layout</h1>
        <p>This is a minimal layout with no header or sidebar. Just the main content area.</p>
      </Box>
    ),
  },
};

export const WithCollapsedSidebar: Story = {
  args: {
    header: (
      <Header logo={<div style={{ fontWeight: 'bold', fontSize: '20px' }}>MyApp</div>}>
        <Button variant="primary">Upgrade</Button>
      </Header>
    ),
    sidebar: (
      <Sidebar defaultCollapsed>
        <Sidebar.Header>Nav</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Dashboard" isActive />
          <Sidebar.Item label="Projects" />
          <Sidebar.Item label="Team" badge={5} />
          <Sidebar.Item label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    ),
    children: (
      <Box padding={8}>
        <h1>Collapsed Sidebar</h1>
        <p>
          The sidebar starts collapsed (rail mode). Click the toggle button to expand it and see
          full labels.
        </p>
      </Box>
    ),
  },
};

// Mock data for FullApplication story
const stats = [
  { id: '1', label: 'Total Users', value: '1,234', change: 12 },
  { id: '2', label: 'Revenue', value: '$45.2K', change: 8 },
  { id: '3', label: 'Active Projects', value: '67', change: 15 },
  { id: '4', label: 'Tasks Completed', value: '234', change: 23 },
];

const activities = [
  { id: '1', text: 'Activity item 1' },
  { id: '2', text: 'Activity item 2' },
  { id: '3', text: 'Activity item 3' },
  { id: '4', text: 'Activity item 4' },
  { id: '5', text: 'Activity item 5' },
];

export const FullApplication: Story = {
  args: {
    header: (
      <Header logo={<div style={{ fontWeight: 'bold', fontSize: '20px' }}>Dashboard</div>}>
        <Box display="flex" gap={4} alignItems="center">
          <Input
            type="search"
            placeholder="Search..."
            style={{ minWidth: '300px' }}
          />
          <Button variant="ghost">Notifications</Button>
          <Button variant="ghost">Profile</Button>
        </Box>
      </Header>
    ),
    sidebar: (
      <Sidebar>
        <Sidebar.Header>My Workspace</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Overview" isActive />
          <Sidebar.Item label="Analytics" />
          <Sidebar.Item label="Reports" />
          <Sidebar.Item label="Users" badge={12} />
          <Sidebar.Item label="Settings" />
          <Sidebar.Item label="Help & Support" />
        </Sidebar.Nav>
      </Sidebar>
    ),
    children: (
      <Box padding={8}>
        <Stack spacing={6}>
          <Stack spacing={2}>
            <Typography variant="h1" as="h1">
              Welcome to Your Dashboard
            </Typography>
            <Typography variant="body" as="p">
              Here is an overview of your activity
            </Typography>
          </Stack>

          <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={6}>
            {stats.map((stat) => (
              <Card key={stat.id} padding={6} hoverable>
                <Stack spacing={3}>
                  <Typography variant="label" as="div">
                    {stat.label}
                  </Typography>
                  <Typography variant="h2" as="div" weight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" as="div">
                    ↑ {stat.change}% from last month
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Grid>

          <Stack spacing={4}>
            <Typography variant="h3" as="h2">
              Recent Activity
            </Typography>
            <Card padding={0}>
              {activities.map((activity, index) => (
                <Box
                  key={activity.id}
                  padding={4}
                  style={{
                    borderBottom:
                      index < activities.length - 1
                        ? '1px solid var(--boom-color-border-default)'
                        : 'none',
                  }}
                >
                  {activity.text}
                </Box>
              ))}
            </Card>
          </Stack>
        </Stack>
      </Box>
    ),
  },
};

export const CustomSidebarWidth: Story = {
  args: {
    header: (
      <Header logo={<div style={{ fontWeight: 'bold', fontSize: '20px' }}>Wide Sidebar</div>}>
        <Button variant="primary">Action</Button>
      </Header>
    ),
    sidebar: (
      <Sidebar width="350px">
        <Sidebar.Header>Wide Navigation</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Dashboard with Long Name" isActive />
          <Sidebar.Item label="Projects & Workspaces" />
          <Sidebar.Item label="Team Management" badge={8} />
          <Sidebar.Item label="Settings & Preferences" />
        </Sidebar.Nav>
      </Sidebar>
    ),
    children: (
      <Box padding={8}>
        <h1>Custom Sidebar Width</h1>
        <p>This sidebar is wider (350px) to accommodate longer navigation labels.</p>
      </Box>
    ),
  },
};

export const RightSidebar: Story = {
  args: {
    header: (
      <Header logo={<div style={{ fontWeight: 'bold', fontSize: '20px' }}>Right Sidebar</div>}>
        <Button variant="ghost">Home</Button>
        <Button variant="ghost">About</Button>
        <Button variant="primary">Contact</Button>
      </Header>
    ),
    sidebar: (
      <Sidebar position="right">
        <Sidebar.Header>Quick Actions</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Notifications" badge={5} isActive />
          <Sidebar.Item label="Messages" badge={2} />
          <Sidebar.Item label="Settings" />
          <Sidebar.Item label="Help" />
        </Sidebar.Nav>
      </Sidebar>
    ),
    children: (
      <Box padding={8}>
        <h1>Right-Positioned Sidebar</h1>
        <p>
          The sidebar appears on the right side of the layout instead of the default left position.
          This is useful for secondary navigation or contextual actions.
        </p>
        <Box>
          <h2>Use Cases</h2>
          <ul>
            <li>Notifications panel</li>
            <li>Chat or messaging sidebar</li>
            <li>Context-sensitive tools</li>
            <li>Secondary navigation</li>
          </ul>
        </Box>
      </Box>
    ),
  },
};

export const WithStyledContent: Story = {
  args: {
    header: (
      <Header logo={<div style={{ fontWeight: 'bold', fontSize: '20px' }}>Styled App</div>}>
        <Button variant="primary">Get Started</Button>
      </Header>
    ),
    sidebar: (
      <Sidebar>
        <Sidebar.Header>Navigation</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" isActive />
          <Sidebar.Item label="Explore" />
          <Sidebar.Item label="Library" />
          <Sidebar.Item label="Profile" />
        </Sidebar.Nav>
      </Sidebar>
    ),
    children: (
      <div style={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box padding={8}>
          <div style={{ color: 'white', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3rem', marginTop: '2rem' }}>Beautiful Layouts</h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
              AppShell provides a flexible foundation for building modern application layouts with
              optional header and sidebar components.
            </p>
            <div style={{ marginTop: '2rem' }}>
              <Button variant="primary">Learn More</Button>
            </div>
          </div>
        </Box>
      </div>
    ),
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Sidebar } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

// Icons for demos
const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const DocumentIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
      clipRule="evenodd"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
  </svg>
);

// Demo wrapper component
function SidebarDemo({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '600px', border: '1px solid #e0e0e0' }}>
      {children}
      <div style={{ flex: 1, padding: '2rem', background: '#f9fafb' }}>
        <h2 style={{ marginTop: 0 }}>Main Content</h2>
        <p>This is the main content area. The sidebar is positioned to the left.</p>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <SidebarDemo>
      <Sidebar>
        <Sidebar.Header>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Logo</div>
        </Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item icon={<HomeIcon />} label="Home" isActive />
          <Sidebar.Item icon={<ChartIcon />} label="Analytics" />
          <Sidebar.Item icon={<DocumentIcon />} label="Documents" />
          <Sidebar.Item icon={<UsersIcon />} label="Team" />
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    </SidebarDemo>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <SidebarDemo>
      <Sidebar collapsed>
        <Sidebar.Header>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>L</div>
        </Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item icon={<HomeIcon />} label="Home" isActive />
          <Sidebar.Item icon={<ChartIcon />} label="Analytics" />
          <Sidebar.Item icon={<DocumentIcon />} label="Documents" />
          <Sidebar.Item icon={<UsersIcon />} label="Team" />
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    </SidebarDemo>
  ),
};

export const Controlled: Story = {
  render: () => {
    function ControlledSidebar() {
      const [collapsed, setCollapsed] = useState(false);

      return (
        <div>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
            <button onClick={() => setCollapsed(!collapsed)}>
              Toggle Sidebar
            </button>
          </div>
          <SidebarDemo>
            <Sidebar collapsed={collapsed} onCollapse={setCollapsed}>
              <Sidebar.Header>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {collapsed ? 'L' : 'Logo'}
                </div>
              </Sidebar.Header>
              <Sidebar.Nav>
                <Sidebar.Item icon={<HomeIcon />} label="Home" isActive />
                <Sidebar.Item icon={<ChartIcon />} label="Analytics" />
                <Sidebar.Item icon={<DocumentIcon />} label="Documents" />
                <Sidebar.Item icon={<UsersIcon />} label="Team" />
                <Sidebar.Item icon={<SettingsIcon />} label="Settings" />
              </Sidebar.Nav>
            </Sidebar>
          </SidebarDemo>
        </div>
      );
    }

    return <ControlledSidebar />;
  },
};

export const RightPosition: Story = {
  render: () => (
    <div style={{ display: 'flex', height: '600px', border: '1px solid #e0e0e0' }}>
      <div style={{ flex: 1, padding: '2rem', background: '#f9fafb' }}>
        <h2 style={{ marginTop: 0 }}>Main Content</h2>
        <p>The sidebar is positioned to the right.</p>
      </div>
      <Sidebar position="right">
        <Sidebar.Header>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Logo</div>
        </Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item icon={<HomeIcon />} label="Home" isActive />
          <Sidebar.Item icon={<ChartIcon />} label="Analytics" />
          <Sidebar.Item icon={<DocumentIcon />} label="Documents" />
          <Sidebar.Item icon={<UsersIcon />} label="Team" />
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    </div>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <SidebarDemo>
      <Sidebar>
        <Sidebar.Header>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Logo</div>
        </Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item icon={<HomeIcon />} label="Home" isActive />
          <Sidebar.Item icon={<BellIcon />} label="Notifications" badge={12} />
          <Sidebar.Item icon={<DocumentIcon />} label="Documents" badge={3} />
          <Sidebar.Item icon={<UsersIcon />} label="Team" badge={150} />
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    </SidebarDemo>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <SidebarDemo>
      <Sidebar>
        <Sidebar.Header>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Logo</div>
        </Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item icon={<HomeIcon />} label="Home" isActive />
          <Sidebar.Item icon={<ChartIcon />} label="Analytics" />
          <Sidebar.Item icon={<DocumentIcon />} label="Documents" disabled />
          <Sidebar.Item icon={<UsersIcon />} label="Team" disabled />
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    </SidebarDemo>
  ),
};

export const CustomWidth: Story = {
  render: () => (
    <SidebarDemo>
      <Sidebar width="320px" collapsedWidth="80px">
        <Sidebar.Header>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Logo</div>
        </Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item icon={<HomeIcon />} label="Home" isActive />
          <Sidebar.Item icon={<ChartIcon />} label="Analytics" />
          <Sidebar.Item icon={<DocumentIcon />} label="Documents" />
          <Sidebar.Item icon={<UsersIcon />} label="Team" />
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    </SidebarDemo>
  ),
};

export const AsLinks: Story = {
  render: () => (
    <SidebarDemo>
      <Sidebar>
        <Sidebar.Header>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Logo</div>
        </Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item icon={<HomeIcon />} label="Home" href="/home" isActive />
          <Sidebar.Item icon={<ChartIcon />} label="Analytics" href="/analytics" />
          <Sidebar.Item icon={<DocumentIcon />} label="Documents" href="/documents" />
          <Sidebar.Item icon={<UsersIcon />} label="Team" href="/team" />
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" href="/settings" />
        </Sidebar.Nav>
      </Sidebar>
    </SidebarDemo>
  ),
};

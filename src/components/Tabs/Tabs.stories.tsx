import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';
import { TabList } from './TabList';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab value="tab1">Tab 1</Tab>
          <Tab value="tab2">Tab 2</Tab>
          <Tab value="tab3">Tab 3</Tab>
        </TabList>
        <TabPanel value="tab1">
          <h3>Content for Tab 1</h3>
          <p>This is the content for the first tab.</p>
        </TabPanel>
        <TabPanel value="tab2">
          <h3>Content for Tab 2</h3>
          <p>This is the content for the second tab.</p>
        </TabPanel>
        <TabPanel value="tab3">
          <h3>Content for Tab 3</h3>
          <p>This is the content for the third tab.</p>
        </TabPanel>
      </Tabs>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
      <Tabs value={activeTab} onChange={setActiveTab} orientation="vertical">
        <TabList>
          <Tab value="profile">Profile</Tab>
          <Tab value="settings">Settings</Tab>
          <Tab value="notifications">Notifications</Tab>
        </TabList>
        <TabPanel value="profile">
          <h3>Profile</h3>
          <p>Manage your profile information here.</p>
        </TabPanel>
        <TabPanel value="settings">
          <h3>Settings</h3>
          <p>Configure your application settings.</p>
        </TabPanel>
        <TabPanel value="notifications">
          <h3>Notifications</h3>
          <p>Manage your notification preferences.</p>
        </TabPanel>
      </Tabs>
    );
  },
};

export const WithDisabledTab: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('home');

    return (
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab value="home">Home</Tab>
          <Tab value="about">About</Tab>
          <Tab value="contact" disabled>
            Contact (Disabled)
          </Tab>
          <Tab value="help">Help</Tab>
        </TabList>
        <TabPanel value="home">
          <h3>Home</h3>
          <p>Welcome to the home page.</p>
        </TabPanel>
        <TabPanel value="about">
          <h3>About</h3>
          <p>Learn more about us.</p>
        </TabPanel>
        <TabPanel value="contact">
          <h3>Contact</h3>
          <p>Get in touch with us.</p>
        </TabPanel>
        <TabPanel value="help">
          <h3>Help</h3>
          <p>Find answers to your questions.</p>
        </TabPanel>
      </Tabs>
    );
  },
};

export const ManyTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          {Array.from({ length: 8 }, (_, i) => (
            <Tab key={i} value={`tab${i + 1}`}>
              Tab {i + 1}
            </Tab>
          ))}
        </TabList>
        {Array.from({ length: 8 }, (_, i) => (
          <TabPanel key={i} value={`tab${i + 1}`}>
            <h3>Content {i + 1}</h3>
            <p>This is the content for tab {i + 1}.</p>
          </TabPanel>
        ))}
      </Tabs>
    );
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('tab1');

    return (
      <div>
        <p style={{ marginBottom: '16px' }}>
          Try keyboard navigation:
          <br />
          <strong>Arrow Left/Right:</strong> Navigate between tabs
          <br />
          <strong>Home:</strong> Go to first tab
          <br />
          <strong>End:</strong> Go to last tab
        </p>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="tab1">Dashboard</Tab>
            <Tab value="tab2">Analytics</Tab>
            <Tab value="tab3">Reports</Tab>
            <Tab value="tab4">Settings</Tab>
          </TabList>
          <TabPanel value="tab1">
            <h3>Dashboard</h3>
            <p>View your dashboard overview.</p>
          </TabPanel>
          <TabPanel value="tab2">
            <h3>Analytics</h3>
            <p>Analyze your data here.</p>
          </TabPanel>
          <TabPanel value="tab3">
            <h3>Reports</h3>
            <p>Generate and view reports.</p>
          </TabPanel>
          <TabPanel value="tab4">
            <h3>Settings</h3>
            <p>Configure your preferences.</p>
          </TabPanel>
        </Tabs>
      </div>
    );
  },
};

export const VerticalWithDisabled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('general');

    return (
      <Tabs value={activeTab} onChange={setActiveTab} orientation="vertical">
        <TabList>
          <Tab value="general">General</Tab>
          <Tab value="security">Security</Tab>
          <Tab value="billing" disabled>
            Billing (Pro only)
          </Tab>
          <Tab value="advanced">Advanced</Tab>
        </TabList>
        <TabPanel value="general">
          <h3>General Settings</h3>
          <p>Configure general application settings.</p>
        </TabPanel>
        <TabPanel value="security">
          <h3>Security Settings</h3>
          <p>Manage security and privacy options.</p>
        </TabPanel>
        <TabPanel value="billing">
          <h3>Billing Settings</h3>
          <p>Manage your subscription and billing.</p>
        </TabPanel>
        <TabPanel value="advanced">
          <h3>Advanced Settings</h3>
          <p>Advanced configuration options.</p>
        </TabPanel>
      </Tabs>
    );
  },
};

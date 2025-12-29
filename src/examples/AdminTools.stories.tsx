import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Header } from '../components/Header';
import { SearchCommand } from '../components/SearchCommand';
import { NotificationMenu } from '../components/NotificationMenu';
import { Modal } from '../components/primitives/Modal';
import { Button } from '../components/Button';
import { Table } from '../components/Table';

const meta: Meta = {
  title: 'Examples/Admin Tools',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Admin interface patterns using Header, SearchCommand, NotificationMenu, Modal, Button, and Table components.'
      }
    }
  },
};

export default meta;

type Story = StoryObj;

const mockNotifications = [
  { id: 1, title: 'New user registered', message: 'John Doe just signed up', time: '2 min ago', unread: true },
  { id: 2, title: 'Server alert', message: 'High CPU usage detected', time: '15 min ago', unread: true },
  { id: 3, title: 'Payment received', message: 'Invoice #1234 paid', time: '1 hour ago', unread: false },
];

const mockCommands = [
  { id: 1, label: 'Create New User', category: 'Users' },
  { id: 2, label: 'View Analytics', category: 'Reports' },
  { id: 3, label: 'Export Data', category: 'Data' },
  { id: 4, label: 'System Settings', category: 'Settings' },
  { id: 5, label: 'View Logs', category: 'System' },
];

export const AdminHeader: Story = {
  render: () => {
    const [searchOpen, setSearchOpen] = useState(false);

    const handleSearch = (query: string) => {
      console.log('Searching for:', query);
    };

    const handleCommandSelect = (command: typeof mockCommands[0]) => {
      console.log('Selected command:', command.label);
      setSearchOpen(false);
    };

    return (
      <>
        <Header
          logo={<strong style={{ fontSize: '1.25rem' }}>Admin Panel</strong>}
          actions={
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
                ⌘K Search
              </Button>
              <NotificationMenu
                notifications={mockNotifications}
                onNotificationClick={(notif) => console.log('Clicked:', notif.title)}
                onClearAll={() => console.log('Clear all')}
              />
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          }
        />

        <SearchCommand
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={handleSearch}
          placeholder="Search or run a command..."
          commands={mockCommands.map(cmd => ({
            ...cmd,
            onSelect: () => handleCommandSelect(cmd),
          }))}
        />
      </>
    );
  },
};

export const QuickActions: Story = {
  render: () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');

    const handleCommandSelect = (command: typeof mockCommands[0]) => {
      setSelectedAction(command.label);
      setSearchOpen(false);
      setModalOpen(true);
    };

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Quick Actions</h1>
          <p style={{ color: 'var(--boom-theme-text-secondary)' }}>
            Press <kbd>⌘K</kbd> or click the button to open command palette
          </p>
          <Button onClick={() => setSearchOpen(true)} style={{ marginTop: '1rem' }}>
            Open Command Palette
          </Button>
        </div>

        <SearchCommand
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={(q) => console.log('Search:', q)}
          placeholder="Search or run a command..."
          commands={mockCommands.map(cmd => ({
            ...cmd,
            onSelect: () => handleCommandSelect(cmd),
          }))}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedAction}
          description="This is where you'd implement the selected action"
        >
          <p>You selected: <strong>{selectedAction}</strong></p>
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      </div>
    );
  },
};

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Editor' },
];

export const BulkOperations: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [operation, setOperation] = useState('');

    const toggleSelect = (id: number) => {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    };

    const toggleSelectAll = () => {
      setSelectedIds(prev =>
        prev.length === mockUsers.length ? [] : mockUsers.map(u => u.id)
      );
    };

    const handleBulkAction = (action: string) => {
      setOperation(action);
      setModalOpen(true);
    };

    const executeBulkAction = () => {
      console.log(`${operation} users:`, selectedIds);
      setModalOpen(false);
      setSelectedIds([]);
    };

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Users ({selectedIds.length} selected)</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              onClick={() => handleBulkAction('Delete')}
              disabled={selectedIds.length === 0}
              variant="outline"
              size="sm"
            >
              Delete Selected
            </Button>
            <Button
              onClick={() => handleBulkAction('Export')}
              disabled={selectedIds.length === 0}
              variant="outline"
              size="sm"
            >
              Export Selected
            </Button>
          </div>
        </div>

        <Table>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === mockUsers.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`${operation} Users`}
          description={`Are you sure you want to ${operation.toLowerCase()} ${selectedIds.length} user(s)?`}
        >
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button onClick={executeBulkAction} variant="primary">
              Confirm {operation}
            </Button>
            <Button onClick={() => setModalOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    );
  },
};

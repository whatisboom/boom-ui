import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Table } from '../components/Table/Table';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Popover } from '../components/primitives/Popover';

const meta: Meta = {
  title: 'Examples/Data Management',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Data management patterns using Table, Input, Select, Button, Badge, and Popover components.'
      }
    }
  },
};

export default meta;

type Story = StoryObj;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Editor', status: 'inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'pending' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'active' },
];

export const FilterableTable: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredUsers = mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    return (
      <div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Input
            label="Search"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px' }}
          />
          <Select
            label="Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'Admin', label: 'Admin' },
              { value: 'Editor', label: 'Editor' },
              { value: 'User', label: 'User' },
            ]}
            style={{ flex: '0 1 150px' }}
          />
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' },
            ]}
            style={{ flex: '0 1 150px' }}
          />
        </div>

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Badge
                    variant={
                      user.status === 'active' ? 'success' :
                      user.status === 'inactive' ? 'error' :
                      'warning'
                    }
                  >
                    {user.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <p style={{ marginTop: '1rem', color: 'var(--boom-theme-text-secondary)' }}>
          Showing {filteredUsers.length} of {mockUsers.length} users
        </p>
      </div>
    );
  },
};

export const SortableTable: Story = {
  render: () => {
    const [users, setUsers] = useState(mockUsers);
    const [sortField, setSortField] = useState<keyof User>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: keyof User) => {
      const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      setSortField(field);

      const sorted = [...users].sort((a, b) => {
        if (a[field] < b[field]) return newDirection === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return newDirection === 'asc' ? 1 : -1;
        return 0;
      });
      setUsers(sorted);
    };

    const SortButton = ({ field, label }: { field: keyof User; label: string }) => (
      <button
        onClick={() => handleSort(field)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        {label}
        {sortField === field && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
      </button>
    );

    return (
      <Table>
        <thead>
          <tr>
            <th><SortButton field="name" label="Name" /></th>
            <th><SortButton field="email" label="Email" /></th>
            <th><SortButton field="role" label="Role" /></th>
            <th><SortButton field="status" label="Status" /></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Badge
                  variant={
                    user.status === 'active' ? 'success' :
                    user.status === 'inactive' ? 'error' :
                    'warning'
                  }
                >
                  {user.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  },
};

export const RowActions: Story = {
  render: () => {
    const [users, setUsers] = useState(mockUsers);
    const [openPopover, setOpenPopover] = useState<number | null>(null);

    const handleEdit = (id: number) => {
      console.log('Edit user:', id);
      setOpenPopover(null);
    };

    const handleDelete = (id: number) => {
      setUsers(users.filter(u => u.id !== id));
      setOpenPopover(null);
    };

    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th style={{ width: '100px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Badge
                  variant={
                    user.status === 'active' ? 'success' :
                    user.status === 'inactive' ? 'error' :
                    'warning'
                  }
                >
                  {user.status}
                </Badge>
              </td>
              <td>
                <Popover
                  isOpen={openPopover === user.id}
                  onClose={() => setOpenPopover(null)}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpenPopover(openPopover === user.id ? null : user.id)}
                    >
                      ⋮
                    </Button>
                  }
                  placement="bottom-end"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' }}>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user.id)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </div>
                </Popover>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  },
};

import { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchCommand } from './SearchCommand';
import { SearchResult } from './SearchCommand.types';
import { Button } from '../Button';

const meta: Meta<typeof SearchCommand> = {
  title: 'Components/Navigation/SearchCommand',
  component: SearchCommand,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchCommand>;

const sampleResults: SearchResult[] = [
  {
    id: '1',
    category: 'Pages',
    title: 'Dashboard',
    subtitle: 'View your analytics and metrics',
    icon: '📊',
    onSelect: () => console.log('Navigate to Dashboard'),
  },
  {
    id: '2',
    category: 'Pages',
    title: 'Settings',
    subtitle: 'Manage your account settings',
    icon: '⚙️',
    onSelect: () => console.log('Navigate to Settings'),
  },
  {
    id: '3',
    category: 'Pages',
    title: 'Profile',
    subtitle: 'View and edit your profile',
    icon: '👤',
    onSelect: () => console.log('Navigate to Profile'),
  },
  {
    id: '4',
    category: 'Actions',
    title: 'Create new project',
    subtitle: 'Start a new project from scratch',
    icon: '➕',
    onSelect: () => console.log('Create project'),
  },
  {
    id: '5',
    category: 'Actions',
    title: 'Import data',
    subtitle: 'Import data from CSV or JSON',
    icon: '📥',
    onSelect: () => console.log('Import data'),
  },
  {
    id: '6',
    category: 'Actions',
    title: 'Export report',
    subtitle: 'Export your data as a report',
    icon: '📤',
    onSelect: () => console.log('Export report'),
  },
  {
    id: '7',
    category: 'Help',
    title: 'Documentation',
    subtitle: 'Read the full documentation',
    icon: '📚',
    onSelect: () => console.log('Open docs'),
  },
  {
    id: '8',
    category: 'Help',
    title: 'Keyboard shortcuts',
    subtitle: 'View all keyboard shortcuts',
    icon: '⌨️',
    onSelect: () => console.log('Show shortcuts'),
  },
];

const recentSearches: SearchResult[] = [
  {
    id: 'recent-1',
    category: 'Recent',
    title: 'Dashboard',
    icon: '🕐',
    onSelect: () => console.log('Navigate to Dashboard'),
  },
  {
    id: 'recent-2',
    category: 'Recent',
    title: 'Settings',
    icon: '🕐',
    onSelect: () => console.log('Navigate to Settings'),
  },
];

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearch = (query: string) => {
      // Simulate search filtering
      const filtered = sampleResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Search Command
        </Button>
        <div style={{ marginTop: '1rem', color: 'var(--boom-color-text-secondary)' }}>
          Tip: Press Cmd+K or Ctrl+K to open (in a real app)
        </div>
        <SearchCommand
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSearch={handleSearch}
          results={results}
        />
      </>
    );
  },
};

export const WithRecentSearches: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearch = (query: string) => {
      const filtered = sampleResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Search Command
        </Button>
        <div style={{ marginTop: '1rem', color: 'var(--boom-color-text-secondary)' }}>
          Start typing to search, or see recent searches when empty
        </div>
        <SearchCommand
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSearch={handleSearch}
          results={results}
          recentSearches={recentSearches}
        />
      </>
    );
  },
};

export const WithLoading: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = useCallback((query: string) => {
      setIsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const filtered = sampleResults.filter(
          (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.subtitle?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 1000);
    }, []); // Empty deps - sampleResults is a const, setResults/setIsLoading are stable

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Search Command
        </Button>
        <div style={{ marginTop: '1rem', color: 'var(--boom-color-text-secondary)' }}>
          Search shows loading state with 1 second delay
        </div>
        <SearchCommand
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSearch={handleSearch}
          results={results}
          isLoading={isLoading}
        />
      </>
    );
  },
};

export const WithCustomPlaceholder: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearch = (query: string) => {
      const filtered = sampleResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Search Command
        </Button>
        <SearchCommand
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSearch={handleSearch}
          results={results}
          placeholder="Search pages, actions, and help..."
          emptyMessage="No matches found. Try a different search term."
        />
      </>
    );
  },
};

export const SingleCategory: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    const commandResults: SearchResult[] = [
      {
        id: '1',
        category: 'Commands',
        title: 'New file',
        subtitle: 'Create a new file',
        icon: '📄',
        onSelect: () => console.log('New file'),
      },
      {
        id: '2',
        category: 'Commands',
        title: 'New folder',
        subtitle: 'Create a new folder',
        icon: '📁',
        onSelect: () => console.log('New folder'),
      },
      {
        id: '3',
        category: 'Commands',
        title: 'Save all',
        subtitle: 'Save all open files',
        icon: '💾',
        onSelect: () => console.log('Save all'),
      },
      {
        id: '4',
        category: 'Commands',
        title: 'Close all',
        subtitle: 'Close all open files',
        icon: '✖️',
        onSelect: () => console.log('Close all'),
      },
    ];

    const handleSearch = (query: string) => {
      const filtered = commandResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Command Palette
        </Button>
        <SearchCommand
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSearch={handleSearch}
          results={results}
          placeholder="Type a command..."
        />
      </>
    );
  },
};

export const WithoutIcons: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);

    const simpleResults: SearchResult[] = [
      {
        id: '1',
        category: 'Navigation',
        title: 'Home',
        subtitle: 'Go to home page',
        onSelect: () => console.log('Home'),
      },
      {
        id: '2',
        category: 'Navigation',
        title: 'About',
        subtitle: 'Learn more about us',
        onSelect: () => console.log('About'),
      },
      {
        id: '3',
        category: 'Navigation',
        title: 'Contact',
        subtitle: 'Get in touch',
        onSelect: () => console.log('Contact'),
      },
    ];

    const handleSearch = (query: string) => {
      const filtered = simpleResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Search
        </Button>
        <SearchCommand
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSearch={handleSearch}
          results={results}
        />
      </>
    );
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [results] = useState<SearchResult[]>(sampleResults);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Search Command
        </Button>
        <div style={{ marginTop: '1rem', color: 'var(--boom-color-text-secondary)' }}>
          <p>Keyboard shortcuts:</p>
          <ul style={{ marginTop: '0.5rem' }}>
            <li>↑/↓ - Navigate results</li>
            <li>Enter - Select result</li>
            <li>Esc - Close</li>
          </ul>
        </div>
        <SearchCommand
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSearch={() => {}}
          results={results}
        />
      </>
    );
  },
};

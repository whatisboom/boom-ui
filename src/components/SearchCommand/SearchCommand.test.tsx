import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchCommand } from './SearchCommand';
import { SearchResult } from './SearchCommand.types';

describe('SearchCommand', () => {
  const mockResults: SearchResult[] = [
    {
      id: '1',
      category: 'Pages',
      title: 'Dashboard',
      subtitle: '/dashboard',
      onSelect: vi.fn(),
    },
    {
      id: '2',
      category: 'Actions',
      title: 'Create Project',
      onSelect: vi.fn(),
    },
  ];

  it('should render search input when open', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={[]}
      />
    );

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <SearchCommand
        isOpen={false}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={[]}
      />
    );

    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
  });

  // Note: User interaction tests moved to SearchCommand.motion.test.tsx due to Modal/Overlay motion compatibility

  it('should show loading state', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={[]}
        isLoading={true}
      />
    );

    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '../../../tests/test-utils';
import { SearchCommand } from './SearchCommand';
import { SearchResult } from './SearchCommand.types';

describe('SearchCommand - Motion Tests - Results Rendering', () => {
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

  it('should render search results grouped by category', async () => {
    const onSearch = vi.fn();

    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={onSearch}
        results={mockResults}
      />
    );

    const input = screen.getByPlaceholderText(/search/i);

    // Use fireEvent.change directly to bypass userEvent issues
    // Wrap in act() to ensure React flushes all updates
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
    });

    // Wait for results to render after query state updates
    await waitFor(
      () => {
        expect(screen.getByText('Pages')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Project')).toBeInTheDocument();
  });
});

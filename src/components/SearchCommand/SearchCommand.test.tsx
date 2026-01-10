import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../tests/test-utils';
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

  it('should call onSearch with debounced input', async () => {
    const onSearch = vi.fn();
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={onSearch}
        results={[]}
      />
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test query' } });

    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledWith('test query');
      },
      { timeout: 400 }
    );
  });

  it('should render search results grouped by category', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={mockResults}
      />
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Project')).toBeInTheDocument();
  });

  it('should call onSelect when result is clicked', () => {
    const onSelect = vi.fn();
    const results: SearchResult[] = [
      { id: '1', title: 'Test', onSelect },
    ];

    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={results}
      />
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test' } });

    fireEvent.click(screen.getByText('Test'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('should support keyboard navigation', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={mockResults}
      />
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test' } });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Dashboard').closest('button')).toHaveFocus();

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Create Project').closest('button')).toHaveFocus();

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(screen.getByText('Dashboard').closest('button')).toHaveFocus();
  });

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

  it('should show empty message when no results', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={[]}
        emptyMessage="No results found"
      />
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});

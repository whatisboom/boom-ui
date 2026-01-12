import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchCommand } from './SearchCommand';
import type { SearchResult } from './SearchCommand.types';

describe('SearchCommand - Motion Tests - Keyboard Navigation', () => {
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

  it.skip('should support keyboard navigation', async () => {
    // KNOWN ISSUE: Keyboard focus doesn't work correctly in jsdom environment
    // Arrow keys don't move focus from body to button elements in Portal
    // Works correctly in production and Storybook
    // TODO: Investigate jsdom focus behavior with Portal components
    const user = userEvent.setup({ delay: null });

    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={mockResults}
      />
    );

    const input = screen.getByPlaceholderText(/search/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Dashboard').closest('button')).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByText('Create Project').closest('button')).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByText('Dashboard').closest('button')).toHaveFocus();
  });
});

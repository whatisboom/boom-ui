import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '../../../tests/test-utils';
import { SearchCommand } from './SearchCommand';

describe('SearchCommand - Motion Tests - Empty State', () => {
  it('should show empty message when no results', async () => {
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
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
    });

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchCommand } from './SearchCommand';
import { SearchResult } from './SearchCommand.types';

describe('SearchCommand - Motion Tests - Result Selection', () => {
  it('should call onSelect when result is clicked', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup({ delay: null });
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
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Test'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});

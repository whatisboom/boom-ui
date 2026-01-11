import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '../../../tests/test-utils';
import { SearchCommand } from './SearchCommand';

describe('SearchCommand - Motion Tests - Debounce', () => {
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

    // Use fireEvent.change for consistency with other tests
    await act(async () => {
      fireEvent.change(input, { target: { value: 'test query' } });
    });

    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledWith('test query');
      },
      { timeout: 500 }
    );
  });

  // Note: Other motion tests have been split into separate files to fix Vitest isolation bug:
  // - SearchCommand.motion-results.test.tsx
  // - SearchCommand.motion-select.test.tsx
  // - SearchCommand.motion-keyboard.test.tsx
  // - SearchCommand.motion-empty.test.tsx
});

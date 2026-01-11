import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { SearchCommand } from './SearchCommand';

describe('SearchCommand', () => {

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

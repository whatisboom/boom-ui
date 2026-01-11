import { vi } from 'vitest';
import React, { Fragment, createElement, ReactNode } from 'react';

// Mock motion components to render as plain elements
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');

  // Create a proxy that intercepts motion.* and returns plain elements
  const motionProxy = new Proxy({}, {
    get: (_target, prop: string) => {
      // Return a component that renders as the plain HTML element
      return ({ children, ...props }: any) => {
        const { initial, animate, exit, transition, variants, whileHover, whileTap, whileFocus, ...restProps } = props;
        return createElement(prop, restProps, children);
      };
    }
  });

  return {
    ...actual,
    motion: motionProxy,
    AnimatePresence: ({ children }: { children: ReactNode }) => {
      // Render children directly without animation delays
      return children ? createElement(Fragment, null, children) : null;
    },
  };
});

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

  it('should call onSearch with debounced input', async () => {
    const onSearch = vi.fn();
    const user = userEvent.setup({ delay: null });

    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={onSearch}
        results={[]}
      />
    );

    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'test query');

    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledWith('test query');
      },
      { timeout: 500 }
    );
  });

  it('should render search results grouped by category', async () => {
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
    await user.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('Pages')).toBeInTheDocument();
    });

    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Project')).toBeInTheDocument();
  });

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
    await user.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Test'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('should support keyboard navigation', async () => {
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
    await user.type(input, 'test');

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

  it('should show empty message when no results', async () => {
    const user = userEvent.setup({ delay: null });

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
    await user.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });
});

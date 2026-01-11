import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';

describe('EmptyState', () => {
  it('should render with title', () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByRole('heading', { name: /no results found/i })).toBeInTheDocument();
  });

  it('should render with description', () => {
    render(
      <EmptyState
        title="No results"
        description="Try adjusting your filters"
      />
    );
    expect(screen.getByText(/try adjusting your filters/i)).toBeInTheDocument();
  });

  it('should render with illustration', () => {
    render(
      <EmptyState
        title="Empty"
        illustration={<div data-testid="illustration">Icon</div>}
      />
    );
    expect(screen.getByTestId('illustration')).toBeInTheDocument();
  });

  it('should render with action', () => {
    render(
      <EmptyState
        title="No items"
        action={<Button>Create item</Button>}
      />
    );
    expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
  });

  it('should render different sizes', () => {
    const { rerender, container } = render(<EmptyState title="Title" size="sm" />);
    let emptyState = container.firstChild as HTMLElement;
    expect(emptyState).toBeInTheDocument();

    rerender(<EmptyState title="Title" size="lg" />);
    emptyState = container.firstChild as HTMLElement;
    expect(emptyState).toBeInTheDocument();
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(
      <EmptyState
        illustration={<span>📭</span>}
        title="No messages"
        description="Your inbox is empty"
        action={<Button>Compose</Button>}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should use h2 heading by default', () => {
    render(<EmptyState title="No results" />);
    const heading = screen.getByRole('heading', { name: /no results/i });
    expect(heading.tagName).toBe('H2');
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Stack } from './Stack';

describe('Stack', () => {
  it('should render children', () => {
    render(
      <Stack data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    expect(screen.getByTestId('stack')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('should render as column by default', () => {
    render(<Stack data-testid="stack">Content</Stack>);
    expect(screen.getByTestId('stack')).toHaveStyle({ flexDirection: 'column' });
  });

  it('should render as row when direction is row', () => {
    render(<Stack direction="row" data-testid="stack">Content</Stack>);
    expect(screen.getByTestId('stack')).toHaveStyle({ flexDirection: 'row' });
  });

  it('should apply spacing', () => {
    render(<Stack spacing={4} data-testid="stack">Content</Stack>);
    expect(screen.getByTestId('stack')).toHaveStyle({ gap: 'var(--boom-spacing-4)' });
  });

  it('should apply align', () => {
    render(<Stack align="center" data-testid="stack">Content</Stack>);
    expect(screen.getByTestId('stack')).toHaveStyle({ alignItems: 'center' });
  });

  it('should apply justify', () => {
    render(<Stack justify="space-between" data-testid="stack">Content</Stack>);
    expect(screen.getByTestId('stack')).toHaveStyle({ justifyContent: 'space-between' });
  });

  it('should render as specified element with "as" prop', () => {
    render(<Stack as="section" data-testid="stack">Content</Stack>);
    expect(screen.getByTestId('stack').tagName).toBe('SECTION');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

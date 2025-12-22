import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {

  // Basic Rendering
  it('should render child element', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('should not show tooltip initially', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
  });

  // Hover behavior
  it('should show tooltip on mouse enter', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('should hide tooltip on mouse leave', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });

    await user.unhover(screen.getByText('Hover me'));
    await waitFor(() => {
      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });
  });

  // Focus behavior
  it('should show tooltip on focus', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Tooltip content="Tooltip text">
        <button>Focus me</button>
      </Tooltip>
    );

    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('should hide tooltip on blur', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Tooltip content="Tooltip text">
        <button>Focus me</button>
      </Tooltip>
    );

    await user.tab();
    await waitFor(() => {
      expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });

    await user.tab();
    await waitFor(() => {
      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });
  });

  // Delay
  it('should respect delay prop', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Tooltip content="Delayed tooltip" delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText('Hover me'));

    // Should not appear immediately
    expect(screen.queryByText('Delayed tooltip')).not.toBeInTheDocument();

    // Wait for delay + animation
    await waitFor(
      () => {
        expect(screen.getByText('Delayed tooltip')).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it('should cancel delayed tooltip on mouse leave', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Tooltip content="Delayed tooltip" delay={200}>
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText('Hover me'));

    // Immediately unhover before delay completes
    await user.unhover(screen.getByText('Hover me'));

    // Wait to ensure tooltip doesn't appear
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Tooltip should not appear
    expect(screen.queryByText('Delayed tooltip')).not.toBeInTheDocument();
  });

  // Placements
  it('should render with top placement', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Tooltip content="Top tooltip" placement="top">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(screen.getByText('Top tooltip')).toBeInTheDocument();
    });
  });

  it('should render with bottom placement', async () => {
    const user = userEvent.setup({ delay: null });

    render(
      <Tooltip content="Bottom tooltip" placement="bottom">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(screen.getByText('Bottom tooltip')).toBeInTheDocument();
    });
  });

  // Accessibility
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Tooltip content="Accessible tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (open)', async () => {
    const user = userEvent.setup({ delay: null });

    const { container } = render(
      <Tooltip content="Accessible tooltip">
        <button>Hover me</button>
      </Tooltip>
    );

    await user.hover(screen.getByText('Hover me'));

    await waitFor(() => {
      expect(screen.getByText('Accessible tooltip')).toBeInTheDocument();
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});

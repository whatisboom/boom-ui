import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Alert } from './Alert';

describe('Alert', () => {
  // Basic Rendering
  it('should render alert with content', () => {
    render(<Alert>Test message</Alert>);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render with title', () => {
    render(<Alert title="Alert Title">Test message</Alert>);

    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  // Variants
  it('should render info variant', () => {
    render(<Alert variant="info">Info message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('info');
  });

  it('should render success variant', () => {
    render(<Alert variant="success">Success message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('success');
  });

  it('should render warning variant', () => {
    render(<Alert variant="warning">Warning message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('warning');
  });

  it('should render error variant', () => {
    render(<Alert variant="error">Error message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('error');
  });

  it('should default to info variant', () => {
    render(<Alert>Default message</Alert>);

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('info');
  });

  // Icons
  it('should render default icon based on variant', () => {
    render(<Alert variant="success">Success</Alert>);

    // Icon should be present (we'll check for SVG)
    const alert = screen.getByRole('alert');
    const svg = alert.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render custom icon when provided', () => {
    const customIcon = <span data-testid="custom-icon">⭐</span>;
    render(<Alert icon={customIcon}>Message</Alert>);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('should hide icon when icon is null', () => {
    render(<Alert icon={null}>Message</Alert>);

    const alert = screen.getByRole('alert');
    const svg = alert.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  // Dismissible
  it('should render close button when onClose provided', () => {
    const handleClose = vi.fn();
    render(<Alert onClose={handleClose}>Dismissible message</Alert>);

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('should not render close button when onClose not provided', () => {
    render(<Alert>Non-dismissible message</Alert>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should call onClose when close button clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<Alert onClose={handleClose}>Dismissible message</Alert>);

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // Custom className
  it('should apply custom className', () => {
    render(<Alert className="custom-class">Message</Alert>);

    expect(screen.getByRole('alert').className).toContain('custom-class');
  });

  // Accessibility
  it('should have no accessibility violations (default)', async () => {
    const { container } = render(<Alert>Test message</Alert>);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with title)', async () => {
    const { container } = render(<Alert title="Title">Test message</Alert>);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (dismissible)', async () => {
    const { container } = render(<Alert onClose={() => {}}>Dismissible message</Alert>);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (all variants)', async () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;

    for (const variant of variants) {
      const { container } = render(<Alert variant={variant}>Message</Alert>);
      expect(await axe(container)).toHaveNoViolations();
    }
  });

  it('should have role="alert" for screen readers', () => {
    render(<Alert>Important message</Alert>);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});

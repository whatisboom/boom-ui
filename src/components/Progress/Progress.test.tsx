import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Progress } from './Progress';

describe('Progress', () => {
  // Basic Rendering - Linear
  it('should render linear progress by default', () => {
    render(<Progress value={50} aria-label="Loading" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
  });

  it('should display determinate linear progress value', () => {
    render(<Progress value={75} aria-label="Loading" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '75');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('should render indeterminate linear progress when value not provided', () => {
    render(<Progress aria-label="Loading" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).not.toHaveAttribute('aria-valuenow');
  });

  // Circular variant
  it('should render circular progress', () => {
    render(<Progress variant="circular" value={60} aria-label="Loading" />);

    const progress = screen.getByRole('progressbar');
    // SVG elements use className differently, check with getAttribute
    expect(progress.getAttribute('class')).toContain('circular');
  });

  it('should render indeterminate circular progress', () => {
    render(<Progress variant="circular" aria-label="Loading" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).not.toHaveAttribute('aria-valuenow');
  });

  // Sizes
  it('should render different sizes', () => {
    const { rerender } = render(<Progress value={50} size="sm" aria-label="Loading" />);
    expect(screen.getByRole('progressbar').className).toContain('sm');

    rerender(<Progress value={50} size="md" aria-label="Loading" />);
    expect(screen.getByRole('progressbar').className).toContain('md');

    rerender(<Progress value={50} size="lg" aria-label="Loading" />);
    expect(screen.getByRole('progressbar').className).toContain('lg');
  });

  // Labels
  it('should show percentage label when showLabel is true', () => {
    render(<Progress value={45} showLabel aria-label="Loading" />);

    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('should show custom label when provided', () => {
    render(<Progress value={60} label="Uploading..." aria-label="Upload progress" />);

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('should not show label by default', () => {
    const { container } = render(<Progress value={50} aria-label="Loading" />);

    // Check that there's no text content showing percentage
    expect(container.textContent).not.toContain('50%');
  });

  it('should prioritize custom label over percentage', () => {
    render(<Progress value={50} showLabel label="Custom" aria-label="Loading" />);

    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  // Value boundaries
  it('should handle 0% value', () => {
    render(<Progress value={0} showLabel aria-label="Loading" />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should handle 100% value', () => {
    render(<Progress value={100} showLabel aria-label="Loading" />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should clamp values above 100', () => {
    render(<Progress value={150} aria-label="Loading" />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('should clamp values below 0', () => {
    render(<Progress value={-10} aria-label="Loading" />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  // ARIA attributes
  it('should have correct ARIA attributes for determinate progress', () => {
    render(<Progress value={50} aria-label="File upload" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-label', 'File upload');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveAttribute('aria-valuemin', '0');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });

  it('should have correct ARIA attributes for indeterminate progress', () => {
    render(<Progress aria-label="Loading" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-label', 'Loading');
    expect(progress).not.toHaveAttribute('aria-valuenow');
  });

  // Custom className
  it('should apply custom className', () => {
    render(<Progress value={50} className="custom-class" aria-label="Loading" />);

    expect(screen.getByRole('progressbar').className).toContain('custom-class');
  });

  // Accessibility
  it('should have no accessibility violations (linear determinate)', async () => {
    const { container } = render(<Progress value={50} aria-label="Loading" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (linear indeterminate)', async () => {
    const { container } = render(<Progress aria-label="Loading" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (circular determinate)', async () => {
    const { container } = render(<Progress variant="circular" value={75} aria-label="Loading" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (circular indeterminate)', async () => {
    const { container } = render(<Progress variant="circular" aria-label="Loading" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with label)', async () => {
    const { container } = render(<Progress value={50} showLabel aria-label="Loading" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});

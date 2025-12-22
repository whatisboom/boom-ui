import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  // Basic Rendering
  it('should render children correctly', () => {
    render(<Badge>5</Badge>);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render string content', () => {
    render(<Badge>NEW</Badge>);

    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('should render numeric content', () => {
    render(<Badge>{99}</Badge>);

    expect(screen.getByText('99')).toBeInTheDocument();
  });

  // Variants
  it('should render primary variant', () => {
    const { container } = render(<Badge variant="primary">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('primary');
  });

  it('should render success variant', () => {
    const { container } = render(<Badge variant="success">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('success');
  });

  it('should render warning variant', () => {
    const { container } = render(<Badge variant="warning">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('warning');
  });

  it('should render error variant', () => {
    const { container } = render(<Badge variant="error">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('error');
  });

  it('should render info variant', () => {
    const { container } = render(<Badge variant="info">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('info');
  });

  it('should render neutral variant', () => {
    const { container } = render(<Badge variant="neutral">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('neutral');
  });

  // Sizes
  it('should render small size', () => {
    const { container } = render(<Badge size="sm">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('sm');
  });

  it('should render medium size', () => {
    const { container } = render(<Badge size="md">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('md');
  });

  it('should render large size', () => {
    const { container } = render(<Badge size="lg">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('lg');
  });

  // Custom className
  it('should apply custom className', () => {
    const { container } = render(<Badge className="custom-badge">1</Badge>);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('custom-badge');
  });

  // Accessibility
  it('should have no accessibility violations (default)', async () => {
    const { container } = render(<Badge>5</Badge>);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with variant)', async () => {
    const { container } = render(<Badge variant="success">Active</Badge>);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (all sizes)', async () => {
    const { container } = render(
      <div>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (all variants)', async () => {
    const { container } = render(
      <div>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="neutral">Neutral</Badge>
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  // Basic Rendering
  it('should render standalone badge with content', () => {
    render(<Badge content="5" />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render badge wrapping children', () => {
    render(
      <Badge content="3">
        <button>Notifications</button>
      </Badge>
    );

    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render dot badge', () => {
    const { container } = render(<Badge dot />);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge?.className).toContain('dot');
  });

  // Variants
  it('should render primary variant', () => {
    const { container } = render(<Badge content="1" variant="primary" />);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('primary');
  });

  it('should render success variant', () => {
    const { container } = render(<Badge content="1" variant="success" />);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('success');
  });

  it('should render warning variant', () => {
    const { container } = render(<Badge content="1" variant="warning" />);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('warning');
  });

  it('should render error variant', () => {
    const { container } = render(<Badge content="1" variant="error" />);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('error');
  });

  // Sizes
  it('should render different sizes', () => {
    const { container, rerender } = render(<Badge content="1" size="sm" />);
    let badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('sm');

    rerender(<Badge content="1" size="md" />);
    badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('md');

    rerender(<Badge content="1" size="lg" />);
    badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('lg');
  });

  // Max value
  it('should display max+ when content exceeds max', () => {
    render(<Badge content={150} max={99} />);

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should display actual content when below max', () => {
    render(<Badge content={50} max={99} />);

    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should use default max of 99', () => {
    render(<Badge content={100} />);

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  // Positions
  it('should apply position classes when wrapping children', () => {
    const { container } = render(
      <Badge content="1" position="top-right">
        <button>Button</button>
      </Badge>
    );

    const wrapper = container.querySelector('[class*="wrapper"]');
    expect(wrapper?.className).toContain('topRight');
  });

  it('should apply bottom-left position', () => {
    const { container } = render(
      <Badge content="1" position="bottom-left">
        <button>Button</button>
      </Badge>
    );

    const wrapper = container.querySelector('[class*="wrapper"]');
    expect(wrapper?.className).toContain('bottomLeft');
  });

  // Dot badge
  it('should render dot without content', () => {
    const { container } = render(<Badge dot />);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.textContent).toBe('');
  });

  it('should ignore content when dot is true', () => {
    const { container } = render(<Badge dot content="5" />);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.textContent).toBe('');
  });

  // String content
  it('should render string content', () => {
    render(<Badge content="NEW" />);

    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  // Custom className
  it('should apply custom className', () => {
    const { container } = render(<Badge content="1" className="custom-badge" />);

    const badge = container.querySelector('[class*="badge"]');
    expect(badge?.className).toContain('custom-badge');
  });

  // Accessibility
  it('should have no accessibility violations (standalone)', async () => {
    const { container } = render(<Badge content="5" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (wrapping)', async () => {
    const { container } = render(
      <Badge content="3">
        <button>Notifications</button>
      </Badge>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (dot)', async () => {
    const { container } = render(<Badge dot />);

    expect(await axe(container)).toHaveNoViolations();
  });
});

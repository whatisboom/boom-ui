import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, act } from '../../../tests/test-utils';
import { axe } from 'vitest-axe';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  // Basic Rendering with Image
  it('should render image when src is provided', () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="User" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(img).toHaveAttribute('alt', 'User');
  });

  // Fallback to Initials
  it('should render initials when src fails to load', async () => {
    render(
      <Avatar src="https://invalid-url.com/broken.jpg" alt="John Doe" name="John Doe" />
    );

    const img = screen.getByRole('img');

    // Trigger error
    act(() => {
      img.dispatchEvent(new Event('error'));
    });

    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  it('should render initials when no src is provided', () => {
    render(<Avatar alt="Jane Smith" name="Jane Smith" />);

    expect(screen.getByText('JS')).toBeInTheDocument();
  });

  it('should generate single initial when name has one word', () => {
    render(<Avatar alt="Madonna" name="Madonna" />);

    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('should use first two words for initials', () => {
    render(<Avatar alt="User" name="John Michael Doe" />);

    expect(screen.getByText('JM')).toBeInTheDocument();
  });

  it('should handle empty name gracefully', () => {
    const { container } = render(<Avatar alt="User" name="" />);

    const avatar = container.querySelector('[class*="avatar"]');
    expect(avatar).toBeInTheDocument();
  });

  // Sizes
  it('should render small size', () => {
    const { container } = render(<Avatar alt="User" name="John Doe" size="sm" />);

    const avatar = container.querySelector('[class*="avatar"]');
    expect(avatar?.className).toContain('sm');
  });

  it('should render medium size by default', () => {
    const { container } = render(<Avatar alt="User" name="John Doe" />);

    const avatar = container.querySelector('[class*="avatar"]');
    expect(avatar?.className).toContain('md');
  });

  it('should render large size', () => {
    const { container } = render(<Avatar alt="User" name="John Doe" size="lg" />);

    const avatar = container.querySelector('[class*="avatar"]');
    expect(avatar?.className).toContain('lg');
  });

  it('should render extra large size', () => {
    const { container } = render(<Avatar alt="User" name="John Doe" size="xl" />);

    const avatar = container.querySelector('[class*="avatar"]');
    expect(avatar?.className).toContain('xl');
  });

  // Status Indicators
  it('should not show status indicator by default', () => {
    const { container } = render(<Avatar alt="User" name="User" status="online" />);

    const statusIndicator = container.querySelector('[class*="status"]');
    expect(statusIndicator).not.toBeInTheDocument();
  });

  it('should show online status', () => {
    const { container } = render(
      <Avatar alt="User" name="User" status="online" showStatus />
    );

    const statusIndicator = container.querySelector('[class*="status"]');
    expect(statusIndicator?.className).toContain('online');
  });

  it('should show offline status', () => {
    const { container } = render(
      <Avatar alt="User" name="User" status="offline" showStatus />
    );

    const statusIndicator = container.querySelector('[class*="status"]');
    expect(statusIndicator?.className).toContain('offline');
  });

  it('should show away status', () => {
    const { container } = render(
      <Avatar alt="User" name="User" status="away" showStatus />
    );

    const statusIndicator = container.querySelector('[class*="status"]');
    expect(statusIndicator?.className).toContain('away');
  });

  it('should show busy status', () => {
    const { container } = render(
      <Avatar alt="User" name="User" status="busy" showStatus />
    );

    const statusIndicator = container.querySelector('[class*="status"]');
    expect(statusIndicator?.className).toContain('busy');
  });

  // Image Loading States
  it('should show image when loaded successfully', async () => {
    render(<Avatar src="https://example.com/avatar.jpg" alt="User" name="User" />);

    const img = screen.getByRole('img');

    // Simulate successful load
    act(() => {
      img.dispatchEvent(new Event('load'));
    });

    await waitFor(() => {
      expect(img).toBeVisible();
      expect(screen.queryByText('U')).not.toBeInTheDocument();
    });
  });

  // Custom className
  it('should apply custom className', () => {
    const { container } = render(
      <Avatar alt="User" name="User" className="custom-avatar" />
    );

    const avatar = container.querySelector('[class*="avatar"]');
    expect(avatar?.className).toContain('custom-avatar');
  });

  // Accessibility
  it('should have no accessibility violations (with image)', async () => {
    const { container } = render(
      <Avatar src="https://example.com/avatar.jpg" alt="John Doe" />
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with initials)', async () => {
    const { container } = render(<Avatar alt="John Doe" name="John Doe" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with status)', async () => {
    const { container } = render(
      <Avatar
        alt="User"
        name="User"
        status="online"
        showStatus
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (all sizes)', async () => {
    const { container } = render(
      <div>
        <Avatar alt="User 1" name="User 1" size="sm" />
        <Avatar alt="User 2" name="User 2" size="md" />
        <Avatar alt="User 3" name="User 3" size="lg" />
        <Avatar alt="User 4" name="User 4" size="xl" />
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

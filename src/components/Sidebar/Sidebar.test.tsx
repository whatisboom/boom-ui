import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  // Mock window.matchMedia
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  beforeEach(() => {
    // Default to desktop view
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const HomeIcon = () => <svg data-testid="home-icon" />;
  const SettingsIcon = () => <svg data-testid="settings-icon" />;

  const renderSidebar = (props = {}) => {
    return render(
      <Sidebar {...props}>
        <Sidebar.Header>
          <div>Logo</div>
        </Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item icon={<HomeIcon />} label="Home" />
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    );
  };

  // Basic Rendering
  it('should render sidebar with header and navigation items', () => {
    renderSidebar();

    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    renderSidebar({ className: 'custom-sidebar' });

    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toHaveClass('custom-sidebar');
  });

  // Controlled Mode
  it('should work in controlled mode', () => {
    const onCollapse = vi.fn();
    const { rerender } = render(
      <Sidebar collapsed={false} onCollapse={onCollapse}>
        <Sidebar.Header>Logo</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" />
        </Sidebar.Nav>
      </Sidebar>
    );

    let sidebar = screen.getByRole('navigation');
    expect(sidebar.className).not.toContain('collapsed');

    // Rerender with collapsed=true
    rerender(
      <Sidebar collapsed={true} onCollapse={onCollapse}>
        <Sidebar.Header>Logo</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" />
        </Sidebar.Nav>
      </Sidebar>
    );

    sidebar = screen.getByRole('navigation');
    expect(sidebar.className).toContain('collapsed');
  });

  // Uncontrolled Mode
  it('should work in uncontrolled mode with defaultCollapsed', () => {
    render(
      <Sidebar defaultCollapsed={true}>
        <Sidebar.Header>Logo</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" />
        </Sidebar.Nav>
      </Sidebar>
    );

    const sidebar = screen.getByRole('navigation');
    expect(sidebar.className).toContain('collapsed');
  });

  // Position
  it('should render on left by default', () => {
    renderSidebar();

    const sidebar = screen.getByRole('navigation');
    expect(sidebar.className).toContain('left');
  });

  it('should render on right when position="right"', () => {
    renderSidebar({ position: 'right' });

    const sidebar = screen.getByRole('navigation');
    expect(sidebar.className).toContain('right');
  });

  // Sidebar Items
  it('should render item icons', () => {
    renderSidebar();

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
  });

  it('should handle item click', async () => {
    const onClick = vi.fn();
    render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" onClick={onClick} />
        </Sidebar.Nav>
      </Sidebar>
    );

    await userEvent.click(screen.getByText('Home'));

    expect(onClick).toHaveBeenCalled();
  });

  it('should render item as link with href', () => {
    render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" href="/home" />
        </Sidebar.Nav>
      </Sidebar>
    );

    const link = screen.getByText('Home').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
  });

  it('should mark active item with aria-current', () => {
    render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" isActive={true} />
          <Sidebar.Item label="Settings" isActive={false} />
        </Sidebar.Nav>
      </Sidebar>
    );

    const homeItem = screen.getByText('Home').closest('button');
    const settingsItem = screen.getByText('Settings').closest('button');

    expect(homeItem).toHaveAttribute('aria-current', 'page');
    expect(settingsItem).not.toHaveAttribute('aria-current');
  });

  it('should render badge when provided', () => {
    render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Notifications" badge={5} />
        </Sidebar.Nav>
      </Sidebar>
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render "99+" for badges over 99', () => {
    render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Notifications" badge={150} />
        </Sidebar.Nav>
      </Sidebar>
    );

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should not render badge when value is 0', () => {
    render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Notifications" badge={0} />
        </Sidebar.Nav>
      </Sidebar>
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should disable item when disabled=true', async () => {
    const onClick = vi.fn();
    render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" disabled={true} onClick={onClick} />
        </Sidebar.Nav>
      </Sidebar>
    );

    const item = screen.getByText('Home').closest('button');
    expect(item).toHaveAttribute('disabled');

    if (item) {
      await userEvent.click(item);
    }
    expect(onClick).not.toHaveBeenCalled();
  });

  // Collapsed State
  it('should add title attribute to items when collapsed', () => {
    render(
      <Sidebar collapsed={true}>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" />
        </Sidebar.Nav>
      </Sidebar>
    );

    const item = screen.getByText('Home').closest('button');
    expect(item).toHaveAttribute('title', 'Home');
  });

  it('should hide labels in collapsed state', () => {
    render(
      <Sidebar collapsed={true}>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" />
        </Sidebar.Nav>
      </Sidebar>
    );

    const label = screen.getByText('Home');
    expect(label.className).toContain('collapsed');
  });

  // Mobile Behavior
  it('should not render drawer on desktop', () => {
    mockMatchMedia(false); // Desktop
    renderSidebar();

    // Sidebar should render normally (not in drawer)
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toBeInTheDocument();
  });

  it('should render in drawer on mobile', async () => {
    mockMatchMedia(true); // Mobile
    renderSidebar();

    // On mobile, sidebar is initially closed
    // The Drawer component uses AnimatePresence, so content may not be in DOM
    await waitFor(() => {
      expect(screen.queryByText('Logo')).not.toBeInTheDocument();
    });
  });

  // Width customization
  it('should apply custom width', () => {
    render(
      <Sidebar width="320px">
        <Sidebar.Nav>
          <Sidebar.Item label="Home" />
        </Sidebar.Nav>
      </Sidebar>
    );

    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toHaveStyle({ '--sidebar-width': '320px' });
  });

  it('should apply custom collapsed width', () => {
    render(
      <Sidebar collapsedWidth="80px">
        <Sidebar.Nav>
          <Sidebar.Item label="Home" />
        </Sidebar.Nav>
      </Sidebar>
    );

    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toHaveStyle({ '--sidebar-collapsed-width': '80px' });
  });

  // Accessibility
  it('should have navigation landmark', () => {
    renderSidebar();

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Sidebar navigation');
  });

  it('should have list role for navigation', () => {
    renderSidebar();

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
  });

  it('should have no accessibility violations (expanded)', async () => {
    const { container } = renderSidebar();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (collapsed)', async () => {
    const { container } = render(
      <Sidebar collapsed={true}>
        <Sidebar.Header>Logo</Sidebar.Header>
        <Sidebar.Nav>
          <Sidebar.Item icon={<HomeIcon />} label="Home" />
          <Sidebar.Item icon={<SettingsIcon />} label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with active item)', async () => {
    const { container } = render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" isActive={true} />
          <Sidebar.Item label="Settings" />
        </Sidebar.Nav>
      </Sidebar>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with disabled item)', async () => {
    const { container } = render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Home" />
          <Sidebar.Item label="Settings" disabled={true} />
        </Sidebar.Nav>
      </Sidebar>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with badges)', async () => {
    const { container } = render(
      <Sidebar>
        <Sidebar.Nav>
          <Sidebar.Item label="Notifications" badge={5} />
          <Sidebar.Item label="Messages" badge={150} />
        </Sidebar.Nav>
      </Sidebar>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (right position)', async () => {
    const { container } = renderSidebar({ position: 'right' });

    expect(await axe(container)).toHaveNoViolations();
  });
});

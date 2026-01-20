import type { ReactNode } from 'react';

export interface SidebarProps {
  /**
   * Sidebar content (typically Sidebar.Header, Sidebar.Nav)
   */
  children: ReactNode;

  /**
   * Whether the sidebar is collapsed (controlled mode)
   */
  collapsed?: boolean;

  /**
   * Callback when collapse state changes (controlled mode)
   */
  onCollapse?: (collapsed: boolean) => void;

  /**
   * Initial collapsed state (uncontrolled mode)
   * @default false
   */
  defaultCollapsed?: boolean;

  /**
   * Position of sidebar
   * @default 'left'
   */
  position?: 'left' | 'right';

  /**
   * Width when expanded
   * @default '280px'
   */
  width?: string;

  /**
   * Width when collapsed (rail mode)
   * @default '64px'
   */
  collapsedWidth?: string;

  /**
   * Breakpoint for mobile overlay behavior
   * @default 768
   */
  mobileBreakpoint?: number;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Disable animations
   * @default false
   */
  disableAnimation?: boolean;
}

export interface SidebarHeaderProps {
  /**
   * Header content
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface SidebarNavProps {
  /**
   * Navigation items (Sidebar.Item components)
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface SidebarItemProps {
  /**
   * Item icon
   */
  icon?: ReactNode;

  /**
   * Item label
   */
  label: string;

  /**
   * Whether this item is active
   * @default false
   */
  isActive?: boolean;

  /**
   * Whether this item is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click handler
   */
  onClick?: () => void;

  /**
   * Link href (if this is a link)
   */
  href?: string;

  /**
   * Badge count
   */
  badge?: number;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface SidebarContextValue {
  /**
   * Whether the sidebar is collapsed
   */
  collapsed: boolean;

  /**
   * Toggle collapse state
   */
  toggleCollapse: () => void;

  /**
   * Sidebar position
   */
  position: 'left' | 'right';

  /**
   * Whether on mobile (overlay mode)
   */
  isMobile: boolean;

  /**
   * Close sidebar (mobile only)
   */
  close: () => void;

  /**
   * Whether animations are disabled
   */
  disableAnimation: boolean;
}

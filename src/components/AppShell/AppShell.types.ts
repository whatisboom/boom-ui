import type { ReactElement, ReactNode, CSSProperties } from 'react';
import type { HeaderProps } from '@/components/Header/Header.types';
import type { SidebarProps } from '@/components/Sidebar/Sidebar.types';

export interface AppShellProps {
  /**
   * Header component (typically <Header />)
   */
  header?: ReactElement<HeaderProps>;

  /**
   * Sidebar component (typically <Sidebar />)
   */
  sidebar?: ReactElement<SidebarProps>;

  /**
   * Main content area
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Additional inline styles
   *
   * Note: Can be used to override the default grid layout if advanced customization is needed.
   * The component provides default grid template properties based on header/sidebar presence,
   * but these can be overridden via this prop.
   */
  style?: CSSProperties;
}

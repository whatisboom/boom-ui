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
   * Note: Grid layout properties (gridTemplateAreas, gridTemplateRows, gridTemplateColumns)
   * are managed by the component based on header/sidebar presence and will override any
   * user-provided values.
   */
  style?: CSSProperties;
}

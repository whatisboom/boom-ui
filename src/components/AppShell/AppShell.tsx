import type { CSSProperties } from 'react';
import type { AppShellProps } from './AppShell.types';
import { cn } from '@/utils/classnames';
import styles from './AppShell.module.css';

const DEFAULT_SIDEBAR_WIDTH = '280px';
const HEADER_HEIGHT = 'var(--boom-header-height, 64px)';

export function AppShell({ header, sidebar, children, className, style }: AppShellProps) {
  // Extract sidebar width from sidebar props
  const sidebarWidth = sidebar?.props.width || DEFAULT_SIDEBAR_WIDTH;

  // Build grid template properties based on what's present
  const hasHeader = !!header;
  const hasSidebar = !!sidebar;

  // Grid template areas
  let gridTemplateAreas: string;
  if (hasHeader && hasSidebar) {
    gridTemplateAreas = '"header header" "sidebar main"';
  } else if (hasHeader) {
    gridTemplateAreas = '"header" "main"';
  } else if (hasSidebar) {
    gridTemplateAreas = '"sidebar main"';
  } else {
    gridTemplateAreas = '"main"';
  }

  // Grid template rows
  let gridTemplateRows: string;
  if (hasHeader) {
    gridTemplateRows = `${HEADER_HEIGHT} 1fr`;
  } else {
    gridTemplateRows = '100vh';
  }

  // Grid template columns
  let gridTemplateColumns: string;
  if (hasSidebar) {
    gridTemplateColumns = `${sidebarWidth} 1fr`;
  } else {
    gridTemplateColumns = '1fr';
  }

  // Merge inline styles with grid properties and layout styles
  // Note: Grid template properties are intentionally placed AFTER user's style prop
  // to ensure the component's layout structure is preserved. The grid layout is
  // calculated based on header/sidebar presence and must not be overridden.
  const containerStyle: CSSProperties = {
    display: 'grid',
    height: '100vh',
    overflow: 'hidden',
    ...style,
    gridTemplateAreas,
    gridTemplateRows,
    gridTemplateColumns,
  };

  // Style for main element
  const mainStyle: CSSProperties = {
    gridArea: 'main',
  };

  // Style for header wrapper
  const headerStyle: CSSProperties = {
    gridArea: 'header',
  };

  // Style for sidebar wrapper
  const sidebarStyle: CSSProperties = {
    gridArea: 'sidebar',
  };

  return (
    <div className={cn(styles.appShell, className)} style={containerStyle}>
      {header && <div style={headerStyle}>{header}</div>}
      {sidebar && <div style={sidebarStyle}>{sidebar}</div>}
      <main className={styles.main} style={mainStyle}>
        {children}
      </main>
    </div>
  );
}

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Drawer } from '@/components/primitives/Drawer';
import { SidebarContext } from './SidebarContext';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarItem } from './SidebarItem';
import type { SidebarProps } from './Sidebar.types';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/utils/classnames';
import styles from './Sidebar.module.css';

const DEFAULT_WIDTH = '280px';
const DEFAULT_COLLAPSED_WIDTH = '64px';
const DEFAULT_MOBILE_BREAKPOINT = 768;

function SidebarComponent({
  children,
  collapsed: controlledCollapsed,
  onCollapse,
  defaultCollapsed = false,
  position = 'left',
  width = DEFAULT_WIDTH,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT,
  className,
  disableAnimation = false,
}: SidebarProps) {
  // Controlled vs uncontrolled state
  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    useState(defaultCollapsed);

  const isControlled = controlledCollapsed !== undefined;
  const collapsed = isControlled ? controlledCollapsed : uncontrolledCollapsed;

  // Mobile detection
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = useCallback(() => {
    if (isMobile) {
      // On mobile, toggle drawer open/close
      setMobileOpen((prev) => !prev);
    } else {
      // On desktop, toggle collapse state
      const newCollapsed = !collapsed;
      if (isControlled) {
        onCollapse?.(newCollapsed);
      } else {
        setUncontrolledCollapsed(newCollapsed);
      }
    }
  }, [isMobile, collapsed, isControlled, onCollapse]);

  const close = useCallback(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  const contextValue = useMemo(
    () => ({
      collapsed,
      toggleCollapse,
      position,
      isMobile,
      close,
      disableAnimation,
    }),
    [collapsed, toggleCollapse, position, isMobile, close, disableAnimation]
  );

  const sidebarContent = (
    <SidebarContext.Provider value={contextValue}>
      <nav
        className={cn(
          styles.sidebar,
          collapsed && styles.collapsed,
          styles[position],
          className
        )}
        style={{
          '--sidebar-width': width,
          '--sidebar-collapsed-width': collapsedWidth,
        } as React.CSSProperties}
        aria-label="Sidebar navigation"
      >
        {children}
      </nav>
    </SidebarContext.Provider>
  );

  // On mobile, render inside Drawer
  if (isMobile) {
    return (
      <Drawer
        isOpen={mobileOpen}
        onClose={close}
        side={position}
        width={width}
      >
        <SidebarContext.Provider value={contextValue}>
          {children}
        </SidebarContext.Provider>
      </Drawer>
    );
  }

  // On desktop, render static sidebar with animation
  if (disableAnimation) {
    return sidebarContent;
  }

  return (
    <motion.div
      initial={false}
      animate={{
        width: collapsed ? collapsedWidth : width,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={styles.sidebarWrapper}
    >
      {sidebarContent}
    </motion.div>
  );
}

// Attach compound components
export const Sidebar = Object.assign(SidebarComponent, {
  Header: SidebarHeader,
  Nav: SidebarNav,
  Item: SidebarItem,
  displayName: 'Sidebar',
});

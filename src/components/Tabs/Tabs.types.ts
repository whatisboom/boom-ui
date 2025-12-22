import { ReactNode } from 'react';

export interface TabsProps {
  /**
   * Current active tab value
   */
  value: string;

  /**
   * Callback when active tab changes
   */
  onChange: (value: string) => void;

  /**
   * Tab children (TabList and TabPanel components)
   */
  children: ReactNode;

  /**
   * Orientation of tabs
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface TabListProps {
  /**
   * Tab components
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface TabProps {
  /**
   * Value for this tab
   */
  value: string;

  /**
   * Tab label
   */
  children: ReactNode;

  /**
   * Whether this tab is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface TabPanelProps {
  /**
   * Value for this panel (should match a Tab value)
   */
  value: string;

  /**
   * Panel content
   */
  children: ReactNode;

  /**
   * Additional CSS class name
   */
  className?: string;
}

export interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  registerTab: (value: string, disabled: boolean) => void;
  unregisterTab: (value: string) => void;
  tabValues: string[];
  disabledTabs: Set<string>;
}

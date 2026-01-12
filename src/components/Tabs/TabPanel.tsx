import { useTabsContext } from './TabsContext';
import type { TabPanelProps } from './Tabs.types';
import { cn } from '@/utils/classnames';
import styles from './Tabs.module.css';

export const TabPanel = ({ value, children, className }: TabPanelProps) => {
  const { activeTab } = useTabsContext();
  const panelId = `panel-${value}`;
  const tabId = `tab-${value}`;

  const isActive = activeTab === value;

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!isActive}
      className={cn(styles.tabPanel, !isActive && styles.hidden, className)}
    >
      {children}
    </div>
  );
};

TabPanel.displayName = 'TabPanel';

import { useEffect } from 'react';
import { useTabsContext } from './TabsContext';
import { TabProps } from './Tabs.types';
import { cn } from '@/utils/classnames';
import styles from './Tabs.module.css';

export const Tab = ({ value, children, disabled = false, className }: TabProps) => {
  const { activeTab, setActiveTab, registerTab, unregisterTab } = useTabsContext();
  const tabId = `tab-${value}`;
  const panelId = `panel-${value}`;

  const isActive = activeTab === value;

  useEffect(() => {
    registerTab(value, disabled);
    return () => unregisterTab(value);
  }, [value, disabled, registerTab, unregisterTab]);

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  return (
    <button
      id={tabId}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={panelId}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      data-value={value}
      onClick={handleClick}
      className={cn(
        styles.tab,
        isActive && styles.active,
        disabled && styles.disabled,
        className
      )}
    >
      {children}
    </button>
  );
};

Tab.displayName = 'Tab';

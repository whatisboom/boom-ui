import { useState, useCallback, useMemo } from 'react';
import { TabsContext } from './TabsContext';
import type { TabsProps } from './Tabs.types';
import { cn } from '@/utils/classnames';
import styles from './Tabs.module.css';

export const Tabs = ({
  value,
  onChange,
  children,
  orientation = 'horizontal',
  className,
}: TabsProps) => {
  const [tabValues, setTabValues] = useState<string[]>([]);
  const [disabledTabs, setDisabledTabs] = useState<Set<string>>(new Set());

  const registerTab = useCallback((tabValue: string, disabled: boolean) => {
    setTabValues((prev) => {
      if (prev.includes(tabValue)) {return prev;}
      return [...prev, tabValue];
    });

    if (disabled) {
      setDisabledTabs((prev) => new Set(prev).add(tabValue));
    } else {
      setDisabledTabs((prev) => {
        const next = new Set(prev);
        next.delete(tabValue);
        return next;
      });
    }
  }, []);

  const unregisterTab = useCallback((tabValue: string) => {
    setTabValues((prev) => prev.filter((v) => v !== tabValue));
    setDisabledTabs((prev) => {
      const next = new Set(prev);
      next.delete(tabValue);
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      activeTab: value,
      setActiveTab: onChange,
      orientation,
      registerTab,
      unregisterTab,
      tabValues,
      disabledTabs,
    }),
    [value, onChange, orientation, registerTab, unregisterTab, tabValues, disabledTabs]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn(styles.tabs, styles[orientation], className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

import { createContext, useContext } from 'react';
import { TabsContextValue } from './Tabs.types';

export const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
};

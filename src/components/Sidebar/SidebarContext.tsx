import { createContext, useContext } from 'react';
import type { SidebarContextValue } from './Sidebar.types';

export const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
);

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      'Sidebar compound components must be used within a Sidebar component'
    );
  }
  return context;
}

import { createContext, useContext } from 'react';
import type { MenuContextValue } from './Menu.types';

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu compound components must be used within a Menu component');
  }
  return context;
}

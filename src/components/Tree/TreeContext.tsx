import { createContext, useContext } from 'react';
import { TreeContextValue } from './Tree.types';

export const TreeContext = createContext<TreeContextValue | undefined>(undefined);

export const useTreeContext = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTreeContext must be used within a Tree component');
  }
  return context;
};

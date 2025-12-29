import { createContext, useContext } from 'react';
import { TableContextValue } from './Table.types';

export const TableContext = createContext<TableContextValue | undefined>(undefined);

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table compound components must be used within a Table component');
  }
  return context;
};

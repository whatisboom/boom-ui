import { createContext, useContext } from 'react';
import type { TableContextValue } from './Table.types';

export const TableContext = createContext<TableContextValue<unknown> | undefined>(undefined);

export const useTableContext = (): TableContextValue<unknown> => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('Table compound components must be used within a Table component');
  }
  return context;
};

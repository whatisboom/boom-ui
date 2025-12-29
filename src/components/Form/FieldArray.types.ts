import { ReactNode } from 'react';

export interface FieldArrayProps {
  /**
   * Array field name from schema
   */
  name: string;

  /**
   * Render function for each field
   */
  children: (field: { id: string }, index: number, actions: {
    remove: () => void;
  }) => ReactNode;

  /**
   * Text for add button
   * @default 'Add'
   */
  addButtonText?: string;

  /**
   * Additional CSS class
   */
  className?: string;
}

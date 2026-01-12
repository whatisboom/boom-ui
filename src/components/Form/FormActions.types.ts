import type { ReactNode } from 'react';

export type FormActionsAlignment = 'left' | 'right' | 'center' | 'space-between';

export interface FormActionsProps {
  /**
   * Button alignment
   * @default 'right'
   */
  align?: FormActionsAlignment;

  /**
   * Action buttons
   */
  children: ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;
}

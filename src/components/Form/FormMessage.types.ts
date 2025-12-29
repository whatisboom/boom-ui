import { ReactNode } from 'react';

export type FormMessageType = 'success' | 'error' | 'warning' | 'info';

export interface FormMessageProps {
  /**
   * Message type
   */
  type: FormMessageType;

  /**
   * Message content
   */
  children: ReactNode;

  /**
   * Dismiss callback
   */
  onDismiss?: () => void;

  /**
   * Additional CSS class
   */
  className?: string;
}

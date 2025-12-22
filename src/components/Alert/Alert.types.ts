import { ReactNode } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  /**
   * The visual style variant of the alert
   * @default 'info'
   */
  variant?: AlertVariant;

  /**
   * Optional title displayed at the top of the alert
   */
  title?: string;

  /**
   * The main content of the alert
   */
  children: ReactNode;

  /**
   * Callback fired when the close button is clicked
   * If provided, a close button will be displayed
   */
  onClose?: () => void;

  /**
   * Custom icon to display. If not provided, a default icon based on variant will be used
   * Pass null to hide the icon completely
   */
  icon?: ReactNode | null;

  /**
   * Additional CSS class name
   */
  className?: string;
}

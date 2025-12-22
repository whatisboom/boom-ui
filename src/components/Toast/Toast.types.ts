import { ReactNode } from 'react';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface Toast {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastProps extends Toast {
  onClose: () => void;
  position?: ToastPosition;
}

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastProviderProps {
  children: ReactNode;
  /**
   * Default position for all toasts
   * @default 'top-right'
   */
  position?: ToastPosition;
  /**
   * Maximum number of toasts to show at once
   * @default 5
   */
  maxToasts?: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  toast: (options: ToastOptions | string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

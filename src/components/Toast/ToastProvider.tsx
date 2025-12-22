import { createContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Portal } from '../primitives/Portal';
import { Toast as ToastComponent } from './Toast';
import {
  Toast,
  ToastOptions,
  ToastContextValue,
  ToastProviderProps,
  ToastPosition,
} from './Toast.types';
import styles from './Toast.module.css';

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (options: ToastOptions | string): string => {
      const id = Math.random().toString(36).substring(2, 9);
      const toastOptions: ToastOptions =
        typeof options === 'string' ? { message: options } : options;

      const newToast: Toast = {
        id,
        message: toastOptions.message,
        variant: toastOptions.variant,
        duration: toastOptions.duration ?? 3000,
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Keep only the last maxToasts
        return updated.slice(-maxToasts);
      });

      return id;
    },
    [maxToasts]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const getPositionClass = (pos: ToastPosition): string => {
    switch (pos) {
      case 'top-right':
        return styles.topRight;
      case 'top-left':
        return styles.topLeft;
      case 'top-center':
        return styles.topCenter;
      case 'bottom-right':
        return styles.bottomRight;
      case 'bottom-left':
        return styles.bottomLeft;
      case 'bottom-center':
        return styles.bottomCenter;
      default:
        return styles.topRight;
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <Portal>
        <div className={`${styles.container} ${getPositionClass(position)}`}>
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <ToastComponent
                key={t.id}
                id={t.id}
                message={t.message}
                variant={t.variant}
                duration={t.duration}
                onClose={() => dismiss(t.id)}
                position={position}
              />
            ))}
          </AnimatePresence>
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};

ToastProvider.displayName = 'ToastProvider';

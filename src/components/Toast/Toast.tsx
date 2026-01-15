import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/classnames';
import { useStableCallback } from '@/hooks/useStableCallback';
import type { ToastProps } from './Toast.types';
import styles from './Toast.module.css';

// Icons (reusing Alert patterns)
const InfoIcon = () => (
  <svg
    className={styles.icon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SuccessIcon = () => (
  <svg
    className={styles.icon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    className={styles.icon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    className={styles.icon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    className={styles.closeIcon}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const getIcon = (variant: ToastProps['variant']) => {
  switch (variant) {
    case 'success':
      return <SuccessIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'info':
    default:
      return <InfoIcon />;
  }
};

const getSlideDirection = (position: ToastProps['position']) => {
  if (position?.includes('right')) {
    return { x: 400 };
  }
  if (position?.includes('left')) {
    return { x: -400 };
  }
  return { y: -100 }; // top-center, bottom-center
};

export const Toast = ({
  message,
  variant = 'info',
  duration,
  onClose,
  position,
}: ToastProps) => {
  const stableOnClose = useStableCallback(onClose);

  useEffect(() => {
    if (!duration) {
      return;
    }

    const timer = setTimeout(() => {
      stableOnClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, stableOnClose]);

  const slideDirection = getSlideDirection(position);

  return (
    <motion.div
      initial={{ opacity: 0, ...slideDirection }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...slideDirection }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(styles.toast, styles[variant])}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {getIcon(variant)}

      <div className={styles.message}>{message}</div>

      <button
        type="button"
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close notification"
      >
        <CloseIcon />
      </button>
    </motion.div>
  );
};

Toast.displayName = 'Toast';

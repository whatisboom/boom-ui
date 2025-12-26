import { useRef } from 'react';
import { Portal } from '../primitives/Portal';
import { Overlay } from '../primitives/Overlay';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { SpinnerProps } from './Spinner.types';
import styles from './Spinner.module.css';

export function Spinner({
  size = 'md',
  overlay = false,
  label = 'Loading',
  disableAnimation = false,
  className = '',
}: SpinnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useScrollLock(overlay);
  useFocusTrap(containerRef, overlay);

  const spinnerClasses = [
    styles.spinner,
    styles[size],
    disableAnimation && styles.noAnimation,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerElement = (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className={spinnerClasses} />
    </div>
  );

  if (overlay) {
    return (
      <Portal>
        <Overlay visible={true} />
        <div ref={containerRef} className={styles.overlayContainer}>
          {spinnerElement}
        </div>
      </Portal>
    );
  }

  return spinnerElement;
}

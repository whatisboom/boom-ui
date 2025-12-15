import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '../Portal';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { OverlayProps } from '../types';
import styles from './Overlay.module.css';

export function Overlay({
  isOpen,
  onClose,
  children,
  closeOnClickOutside = true,
  closeOnEscape = true,
  lockScroll = true,
}: OverlayProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen && lockScroll);
  useFocusTrap(contentRef, isOpen);
  useKeyboardShortcut('Escape', onClose, { enabled: isOpen && closeOnEscape });

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const firstFocusable = contentRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnClickOutside && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={styles.backdrop}
              onMouseDown={handleBackdropClick}
              data-testid="overlay-backdrop"
            />
            <div ref={contentRef} className={styles.content}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

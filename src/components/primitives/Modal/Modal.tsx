import { useId } from 'react';
import { motion } from 'framer-motion';
import { Overlay } from '../Overlay';
import type { ModalProps } from '../types';
import { cn } from '@/utils/classnames';
import styles from './Modal.module.css';

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEscape = true,
  lockScroll = true,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      lockScroll={lockScroll}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(styles.modal, styles[size])}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>

        {(title || description) && (
          <div className={styles.header}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
        )}

        <div className={styles.body}>{children}</div>
      </motion.div>
    </Overlay>
  );
}

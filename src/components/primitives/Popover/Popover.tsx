import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '../Portal';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { usePopoverPosition } from '@/hooks/usePopoverPosition';
import type { PopoverProps } from '../types';
import styles from './Popover.module.css';

export function Popover({
  isOpen,
  onClose,
  children,
  anchorEl,
  placement = 'bottom',
  offset = 8,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useClickOutside(popoverRef, onClose, isOpen);
  useKeyboardShortcut('Escape', onClose, { enabled: isOpen });

  const position = usePopoverPosition(popoverRef, anchorEl, placement, offset, isOpen);

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            className={styles.popover}
            style={{
              top: position.top,
              left: position.left,
            }}
            initial={{ opacity: 0, y: placement === 'bottom' ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === 'bottom' ? -10 : 10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}

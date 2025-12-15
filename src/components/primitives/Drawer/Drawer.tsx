import { motion } from 'framer-motion';
import { Overlay } from '../Overlay';
import { DrawerProps } from '../types';
import { cn } from '@/utils/classnames';
import styles from './Drawer.module.css';

const DEFAULT_WIDTH = '280px';

export function Drawer({
  isOpen,
  onClose,
  children,
  side = 'left',
  width = DEFAULT_WIDTH,
  closeOnClickOutside = true,
  closeOnEscape = true,
  lockScroll = true,
}: DrawerProps) {
  const slideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
  };

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
        data-testid="drawer"
        className={cn(styles.drawer, styles[side])}
        style={{ width }}
        initial={slideVariants[side].initial}
        animate={slideVariants[side].animate}
        exit={slideVariants[side].exit}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </Overlay>
  );
}

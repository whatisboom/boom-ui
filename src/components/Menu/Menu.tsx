import { useState, useRef, useMemo } from 'react';
import { MenuContext } from './MenuContext';
import type { MenuProps } from './Menu.types';
import { cn } from '@/utils/classnames';
import styles from './Menu.module.css';

export const Menu = ({ children, className }: MenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [itemCount, setItemCount] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const registerItem = (index: number, ref: HTMLButtonElement) => {
    itemRefs.current.set(index, ref);
  };

  const unregisterItem = (index: number) => {
    itemRefs.current.delete(index);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      triggerRef,
      contentRef,
      focusedIndex,
      setFocusedIndex,
      itemRefs,
      registerItem,
      unregisterItem,
      closeMenu,
      itemCount,
      setItemCount,
    }),
    [isOpen, focusedIndex, itemCount]
  );

  return (
    <MenuContext.Provider value={contextValue}>
      <div className={cn(styles.menu, className)}>{children}</div>
    </MenuContext.Provider>
  );
};

Menu.displayName = 'Menu';

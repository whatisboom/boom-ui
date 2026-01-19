import { useEffect } from 'react';
import { Popover } from '../primitives/Popover';
import { useMenuContext } from './MenuContext';
import type { MenuContentProps } from './Menu.types';
import { cn } from '@/utils/classnames';
import styles from './Menu.module.css';

export const MenuContent = ({
  children,
  className,
  placement = 'bottom',
  offset = 8,
}: MenuContentProps) => {
  const {
    isOpen,
    closeMenu,
    triggerRef,
    contentRef,
    focusedIndex,
    setFocusedIndex,
    itemRefs,
  } = useMenuContext();

  // Focus the appropriate item when focusedIndex changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      const item = itemRefs.current.get(focusedIndex);
      if (item && !item.disabled) {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
          item.focus();
        });
      }
    }
  }, [focusedIndex, isOpen, itemRefs]);

  // Handle keyboard navigation
  // Remove useCallback - React Compiler will optimize this
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const enabledItems = Array.from(itemRefs.current.entries())
      .filter(([, ref]) => !ref.disabled)
      .map(([index]) => index)
      .sort((a, b) => a - b);

    if (enabledItems.length === 0) {return;}

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const currentPos = enabledItems.indexOf(focusedIndex);
        const nextIndex =
          currentPos === -1
            ? enabledItems[0]
            : enabledItems[(currentPos + 1) % enabledItems.length];
        setFocusedIndex(nextIndex);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const currentPos = enabledItems.indexOf(focusedIndex);
        const prevIndex =
          currentPos === -1
            ? enabledItems[enabledItems.length - 1]
            : enabledItems[
                (currentPos - 1 + enabledItems.length) % enabledItems.length
              ];
        setFocusedIndex(prevIndex);
        break;
      }
      case 'Home': {
        e.preventDefault();
        setFocusedIndex(enabledItems[0]);
        break;
      }
      case 'End': {
        e.preventDefault();
        setFocusedIndex(enabledItems[enabledItems.length - 1]);
        break;
      }
      case 'Escape': {
        e.preventDefault();
        closeMenu();
        // Return focus to trigger
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
        break;
      }
    }
  };

  // Focus first item when menu opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure items are registered
      const timer = setTimeout(() => {
        const enabledItems = Array.from(itemRefs.current.entries())
          .filter(([, ref]) => !ref.disabled)
          .map(([index]) => index)
          .sort((a, b) => a - b);

        if (enabledItems.length > 0) {
          setFocusedIndex(enabledItems[0]);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isOpen, itemRefs, setFocusedIndex]);

  return (
    <Popover
      isOpen={isOpen}
      onClose={closeMenu}
      anchorEl={triggerRef}
      placement={placement}
      offset={offset}
    >
      <div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        className={cn(styles.menuContent, className)}
        role="menu"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </Popover>
  );
};

MenuContent.displayName = 'Menu.Content';

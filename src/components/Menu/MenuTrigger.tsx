import { cloneElement, isValidElement } from 'react';
import { useMenuContext } from './MenuContext';
import type { MenuTriggerProps } from './Menu.types';

export const MenuTrigger = ({ children, className }: MenuTriggerProps) => {
  const { setIsOpen, isOpen, triggerRef } = useMenuContext();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  // Clone the child element and add our props
  if (isValidElement(children)) {
    return cloneElement(children as React.ReactElement<{
      onClick?: () => void;
      onKeyDown?: (e: React.KeyboardEvent) => void;
      'aria-haspopup'?: boolean;
      'aria-expanded'?: boolean;
      ref?: React.Ref<HTMLElement>;
      className?: string;
    }>, {
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      'aria-haspopup': true,
      'aria-expanded': isOpen,
      ref: triggerRef,
      className: className || (children as React.ReactElement<{ className?: string }>).props.className,
    });
  }

  return <>{children}</>;
};

MenuTrigger.displayName = 'Menu.Trigger';

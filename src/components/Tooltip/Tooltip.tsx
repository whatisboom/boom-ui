import { useState, useRef, cloneElement, useEffect } from 'react';
import { Popover } from '../primitives/Popover';
import type { TooltipProps } from './Tooltip.types';
import styles from './Tooltip.module.css';
import { cn } from '@/utils/classnames';

export const Tooltip = ({
  content,
  children,
  placement = 'top',
  delay = 0,
  offset = 8,
  className,
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showTooltip = () => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(true);
      }, delay);
    } else {
      setIsOpen(true);
    }
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Clone the child element and add event handlers
  // Type the original props to safely access event handlers
  type ChildProps = {
    onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLElement>) => void;
  };
  const originalProps = children.props as ChildProps;

  // In React 19, we need to use a type assertion for the entire cloneElement call
  // to work around stricter ref typing in cloneElement.
  // Passing refs to cloneElement is the correct React pattern for forwarding refs to dynamic children.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/refs
  const trigger = cloneElement(children as any, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      showTooltip();
      // Call original onMouseEnter if it exists
      originalProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      hideTooltip();
      // Call original onMouseLeave if it exists
      originalProps.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      showTooltip();
      // Call original onFocus if it exists
      originalProps.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      hideTooltip();
      // Call original onBlur if it exists
      originalProps.onBlur?.(e);
    },
  });

  return (
    <>
      {trigger}
      <Popover
        isOpen={isOpen}
        onClose={hideTooltip}
        anchorEl={triggerRef}
        placement={placement}
        offset={offset}
      >
        <div className={cn(styles.tooltip, className)}>{content}</div>
      </Popover>
    </>
  );
};

Tooltip.displayName = 'Tooltip';

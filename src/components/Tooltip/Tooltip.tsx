import { useState, useRef, cloneElement, useEffect } from 'react';
import { Popover } from '../primitives/Popover';
import { TooltipProps } from './Tooltip.types';
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

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
  // eslint-disable-next-line react-hooks/refs -- Passing refs to cloneElement is the correct React pattern for forwarding refs to dynamic children
  const trigger = cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      showTooltip();
      // Call original onMouseEnter if it exists
      if (children.props.onMouseEnter) {
        children.props.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      hideTooltip();
      // Call original onMouseLeave if it exists
      if (children.props.onMouseLeave) {
        children.props.onMouseLeave(e);
      }
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      showTooltip();
      // Call original onFocus if it exists
      if (children.props.onFocus) {
        children.props.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      hideTooltip();
      // Call original onBlur if it exists
      if (children.props.onBlur) {
        children.props.onBlur(e);
      }
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

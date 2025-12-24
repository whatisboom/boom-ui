import { useState, useEffect, RefObject } from 'react';

interface Position {
  top: number;
  left: number;
}

export function usePopoverPosition(
  popoverRef: RefObject<HTMLElement>,
  anchorRef: RefObject<HTMLElement>,
  placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
  offset: number = 8
): Position {
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (!popoverRef.current || !anchorRef.current) return;

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'bottom':
          top = anchorRect.bottom + offset;
          left = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2;
          break;
        case 'top':
          top = anchorRect.top - popoverRect.height - offset;
          left = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2;
          break;
        case 'left':
          top = anchorRect.top + anchorRect.height / 2 - popoverRect.height / 2;
          left = anchorRect.left - popoverRect.width - offset;
          break;
        case 'right':
          top = anchorRect.top + anchorRect.height / 2 - popoverRect.height / 2;
          left = anchorRect.right + offset;
          break;
      }

      setPosition({ top, left });
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
    // Refs are intentionally excluded from deps to avoid re-renders
    // The effect reads .current values which are always up-to-date in the closure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement, offset]);

  return position;
}

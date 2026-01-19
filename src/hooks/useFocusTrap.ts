import type { RefObject } from 'react';
import { useEffect } from 'react';
import { createFocusTrap } from '@/utils/focus-management';

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled || !ref.current) {return;}

    const cleanup = createFocusTrap(ref.current);
    return cleanup;
  }, [ref, enabled]);
}

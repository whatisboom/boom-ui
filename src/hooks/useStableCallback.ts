import { useRef, useCallback, useLayoutEffect } from 'react';

/**
 * Creates a stable callback that always calls the latest version of the provided function.
 *
 * This hook solves the problem of callback identity changing on every render, which can
 * cause unnecessary re-renders when callbacks are used in dependency arrays.
 *
 * @param callback - The callback function to stabilize
 * @returns A stable callback reference that calls the latest version of the provided function
 *
 * @example
 * ```tsx
 * function MyComponent({ onSave }: { onSave: () => void }) {
 *   const stableSave = useStableCallback(onSave);
 *
 *   useEffect(() => {
 *     // stableSave reference never changes, but always calls latest onSave
 *     const timer = setTimeout(stableSave, 1000);
 *     return () => clearTimeout(timer);
 *   }, [stableSave]); // Won't re-run when onSave changes
 * }
 * ```
 */
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  const callbackRef = useRef<T>(callback);

  // Update ref to latest callback on every render (before paint)
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // Return stable callback that invokes latest ref
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    ((...args) => callbackRef.current(...args)) as T,
    []
  );
}

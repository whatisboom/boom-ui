import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStableCallback } from './useStableCallback';

describe('useStableCallback', () => {
  it('should maintain reference stability across re-renders', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ cb }) => useStableCallback(cb),
      { initialProps: { cb: callback } }
    );

    const firstRef = result.current;

    // Re-render with new callback
    const newCallback = vi.fn();
    rerender({ cb: newCallback });

    // Reference should be the same
    expect(result.current).toBe(firstRef);
  });

  it('should call the latest callback version', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { result, rerender } = renderHook(
      ({ cb }) => useStableCallback(cb),
      { initialProps: { cb: callback1 } }
    );

    // Call stable callback
    result.current('arg1', 'arg2');
    expect(callback1).toHaveBeenCalledWith('arg1', 'arg2');
    expect(callback2).not.toHaveBeenCalled();

    // Update to new callback
    rerender({ cb: callback2 });

    // Call stable callback again
    result.current('arg3', 'arg4');
    expect(callback1).toHaveBeenCalledTimes(1); // Not called again
    expect(callback2).toHaveBeenCalledWith('arg3', 'arg4');
  });

  it('should handle callbacks with return values', () => {
    const callback = vi.fn(() => 'result');
    const { result } = renderHook(() => useStableCallback(callback));

    const returnValue = result.current();
    expect(returnValue).toBe('result');
  });

  it('should handle undefined callbacks gracefully', () => {
    const { result } = renderHook(() =>
      useStableCallback(() => undefined)
    );

    expect(() => result.current()).not.toThrow();
  });
});

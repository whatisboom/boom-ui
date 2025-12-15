import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { fireEvent } from '@testing-library/react';

describe('useKeyboardShortcut', () => {
  it('should call handler on Cmd+K (Mac)', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('k', handler, { meta: true }));

    fireEvent.keyDown(document, { key: 'k', metaKey: true });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should call handler on Ctrl+K (Windows)', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('k', handler, { ctrl: true }));

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler without modifier', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('k', handler, { meta: true }));

    fireEvent.keyDown(document, { key: 'k' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should cleanup on unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useKeyboardShortcut('k', handler));

    unmount();

    fireEvent.keyDown(document, { key: 'k' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should support Escape key', () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcut('Escape', handler));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handler).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollLock } from './useScrollLock';

describe('useScrollLock', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('should lock scroll when enabled', () => {
    renderHook(() => useScrollLock(true));

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should not lock scroll when disabled', () => {
    renderHook(() => useScrollLock(false));

    expect(document.body.style.overflow).toBe('');
  });

  it('should restore scroll on unmount', () => {
    const { unmount } = renderHook(() => useScrollLock(true));

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('should add padding to prevent layout shift', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 1009, // 15px scrollbar
    });

    renderHook(() => useScrollLock(true));

    expect(document.body.style.paddingRight).toBe('15px');
  });
});

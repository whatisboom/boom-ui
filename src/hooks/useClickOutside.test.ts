import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';
import { fireEvent } from '@testing-library/react';

describe('useClickOutside', () => {
  it('should call handler when clicking outside', () => {
    const handler = vi.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    renderHook(() => useClickOutside({ current: element }, handler));

    fireEvent.mouseDown(document.body);

    expect(handler).toHaveBeenCalledTimes(1);
    document.body.removeChild(element);
  });

  it('should not call handler when clicking inside', () => {
    const handler = vi.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    renderHook(() => useClickOutside({ current: element }, handler));

    fireEvent.mouseDown(element);

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(element);
  });

  it('should cleanup on unmount', () => {
    const handler = vi.fn();
    const element = document.createElement('div');
    document.body.appendChild(element);

    const { unmount } = renderHook(() => useClickOutside({ current: element }, handler));
    unmount();

    fireEvent.mouseDown(document.body);

    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(element);
  });
});

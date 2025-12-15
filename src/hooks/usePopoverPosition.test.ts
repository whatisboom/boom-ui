import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePopoverPosition } from './usePopoverPosition';
import { useRef } from 'react';

describe('usePopoverPosition', () => {
  let anchor: HTMLDivElement;
  let popover: HTMLDivElement;

  beforeEach(() => {
    anchor = document.createElement('div');
    Object.defineProperty(anchor, 'getBoundingClientRect', {
      value: () => ({ top: 100, left: 100, bottom: 120, right: 200, width: 100, height: 20 }),
    });

    popover = document.createElement('div');
    Object.defineProperty(popover, 'offsetWidth', { value: 150 });
    Object.defineProperty(popover, 'offsetHeight', { value: 100 });
    Object.defineProperty(popover, 'getBoundingClientRect', {
      value: () => ({ top: 0, left: 0, bottom: 100, right: 150, width: 150, height: 100 }),
    });
  });

  it('should position popover below anchor', () => {
    const { result } = renderHook(() =>
      usePopoverPosition({ current: popover }, { current: anchor }, 'bottom', 8)
    );

    expect(result.current).toEqual({
      top: 128, // 100 + 20 + 8
      left: 25, // 100 + 50 - 75 (centered)
    });
  });

  it('should position popover above anchor', () => {
    const { result } = renderHook(() =>
      usePopoverPosition({ current: popover }, { current: anchor }, 'top', 8)
    );

    expect(result.current).toEqual({
      top: -8, // 100 - 100 - 8
      left: 25,
    });
  });
});

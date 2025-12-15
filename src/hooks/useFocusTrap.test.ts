import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';
import { useRef } from 'react';

describe('useFocusTrap', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="first">First</button>
      <button id="middle">Middle</button>
      <button id="last">Last</button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should trap focus within container', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, true));

    const last = container.querySelector('#last') as HTMLButtonElement;
    last.focus();

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    container.dispatchEvent(tabEvent);

    const first = container.querySelector('#first') as HTMLButtonElement;
    expect(document.activeElement).toBe(first);
  });

  it('should not trap when disabled', () => {
    const ref = { current: container };
    renderHook(() => useFocusTrap(ref, false));

    const last = container.querySelector('#last') as HTMLButtonElement;
    last.focus();

    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    container.dispatchEvent(tabEvent);

    expect(document.activeElement).toBe(last);
  });
});

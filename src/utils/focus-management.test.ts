import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getFocusableElements, createFocusTrap } from './focus-management';

describe('focus-management', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('getFocusableElements', () => {
    it('should return focusable elements', () => {
      container.innerHTML = `
        <button>Button</button>
        <a href="#">Link</a>
        <input type="text" />
        <div>Not focusable</div>
      `;

      const elements = getFocusableElements(container);
      expect(elements).toHaveLength(3);
    });

    it('should exclude disabled elements', () => {
      container.innerHTML = `
        <button>Enabled</button>
        <button disabled>Disabled</button>
      `;

      const elements = getFocusableElements(container);
      expect(elements).toHaveLength(1);
    });
  });

  describe('createFocusTrap', () => {
    it('should trap focus within container', () => {
      container.innerHTML = `
        <button id="first">First</button>
        <button id="last">Last</button>
      `;

      const cleanup = createFocusTrap(container);
      const first = container.querySelector('#first') as HTMLButtonElement;
      const last = container.querySelector('#last') as HTMLButtonElement;

      last.focus();
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      container.dispatchEvent(tabEvent);

      expect(document.activeElement).toBe(first);
      cleanup();
    });
  });
});

# Header and Navigation Components Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build standalone Header, Navigation, SearchCommand, NotificationMenu, and UserMenu components with shared primitives for overlays and popover interactions.

**Architecture:** Create reusable primitives (Portal, Overlay, Modal, Drawer, Popover) and custom hooks for common patterns (keyboard shortcuts, focus management, click-outside detection). Build composable components that are fully controlled, with callbacks for data interactions. All components support light/dark themes and are fully accessible.

**Tech Stack:** React, TypeScript, CSS Modules, Framer Motion, Vitest, Testing Library, vitest-axe

---

## Task 1: Shared Utilities and Types

**Files:**
- Create: `src/components/primitives/types.ts`
- Create: `src/utils/focus-management.ts`
- Create: `src/utils/focus-management.test.ts`

**Step 1: Write failing test for focus management utilities**

Create `src/utils/focus-management.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

```bash
npm test focus-management.test.ts
```

Expected: FAIL - module not found

**Step 3: Create focus management utilities**

Create `src/utils/focus-management.ts`:

```typescript
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export function createFocusTrap(container: HTMLElement): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test focus-management.test.ts
```

Expected: PASS

**Step 5: Create shared primitive types**

Create `src/components/primitives/types.ts`:

```typescript
export interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  lockScroll?: boolean;
}

export interface ModalProps extends OverlayProps {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export interface DrawerProps extends OverlayProps {
  side?: 'left' | 'right';
  width?: string;
}

export interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorEl: HTMLElement | null;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
}
```

**Step 6: Commit**

```bash
git add src/utils/focus-management.ts src/utils/focus-management.test.ts src/components/primitives/types.ts
git commit -m "feat: add focus management utilities and primitive types"
```

---

## Task 2: Custom Hooks - useClickOutside

**Files:**
- Create: `src/hooks/useClickOutside.ts`
- Create: `src/hooks/useClickOutside.test.ts`

**Step 1: Write failing test**

Create `src/hooks/useClickOutside.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

```bash
npm test useClickOutside.test.ts
```

Expected: FAIL - module not found

**Step 3: Implement useClickOutside hook**

Create `src/hooks/useClickOutside.ts`:

```typescript
import { useEffect, RefObject } from 'react';

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (!ref.current || ref.current.contains(target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test useClickOutside.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useClickOutside.ts src/hooks/useClickOutside.test.ts
git commit -m "feat: add useClickOutside hook"
```

---

## Task 3: Custom Hooks - useFocusTrap

**Files:**
- Create: `src/hooks/useFocusTrap.ts`
- Create: `src/hooks/useFocusTrap.test.ts`

**Step 1: Write failing test**

Create `src/hooks/useFocusTrap.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
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
```

**Step 2: Run test to verify it fails**

```bash
npm test useFocusTrap.test.ts
```

Expected: FAIL - module not found

**Step 3: Implement useFocusTrap hook**

Create `src/hooks/useFocusTrap.ts`:

```typescript
import { useEffect, RefObject } from 'react';
import { createFocusTrap } from '@/utils/focus-management';

export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled || !ref.current) return;

    const cleanup = createFocusTrap(ref.current);
    return cleanup;
  }, [ref, enabled]);
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test useFocusTrap.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useFocusTrap.ts src/hooks/useFocusTrap.test.ts
git commit -m "feat: add useFocusTrap hook"
```

---

## Task 4: Custom Hooks - useScrollLock

**Files:**
- Create: `src/hooks/useScrollLock.ts`
- Create: `src/hooks/useScrollLock.test.ts`

**Step 1: Write failing test**

Create `src/hooks/useScrollLock.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

```bash
npm test useScrollLock.test.ts
```

Expected: FAIL - module not found

**Step 3: Implement useScrollLock hook**

Create `src/hooks/useScrollLock.ts`:

```typescript
import { useEffect } from 'react';

export function useScrollLock(enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [enabled]);
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test useScrollLock.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useScrollLock.ts src/hooks/useScrollLock.test.ts
git commit -m "feat: add useScrollLock hook"
```

---

## Task 5: Custom Hooks - useKeyboardShortcut

**Files:**
- Create: `src/hooks/useKeyboardShortcut.ts`
- Create: `src/hooks/useKeyboardShortcut.test.ts`

**Step 1: Write failing test**

Create `src/hooks/useKeyboardShortcut.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

```bash
npm test useKeyboardShortcut.test.ts
```

Expected: FAIL - module not found

**Step 3: Implement useKeyboardShortcut hook**

Create `src/hooks/useKeyboardShortcut.ts`:

```typescript
import { useEffect } from 'react';

export interface KeyboardShortcutOptions {
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  enabled?: boolean;
}

export function useKeyboardShortcut(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {}
): void {
  const { meta = false, ctrl = false, shift = false, alt = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      const matchesKey = event.key.toLowerCase() === key.toLowerCase();
      const matchesMeta = meta ? event.metaKey : !event.metaKey;
      const matchesCtrl = ctrl ? event.ctrlKey : !event.ctrlKey;
      const matchesShift = shift ? event.shiftKey : !event.shiftKey;
      const matchesAlt = alt ? event.altKey : !event.altKey;

      if (matchesKey && matchesMeta && matchesCtrl && matchesShift && matchesAlt) {
        event.preventDefault();
        handler(event);
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [key, handler, meta, ctrl, shift, alt, enabled]);
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test useKeyboardShortcut.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/hooks/useKeyboardShortcut.ts src/hooks/useKeyboardShortcut.test.ts
git commit -m "feat: add useKeyboardShortcut hook"
```

---

## Task 6: Portal Primitive

**Files:**
- Create: `src/components/primitives/Portal/Portal.tsx`
- Create: `src/components/primitives/Portal/Portal.test.tsx`
- Create: `src/components/primitives/Portal/index.ts`

**Step 1: Write failing test**

Create `src/components/primitives/Portal/Portal.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Portal } from './Portal';

describe('Portal', () => {
  it('should render children in document.body', () => {
    const { container } = render(
      <Portal>
        <div data-testid="portal-content">Portal Content</div>
      </Portal>
    );

    expect(container.firstChild).toBeNull();
    expect(document.body.querySelector('[data-testid="portal-content"]')).toBeInTheDocument();
  });

  it('should render in custom container', () => {
    const customContainer = document.createElement('div');
    customContainer.id = 'custom-portal';
    document.body.appendChild(customContainer);

    render(
      <Portal container={customContainer}>
        <div data-testid="custom-portal-content">Custom Portal</div>
      </Portal>
    );

    expect(customContainer.querySelector('[data-testid="custom-portal-content"]')).toBeInTheDocument();

    document.body.removeChild(customContainer);
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(
      <Portal>
        <div data-testid="cleanup-test">Cleanup Test</div>
      </Portal>
    );

    expect(document.body.querySelector('[data-testid="cleanup-test"]')).toBeInTheDocument();

    unmount();

    expect(document.body.querySelector('[data-testid="cleanup-test"]')).not.toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test Portal.test.tsx
```

Expected: FAIL - module not found

**Step 3: Implement Portal component**

Create `src/components/primitives/Portal/Portal.tsx`:

```typescript
import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
  container?: Element;
}

export function Portal({ children, container }: PortalProps) {
  const [mountNode, setMountNode] = useState<Element | null>(null);

  useEffect(() => {
    setMountNode(container || document.body);
  }, [container]);

  if (!mountNode) return null;

  return createPortal(children, mountNode);
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test Portal.test.tsx
```

Expected: PASS

**Step 5: Create barrel export**

Create `src/components/primitives/Portal/index.ts`:

```typescript
export { Portal } from './Portal';
export type { PortalProps } from './Portal';
```

**Step 6: Commit**

```bash
git add src/components/primitives/Portal/
git commit -m "feat: add Portal primitive component"
```

---

## Task 7: Overlay Primitive

**Files:**
- Create: `src/components/primitives/Overlay/Overlay.tsx`
- Create: `src/components/primitives/Overlay/Overlay.module.css`
- Create: `src/components/primitives/Overlay/Overlay.test.tsx`
- Create: `src/components/primitives/Overlay/index.ts`

**Step 1: Write failing test**

Create `src/components/primitives/Overlay/Overlay.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Overlay } from './Overlay';

describe('Overlay', () => {
  it('should render children when open', () => {
    render(
      <Overlay isOpen={true} onClose={vi.fn()}>
        <div>Overlay Content</div>
      </Overlay>
    );

    expect(screen.getByText('Overlay Content')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <Overlay isOpen={false} onClose={vi.fn()}>
        <div>Overlay Content</div>
      </Overlay>
    );

    expect(screen.queryByText('Overlay Content')).not.toBeInTheDocument();
  });

  it('should call onClose on escape key', () => {
    const onClose = vi.fn();
    render(
      <Overlay isOpen={true} onClose={onClose} closeOnEscape={true}>
        <div>Content</div>
      </Overlay>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose on backdrop click', () => {
    const onClose = vi.fn();
    render(
      <Overlay isOpen={true} onClose={onClose} closeOnClickOutside={true}>
        <div>Content</div>
      </Overlay>
    );

    const backdrop = screen.getByTestId('overlay-backdrop');
    fireEvent.mouseDown(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not close on content click', () => {
    const onClose = vi.fn();
    render(
      <Overlay isOpen={true} onClose={onClose} closeOnClickOutside={true}>
        <div data-testid="content">Content</div>
      </Overlay>
    );

    fireEvent.mouseDown(screen.getByTestId('content'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should lock scroll when enabled', () => {
    render(
      <Overlay isOpen={true} onClose={vi.fn()} lockScroll={true}>
        <div>Content</div>
      </Overlay>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test Overlay.test.tsx
```

Expected: FAIL - module not found

**Step 3: Create CSS module**

Create `src/components/primitives/Overlay/Overlay.module.css`:

```css
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--boom-z-overlay, 2000);
  display: flex;
  align-items: center;
  justify-content: center;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.content {
  position: relative;
  z-index: 1;
}
```

**Step 4: Implement Overlay component**

Create `src/components/primitives/Overlay/Overlay.tsx`:

```typescript
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '../Portal';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { OverlayProps } from '../types';
import styles from './Overlay.module.css';

export function Overlay({
  isOpen,
  onClose,
  children,
  closeOnClickOutside = true,
  closeOnEscape = true,
  lockScroll = true,
}: OverlayProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen && lockScroll);
  useFocusTrap(contentRef, isOpen);
  useKeyboardShortcut('Escape', onClose, { enabled: isOpen && closeOnEscape });

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const firstFocusable = contentRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnClickOutside && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={styles.backdrop}
              onClick={handleBackdropClick}
              data-testid="overlay-backdrop"
            />
            <div ref={contentRef} className={styles.content}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
```

**Step 5: Run tests to verify they pass**

```bash
npm test Overlay.test.tsx
```

Expected: PASS

**Step 6: Create barrel export**

Create `src/components/primitives/Overlay/index.ts`:

```typescript
export { Overlay } from './Overlay';
```

**Step 7: Commit**

```bash
git add src/components/primitives/Overlay/
git commit -m "feat: add Overlay primitive component"
```

---

## Task 8: Modal Primitive

**Files:**
- Create: `src/components/primitives/Modal/Modal.tsx`
- Create: `src/components/primitives/Modal/Modal.module.css`
- Create: `src/components/primitives/Modal/Modal.test.tsx`
- Create: `src/components/primitives/Modal/index.ts`

**Step 1: Write failing test**

Create `src/components/primitives/Modal/Modal.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Modal } from './Modal';

describe('Modal', () => {
  it('should render modal with title', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Modal
        isOpen={true}
        onClose={vi.fn()}
        title="Test Modal"
        description="Test Description"
      >
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('should render different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} size="sm">
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('sm');

    rerender(
      <Modal isOpen={true} onClose={vi.fn()} size="lg">
        <div>Content</div>
      </Modal>
    );

    expect(dialog).toHaveClass('lg');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Accessible Modal">
        <div>Content</div>
      </Modal>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test Modal.test.tsx
```

Expected: FAIL - module not found

**Step 3: Create CSS module**

Create `src/components/primitives/Modal/Modal.module.css`:

```css
.modal {
  background-color: var(--boom-theme-bg-primary);
  border-radius: 8px;
  box-shadow: var(--boom-shadow-lg);
  max-height: 90vh;
  overflow: auto;
  position: relative;
}

.modal.sm {
  width: 90%;
  max-width: 400px;
}

.modal.md {
  width: 90%;
  max-width: 600px;
}

.modal.lg {
  width: 90%;
  max-width: 800px;
}

.modal.full {
  width: 95vw;
  height: 95vh;
  max-height: 95vh;
}

.header {
  padding: 24px;
  border-bottom: 1px solid var(--boom-theme-border-color);
}

.title {
  margin: 0;
  font-size: var(--boom-font-size-lg);
  font-weight: var(--boom-font-weight-semibold);
  color: var(--boom-theme-text-primary);
}

.description {
  margin: 8px 0 0;
  font-size: var(--boom-font-size-sm);
  color: var(--boom-theme-text-secondary);
}

.body {
  padding: 24px;
}

.closeButton {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--boom-theme-text-secondary);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.closeButton:hover {
  background-color: var(--boom-theme-bg-secondary);
  color: var(--boom-theme-text-primary);
}

.closeButton:focus-visible {
  outline: 2px solid var(--boom-theme-focus-ring);
  outline-offset: 2px;
}
```

**Step 4: Implement Modal component**

Create `src/components/primitives/Modal/Modal.tsx`:

```typescript
import { useId } from 'react';
import { motion } from 'framer-motion';
import { Overlay } from '../Overlay';
import { ModalProps } from '../types';
import { cn } from '@/utils/classnames';
import styles from './Modal.module.css';

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  closeOnClickOutside = true,
  closeOnEscape = true,
  lockScroll = true,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      lockScroll={lockScroll}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(styles.modal, styles[size])}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>

        {(title || description) && (
          <div className={styles.header}>
            {title && (
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
          </div>
        )}

        <div className={styles.body}>{children}</div>
      </motion.div>
    </Overlay>
  );
}
```

**Step 5: Run tests to verify they pass**

```bash
npm test Modal.test.tsx
```

Expected: PASS

**Step 6: Create barrel export**

Create `src/components/primitives/Modal/index.ts`:

```typescript
export { Modal } from './Modal';
```

**Step 7: Commit**

```bash
git add src/components/primitives/Modal/
git commit -m "feat: add Modal primitive component"
```

---

## Task 9: Drawer Primitive

**Files:**
- Create: `src/components/primitives/Drawer/Drawer.tsx`
- Create: `src/components/primitives/Drawer/Drawer.module.css`
- Create: `src/components/primitives/Drawer/Drawer.test.tsx`
- Create: `src/components/primitives/Drawer/index.ts`

**Step 1: Write failing test**

Create `src/components/primitives/Drawer/Drawer.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('should render drawer from left', () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()} side="left">
        <div>Drawer Content</div>
      </Drawer>
    );

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveClass('left');
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('should render drawer from right', () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()} side="right">
        <div>Drawer Content</div>
      </Drawer>
    );

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveClass('right');
  });

  it('should apply custom width', () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()} width="400px">
        <div>Content</div>
      </Drawer>
    );

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveStyle({ width: '400px' });
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Drawer isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </Drawer>
    );

    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test Drawer.test.tsx
```

Expected: FAIL - module not found

**Step 3: Create CSS module**

Create `src/components/primitives/Drawer/Drawer.module.css`:

```css
.drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: var(--boom-theme-bg-primary);
  box-shadow: var(--boom-shadow-xl);
  overflow-y: auto;
}

.drawer.left {
  left: 0;
}

.drawer.right {
  right: 0;
}
```

**Step 4: Implement Drawer component**

Create `src/components/primitives/Drawer/Drawer.tsx`:

```typescript
import { motion } from 'framer-motion';
import { Overlay } from '../Overlay';
import { DrawerProps } from '../types';
import { cn } from '@/utils/classnames';
import styles from './Drawer.module.css';

const DEFAULT_WIDTH = '280px';

export function Drawer({
  isOpen,
  onClose,
  children,
  side = 'left',
  width = DEFAULT_WIDTH,
  closeOnClickOutside = true,
  closeOnEscape = true,
  lockScroll = true,
}: DrawerProps) {
  const slideVariants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
  };

  return (
    <Overlay
      isOpen={isOpen}
      onClose={onClose}
      closeOnClickOutside={closeOnClickOutside}
      closeOnEscape={closeOnEscape}
      lockScroll={lockScroll}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        data-testid="drawer"
        className={cn(styles.drawer, styles[side])}
        style={{ width }}
        initial={slideVariants[side].initial}
        animate={slideVariants[side].animate}
        exit={slideVariants[side].exit}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </Overlay>
  );
}
```

**Step 5: Run tests to verify they pass**

```bash
npm test Drawer.test.tsx
```

Expected: PASS

**Step 6: Create barrel export**

Create `src/components/primitives/Drawer/index.ts`:

```typescript
export { Drawer } from './Drawer';
```

**Step 7: Commit**

```bash
git add src/components/primitives/Drawer/
git commit -m "feat: add Drawer primitive component"
```

---

## Task 10: Popover Primitive

**Files:**
- Create: `src/components/primitives/Popover/Popover.tsx`
- Create: `src/components/primitives/Popover/Popover.module.css`
- Create: `src/components/primitives/Popover/Popover.test.tsx`
- Create: `src/components/primitives/Popover/index.ts`
- Create: `src/hooks/usePopoverPosition.ts`
- Create: `src/hooks/usePopoverPosition.test.ts`

**Step 1: Write failing test for usePopoverPosition hook**

Create `src/hooks/usePopoverPosition.test.ts`:

```typescript
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
```

**Step 2: Run test to verify it fails**

```bash
npm test usePopoverPosition.test.ts
```

Expected: FAIL - module not found

**Step 3: Implement usePopoverPosition hook**

Create `src/hooks/usePopoverPosition.ts`:

```typescript
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
  }, [popoverRef, anchorRef, placement, offset]);

  return position;
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test usePopoverPosition.test.ts
```

Expected: PASS

**Step 5: Write failing test for Popover component**

Create `src/components/primitives/Popover/Popover.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Popover } from './Popover';

describe('Popover', () => {
  it('should render popover when open', () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);

    render(
      <Popover isOpen={true} onClose={vi.fn()} anchorEl={anchor}>
        <div>Popover Content</div>
      </Popover>
    );

    expect(screen.getByText('Popover Content')).toBeInTheDocument();

    document.body.removeChild(anchor);
  });

  it('should not render when closed', () => {
    const anchor = document.createElement('button');

    render(
      <Popover isOpen={false} onClose={vi.fn()} anchorEl={anchor}>
        <div>Popover Content</div>
      </Popover>
    );

    expect(screen.queryByText('Popover Content')).not.toBeInTheDocument();
  });

  it('should close on escape key', () => {
    const onClose = vi.fn();
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);

    render(
      <Popover isOpen={true} onClose={onClose} anchorEl={anchor}>
        <div>Content</div>
      </Popover>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);

    document.body.removeChild(anchor);
  });
});
```

**Step 6: Run test to verify it fails**

```bash
npm test Popover.test.tsx
```

Expected: FAIL - module not found

**Step 7: Create CSS module**

Create `src/components/primitives/Popover/Popover.module.css`:

```css
.popover {
  position: fixed;
  z-index: var(--boom-z-popover, 3000);
  background-color: var(--boom-theme-bg-primary);
  border: 1px solid var(--boom-theme-border-color);
  border-radius: 8px;
  box-shadow: var(--boom-shadow-lg);
  padding: 8px;
}
```

**Step 8: Implement Popover component**

Create `src/components/primitives/Popover/Popover.tsx`:

```typescript
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portal } from '../Portal';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { usePopoverPosition } from '@/hooks/usePopoverPosition';
import { PopoverProps } from '../types';
import styles from './Popover.module.css';

export function Popover({
  isOpen,
  onClose,
  children,
  anchorEl,
  placement = 'bottom',
  offset = 8,
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef(anchorEl);

  useClickOutside(popoverRef, onClose, isOpen);
  useKeyboardShortcut('Escape', onClose, { enabled: isOpen });

  const position = usePopoverPosition(popoverRef, anchorRef, placement, offset);

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            className={styles.popover}
            style={{
              top: position.top,
              left: position.left,
            }}
            initial={{ opacity: 0, y: placement === 'bottom' ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === 'bottom' ? -10 : 10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
```

**Step 9: Run tests to verify they pass**

```bash
npm test Popover.test.tsx
```

Expected: PASS

**Step 10: Create barrel export**

Create `src/components/primitives/Popover/index.ts`:

```typescript
export { Popover } from './Popover';
```

**Step 11: Commit**

```bash
git add src/hooks/usePopoverPosition.ts src/hooks/usePopoverPosition.test.ts src/components/primitives/Popover/
git commit -m "feat: add Popover primitive component with positioning"
```

---

## Task 11: Header Component

**Files:**
- Create: `src/components/Header/Header.tsx`
- Create: `src/components/Header/Header.types.ts`
- Create: `src/components/Header/Header.module.css`
- Create: `src/components/Header/Header.test.tsx`
- Create: `src/components/Header/Header.stories.tsx`
- Create: `src/components/Header/index.ts`

**Step 1: Write types**

Create `src/components/Header/Header.types.ts`:

```typescript
import { ReactNode } from 'react';

export interface HeaderProps {
  logo?: ReactNode;
  children?: ReactNode;
  sticky?: boolean;
  className?: string;
}
```

**Step 2: Write failing test**

Create `src/components/Header/Header.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Header } from './Header';

describe('Header', () => {
  it('should render header with logo', () => {
    render(
      <Header logo={<div>Logo</div>}>
        <div>Content</div>
      </Header>
    );

    expect(screen.getByText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should have semantic header element', () => {
    render(<Header>Content</Header>);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should apply sticky class when enabled', () => {
    render(<Header sticky>Content</Header>);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Header logo={<img src="/logo.png" alt="Company Logo" />}>
        <nav>Navigation</nav>
      </Header>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Step 3: Run test to verify it fails**

```bash
npm test Header.test.tsx
```

Expected: FAIL - module not found

**Step 4: Create CSS module**

Create `src/components/Header/Header.module.css`:

```css
.header {
  display: flex;
  align-items: center;
  gap: 24px;
  height: var(--boom-header-height, 64px);
  padding: 0 24px;
  background-color: var(--boom-theme-bg-primary);
  border-bottom: 1px solid var(--boom-theme-border-color);
  z-index: var(--boom-z-header, 1000);
}

.header.sticky {
  position: sticky;
  top: 0;
}

.logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
    gap: 16px;
  }
}
```

**Step 5: Implement Header component**

Create `src/components/Header/Header.tsx`:

```typescript
import { HeaderProps } from './Header.types';
import { cn } from '@/utils/classnames';
import styles from './Header.module.css';

export function Header({ logo, children, sticky = false, className }: HeaderProps) {
  return (
    <header className={cn(styles.header, sticky && styles.sticky, className)}>
      {logo && <div className={styles.logo}>{logo}</div>}
      <div className={styles.content}>{children}</div>
    </header>
  );
}
```

**Step 6: Run tests to verify they pass**

```bash
npm test Header.test.tsx
```

Expected: PASS

**Step 7: Create Storybook story**

Create `src/components/Header/Header.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';
import { Button } from '../Button';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo: <div style={{ fontWeight: 'bold', fontSize: '20px' }}>MyApp</div>,
    children: (
      <>
        <Button variant="ghost">Features</Button>
        <Button variant="ghost">Pricing</Button>
        <Button variant="primary">Sign In</Button>
      </>
    ),
  },
};

export const Sticky: Story = {
  args: {
    ...Default.args,
    sticky: true,
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div style={{ height: '200vh', padding: '20px' }}>
          Scroll down to see sticky header
        </div>
      </div>
    ),
  ],
};

export const WithLogo: Story = {
  args: {
    logo: (
      <img
        src="https://via.placeholder.com/120x40/4F46E5/ffffff?text=Logo"
        alt="Logo"
        style={{ height: '40px' }}
      />
    ),
    children: (
      <>
        <Button variant="ghost">Dashboard</Button>
        <Button variant="ghost">Settings</Button>
      </>
    ),
  },
};
```

**Step 8: Create barrel export**

Create `src/components/Header/index.ts`:

```typescript
export { Header } from './Header';
export type { HeaderProps } from './Header.types';
```

**Step 9: Run tests and Storybook**

```bash
npm test Header
npm run storybook
```

Expected: Tests PASS, Storybook renders stories

**Step 10: Commit**

```bash
git add src/components/Header/
git commit -m "feat: add Header component"
```

---

## Task 12: Navigation Component

**Files:**
- Create: `src/components/Navigation/Navigation.tsx`
- Create: `src/components/Navigation/Navigation.types.ts`
- Create: `src/components/Navigation/Navigation.module.css`
- Create: `src/components/Navigation/Navigation.test.tsx`
- Create: `src/components/Navigation/Navigation.stories.tsx`
- Create: `src/components/Navigation/index.ts`

**Step 1: Write types**

Create `src/components/Navigation/Navigation.types.ts`:

```typescript
import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  badge?: string | number;
  isActive?: boolean;
  dropdown?: NavItem[];
}

export interface NavigationProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}
```

**Step 2: Write failing test**

Create `src/components/Navigation/Navigation.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from './Navigation';
import { NavItem } from './Navigation.types';

describe('Navigation', () => {
  const items: NavItem[] = [
    { label: 'Home', href: '/', isActive: true },
    { label: 'About', href: '/about' },
    { label: 'Contact', onClick: vi.fn() },
  ];

  it('should render navigation items', () => {
    render(<Navigation items={items} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('should have semantic nav element', () => {
    render(<Navigation items={items} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should mark active item', () => {
    render(<Navigation items={items} />);

    const homeLink = screen.getByText('Home');
    expect(homeLink).toHaveClass('active');
  });

  it('should call onClick handler', () => {
    const onClick = vi.fn();
    const itemsWithHandler: NavItem[] = [
      { label: 'Click Me', onClick },
    ];

    render(<Navigation items={itemsWithHandler} />);

    fireEvent.click(screen.getByText('Click Me'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render with icon and badge', () => {
    const itemsWithExtras: NavItem[] = [
      {
        label: 'Messages',
        href: '/messages',
        icon: <span data-testid="icon">📧</span>,
        badge: 5,
      },
    ];

    render(<Navigation items={itemsWithExtras} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render dropdown items', () => {
    const itemsWithDropdown: NavItem[] = [
      {
        label: 'Products',
        dropdown: [
          { label: 'Product A', href: '/products/a' },
          { label: 'Product B', href: '/products/b' },
        ],
      },
    ];

    render(<Navigation items={itemsWithDropdown} />);

    const productsButton = screen.getByText('Products');
    fireEvent.click(productsButton);

    expect(screen.getByText('Product A')).toBeInTheDocument();
    expect(screen.getByText('Product B')).toBeInTheDocument();
  });
});
```

**Step 3: Run test to verify it fails**

```bash
npm test Navigation.test.tsx
```

Expected: FAIL - module not found

**Step 4: Create CSS module**

Create `src/components/Navigation/Navigation.module.css`:

```css
.nav {
  display: flex;
}

.nav.horizontal {
  flex-direction: row;
  gap: 8px;
}

.nav.vertical {
  flex-direction: column;
  gap: 4px;
}

.navList {
  display: flex;
  gap: inherit;
  flex-direction: inherit;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navItem {
  position: relative;
}

.navLink,
.navButton {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: none;
  border: none;
  color: var(--boom-theme-text-secondary);
  text-decoration: none;
  font-size: var(--boom-font-size-sm);
  font-weight: var(--boom-font-weight-medium);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
  white-space: nowrap;
}

.navLink:hover,
.navButton:hover {
  background-color: var(--boom-theme-bg-secondary);
  color: var(--boom-theme-text-primary);
}

.navLink.active {
  color: var(--boom-theme-text-primary);
  background-color: var(--boom-theme-bg-secondary);
}

.navLink:focus-visible,
.navButton:focus-visible {
  outline: 2px solid var(--boom-theme-focus-ring);
  outline-offset: 2px;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: var(--boom-theme-accent);
  color: white;
  font-size: 12px;
  font-weight: var(--boom-font-weight-semibold);
}

.dropdownIcon {
  margin-left: 4px;
  transition: transform 0.2s;
}

.dropdownIcon.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 200px;
  background-color: var(--boom-theme-bg-primary);
  border: 1px solid var(--boom-theme-border-color);
  border-radius: 8px;
  box-shadow: var(--boom-shadow-lg);
  padding: 4px;
  z-index: 1000;
}

.vertical .dropdown {
  top: 0;
  left: 100%;
  margin-top: 0;
  margin-left: 4px;
}

.dropdownList {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdownItem {
  /* inherits navLink styles */
}
```

**Step 5: Implement Navigation component**

Create `src/components/Navigation/Navigation.tsx`:

```typescript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationProps, NavItem } from './Navigation.types';
import { cn } from '@/utils/classnames';
import styles from './Navigation.module.css';

function NavItemComponent({
  item,
  orientation,
}: {
  item: NavItem;
  orientation: 'horizontal' | 'vertical';
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const hasDropdown = item.dropdown && item.dropdown.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    if (hasDropdown) {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    } else if (item.onClick) {
      e.preventDefault();
      item.onClick();
    }
  };

  const content = (
    <>
      {item.icon && <span className={styles.icon}>{item.icon}</span>}
      <span>{item.label}</span>
      {item.badge !== undefined && (
        <span className={styles.badge}>{item.badge}</span>
      )}
      {hasDropdown && (
        <svg
          className={cn(styles.dropdownIcon, isDropdownOpen && styles.open)}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M6 8L2 4h8L6 8z" />
        </svg>
      )}
    </>
  );

  const className = cn(
    item.href ? styles.navLink : styles.navButton,
    item.isActive && styles.active
  );

  return (
    <li className={styles.navItem}>
      {item.href ? (
        <a
          href={item.href}
          className={className}
          onClick={hasDropdown ? handleClick : undefined}
          aria-current={item.isActive ? 'page' : undefined}
          aria-expanded={hasDropdown ? isDropdownOpen : undefined}
          aria-haspopup={hasDropdown ? 'menu' : undefined}
        >
          {content}
        </a>
      ) : (
        <button
          className={className}
          onClick={handleClick}
          aria-expanded={hasDropdown ? isDropdownOpen : undefined}
          aria-haspopup={hasDropdown ? 'menu' : undefined}
        >
          {content}
        </button>
      )}

      {hasDropdown && (
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              className={styles.dropdown}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <ul className={styles.dropdownList} role="menu">
                {item.dropdown!.map((dropdownItem, idx) => (
                  <li key={idx} className={styles.dropdownItem} role="none">
                    {dropdownItem.href ? (
                      <a
                        href={dropdownItem.href}
                        className={cn(
                          styles.navLink,
                          dropdownItem.isActive && styles.active
                        )}
                        onClick={
                          dropdownItem.onClick
                            ? (e) => {
                                e.preventDefault();
                                dropdownItem.onClick!();
                              }
                            : undefined
                        }
                        role="menuitem"
                      >
                        {dropdownItem.icon && (
                          <span className={styles.icon}>{dropdownItem.icon}</span>
                        )}
                        <span>{dropdownItem.label}</span>
                        {dropdownItem.badge !== undefined && (
                          <span className={styles.badge}>{dropdownItem.badge}</span>
                        )}
                      </a>
                    ) : (
                      <button
                        className={styles.navButton}
                        onClick={dropdownItem.onClick}
                        role="menuitem"
                      >
                        {dropdownItem.icon && (
                          <span className={styles.icon}>{dropdownItem.icon}</span>
                        )}
                        <span>{dropdownItem.label}</span>
                        {dropdownItem.badge !== undefined && (
                          <span className={styles.badge}>{dropdownItem.badge}</span>
                        )}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

export function Navigation({
  items,
  orientation = 'horizontal',
  className,
}: NavigationProps) {
  return (
    <nav className={cn(styles.nav, styles[orientation], className)}>
      <ul className={styles.navList}>
        {items.map((item, index) => (
          <NavItemComponent key={index} item={item} orientation={orientation} />
        ))}
      </ul>
    </nav>
  );
}
```

**Step 6: Run tests to verify they pass**

```bash
npm test Navigation.test.tsx
```

Expected: PASS

**Step 7: Create Storybook story**

Create `src/components/Navigation/Navigation.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Navigation } from './Navigation';
import { NavItem } from './Navigation.types';

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const items: NavItem[] = [
  { label: 'Dashboard', href: '/', isActive: true },
  { label: 'Projects', href: '/projects' },
  { label: 'Team', href: '/team' },
  { label: 'Settings', href: '/settings' },
];

export const Horizontal: Story = {
  args: {
    items,
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  args: {
    items,
    orientation: 'vertical',
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { label: 'Home', href: '/', icon: '🏠', isActive: true },
      { label: 'Messages', href: '/messages', icon: '💬', badge: 3 },
      { label: 'Notifications', href: '/notifications', icon: '🔔', badge: 12 },
      { label: 'Profile', href: '/profile', icon: '👤' },
    ],
    orientation: 'horizontal',
  },
};

export const WithDropdowns: Story = {
  args: {
    items: [
      { label: 'Home', href: '/', isActive: true },
      {
        label: 'Products',
        dropdown: [
          { label: 'All Products', href: '/products' },
          { label: 'New Arrivals', href: '/products/new' },
          { label: 'Best Sellers', href: '/products/bestsellers' },
        ],
      },
      {
        label: 'Resources',
        dropdown: [
          { label: 'Documentation', href: '/docs' },
          { label: 'Blog', href: '/blog' },
          { label: 'Support', href: '/support' },
        ],
      },
      { label: 'About', href: '/about' },
    ],
    orientation: 'horizontal',
  },
};
```

**Step 8: Create barrel export**

Create `src/components/Navigation/index.ts`:

```typescript
export { Navigation } from './Navigation';
export type { NavigationProps, NavItem } from './Navigation.types';
```

**Step 9: Run tests and verify Storybook**

```bash
npm test Navigation
npm run storybook
```

Expected: Tests PASS, Storybook renders

**Step 10: Commit**

```bash
git add src/components/Navigation/
git commit -m "feat: add Navigation component with dropdown support"
```

---

## Task 13: SearchCommand Component (Part 1 - Types and Hook)

**Files:**
- Create: `src/components/SearchCommand/SearchCommand.types.ts`
- Create: `src/hooks/useDebounce.ts`
- Create: `src/hooks/useDebounce.test.ts`

**Step 1: Write types**

Create `src/components/SearchCommand/SearchCommand.types.ts`:

```typescript
import { ReactNode } from 'react';

export interface SearchResult {
  id: string;
  category?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface SearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  results: SearchResult[];
  isLoading?: boolean;
  recentSearches?: SearchResult[];
  placeholder?: string;
  emptyMessage?: string;
}
```

**Step 2: Write failing test for useDebounce**

Create `src/hooks/useDebounce.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('updated');
  });

  it('should cancel previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    );

    rerender({ value: 'second' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'third' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('third');
  });
});
```

**Step 3: Run test to verify it fails**

```bash
npm test useDebounce.test.ts
```

Expected: FAIL - module not found

**Step 4: Implement useDebounce hook**

Create `src/hooks/useDebounce.ts`:

```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Step 5: Run tests to verify they pass**

```bash
npm test useDebounce.test.ts
```

Expected: PASS

**Step 6: Commit**

```bash
git add src/components/SearchCommand/SearchCommand.types.ts src/hooks/useDebounce.ts src/hooks/useDebounce.test.ts
git commit -m "feat: add SearchCommand types and useDebounce hook"
```

---

## Task 14: SearchCommand Component (Part 2 - Implementation)

**Files:**
- Create: `src/components/SearchCommand/SearchCommand.tsx`
- Create: `src/components/SearchCommand/SearchCommand.module.css`
- Create: `src/components/SearchCommand/SearchCommand.test.tsx`
- Create: `src/components/SearchCommand/SearchCommand.stories.tsx`
- Create: `src/components/SearchCommand/index.ts`

**Step 1: Write failing test**

Create `src/components/SearchCommand/SearchCommand.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchCommand } from './SearchCommand';
import { SearchResult } from './SearchCommand.types';

describe('SearchCommand', () => {
  const mockResults: SearchResult[] = [
    {
      id: '1',
      category: 'Pages',
      title: 'Dashboard',
      subtitle: '/dashboard',
      onSelect: vi.fn(),
    },
    {
      id: '2',
      category: 'Actions',
      title: 'Create Project',
      onSelect: vi.fn(),
    },
  ];

  it('should render search input when open', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={[]}
      />
    );

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <SearchCommand
        isOpen={false}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={[]}
      />
    );

    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
  });

  it('should call onSearch with debounced input', async () => {
    const onSearch = vi.fn();
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={onSearch}
        results={[]}
      />
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test query' } });

    await waitFor(
      () => {
        expect(onSearch).toHaveBeenCalledWith('test query');
      },
      { timeout: 400 }
    );
  });

  it('should render search results grouped by category', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={mockResults}
      />
    );

    expect(screen.getByText('Pages')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Project')).toBeInTheDocument();
  });

  it('should call onSelect when result is clicked', () => {
    const onSelect = vi.fn();
    const results: SearchResult[] = [
      { id: '1', title: 'Test', onSelect },
    ];

    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={results}
      />
    );

    fireEvent.click(screen.getByText('Test'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('should support keyboard navigation', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={mockResults}
      />
    );

    const input = screen.getByPlaceholderText(/search/i);

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Dashboard').closest('button')).toHaveFocus();

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(screen.getByText('Create Project').closest('button')).toHaveFocus();

    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(screen.getByText('Dashboard').closest('button')).toHaveFocus();
  });

  it('should show loading state', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={[]}
        isLoading={true}
      />
    );

    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });

  it('should show empty message when no results', () => {
    render(
      <SearchCommand
        isOpen={true}
        onClose={vi.fn()}
        onSearch={vi.fn()}
        results={[]}
        emptyMessage="No results found"
      />
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test SearchCommand.test.tsx
```

Expected: FAIL - module not found

**Step 3: Create CSS module**

Create `src/components/SearchCommand/SearchCommand.module.css`:

```css
.container {
  width: 90vw;
  max-width: 640px;
  max-height: 80vh;
  background-color: var(--boom-theme-bg-primary);
  border-radius: 12px;
  box-shadow: var(--boom-shadow-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.searchContainer {
  padding: 16px;
  border-bottom: 1px solid var(--boom-theme-border-color);
}

.searchInput {
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  font-size: var(--boom-font-size-md);
  color: var(--boom-theme-text-primary);
  outline: none;
}

.searchInput::placeholder {
  color: var(--boom-theme-text-tertiary);
}

.resultsContainer {
  overflow-y: auto;
  max-height: calc(80vh - 80px);
  padding: 8px;
}

.category {
  padding: 8px 12px;
  font-size: var(--boom-font-size-xs);
  font-weight: var(--boom-font-weight-semibold);
  color: var(--boom-theme-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.resultsList {
  list-style: none;
  margin: 0;
  padding: 0;
}

.resultItem {
  width: 100%;
  padding: 12px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  transition: background-color 0.15s;
}

.resultItem:hover,
.resultItem:focus {
  background-color: var(--boom-theme-bg-secondary);
  outline: none;
}

.resultIcon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: var(--boom-theme-bg-tertiary);
  color: var(--boom-theme-text-secondary);
}

.resultContent {
  flex: 1;
  min-width: 0;
}

.resultTitle {
  font-size: var(--boom-font-size-sm);
  font-weight: var(--boom-font-weight-medium);
  color: var(--boom-theme-text-primary);
  margin: 0;
}

.resultSubtitle {
  font-size: var(--boom-font-size-xs);
  color: var(--boom-theme-text-secondary);
  margin: 2px 0 0;
}

.emptyState,
.loadingState {
  padding: 32px;
  text-align: center;
  color: var(--boom-theme-text-secondary);
}

.kbd {
  display: inline-block;
  padding: 2px 6px;
  border: 1px solid var(--boom-theme-border-color);
  border-radius: 4px;
  font-size: var(--boom-font-size-xs);
  font-family: monospace;
  background-color: var(--boom-theme-bg-secondary);
}

.footer {
  padding: 12px 16px;
  border-top: 1px solid var(--boom-theme-border-color);
  display: flex;
  gap: 16px;
  font-size: var(--boom-font-size-xs);
  color: var(--boom-theme-text-tertiary);
}

.footerItem {
  display: flex;
  align-items: center;
  gap: 6px;
}
```

**Step 4: Implement SearchCommand component**

Create `src/components/SearchCommand/SearchCommand.tsx`:

```typescript
import { useState, useRef, useEffect, useMemo } from 'react';
import { Modal } from '../primitives/Modal';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchCommandProps, SearchResult } from './SearchCommand.types';
import styles from './SearchCommand.module.css';

export function SearchCommand({
  isOpen,
  onClose,
  onSearch,
  results,
  isLoading = false,
  recentSearches = [],
  placeholder = 'Search...',
  emptyMessage = 'No results found',
}: SearchCommandProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const displayResults = query ? results : recentSearches;

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};

    displayResults.forEach((result) => {
      const category = result.category || 'Results';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(result);
    });

    return groups;
  }, [displayResults]);

  const flatResults = useMemo(() => {
    return Object.values(groupedResults).flat();
  }, [groupedResults]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [flatResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flatResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          flatResults[selectedIndex].onSelect();
          onClose();
        }
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    result.onSelect();
    onClose();
  };

  let resultIndex = 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnClickOutside={true}
      closeOnEscape={true}
    >
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className={styles.resultsContainer}>
          {isLoading ? (
            <div className={styles.loadingState}>Searching...</div>
          ) : displayResults.length === 0 && query ? (
            <div className={styles.emptyState}>{emptyMessage}</div>
          ) : (
            Object.entries(groupedResults).map(([category, categoryResults]) => (
              <div key={category}>
                <div className={styles.category}>{category}</div>
                <ul className={styles.resultsList}>
                  {categoryResults.map((result) => {
                    const currentIndex = resultIndex++;
                    return (
                      <li key={result.id}>
                        <button
                          className={styles.resultItem}
                          onClick={() => handleResultClick(result)}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          ref={
                            selectedIndex === currentIndex
                              ? (el) => el?.focus()
                              : undefined
                          }
                        >
                          {result.icon && (
                            <div className={styles.resultIcon}>{result.icon}</div>
                          )}
                          <div className={styles.resultContent}>
                            <div className={styles.resultTitle}>
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className={styles.resultSubtitle}>
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerItem}>
            <span className={styles.kbd}>↑↓</span>
            <span>Navigate</span>
          </div>
          <div className={styles.footerItem}>
            <span className={styles.kbd}>Enter</span>
            <span>Select</span>
          </div>
          <div className={styles.footerItem}>
            <span className={styles.kbd}>Esc</span>
            <span>Close</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
```

**Step 5: Run tests to verify they pass**

```bash
npm test SearchCommand.test.tsx
```

Expected: PASS

**Step 6: Create Storybook story**

Create `src/components/SearchCommand/SearchCommand.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SearchCommand } from './SearchCommand';
import { SearchResult } from './SearchCommand.types';
import { Button } from '../Button';

const meta = {
  title: 'Components/SearchCommand',
  component: SearchCommand,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchCommand>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockResults: SearchResult[] = [
  {
    id: '1',
    category: 'Pages',
    title: 'Dashboard',
    subtitle: '/dashboard',
    icon: '📊',
    onSelect: () => console.log('Navigate to Dashboard'),
  },
  {
    id: '2',
    category: 'Pages',
    title: 'Projects',
    subtitle: '/projects',
    icon: '📁',
    onSelect: () => console.log('Navigate to Projects'),
  },
  {
    id: '3',
    category: 'Actions',
    title: 'Create New Project',
    subtitle: 'Start a new project',
    icon: '✨',
    onSelect: () => console.log('Create Project'),
  },
  {
    id: '4',
    category: 'Actions',
    title: 'Invite Team Member',
    subtitle: 'Add someone to your team',
    icon: '👥',
    onSelect: () => console.log('Invite Member'),
  },
];

function SearchCommandWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (query: string) => {
    const filtered = mockResults.filter((result) =>
      result.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Search (Cmd+K)
      </Button>
      <SearchCommand
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSearch={handleSearch}
        results={results}
      />
    </>
  );
}

export const Default: Story = {
  render: () => <SearchCommandWrapper />,
};

export const WithRecentSearches: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Search</Button>
        <SearchCommand
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSearch={() => {}}
          results={[]}
          recentSearches={mockResults.slice(0, 3)}
        />
      </>
    );
  },
};

export const Loading: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <SearchCommand
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSearch={() => {}}
        results={[]}
        isLoading={true}
      />
    );
  },
};
```

**Step 7: Create barrel export**

Create `src/components/SearchCommand/index.ts`:

```typescript
export { SearchCommand } from './SearchCommand';
export type { SearchCommandProps, SearchResult } from './SearchCommand.types';
```

**Step 8: Run tests and verify Storybook**

```bash
npm test SearchCommand
npm run storybook
```

Expected: Tests PASS, Storybook renders

**Step 9: Commit**

```bash
git add src/components/SearchCommand/
git commit -m "feat: add SearchCommand component with keyboard navigation"
```

---

## Task 15: NotificationMenu Component

**Files:**
- Create: `src/components/NotificationMenu/NotificationMenu.tsx`
- Create: `src/components/NotificationMenu/NotificationMenu.types.ts`
- Create: `src/components/NotificationMenu/NotificationMenu.module.css`
- Create: `src/components/NotificationMenu/NotificationMenu.test.tsx`
- Create: `src/components/NotificationMenu/NotificationMenu.stories.tsx`
- Create: `src/components/NotificationMenu/index.ts`

**Step 1: Write types**

Create `src/components/NotificationMenu/NotificationMenu.types.ts`:

```typescript
import { ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationMenuTriggerProps {
  unreadCount?: number;
  onClick: () => void;
}

export interface NotificationMenuPanelProps {
  notifications: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onSeeAll?: () => void;
  emptyMessage?: string;
  children?: ReactNode;
}

export interface NotificationMenuItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
}

export interface NotificationMenuProps {
  children: ReactNode;
}
```

**Step 2: Write failing test**

Create `src/components/NotificationMenu/NotificationMenu.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  NotificationMenu,
  NotificationMenuTrigger,
  NotificationMenuPanel,
  NotificationMenuItem,
} from './NotificationMenu';
import { Notification } from './NotificationMenu.types';

describe('NotificationMenu', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'New Comment',
      message: 'John commented on your post',
      timestamp: new Date('2024-01-01'),
      read: false,
    },
    {
      id: '2',
      title: 'Update Available',
      message: 'Version 2.0 is ready',
      timestamp: new Date('2024-01-02'),
      read: true,
    },
  ];

  describe('NotificationMenuTrigger', () => {
    it('should render bell icon with badge', () => {
      render(<NotificationMenuTrigger unreadCount={5} onClick={vi.fn()} />);

      expect(screen.getByLabelText(/notifications/i)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should not show badge when count is 0', () => {
      render(<NotificationMenuTrigger unreadCount={0} onClick={vi.fn()} />);

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(<NotificationMenuTrigger onClick={onClick} />);

      fireEvent.click(screen.getByLabelText(/notifications/i));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('NotificationMenuItem', () => {
    it('should render notification details', () => {
      render(
        <NotificationMenuItem notification={mockNotifications[0]} />
      );

      expect(screen.getByText('New Comment')).toBeInTheDocument();
      expect(screen.getByText('John commented on your post')).toBeInTheDocument();
    });

    it('should show unread indicator', () => {
      const { container } = render(
        <NotificationMenuItem notification={mockNotifications[0]} />
      );

      expect(container.querySelector('.unread')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(
        <NotificationMenuItem
          notification={mockNotifications[0]}
          onClick={onClick}
        />
      );

      fireEvent.click(screen.getByText('New Comment'));
      expect(onClick).toHaveBeenCalledWith(mockNotifications[0]);
    });
  });

  describe('NotificationMenuPanel', () => {
    it('should render all notifications', () => {
      render(
        <NotificationMenuPanel notifications={mockNotifications} />
      );

      expect(screen.getByText('New Comment')).toBeInTheDocument();
      expect(screen.getByText('Update Available')).toBeInTheDocument();
    });

    it('should show empty message when no notifications', () => {
      render(
        <NotificationMenuPanel
          notifications={[]}
          emptyMessage="No notifications"
        />
      );

      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });

    it('should render footer actions', () => {
      render(
        <NotificationMenuPanel
          notifications={mockNotifications}
          onMarkAllRead={vi.fn()}
          onSeeAll={vi.fn()}
        />
      );

      expect(screen.getByText(/mark all read/i)).toBeInTheDocument();
      expect(screen.getByText(/see all/i)).toBeInTheDocument();
    });
  });

  describe('NotificationMenu composition', () => {
    it('should compose trigger and panel', () => {
      const { container } = render(
        <NotificationMenu>
          <NotificationMenuTrigger unreadCount={2} onClick={vi.fn()} />
          <NotificationMenuPanel notifications={mockNotifications} />
        </NotificationMenu>
      );

      expect(container.querySelector('[aria-label*="notification"]')).toBeInTheDocument();
    });
  });
});
```

**Step 3: Run test to verify it fails**

```bash
npm test NotificationMenu.test.tsx
```

Expected: FAIL - module not found

**Step 4: Create CSS module**

Create `src/components/NotificationMenu/NotificationMenu.module.css`:

```css
.trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  color: var(--boom-theme-text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.trigger:hover {
  background-color: var(--boom-theme-bg-secondary);
  color: var(--boom-theme-text-primary);
}

.trigger:focus-visible {
  outline: 2px solid var(--boom-theme-focus-ring);
  outline-offset: 2px;
}

.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--boom-theme-error);
  color: white;
  border-radius: 9px;
  font-size: 11px;
  font-weight: var(--boom-font-weight-semibold);
}

.panel {
  width: 380px;
  max-height: 480px;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 16px;
  border-bottom: 1px solid var(--boom-theme-border-color);
}

.headerTitle {
  font-size: var(--boom-font-size-md);
  font-weight: var(--boom-font-weight-semibold);
  color: var(--boom-theme-text-primary);
  margin: 0;
}

.notificationsList {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  max-height: 320px;
}

.notificationItem {
  position: relative;
  padding: 12px 16px;
  border-bottom: 1px solid var(--boom-theme-border-color);
  cursor: pointer;
  transition: background-color 0.15s;
}

.notificationItem:hover {
  background-color: var(--boom-theme-bg-secondary);
}

.notificationItem.unread::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--boom-theme-accent);
}

.notificationItem.unread {
  padding-left: 24px;
}

.notificationHeader {
  display: flex;
  align-items: start;
  gap: 12px;
  margin-bottom: 4px;
}

.notificationIcon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: var(--boom-theme-bg-tertiary);
}

.notificationContent {
  flex: 1;
  min-width: 0;
}

.notificationTitle {
  font-size: var(--boom-font-size-sm);
  font-weight: var(--boom-font-weight-medium);
  color: var(--boom-theme-text-primary);
  margin: 0 0 4px;
}

.notificationMessage {
  font-size: var(--boom-font-size-sm);
  color: var(--boom-theme-text-secondary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notificationTimestamp {
  font-size: var(--boom-font-size-xs);
  color: var(--boom-theme-text-tertiary);
  margin-top: 4px;
}

.notificationAction {
  margin-top: 8px;
}

.actionButton {
  padding: 4px 12px;
  border: 1px solid var(--boom-theme-border-color);
  background-color: var(--boom-theme-bg-primary);
  color: var(--boom-theme-text-primary);
  border-radius: 4px;
  font-size: var(--boom-font-size-xs);
  cursor: pointer;
  transition: background-color 0.15s;
}

.actionButton:hover {
  background-color: var(--boom-theme-bg-secondary);
}

.footer {
  padding: 12px 16px;
  border-top: 1px solid var(--boom-theme-border-color);
  display: flex;
  gap: 12px;
}

.footerButton {
  flex: 1;
  padding: 8px;
  border: none;
  background: none;
  color: var(--boom-theme-text-secondary);
  font-size: var(--boom-font-size-sm);
  font-weight: var(--boom-font-weight-medium);
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.15s, color 0.15s;
}

.footerButton:hover {
  background-color: var(--boom-theme-bg-secondary);
  color: var(--boom-theme-text-primary);
}

.empty {
  padding: 32px;
  text-align: center;
  color: var(--boom-theme-text-secondary);
}
```

**Step 5: Implement NotificationMenu components**

Create `src/components/NotificationMenu/NotificationMenu.tsx`:

```typescript
import { createContext, useContext, useState } from 'react';
import {
  NotificationMenuProps,
  NotificationMenuTriggerProps,
  NotificationMenuPanelProps,
  NotificationMenuItemProps,
} from './NotificationMenu.types';
import { Popover } from '../primitives/Popover';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useRef } from 'react';
import styles from './NotificationMenu.module.css';

interface NotificationMenuContextValue {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement> | null;
}

const NotificationMenuContext = createContext<NotificationMenuContextValue | undefined>(
  undefined
);

function useNotificationMenu() {
  const context = useContext(NotificationMenuContext);
  if (!context) {
    throw new Error(
      'NotificationMenu components must be used within NotificationMenu'
    );
  }
  return context;
}

export function NotificationMenu({ children }: NotificationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <NotificationMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      {children}
    </NotificationMenuContext.Provider>
  );
}

export function NotificationMenuTrigger({
  unreadCount = 0,
  onClick,
}: NotificationMenuTriggerProps) {
  const { triggerRef, isOpen, setIsOpen } = useNotificationMenu();

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick();
  };

  return (
    <button
      ref={triggerRef}
      className={styles.trigger}
      onClick={handleClick}
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
      </svg>
      {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
    </button>
  );
}

export function NotificationMenuItem({
  notification,
  onClick,
}: NotificationMenuItemProps) {
  const handleClick = () => {
    onClick?.(notification);
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    notification.action?.onClick();
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <li
      className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
      onClick={handleClick}
    >
      <div className={styles.notificationHeader}>
        {notification.icon && (
          <div className={styles.notificationIcon}>{notification.icon}</div>
        )}
        <div className={styles.notificationContent}>
          <h4 className={styles.notificationTitle}>{notification.title}</h4>
          <p className={styles.notificationMessage}>{notification.message}</p>
          <div className={styles.notificationTimestamp}>
            {formatTimestamp(notification.timestamp)}
          </div>
          {notification.action && (
            <div className={styles.notificationAction}>
              <button
                className={styles.actionButton}
                onClick={handleActionClick}
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function NotificationMenuPanel({
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onSeeAll,
  emptyMessage = 'No notifications',
  children,
}: NotificationMenuPanelProps) {
  const { isOpen, setIsOpen, triggerRef } = useNotificationMenu();
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(panelRef, () => setIsOpen(false), isOpen);

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      anchorEl={triggerRef.current}
      placement="bottom"
      offset={8}
    >
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.header}>
          <h3 className={styles.headerTitle}>Notifications</h3>
        </div>

        {notifications.length === 0 ? (
          <div className={styles.empty}>{emptyMessage}</div>
        ) : (
          <ul className={styles.notificationsList}>
            {notifications.map((notification) => (
              <NotificationMenuItem
                key={notification.id}
                notification={notification}
                onClick={onNotificationClick}
              />
            ))}
          </ul>
        )}

        {children}

        {(onMarkAllRead || onSeeAll) && (
          <div className={styles.footer}>
            {onMarkAllRead && (
              <button className={styles.footerButton} onClick={onMarkAllRead}>
                Mark all read
              </button>
            )}
            {onSeeAll && (
              <button className={styles.footerButton} onClick={onSeeAll}>
                See all
              </button>
            )}
          </div>
        )}
      </div>
    </Popover>
  );
}

NotificationMenu.Trigger = NotificationMenuTrigger;
NotificationMenu.Panel = NotificationMenuPanel;
NotificationMenu.Item = NotificationMenuItem;
```

**Step 6: Run tests to verify they pass**

```bash
npm test NotificationMenu.test.tsx
```

Expected: PASS

**Step 7: Create Storybook story**

Create `src/components/NotificationMenu/NotificationMenu.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import {
  NotificationMenu,
  NotificationMenuTrigger,
  NotificationMenuPanel,
} from './NotificationMenu';
import { Notification } from './NotificationMenu.types';

const meta = {
  title: 'Components/NotificationMenu',
  component: NotificationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NotificationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Comment',
    message: 'John Doe commented on your post "Getting Started with React"',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    icon: '💬',
    action: {
      label: 'Reply',
      onClick: () => console.log('Reply clicked'),
    },
  },
  {
    id: '2',
    title: 'System Update',
    message: 'New version 2.0 is available. Update now to get the latest features.',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: false,
    icon: '🔄',
  },
  {
    id: '3',
    title: 'Welcome!',
    message: 'Thanks for joining our platform. Check out our getting started guide.',
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
    icon: '👋',
    action: {
      label: 'View Guide',
      onClick: () => console.log('View guide clicked'),
    },
  },
];

export const Default: Story = {
  render: () => (
    <NotificationMenu>
      <NotificationMenuTrigger unreadCount={2} onClick={() => {}} />
      <NotificationMenuPanel
        notifications={mockNotifications}
        onNotificationClick={(notification) => console.log('Clicked:', notification)}
        onMarkAllRead={() => console.log('Mark all read')}
        onSeeAll={() => console.log('See all')}
      />
    </NotificationMenu>
  ),
};

export const NoNotifications: Story = {
  render: () => (
    <NotificationMenu>
      <NotificationMenuTrigger unreadCount={0} onClick={() => {}} />
      <NotificationMenuPanel notifications={[]} />
    </NotificationMenu>
  ),
};

export const ManyNotifications: Story = {
  render: () => {
    const manyNotifications: Notification[] = Array.from(
      { length: 10 },
      (_, i) => ({
        id: String(i),
        title: `Notification ${i + 1}`,
        message: `This is notification message number ${i + 1}`,
        timestamp: new Date(Date.now() - i * 3600000),
        read: i > 5,
        icon: '🔔',
      })
    );

    return (
      <NotificationMenu>
        <NotificationMenuTrigger unreadCount={6} onClick={() => {}} />
        <NotificationMenuPanel
          notifications={manyNotifications}
          onMarkAllRead={() => console.log('Mark all read')}
          onSeeAll={() => console.log('See all')}
        />
      </NotificationMenu>
    );
  },
};
```

**Step 8: Create barrel export**

Create `src/components/NotificationMenu/index.ts`:

```typescript
export {
  NotificationMenu,
  NotificationMenuTrigger,
  NotificationMenuPanel,
  NotificationMenuItem,
} from './NotificationMenu';
export type {
  NotificationMenuProps,
  NotificationMenuTriggerProps,
  NotificationMenuPanelProps,
  NotificationMenuItemProps,
  Notification,
} from './NotificationMenu.types';
```

**Step 9: Run tests and verify Storybook**

```bash
npm test NotificationMenu
npm run storybook
```

Expected: Tests PASS, Storybook renders

**Step 10: Commit**

```bash
git add src/components/NotificationMenu/
git commit -m "feat: add composable NotificationMenu component"
```

---

## Task 16: UserMenu Component

**Files:**
- Create: `src/components/UserMenu/UserMenu.tsx`
- Create: `src/components/UserMenu/UserMenu.types.ts`
- Create: `src/components/UserMenu/UserMenu.module.css`
- Create: `src/components/UserMenu/UserMenu.test.tsx`
- Create: `src/components/UserMenu/UserMenu.stories.tsx`
- Create: `src/components/UserMenu/index.ts`

**Step 1: Write types**

Create `src/components/UserMenu/UserMenu.types.ts`:

```typescript
import { ReactNode } from 'react';

export interface UserStat {
  label: string;
  value: string | number;
}

export interface UserMenuProps {
  children: ReactNode;
}

export interface UserMenuTriggerProps {
  avatar?: string;
  name?: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  onClick: () => void;
}

export interface UserMenuPanelProps {
  children: ReactNode;
}

export interface UserMenuProfileProps {
  avatar?: string;
  name: string;
  email?: string;
  stats?: UserStat[];
}

export interface UserMenuSectionProps {
  title?: string;
  children: ReactNode;
}

export interface UserMenuItemProps {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

export interface UserMenuSeparatorProps {}
```

**Step 2: Write failing test**

Create `src/components/UserMenu/UserMenu.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  UserMenu,
  UserMenuTrigger,
  UserMenuPanel,
  UserMenuProfile,
  UserMenuSection,
  UserMenuItem,
  UserMenuSeparator,
} from './UserMenu';

describe('UserMenu', () => {
  describe('UserMenuTrigger', () => {
    it('should render avatar button', () => {
      render(
        <UserMenuTrigger
          avatar="https://example.com/avatar.jpg"
          name="John Doe"
          onClick={vi.fn()}
        />
      );

      const button = screen.getByRole('button', { name: /john doe/i });
      expect(button).toBeInTheDocument();
    });

    it('should show status indicator', () => {
      const { container } = render(
        <UserMenuTrigger
          name="John Doe"
          status="online"
          onClick={vi.fn()}
        />
      );

      expect(container.querySelector('.online')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(<UserMenuTrigger name="John Doe" onClick={onClick} />);

      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('UserMenuProfile', () => {
    it('should render user info', () => {
      render(
        <UserMenuProfile
          name="John Doe"
          email="john@example.com"
          avatar="https://example.com/avatar.jpg"
        />
      );

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should render stats', () => {
      const stats = [
        { label: 'Projects', value: 12 },
        { label: 'Tasks', value: 45 },
      ];

      render(<UserMenuProfile name="John Doe" stats={stats} />);

      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
    });
  });

  describe('UserMenuItem', () => {
    it('should render menu item with icon', () => {
      render(
        <UserMenuItem icon={<span data-testid="icon">⚙️</span>} onClick={vi.fn()}>
          Settings
        </UserMenuItem>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const onClick = vi.fn();
      render(<UserMenuItem onClick={onClick}>Settings</UserMenuItem>);

      fireEvent.click(screen.getByText('Settings'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should apply danger variant styles', () => {
      render(
        <UserMenuItem variant="danger" onClick={vi.fn()}>
          Sign Out
        </UserMenuItem>
      );

      const button = screen.getByText('Sign Out');
      expect(button).toHaveClass('danger');
    });
  });

  describe('UserMenu composition', () => {
    it('should compose all subcomponents', () => {
      render(
        <UserMenu>
          <UserMenuTrigger name="John Doe" onClick={vi.fn()} />
          <UserMenuPanel>
            <UserMenuProfile name="John Doe" email="john@example.com" />
            <UserMenuSeparator />
            <UserMenuSection title="Account">
              <UserMenuItem onClick={vi.fn()}>Settings</UserMenuItem>
            </UserMenuSection>
          </UserMenuPanel>
        </UserMenu>
      );

      expect(screen.getByRole('button', { name: /john doe/i })).toBeInTheDocument();
    });
  });
});
```

**Step 3: Run test to verify it fails**

```bash
npm test UserMenu.test.tsx
```

Expected: FAIL - module not found

**Step 4: Create CSS module**

Create `src/components/UserMenu/UserMenu.module.css`:

```css
.trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s;
  position: relative;
}

.trigger:hover {
  background-color: var(--boom-theme-bg-secondary);
}

.trigger:focus-visible {
  outline: 2px solid var(--boom-theme-focus-ring);
  outline-offset: 2px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--boom-theme-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--boom-theme-text-secondary);
  font-weight: var(--boom-font-weight-semibold);
}

.status {
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--boom-theme-bg-primary);
}

.status.online {
  background-color: #10b981;
}

.status.away {
  background-color: #f59e0b;
}

.status.busy {
  background-color: #ef4444;
}

.status.offline {
  background-color: #6b7280;
}

.panel {
  width: 320px;
}

.profile {
  padding: 16px;
  text-align: center;
}

.profileAvatar {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--boom-theme-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--boom-theme-text-secondary);
  font-size: 24px;
  font-weight: var(--boom-font-weight-semibold);
}

.profileName {
  font-size: var(--boom-font-size-md);
  font-weight: var(--boom-font-weight-semibold);
  color: var(--boom-theme-text-primary);
  margin: 0 0 4px;
}

.profileEmail {
  font-size: var(--boom-font-size-sm);
  color: var(--boom-theme-text-secondary);
  margin: 0;
}

.stats {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--boom-theme-border-color);
}

.stat {
  text-align: center;
}

.statValue {
  display: block;
  font-size: var(--boom-font-size-lg);
  font-weight: var(--boom-font-weight-semibold);
  color: var(--boom-theme-text-primary);
}

.statLabel {
  display: block;
  font-size: var(--boom-font-size-xs);
  color: var(--boom-theme-text-tertiary);
  margin-top: 2px;
}

.section {
  padding: 8px;
}

.sectionTitle {
  padding: 8px 12px;
  font-size: var(--boom-font-size-xs);
  font-weight: var(--boom-font-weight-semibold);
  color: var(--boom-theme-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: none;
  background: none;
  color: var(--boom-theme-text-primary);
  font-size: var(--boom-font-size-sm);
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.item:hover {
  background-color: var(--boom-theme-bg-secondary);
}

.item:focus-visible {
  outline: 2px solid var(--boom-theme-focus-ring);
  outline-offset: -2px;
}

.item.danger {
  color: var(--boom-theme-error);
}

.item.danger:hover {
  background-color: var(--boom-theme-error-bg);
}

.itemIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  color: inherit;
}

.separator {
  height: 1px;
  background-color: var(--boom-theme-border-color);
  margin: 4px 0;
}
```

**Step 5: Implement UserMenu components**

Create `src/components/UserMenu/UserMenu.tsx`:

```typescript
import { createContext, useContext, useState, useRef } from 'react';
import {
  UserMenuProps,
  UserMenuTriggerProps,
  UserMenuPanelProps,
  UserMenuProfileProps,
  UserMenuSectionProps,
  UserMenuItemProps,
} from './UserMenu.types';
import { Popover } from '../primitives/Popover';
import { useClickOutside } from '@/hooks/useClickOutside';
import styles from './UserMenu.module.css';

interface UserMenuContextValue {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement> | null;
}

const UserMenuContext = createContext<UserMenuContextValue | undefined>(undefined);

function useUserMenu() {
  const context = useContext(UserMenuContext);
  if (!context) {
    throw new Error('UserMenu components must be used within UserMenu');
  }
  return context;
}

export function UserMenu({ children }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <UserMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      {children}
    </UserMenuContext.Provider>
  );
}

export function UserMenuTrigger({
  avatar,
  name,
  status,
  onClick,
}: UserMenuTriggerProps) {
  const { triggerRef, isOpen, setIsOpen } = useUserMenu();

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick();
  };

  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      ref={triggerRef}
      className={styles.trigger}
      onClick={handleClick}
      aria-label={`User menu for ${name}`}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <div className={styles.avatar}>
        {avatar ? <img src={avatar} alt={name} /> : initials}
      </div>
      {status && <span className={`${styles.status} ${styles[status]}`} />}
    </button>
  );
}

export function UserMenuPanel({ children }: UserMenuPanelProps) {
  const { isOpen, setIsOpen, triggerRef } = useUserMenu();
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside(panelRef, () => setIsOpen(false), isOpen);

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      anchorEl={triggerRef.current}
      placement="bottom"
      offset={8}
    >
      <div ref={panelRef} className={styles.panel}>
        {children}
      </div>
    </Popover>
  );
}

export function UserMenuProfile({
  avatar,
  name,
  email,
  stats,
}: UserMenuProfileProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={styles.profile}>
      <div className={styles.profileAvatar}>
        {avatar ? <img src={avatar} alt={name} /> : initials}
      </div>
      <h3 className={styles.profileName}>{name}</h3>
      {email && <p className={styles.profileEmail}>{email}</p>}
      {stats && stats.length > 0 && (
        <div className={styles.stats}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function UserMenuSection({ title, children }: UserMenuSectionProps) {
  return (
    <div className={styles.section}>
      {title && <h4 className={styles.sectionTitle}>{title}</h4>}
      {children}
    </div>
  );
}

export function UserMenuItem({
  icon,
  children,
  onClick,
  variant = 'default',
}: UserMenuItemProps) {
  return (
    <button
      className={`${styles.item} ${variant === 'danger' ? styles.danger : ''}`}
      onClick={onClick}
    >
      {icon && <span className={styles.itemIcon}>{icon}</span>}
      {children}
    </button>
  );
}

export function UserMenuSeparator() {
  return <div className={styles.separator} />;
}

UserMenu.Trigger = UserMenuTrigger;
UserMenu.Panel = UserMenuPanel;
UserMenu.Profile = UserMenuProfile;
UserMenu.Section = UserMenuSection;
UserMenu.Item = UserMenuItem;
UserMenu.Separator = UserMenuSeparator;
```

**Step 6: Run tests to verify they pass**

```bash
npm test UserMenu.test.tsx
```

Expected: PASS

**Step 7: Create Storybook story**

Create `src/components/UserMenu/UserMenu.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import {
  UserMenu,
  UserMenuTrigger,
  UserMenuPanel,
  UserMenuProfile,
  UserMenuSection,
  UserMenuItem,
  UserMenuSeparator,
} from './UserMenu';

const meta = {
  title: 'Components/UserMenu',
  component: UserMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UserMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <UserMenu>
      <UserMenuTrigger
        name="John Doe"
        status="online"
        onClick={() => {}}
      />
      <UserMenuPanel>
        <UserMenuProfile
          name="John Doe"
          email="john@example.com"
          stats={[
            { label: 'Projects', value: 12 },
            { label: 'Tasks', value: 45 },
          ]}
        />
        <UserMenuSeparator />
        <UserMenuSection title="Account">
          <UserMenuItem icon="⚙️" onClick={() => console.log('Settings')}>
            Settings
          </UserMenuItem>
          <UserMenuItem icon="👤" onClick={() => console.log('Profile')}>
            Profile
          </UserMenuItem>
        </UserMenuSection>
        <UserMenuSeparator />
        <UserMenuItem
          icon="🚪"
          variant="danger"
          onClick={() => console.log('Sign out')}
        >
          Sign Out
        </UserMenuItem>
      </UserMenuPanel>
    </UserMenu>
  ),
};

export const WithAvatar: Story = {
  render: () => (
    <UserMenu>
      <UserMenuTrigger
        avatar="https://i.pravatar.cc/150?img=1"
        name="Jane Smith"
        status="away"
        onClick={() => {}}
      />
      <UserMenuPanel>
        <UserMenuProfile
          avatar="https://i.pravatar.cc/150?img=1"
          name="Jane Smith"
          email="jane@example.com"
        />
        <UserMenuSeparator />
        <UserMenuSection>
          <UserMenuItem icon="⚙️" onClick={() => {}}>Settings</UserMenuItem>
          <UserMenuItem icon="❓" onClick={() => {}}>Help</UserMenuItem>
        </UserMenuSection>
        <UserMenuSeparator />
        <UserMenuItem variant="danger" onClick={() => {}}>
          Sign Out
        </UserMenuItem>
      </UserMenuPanel>
    </UserMenu>
  ),
};

export const Minimal: Story = {
  render: () => (
    <UserMenu>
      <UserMenuTrigger name="User" onClick={() => {}} />
      <UserMenuPanel>
        <UserMenuProfile name="User" />
        <UserMenuSeparator />
        <UserMenuItem onClick={() => {}}>Profile</UserMenuItem>
        <UserMenuItem onClick={() => {}}>Settings</UserMenuItem>
        <UserMenuItem variant="danger" onClick={() => {}}>
          Sign Out
        </UserMenuItem>
      </UserMenuPanel>
    </UserMenu>
  ),
};
```

**Step 8: Create barrel export**

Create `src/components/UserMenu/index.ts`:

```typescript
export {
  UserMenu,
  UserMenuTrigger,
  UserMenuPanel,
  UserMenuProfile,
  UserMenuSection,
  UserMenuItem,
  UserMenuSeparator,
} from './UserMenu';
export type {
  UserMenuProps,
  UserMenuTriggerProps,
  UserMenuPanelProps,
  UserMenuProfileProps,
  UserMenuSectionProps,
  UserMenuItemProps,
  UserStat,
} from './UserMenu.types';
```

**Step 9: Run tests and verify Storybook**

```bash
npm test UserMenu
npm run storybook
```

Expected: Tests PASS, Storybook renders

**Step 10: Commit**

```bash
git add src/components/UserMenu/
git commit -m "feat: add composable UserMenu component with profile panel"
```

---

## Task 17: MobileMenu Component

**Files:**
- Create: `src/components/MobileMenu/MobileMenu.tsx`
- Create: `src/components/MobileMenu/MobileMenu.types.ts`
- Create: `src/components/MobileMenu/MobileMenu.module.css`
- Create: `src/components/MobileMenu/MobileMenu.test.tsx`
- Create: `src/components/MobileMenu/MobileMenu.stories.tsx`
- Create: `src/components/MobileMenu/index.ts`

**Step 1: Write types**

Create `src/components/MobileMenu/MobileMenu.types.ts`:

```typescript
import { ReactNode } from 'react';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: 'left' | 'right';
  width?: string;
}
```

**Step 2: Write failing test**

Create `src/components/MobileMenu/MobileMenu.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileMenu } from './MobileMenu';

describe('MobileMenu', () => {
  it('should render children when open', () => {
    render(
      <MobileMenu isOpen={true} onClose={vi.fn()}>
        <div>Mobile Menu Content</div>
      </MobileMenu>
    );

    expect(screen.getByText('Mobile Menu Content')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <MobileMenu isOpen={false} onClose={vi.fn()}>
        <div>Mobile Menu Content</div>
      </MobileMenu>
    );

    expect(screen.queryByText('Mobile Menu Content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(
      <MobileMenu isOpen={true} onClose={onClose}>
        <div>Content</div>
      </MobileMenu>
    );

    const closeButton = screen.getByLabelText(/close menu/i);
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render from left side by default', () => {
    const { container } = render(
      <MobileMenu isOpen={true} onClose={vi.fn()}>
        <div>Content</div>
      </MobileMenu>
    );

    const drawer = container.querySelector('[data-testid="drawer"]');
    expect(drawer).toBeInTheDocument();
  });

  it('should render from right side', () => {
    render(
      <MobileMenu isOpen={true} onClose={vi.fn()} side="right">
        <div>Content</div>
      </MobileMenu>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply custom width', () => {
    render(
      <MobileMenu isOpen={true} onClose={vi.fn()} width="320px">
        <div>Content</div>
      </MobileMenu>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
```

**Step 3: Run test to verify it fails**

```bash
npm test MobileMenu.test.tsx
```

Expected: FAIL - module not found

**Step 4: Create CSS module**

Create `src/components/MobileMenu/MobileMenu.module.css`:

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--boom-theme-border-color);
}

.logo {
  font-size: var(--boom-font-size-lg);
  font-weight: var(--boom-font-weight-semibold);
  color: var(--boom-theme-text-primary);
}

.closeButton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: var(--boom-theme-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.closeButton:hover {
  background-color: var(--boom-theme-bg-secondary);
  color: var(--boom-theme-text-primary);
}

.closeButton:focus-visible {
  outline: 2px solid var(--boom-theme-focus-ring);
  outline-offset: 2px;
}

.content {
  padding: 16px;
  overflow-y: auto;
  height: calc(100% - 68px);
}
```

**Step 5: Implement MobileMenu component**

Create `src/components/MobileMenu/MobileMenu.tsx`:

```typescript
import { Drawer } from '../primitives/Drawer';
import { MobileMenuProps } from './MobileMenu.types';
import styles from './MobileMenu.module.css';

export function MobileMenu({
  isOpen,
  onClose,
  children,
  side = 'left',
  width = '280px',
}: MobileMenuProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} side={side} width={width}>
      <div className={styles.header}>
        <div className={styles.logo}>Menu</div>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className={styles.content}>{children}</div>
    </Drawer>
  );
}
```

**Step 6: Run tests to verify they pass**

```bash
npm test MobileMenu.test.tsx
```

Expected: PASS

**Step 7: Create Storybook story**

Create `src/components/MobileMenu/MobileMenu.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';
import { Navigation } from '../Navigation';
import { NavItem } from '../Navigation/Navigation.types';
import { Button } from '../Button';

const meta = {
  title: 'Components/MobileMenu',
  component: MobileMenu,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MobileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', isActive: true },
  { label: 'Projects', href: '/projects' },
  { label: 'Team', href: '/team' },
  { label: 'Settings', href: '/settings' },
];

function MobileMenuWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Mobile Menu</Button>
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Navigation items={navItems} orientation="vertical" />
      </MobileMenu>
    </div>
  );
}

export const Default: Story = {
  render: () => <MobileMenuWrapper />,
};

export const FromRight: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open from Right</Button>
        <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} side="right">
          <Navigation items={navItems} orientation="vertical" />
        </MobileMenu>
      </div>
    );
  },
};

export const CustomWidth: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>Open Wide Menu</Button>
        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          width="320px"
        >
          <Navigation items={navItems} orientation="vertical" />
        </MobileMenu>
      </div>
    );
  },
};
```

**Step 8: Create barrel export**

Create `src/components/MobileMenu/index.ts`:

```typescript
export { MobileMenu } from './MobileMenu';
export type { MobileMenuProps } from './MobileMenu.types';
```

**Step 9: Run tests and verify Storybook**

```bash
npm test MobileMenu
npm run storybook
```

Expected: Tests PASS, Storybook renders

**Step 10: Commit**

```bash
git add src/components/MobileMenu/
git commit -m "feat: add MobileMenu component for responsive navigation"
```

---

## Task 18: Export All Components from Library

**Files:**
- Modify: `src/index.ts`

**Step 1: Update main library export**

Edit `src/index.ts` to export all new components:

```typescript
// Existing exports
export { Button } from './components/Button';
export { Typography } from './components/Typography';
export { Box } from './components/Box';
export { Stack } from './components/Stack';
export { Input } from './components/Input';
export { Card } from './components/Card';
export { ThemeProvider, useTheme } from './components/ThemeProvider';

// Primitives
export { Portal } from './components/primitives/Portal';
export { Overlay } from './components/primitives/Overlay';
export { Modal } from './components/primitives/Modal';
export { Drawer } from './components/primitives/Drawer';
export { Popover } from './components/primitives/Popover';

// Header & Navigation
export { Header } from './components/Header';
export { Navigation } from './components/Navigation';
export { SearchCommand } from './components/SearchCommand';
export {
  NotificationMenu,
  NotificationMenuTrigger,
  NotificationMenuPanel,
  NotificationMenuItem,
} from './components/NotificationMenu';
export {
  UserMenu,
  UserMenuTrigger,
  UserMenuPanel,
  UserMenuProfile,
  UserMenuSection,
  UserMenuItem,
  UserMenuSeparator,
} from './components/UserMenu';
export { MobileMenu } from './components/MobileMenu';

// Hooks
export { useClickOutside } from './hooks/useClickOutside';
export { useFocusTrap } from './hooks/useFocusTrap';
export { useScrollLock } from './hooks/useScrollLock';
export { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
export { useDebounce } from './hooks/useDebounce';

// Type exports
export type { ButtonProps } from './components/Button';
export type { TypographyProps } from './components/Typography';
export type { BoxProps } from './components/Box';
export type { StackProps } from './components/Stack';
export type { InputProps } from './components/Input';
export type { CardProps } from './components/Card';
export type { ThemeProviderProps } from './components/ThemeProvider';

export type { PortalProps } from './components/primitives/Portal';
export type { OverlayProps } from './components/primitives/types';
export type { ModalProps } from './components/primitives/types';
export type { DrawerProps } from './components/primitives/types';
export type { PopoverProps } from './components/primitives/types';

export type { HeaderProps } from './components/Header';
export type { NavigationProps, NavItem } from './components/Navigation';
export type { SearchCommandProps, SearchResult } from './components/SearchCommand';
export type {
  Notification,
  NotificationMenuProps,
  NotificationMenuTriggerProps,
  NotificationMenuPanelProps,
  NotificationMenuItemProps,
} from './components/NotificationMenu';
export type {
  UserMenuProps,
  UserMenuTriggerProps,
  UserMenuPanelProps,
  UserMenuProfileProps,
  UserMenuSectionProps,
  UserMenuItemProps,
  UserStat,
} from './components/UserMenu';
export type { MobileMenuProps } from './components/MobileMenu';
```

**Step 2: Run build to verify exports**

```bash
npm run build
```

Expected: Build succeeds with no errors

**Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: No type errors

**Step 4: Commit**

```bash
git add src/index.ts
git commit -m "feat: export all header and navigation components from library"
```

---

## Task 19: Integration Story

**Files:**
- Create: `src/components/Header/HeaderIntegration.stories.tsx`

**Step 1: Create comprehensive integration story**

Create `src/components/Header/HeaderIntegration.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Header } from './Header';
import { Navigation } from '../Navigation';
import { SearchCommand } from '../SearchCommand';
import { NotificationMenu, NotificationMenuTrigger, NotificationMenuPanel } from '../NotificationMenu';
import { UserMenu, UserMenuTrigger, UserMenuPanel, UserMenuProfile, UserMenuSection, UserMenuItem, UserMenuSeparator } from '../UserMenu';
import { MobileMenu } from '../MobileMenu';
import { Button } from '../Button';
import { NavItem } from '../Navigation/Navigation.types';
import { SearchResult } from '../SearchCommand/SearchCommand.types';
import { Notification } from '../NotificationMenu/NotificationMenu.types';

const meta = {
  title: 'Components/Header/Integration',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', isActive: true },
  { label: 'Projects', href: '/projects' },
  { label: 'Team', href: '/team' },
  { label: 'Settings', href: '/settings' },
];

const searchResults: SearchResult[] = [
  {
    id: '1',
    category: 'Pages',
    title: 'Dashboard',
    subtitle: '/dashboard',
    icon: '📊',
    onSelect: () => console.log('Navigate to Dashboard'),
  },
  {
    id: '2',
    category: 'Pages',
    title: 'Projects',
    subtitle: '/projects',
    icon: '📁',
    onSelect: () => console.log('Navigate to Projects'),
  },
  {
    id: '3',
    category: 'Actions',
    title: 'Create New Project',
    icon: '✨',
    onSelect: () => console.log('Create Project'),
  },
];

const notifications: Notification[] = [
  {
    id: '1',
    title: 'New Comment',
    message: 'John commented on your post',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    icon: '💬',
  },
  {
    id: '2',
    title: 'System Update',
    message: 'Version 2.0 is available',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: false,
    icon: '🔄',
  },
];

export const FullIntegration: Story = {
  render: () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearch = (query: string) => {
      setSearchQuery(query);
      const filtered = searchResults.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };

    return (
      <>
        <Header
          logo={<div style={{ fontWeight: 'bold', fontSize: '20px' }}>MyApp</div>}
          sticky
        >
          {/* Desktop Navigation */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
              <Navigation items={navItems} />
            </div>

            {/* Search Trigger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
            >
              🔍 Search
            </Button>

            {/* Notifications */}
            <NotificationMenu>
              <NotificationMenuTrigger unreadCount={2} onClick={() => {}} />
              <NotificationMenuPanel
                notifications={notifications}
                onMarkAllRead={() => console.log('Mark all read')}
                onSeeAll={() => console.log('See all')}
              />
            </NotificationMenu>

            {/* User Menu */}
            <UserMenu>
              <UserMenuTrigger
                name="John Doe"
                status="online"
                onClick={() => {}}
              />
              <UserMenuPanel>
                <UserMenuProfile
                  name="John Doe"
                  email="john@example.com"
                  stats={[
                    { label: 'Projects', value: 12 },
                    { label: 'Tasks', value: 45 },
                  ]}
                />
                <UserMenuSeparator />
                <UserMenuSection title="Account">
                  <UserMenuItem icon="⚙️" onClick={() => {}}>
                    Settings
                  </UserMenuItem>
                  <UserMenuItem icon="👤" onClick={() => {}}>
                    Profile
                  </UserMenuItem>
                </UserMenuSection>
                <UserMenuSeparator />
                <UserMenuItem variant="danger" onClick={() => {}}>
                  Sign Out
                </UserMenuItem>
              </UserMenuPanel>
            </UserMenu>

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
              className="mobile-only"
            >
              ☰
            </Button>
          </div>
        </Header>

        {/* Search Command */}
        <SearchCommand
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSearch={handleSearch}
          results={results}
        />

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <Navigation items={navItems} orientation="vertical" />
        </MobileMenu>

        {/* Page Content */}
        <div style={{ padding: '40px', minHeight: '100vh' }}>
          <h1>Dashboard</h1>
          <p>This is an example page with the integrated header.</p>
          <p>Try the search (Cmd+K), notifications, and user menu.</p>
        </div>
      </>
    );
  },
};

export const MinimalIntegration: Story = {
  render: () => (
    <>
      <Header logo="MyApp">
        <Navigation items={navItems.slice(0, 3)} />
        <UserMenu>
          <UserMenuTrigger name="User" onClick={() => {}} />
          <UserMenuPanel>
            <UserMenuProfile name="User" />
            <UserMenuSeparator />
            <UserMenuItem onClick={() => {}}>Profile</UserMenuItem>
            <UserMenuItem variant="danger" onClick={() => {}}>
              Sign Out
            </UserMenuItem>
          </UserMenuPanel>
        </UserMenu>
      </Header>
      <div style={{ padding: '40px' }}>
        <h1>Minimal Header Example</h1>
      </div>
    </>
  ),
};
```

**Step 2: Run Storybook to verify integration**

```bash
npm run storybook
```

Expected: Integration stories render correctly

**Step 3: Commit**

```bash
git add src/components/Header/HeaderIntegration.stories.tsx
git commit -m "docs: add Header integration stories"
```

---

## Task 20: Run Full Test Suite and Build

**Step 1: Run all tests**

```bash
npm test
```

Expected: All tests PASS

**Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: No type errors

**Step 3: Run build**

```bash
npm run build
```

Expected: Build succeeds

**Step 4: Run Storybook build**

```bash
npm run build-storybook
```

Expected: Storybook builds successfully

**Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete header and navigation component implementation"
```

---

## Execution Handoff

Plan complete and saved to `docs/plans/2025-12-14-header-navigation.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?

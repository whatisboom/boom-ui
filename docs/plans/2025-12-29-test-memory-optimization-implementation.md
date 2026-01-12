# Test Memory Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate memory leaks to enable all 57 test files to run in single process without OOM errors

**Architecture:** Three-layer cleanup system: (1) Global test setup with aggressive resource cleanup, (2) Per-test resource tracking utilities, (3) Component-level cleanup audit. Plus optional memory profiling for validation.

**Tech Stack:** TypeScript, Vitest, @testing-library/react, JSDOM, Node.js V8 profiler

---

## Phase 1: Foundation - Memory Profiling Infrastructure

### Task 1: Create Memory Profiler Types

**Files:**
- Create: `tests/memory-profiler.types.ts`

**Step 1: Create type definitions**

```typescript
// tests/memory-profiler.types.ts
export interface MemorySnapshot {
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
  timestamp: number;
}

export interface MemoryDelta {
  heapGrowth: number;
  detachedNodes: number;
  activeListeners: number;
  activeTimers: number;
  label: string;
}

export interface MemoryThresholds {
  heapGrowth: number;
  detachedNodes: number;
  activeListeners: number;
  activeTimers: number;
}

export interface LeakReport {
  leaks: string[];
  delta: MemoryDelta;
  passed: boolean;
}
```

**Step 2: Commit types**

```bash
git add tests/memory-profiler.types.ts
git commit -m "feat: add memory profiler type definitions"
```

---

### Task 2: Create Memory Profiler Core

**Files:**
- Create: `tests/memory-profiler.ts`
- Reference: `tests/memory-profiler.types.ts`

**Step 1: Implement MemoryProfiler class**

```typescript
// tests/memory-profiler.ts
import type {
  MemorySnapshot,
  MemoryDelta,
  MemoryThresholds,
  LeakReport
} from './memory-profiler.types';

export const THRESHOLDS: MemoryThresholds = {
  heapGrowth: 10 * 1024 * 1024, // 10MB
  detachedNodes: 5,
  activeListeners: 0,
  activeTimers: 0
};

export class MemoryProfiler {
  private baseline: MemorySnapshot | null = null;
  private testSnapshots = new Map<string, MemorySnapshot>();

  snapshot(): MemorySnapshot {
    const mem = process.memoryUsage();
    return {
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
      arrayBuffers: mem.arrayBuffers,
      timestamp: Date.now()
    };
  }

  captureBaseline(): void {
    this.baseline = this.snapshot();
  }

  calculateDelta(before: MemorySnapshot, after: MemorySnapshot): MemorySnapshot {
    return {
      heapUsed: after.heapUsed - before.heapUsed,
      heapTotal: after.heapTotal - before.heapTotal,
      external: after.external - before.external,
      arrayBuffers: after.arrayBuffers - before.arrayBuffers,
      timestamp: after.timestamp - before.timestamp
    };
  }

  compareToBaseline(
    label: string,
    detachedNodes: number,
    activeListeners: number,
    activeTimers: number
  ): MemoryDelta {
    if (!this.baseline) {
      throw new Error('No baseline captured. Call captureBaseline() first.');
    }

    const current = this.snapshot();
    const delta = this.calculateDelta(this.baseline, current);

    return {
      heapGrowth: delta.heapUsed,
      detachedNodes,
      activeListeners,
      activeTimers,
      label
    };
  }

  checkLeaks(delta: MemoryDelta, thresholds: MemoryThresholds = THRESHOLDS): LeakReport {
    const leaks: string[] = [];

    if (delta.heapGrowth > thresholds.heapGrowth) {
      const mb = (delta.heapGrowth / 1024 / 1024).toFixed(2);
      leaks.push(`Heap grew ${mb}MB (threshold: ${thresholds.heapGrowth / 1024 / 1024}MB)`);
    }

    if (delta.detachedNodes > thresholds.detachedNodes) {
      leaks.push(`${delta.detachedNodes} detached nodes (threshold: ${thresholds.detachedNodes})`);
    }

    if (delta.activeListeners > thresholds.activeListeners) {
      leaks.push(`${delta.activeListeners} leaked listeners (threshold: ${thresholds.activeListeners})`);
    }

    if (delta.activeTimers > thresholds.activeTimers) {
      leaks.push(`${delta.activeTimers} leaked timers (threshold: ${thresholds.activeTimers})`);
    }

    return {
      leaks,
      delta,
      passed: leaks.length === 0
    };
  }

  logMemoryUsage(label: string): void {
    if (process.env.MEMORY_PROFILE !== 'true') {
      return;
    }

    const snapshot = this.snapshot();
    const mb = (snapshot.heapUsed / 1024 / 1024).toFixed(2);
    console.log(`[MEMORY ${label}] Heap: ${mb}MB`);
  }
}

// Singleton instance
export const memoryProfiler = new MemoryProfiler();

// Convenience functions
export function logMemoryUsage(label: string): void {
  memoryProfiler.logMemoryUsage(label);
}

export function captureBaseline(): void {
  memoryProfiler.captureBaseline();
}
```

**Step 2: Commit memory profiler**

```bash
git add tests/memory-profiler.ts
git commit -m "feat: add memory profiler core implementation"
```

---

### Task 3: Add V8 Heap Snapshot Support

**Files:**
- Modify: `tests/memory-profiler.ts`

**Step 1: Add heap snapshot function**

```typescript
// Add to tests/memory-profiler.ts after imports
import v8 from 'v8';
import path from 'path';
import fs from 'fs';

// Add after MemoryProfiler class
export function captureHeapSnapshot(label: string): string | null {
  if (process.env.HEAP_SNAPSHOT !== 'true') {
    return null;
  }

  const snapshotDir = path.join(process.cwd(), '.heap-snapshots');
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(snapshotDir, `${label}-${timestamp}.heapsnapshot`);

  const snapshot = v8.writeHeapSnapshot(filename);
  console.log(`Heap snapshot written to ${snapshot}`);

  return snapshot;
}
```

**Step 2: Update .gitignore**

```bash
echo ".heap-snapshots/" >> .gitignore
```

**Step 3: Commit heap snapshot support**

```bash
git add tests/memory-profiler.ts .gitignore
git commit -m "feat: add V8 heap snapshot capture support"
```

---

## Phase 2: Resource Tracking Infrastructure

### Task 4: Create Timer Tracking Registry

**Files:**
- Create: `tests/timer-tracker.ts`

**Step 1: Implement timer tracking**

```typescript
// tests/timer-tracker.ts
interface TrackedTimer {
  id: number;
  type: 'setTimeout' | 'setInterval' | 'requestAnimationFrame';
  stack: string;
  timestamp: number;
}

class TimerTracker {
  private timers = new Map<number, TrackedTimer>();
  private originalSetTimeout: typeof setTimeout;
  private originalSetInterval: typeof setInterval;
  private originalClearTimeout: typeof clearTimeout;
  private originalClearInterval: typeof clearInterval;
  private originalRequestAnimationFrame: typeof requestAnimationFrame;
  private originalCancelAnimationFrame: typeof cancelAnimationFrame;
  private installed = false;

  constructor() {
    this.originalSetTimeout = global.setTimeout;
    this.originalSetInterval = global.setInterval;
    this.originalClearTimeout = global.clearTimeout;
    this.originalClearInterval = global.clearInterval;
    this.originalRequestAnimationFrame = global.requestAnimationFrame;
    this.originalCancelAnimationFrame = global.cancelAnimationFrame;
  }

  install(): void {
    if (this.installed) return;
    this.installed = true;

    const tracker = this;

    global.setTimeout = function(...args: Parameters<typeof setTimeout>): ReturnType<typeof setTimeout> {
      const id = tracker.originalSetTimeout.apply(this, args) as unknown as number;
      tracker.timers.set(id, {
        id,
        type: 'setTimeout',
        stack: new Error().stack || '',
        timestamp: Date.now()
      });
      return id as unknown as ReturnType<typeof setTimeout>;
    } as typeof setTimeout;

    global.setInterval = function(...args: Parameters<typeof setInterval>): ReturnType<typeof setInterval> {
      const id = tracker.originalSetInterval.apply(this, args) as unknown as number;
      tracker.timers.set(id, {
        id,
        type: 'setInterval',
        stack: new Error().stack || '',
        timestamp: Date.now()
      });
      return id as unknown as ReturnType<typeof setInterval>;
    } as typeof setInterval;

    global.clearTimeout = function(id?: number): void {
      if (id !== undefined) {
        tracker.timers.delete(id);
      }
      tracker.originalClearTimeout(id);
    };

    global.clearInterval = function(id?: number): void {
      if (id !== undefined) {
        tracker.timers.delete(id);
      }
      tracker.originalClearInterval(id);
    };

    global.requestAnimationFrame = function(callback: FrameRequestCallback): number {
      const id = tracker.originalRequestAnimationFrame(callback);
      tracker.timers.set(id, {
        id,
        type: 'requestAnimationFrame',
        stack: new Error().stack || '',
        timestamp: Date.now()
      });
      return id;
    };

    global.cancelAnimationFrame = function(id: number): void {
      tracker.timers.delete(id);
      tracker.originalCancelAnimationFrame(id);
    };
  }

  clearAll(): void {
    for (const [id, timer] of this.timers) {
      if (timer.type === 'setTimeout' || timer.type === 'setInterval') {
        this.originalClearTimeout(id);
      } else if (timer.type === 'requestAnimationFrame') {
        this.originalCancelAnimationFrame(id);
      }
    }
    this.timers.clear();
  }

  getActiveCount(): number {
    return this.timers.size;
  }

  getActiveTimers(): TrackedTimer[] {
    return Array.from(this.timers.values());
  }

  logLeakedTimers(): void {
    if (this.timers.size === 0) return;

    console.warn(`[TIMER LEAK] ${this.timers.size} timer(s) not cleaned up:`);
    for (const timer of this.timers.values()) {
      console.warn(`  - ${timer.type} (id: ${timer.id})`);
      console.warn(`    Stack: ${timer.stack.split('\n').slice(1, 3).join('\n')}`);
    }
  }

  reset(): void {
    this.clearAll();
  }
}

export const timerTracker = new TimerTracker();

export function installTimerTracking(): void {
  timerTracker.install();
}

export function clearAllTrackedTimers(): void {
  timerTracker.clearAll();
}

export function getActiveTimerCount(): number {
  return timerTracker.getActiveCount();
}

export function logLeakedTimers(): void {
  timerTracker.logLeakedTimers();
}
```

**Step 2: Commit timer tracker**

```bash
git add tests/timer-tracker.ts
git commit -m "feat: add timer tracking registry"
```

---

### Task 5: Create Event Listener Tracking Registry

**Files:**
- Create: `tests/listener-tracker.ts`

**Step 1: Implement listener tracking**

```typescript
// tests/listener-tracker.ts
interface TrackedListener {
  target: EventTarget;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
  stack: string;
  timestamp: number;
}

class ListenerTracker {
  private listeners = new Map<string, TrackedListener>();
  private originalAddEventListener: typeof EventTarget.prototype.addEventListener;
  private originalRemoveEventListener: typeof EventTarget.prototype.removeEventListener;
  private installed = false;
  private listenerIdCounter = 0;

  constructor() {
    this.originalAddEventListener = EventTarget.prototype.addEventListener;
    this.originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  }

  private getListenerId(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject
  ): string {
    // Simple approach: increment counter for each add
    return `${this.listenerIdCounter++}`;
  }

  install(): void {
    if (this.installed) return;
    this.installed = true;

    const tracker = this;

    EventTarget.prototype.addEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions
    ): void {
      if (listener) {
        const id = tracker.getListenerId(this, type, listener);
        tracker.listeners.set(id, {
          target: this,
          type,
          listener,
          options,
          stack: new Error().stack || '',
          timestamp: Date.now()
        });
      }
      tracker.originalAddEventListener.call(this, type, listener, options);
    };

    EventTarget.prototype.removeEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | EventListenerOptions
    ): void {
      // Remove from tracking - find matching listener
      for (const [id, tracked] of tracker.listeners) {
        if (tracked.target === this && tracked.type === type && tracked.listener === listener) {
          tracker.listeners.delete(id);
          break;
        }
      }
      tracker.originalRemoveEventListener.call(this, type, listener, options);
    };
  }

  removeAll(): void {
    for (const tracked of this.listeners.values()) {
      try {
        this.originalRemoveEventListener.call(
          tracked.target,
          tracked.type,
          tracked.listener,
          tracked.options
        );
      } catch (e) {
        // Ignore errors during cleanup
      }
    }
    this.listeners.clear();
  }

  getActiveCount(): number {
    return this.listeners.size;
  }

  getActiveListeners(): TrackedListener[] {
    return Array.from(this.listeners.values());
  }

  logLeakedListeners(): void {
    if (this.listeners.size === 0) return;

    console.warn(`[LISTENER LEAK] ${this.listeners.size} listener(s) not cleaned up:`);
    for (const listener of this.listeners.values()) {
      const targetName = listener.target.constructor.name;
      console.warn(`  - ${listener.type} on ${targetName}`);
      console.warn(`    Stack: ${listener.stack.split('\n').slice(1, 3).join('\n')}`);
    }
  }

  reset(): void {
    this.removeAll();
  }
}

export const listenerTracker = new ListenerTracker();

export function installListenerTracking(): void {
  listenerTracker.install();
}

export function removeAllTrackedListeners(): void {
  listenerTracker.removeAll();
}

export function getActiveListenerCount(): number {
  return listenerTracker.getActiveCount();
}

export function logLeakedListeners(): void {
  listenerTracker.logLeakedListeners();
}
```

**Step 2: Commit listener tracker**

```bash
git add tests/listener-tracker.ts
git commit -m "feat: add event listener tracking registry"
```

---

### Task 6: Create DOM Cleanup Utilities

**Files:**
- Create: `tests/dom-cleanup.ts`

**Step 1: Implement DOM cleanup helpers**

```typescript
// tests/dom-cleanup.ts
export function cleanupPortals(): void {
  // Find all portal containers
  const portals = document.querySelectorAll('[data-portal-root], .modal-root, .drawer-root, .popover-root, .tooltip-root');

  portals.forEach(portal => {
    portal.remove();
  });
}

export function resetDocumentBody(): void {
  // Clear inline styles that might be left by scroll lock
  document.body.style.cssText = '';
  document.documentElement.style.cssText = '';

  // Remove any remaining child nodes except scripts
  const children = Array.from(document.body.children);
  children.forEach(child => {
    if (child.tagName !== 'SCRIPT') {
      child.remove();
    }
  });
}

export function countDetachedNodes(): number {
  // Note: This is a simplified implementation
  // JSDOM doesn't provide direct access to detached nodes like Chrome DevTools
  // We return 0 for now and can enhance with gc() if needed

  // In a real implementation, you might use:
  // - global.gc() if --expose-gc flag is set
  // - Heap snapshot analysis
  // For now, we'll return 0 as a placeholder
  return 0;
}

export function cleanupFramerMotion(): void {
  // Clear any Framer Motion related state
  // This is component-specific and will be enhanced in component audit phase

  // Cancel any ongoing animations by forcing all motion elements to finish
  const motionElements = document.querySelectorAll('[data-framer-component]');
  motionElements.forEach(el => {
    // Force animation to complete
    if (el instanceof HTMLElement) {
      el.style.transition = 'none';
    }
  });
}
```

**Step 2: Commit DOM cleanup**

```bash
git add tests/dom-cleanup.ts
git commit -m "feat: add DOM cleanup utilities"
```

---

## Phase 3: Enhanced Global Test Setup

### Task 7: Update Global Test Setup with Enhanced Cleanup

**Files:**
- Modify: `tests/setup.ts`
- Reference: `tests/timer-tracker.ts`, `tests/listener-tracker.ts`, `tests/dom-cleanup.ts`, `tests/memory-profiler.ts`

**Step 1: Add imports and install tracking**

```typescript
// Add these imports at the top of tests/setup.ts after existing imports
import {
  installTimerTracking,
  clearAllTrackedTimers,
  getActiveTimerCount,
  logLeakedTimers
} from './timer-tracker';
import {
  installListenerTracking,
  removeAllTrackedListeners,
  getActiveListenerCount,
  logLeakedListeners
} from './listener-tracker';
import {
  cleanupPortals,
  resetDocumentBody,
  cleanupFramerMotion
} from './dom-cleanup';
import { logMemoryUsage, captureBaseline } from './memory-profiler';

// Install tracking (add after expect.extend(matchers))
installTimerTracking();
installListenerTracking();

// Capture baseline before tests start (add after install calls)
captureBaseline();
```

**Step 2: Replace afterEach with enhanced cleanup**

Replace the existing `afterEach` block with:

```typescript
// Enhanced cleanup after each test
afterEach(() => {
  const errors: Error[] = [];

  try {
    // Timer cleanup
    vi.clearAllTimers();
    clearAllTrackedTimers();

    if (process.env.MEMORY_PROFILE === 'true') {
      const activeTimers = getActiveTimerCount();
      if (activeTimers > 0) {
        logLeakedTimers();
      }
    }
  } catch (e) {
    errors.push(new Error(`Timer cleanup failed: ${e}`));
  }

  try {
    // Event listener cleanup
    removeAllTrackedListeners();

    if (process.env.MEMORY_PROFILE === 'true') {
      const activeListeners = getActiveListenerCount();
      if (activeListeners > 0) {
        logLeakedListeners();
      }
    }
  } catch (e) {
    errors.push(new Error(`Event listener cleanup failed: ${e}`));
  }

  try {
    // Portal/DOM cleanup
    cleanupPortals();
    cleanupFramerMotion();
    resetDocumentBody();
  } catch (e) {
    errors.push(new Error(`DOM cleanup failed: ${e}`));
  }

  try {
    // React cleanup
    cleanup();
  } catch (e) {
    errors.push(new Error(`React cleanup failed: ${e}`));
  } finally {
    // Always restore mocks, even if cleanup failed
    vi.clearAllMocks();
    vi.restoreAllMocks();
  }

  if (errors.length > 0) {
    console.warn('Cleanup errors detected:', errors);
  }
});
```

**Step 3: Add beforeEach for memory logging**

Add before the afterEach block:

```typescript
// Memory profiling before each test
beforeEach(() => {
  logMemoryUsage('BEFORE_TEST');
});
```

**Step 4: Update afterEach to log memory**

Add at the end of the afterEach block (before the closing brace):

```typescript
  // Log memory usage after cleanup
  logMemoryUsage('AFTER_TEST');
```

**Step 5: Run tests to verify setup works**

```bash
npm test -- src/components/Button/Button.test.tsx
```

Expected: Tests pass with enhanced cleanup (no errors)

**Step 6: Run with memory profiling enabled**

```bash
MEMORY_PROFILE=true npm test -- src/components/Button/Button.test.tsx
```

Expected: Tests pass with memory logs showing BEFORE_TEST and AFTER_TEST

**Step 7: Commit enhanced setup**

```bash
git add tests/setup.ts
git commit -m "feat: enhance global test setup with aggressive cleanup"
```

---

## Phase 4: Test Utilities Layer

### Task 8: Create Test Utils with Custom Render

**Files:**
- Create: `tests/test-utils.tsx`

**Step 1: Create test utilities file**

```typescript
// tests/test-utils.tsx
import { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';

type CleanupFunction = () => void;

// Per-test cleanup registry
let cleanupCallbacks: CleanupFunction[] = [];

export function registerCleanup(fn: CleanupFunction): void {
  cleanupCallbacks.push(fn);
}

export function runRegisteredCleanup(): void {
  cleanupCallbacks.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Cleanup callback failed:', e);
    }
  });
  cleanupCallbacks = [];
}

// Enhanced render with automatic cleanup tracking
export function renderWithCleanup(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  // Track portal containers before render
  const portalsBefore = new Set(
    Array.from(document.querySelectorAll('[data-portal-root]')).map(el => el)
  );

  // Render component
  const result = render(ui, options);

  // Track new portals created during render
  const portalsAfter = new Set(
    Array.from(document.querySelectorAll('[data-portal-root]')).map(el => el)
  );

  const newPortals = Array.from(portalsAfter).filter(el => !portalsBefore.has(el));

  // Register portal cleanup
  if (newPortals.length > 0) {
    registerCleanup(() => {
      newPortals.forEach(portal => portal.remove());
    });
  }

  // Wrap unmount to include registered cleanup
  const originalUnmount = result.unmount;
  result.unmount = () => {
    runRegisteredCleanup();
    originalUnmount();
  };

  return result;
}

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Export our custom render as the default render
export { renderWithCleanup as render };
```

**Step 2: Commit test utilities**

```bash
git add tests/test-utils.tsx
git commit -m "feat: add test utilities with enhanced render"
```

---

### Task 9: Integrate Cleanup Registry with Global Setup

**Files:**
- Modify: `tests/setup.ts`

**Step 1: Import and call registered cleanup**

Add import:

```typescript
import { runRegisteredCleanup } from './test-utils';
```

Add to afterEach block (in the Portal/DOM cleanup try block, before cleanupPortals):

```typescript
    // Run any registered per-test cleanup
    runRegisteredCleanup();
```

**Step 2: Commit integration**

```bash
git add tests/setup.ts
git commit -m "feat: integrate cleanup registry with global setup"
```

---

### Task 10: Migrate Button Tests to Use New Test Utils

**Files:**
- Modify: `src/components/Button/Button.test.tsx`

**Step 1: Update imports in Button test**

Replace:

```typescript
import { render, screen } from '@testing-library/react';
```

With:

```typescript
import { render, screen } from '../../../tests/test-utils';
```

**Step 2: Run Button tests to verify**

```bash
npm test -- src/components/Button/Button.test.tsx
```

Expected: All tests pass

**Step 3: Run with memory profiling**

```bash
MEMORY_PROFILE=true npm test -- src/components/Button/Button.test.tsx
```

Expected: Tests pass with memory logs, no leaked timers/listeners

**Step 4: Commit Button test migration**

```bash
git add src/components/Button/Button.test.tsx
git commit -m "test: migrate Button tests to use enhanced test utils"
```

---

### Task 11: Migrate Box Tests

**Files:**
- Modify: `src/components/Box/Box.test.tsx`

**Step 1: Update imports**

Replace `@testing-library/react` import with `../../../tests/test-utils`

**Step 2: Run tests**

```bash
npm test -- src/components/Box/Box.test.tsx
```

Expected: All tests pass

**Step 3: Commit**

```bash
git add src/components/Box/Box.test.tsx
git commit -m "test: migrate Box tests to use enhanced test utils"
```

---

### Task 12: Migrate Typography Tests

**Files:**
- Modify: `src/components/Typography/Typography.test.tsx`

**Step 1: Update imports**

Replace `@testing-library/react` import with `../../../tests/test-utils`

**Step 2: Run tests**

```bash
npm test -- src/components/Typography/Typography.test.tsx
```

Expected: All tests pass

**Step 3: Commit**

```bash
git add src/components/Typography/Typography.test.tsx
git commit -m "test: migrate Typography tests to use enhanced test utils"
```

---

## Phase 5: Component Cleanup Audit

### Task 13: Audit and Fix Modal Component

**Files:**
- Read: `src/components/primitives/Modal/Modal.tsx`
- Modify: `src/components/primitives/Modal/Modal.tsx` (if leaks found)

**Step 1: Audit Modal for cleanup issues**

Check for:
- Event listeners (ESC key, click outside) - must be removed in useEffect cleanup
- Scroll lock - must be released in cleanup
- Portal cleanup - should be automatic via Portal component
- Focus trap - must be cleaned up

**Step 2: Fix any identified leaks**

Ensure all useEffect hooks return cleanup functions that remove:
- Event listeners
- Scroll locks
- Focus traps

**Step 3: Run Modal tests**

```bash
npm test -- src/components/primitives/Modal/Modal.test.tsx
```

Expected: Tests pass

**Step 4: Run with memory profiling**

```bash
MEMORY_PROFILE=true npm test -- src/components/primitives/Modal/Modal.test.tsx
```

Expected: No leaked listeners or timers

**Step 5: Migrate Modal tests**

Update imports in `src/components/primitives/Modal/Modal.test.tsx`:

```typescript
import { render, screen } from '../../../../tests/test-utils';
```

**Step 6: Commit Modal fixes and migration**

```bash
git add src/components/primitives/Modal/
git commit -m "fix: ensure Modal properly cleans up event listeners and scroll lock"
```

---

### Task 14: Audit and Fix Drawer Component

**Files:**
- Read: `src/components/primitives/Drawer/Drawer.tsx`
- Modify: `src/components/primitives/Drawer/Drawer.tsx` (if leaks found)
- Modify: `src/components/primitives/Drawer/Drawer.test.tsx`

**Step 1: Audit Drawer (same checks as Modal)**

**Step 2: Fix any identified leaks**

**Step 3: Migrate Drawer tests**

Update imports to use `../../../../tests/test-utils`

**Step 4: Run tests with profiling**

```bash
MEMORY_PROFILE=true npm test -- src/components/primitives/Drawer/Drawer.test.tsx
```

Expected: No leaks

**Step 5: Commit**

```bash
git add src/components/primitives/Drawer/
git commit -m "fix: ensure Drawer properly cleans up resources"
```

---

### Task 15: Audit and Fix Toast Component

**Files:**
- Read: `src/components/Toast/Toast.tsx`, `src/components/Toast/ToastProvider.tsx`, `src/components/Toast/useToast.tsx`
- Modify: `src/components/Toast/ToastProvider.tsx` (if leaks found)
- Modify: `src/components/Toast/Toast.test.tsx`

**Step 1: Audit Toast for timer cleanup**

Check:
- Auto-dismiss timers - must be cleared in useEffect cleanup
- Animation timers - must be cancelled

**Step 2: Ensure timers are cleared**

In ToastProvider or individual Toast component, ensure useEffect cleanup:

```typescript
useEffect(() => {
  if (duration && duration > 0) {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }
}, [duration, onDismiss]);
```

**Step 3: Migrate Toast tests**

Update imports in `src/components/Toast/Toast.test.tsx`

**Step 4: Run tests with profiling**

```bash
MEMORY_PROFILE=true npm test -- src/components/Toast/Toast.test.tsx
```

Expected: No leaked timers

**Step 5: Commit**

```bash
git add src/components/Toast/
git commit -m "fix: ensure Toast clears auto-dismiss timers"
```

---

### Task 16: Batch Migrate Remaining Component Tests

**Files:**
- Modify: All remaining `**/*.test.tsx` files

**Step 1: Create migration script**

```bash
# Find all test files that still import from @testing-library/react
grep -r "from '@testing-library/react'" src/components --include="*.test.tsx" -l > /tmp/tests-to-migrate.txt
```

**Step 2: Migrate each file**

For each file in the list, update the import from `@testing-library/react` to the appropriate relative path to `tests/test-utils`

**Step 3: Run full test suite**

```bash
npm run test:ci
```

Expected: All 57 test files pass

**Step 4: Commit batch migration**

```bash
git add src/
git commit -m "test: migrate all remaining tests to enhanced test utils"
```

---

## Phase 6: ESLint Rules and Documentation

### Task 17: Add ESLint Rules for Cleanup

**Files:**
- Modify: `.eslintrc.cjs`

**Step 1: Add no-restricted-syntax rule**

In the `rules` object, add:

```javascript
'no-restricted-syntax': [
  'warn',
  {
    selector: 'CallExpression[callee.property.name="addEventListener"]',
    message: 'Ensure addEventListener has corresponding removeEventListener in useEffect cleanup'
  }
],
```

**Step 2: Run linter on components**

```bash
npm run lint
```

Expected: Warnings for any addEventListener without cleanup

**Step 3: Commit ESLint rules**

```bash
git add .eslintrc.cjs
git commit -m "feat: add ESLint rule to enforce event listener cleanup"
```

---

### Task 18: Document Cleanup Patterns in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add cleanup patterns section**

Add after the "Common Patterns" section:

```markdown
### Memory Cleanup Patterns

**CRITICAL: All components must properly clean up resources to prevent memory leaks.**

**Event Listeners:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // handle event
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [dependencies]);
```

**Timers:**
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    // do something
  }, delay);

  return () => {
    clearTimeout(timer);
  };
}, [dependencies]);
```

**Intervals:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // do something
  }, delay);

  return () => {
    clearInterval(interval);
  };
}, [dependencies]);
```

**Animation Frames:**
```typescript
useEffect(() => {
  let rafId: number;

  const animate = () => {
    // animation logic
    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(rafId);
  };
}, [dependencies]);
```

**Scroll Lock (use useScrollLock hook):**
```typescript
import { useScrollLock } from '@/hooks/useScrollLock';

function MyComponent({ isOpen }: Props) {
  useScrollLock(isOpen); // Automatically cleans up

  return <div>...</div>;
}
```

**Memory Profiling:**

Run tests with memory profiling to detect leaks:

```bash
# Profile specific test file
MEMORY_PROFILE=true npm test -- src/components/MyComponent/MyComponent.test.tsx

# Capture heap snapshots for detailed analysis
MEMORY_PROFILE=true HEAP_SNAPSHOT=true npm test -- src/components/MyComponent/MyComponent.test.tsx
```

Heap snapshots are saved to `.heap-snapshots/` (gitignored).
```

**Step 2: Commit documentation**

```bash
git add CLAUDE.md
git commit -m "docs: add memory cleanup patterns to CLAUDE.md"
```

---

## Phase 7: Validation and Measurement

### Task 19: Run Full Test Suite in Single Process

**Files:**
- None (validation only)

**Step 1: Run standard test command**

```bash
npm test
```

Expected: All 57 test files pass without OOM errors

**Step 2: Monitor memory during run**

```bash
MEMORY_PROFILE=true npm test > test-memory-log.txt 2>&1
```

**Step 3: Analyze results**

Check test-memory-log.txt for:
- Any leaked timers warnings
- Any leaked listeners warnings
- Memory growth patterns

**Step 4: Document results**

Create a file documenting the outcome:

```bash
echo "## Test Suite Validation Results" > validation-results.md
echo "" >> validation-results.md
echo "Date: $(date)" >> validation-results.md
echo "Tests run: $(grep -c 'RUN' test-memory-log.txt)" >> validation-results.md
echo "Tests passed: $(grep -c '✓' test-memory-log.txt)" >> validation-results.md
echo "" >> validation-results.md
echo "Memory leaks detected: $(grep -c 'LEAK' test-memory-log.txt)" >> validation-results.md
```

---

### Task 20: Compare CI Times

**Files:**
- None (measurement only)

**Step 1: Time isolated test script**

```bash
time npm run test:ci > isolated-time.txt 2>&1
```

**Step 2: Time single process test run**

```bash
time npm test > single-process-time.txt 2>&1
```

**Step 3: Calculate improvement**

Compare the execution times and calculate percentage improvement

**Step 4: Document findings**

Add to validation-results.md:

```markdown
## Performance Comparison

- Isolated script time: [X seconds]
- Single process time: [Y seconds]
- Improvement: [Z%]
```

---

### Task 21: Create Testing Documentation

**Files:**
- Create: `docs/testing/memory-optimization.md`
- Create: `docs/testing/cleanup-patterns.md`

**Step 1: Create memory-optimization.md**

```markdown
# Memory Optimization in Tests

## Overview

This document explains the memory optimization infrastructure in our test suite.

## Architecture

Three-layer cleanup system:

1. **Global Test Setup** (`tests/setup.ts`) - Aggressive cleanup after each test
2. **Test Utilities** (`tests/test-utils.tsx`) - Per-test resource tracking
3. **Component Cleanup** - Proper cleanup in useEffect hooks

## Memory Profiling

### Basic Usage

```bash
MEMORY_PROFILE=true npm test
```

This enables:
- Memory usage logging before/after each test
- Leak warnings for timers and listeners
- Heap growth tracking

### Heap Snapshots

```bash
MEMORY_PROFILE=true HEAP_SNAPSHOT=true npm test
```

Snapshots saved to `.heap-snapshots/` for detailed analysis in Chrome DevTools.

## Troubleshooting Leaks

If you see leak warnings:

1. **Timer leaks**: Check setTimeout/setInterval are cleared
2. **Listener leaks**: Check addEventListener has removeEventListener
3. **Heap growth**: Capture heap snapshot and analyze in Chrome DevTools

## Implementation Details

- Timer tracking: `tests/timer-tracker.ts`
- Listener tracking: `tests/listener-tracker.ts`
- DOM cleanup: `tests/dom-cleanup.ts`
- Memory profiler: `tests/memory-profiler.ts`
```

**Step 2: Create cleanup-patterns.md**

```markdown
# Component Cleanup Patterns

## Event Listeners

Always remove event listeners in useEffect cleanup:

```typescript
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  window.addEventListener('keydown', handler);

  return () => {
    window.removeEventListener('keydown', handler);
  };
}, [onClose]);
```

## Timers

Always clear timers:

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    onDismiss();
  }, duration);

  return () => clearTimeout(timer);
}, [duration, onDismiss]);
```

## Scroll Lock

Use the useScrollLock hook which handles cleanup automatically:

```typescript
import { useScrollLock } from '@/hooks/useScrollLock';

function Modal({ isOpen }: Props) {
  useScrollLock(isOpen);
  // ...
}
```

## Portal Cleanup

Portals created via Portal component are automatically cleaned up.
If creating portals manually, ensure cleanup:

```typescript
useEffect(() => {
  const container = document.createElement('div');
  container.id = 'my-portal';
  document.body.appendChild(container);

  return () => {
    container.remove();
  };
}, []);
```

## Common Mistakes

❌ **Missing cleanup:**
```typescript
useEffect(() => {
  window.addEventListener('click', handler);
  // Missing cleanup!
}, []);
```

✅ **Proper cleanup:**
```typescript
useEffect(() => {
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, []);
```

❌ **Timer not cleared:**
```typescript
useEffect(() => {
  setTimeout(() => doSomething(), 1000);
  // Missing cleanup!
}, []);
```

✅ **Timer cleared:**
```typescript
useEffect(() => {
  const timer = setTimeout(() => doSomething(), 1000);
  return () => clearTimeout(timer);
}, []);
```
```

**Step 3: Commit documentation**

```bash
git add docs/testing/
git commit -m "docs: add memory optimization and cleanup pattern guides"
```

---

### Task 22: Final Validation and Cleanup

**Files:**
- None

**Step 1: Run full test suite one final time**

```bash
npm run test:ci
```

Expected: All 57 test files pass

**Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: No errors

**Step 3: Run linter**

```bash
npm run lint
```

Expected: No errors (warnings for addEventListener OK)

**Step 4: Clean up temporary files**

```bash
rm -f test-memory-log.txt isolated-time.txt single-process-time.txt
```

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: finalize test memory optimization implementation"
```

---

## Success Criteria Verification

After completing all tasks, verify:

- ✅ All 57 test files pass in `npm test` (single process)
- ✅ No OOM errors during test run
- ✅ MEMORY_PROFILE shows no leaked timers
- ✅ MEMORY_PROFILE shows no leaked listeners
- ✅ CI time improved vs isolated script
- ✅ Documentation complete

## Rollback Plan

If issues arise:
- Isolated test script remains at `scripts/run-tests-isolated.sh`
- Can revert to using `npm run test:ci`
- Memory profiling can be disabled (default off)
- Each component migration is independent commit

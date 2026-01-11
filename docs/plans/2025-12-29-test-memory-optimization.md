# Test Memory Optimization Design

**Date:** 2025-12-29
**Status:** Approved
**Goal:** Fix root cause memory leaks to enable running all tests in a single process

## Background

Tests were experiencing out-of-memory (OOM) errors when run together in a single process. Currently using an isolated test script (`scripts/run-tests-isolated.sh`) that runs each of 57 test files in separate vitest processes as a workaround. This prevents memory accumulation but is slower for CI/CD.

**Primary Goal:** Fix underlying memory leaks so all tests can run in single process
**Secondary Goal:** Add memory profiling to identify and prevent future leaks

## Architecture Overview

Three-layer cleanup system to eliminate memory leaks:

### Layer 1: Global Test Setup
Enhanced `tests/setup.ts` with aggressive cleanup orchestrator

### Layer 2: Test Utilities
Custom render wrapper in `tests/test-utils.tsx` that tracks resources per-test

### Layer 3: Component-Level Cleanup
Audit components for proper cleanup patterns + ESLint enforcement

### Memory Profiling Integration
Optional profiling to measure improvements and catch regressions

---

## Layer 1: Global Test Setup Details

**File:** `tests/setup.ts`

Transform the `afterEach` hook into a comprehensive cleanup orchestrator using try-catch-finally pattern:

```typescript
afterEach(() => {
  const errors: Error[] = [];

  try {
    // Timer cleanup
    vi.clearAllTimers();
    clearAllTrackedTimers();
  } catch (e) {
    errors.push(new Error(`Timer cleanup failed: ${e}`));
  }

  try {
    // Event listener cleanup
    removeAllTrackedListeners();
  } catch (e) {
    errors.push(new Error(`Event listener cleanup failed: ${e}`));
  }

  try {
    // Portal/DOM cleanup
    cleanupPortals();
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

**Timer Cleanup:**
- Track all `setTimeout`, `setInterval`, `requestAnimationFrame` calls
- Clear any pending timers after each test
- Detect leaked timers and log warnings

**Event Listener Tracking:**
- Wrap `addEventListener`/`removeEventListener` to maintain a registry
- Track listeners on `window`, `document`, and DOM nodes
- Auto-remove any listeners not cleaned up by test end
- Log warnings for leaked listeners with stack traces

**Portal/DOM Cleanup:**
- Find and remove all portal containers (`[data-portal-root]`, `.modal-root`, etc.)
- Clear any detached DOM nodes that JSDOM might retain
- Reset `document.body` to clean state
- Clear inline styles on body/html (scroll lock remnants)

**Framer Motion Cleanup:**
- Clear motion value subscriptions
- Cancel pending animations
- Reset animation state

**Mock Reset Strategy:**
- `vi.clearAllMocks()` - Clear call history
- `vi.clearAllTimers()` - Handle fake timers
- `vi.restoreAllMocks()` - Reset implementations
- Clear `console` method spies if used

---

## Layer 2: Test Utilities Details

**File:** `tests/test-utils.tsx`

Create enhanced render wrapper with automatic resource tracking:

```typescript
export function renderWithCleanup(ui: ReactElement, options?: RenderOptions) {
  const cleanup = [];

  // Track this render's resources
  const result = render(ui, options);

  // Register portal containers created during render
  trackPortalContainers();

  // Wrap result.unmount to ensure cleanup
  const originalUnmount = result.unmount;
  result.unmount = () => {
    cleanup.forEach(fn => fn());
    originalUnmount();
  };

  return result;
}
```

**Per-Test Resource Tracking:**
- Timer registry: Track timers created during this specific test
- Event listener map: Store listeners added during this test
- Portal container set: Track portal divs created during this render
- Animation frame IDs: Track RAF calls per test

**Cleanup Callback System:**
- Tests can register custom cleanup: `registerCleanup(() => clearMyResource())`
- All callbacks run when test completes
- Useful for WebSocket connections, intervals, subscriptions

**Re-export Testing Library:**
```typescript
export * from '@testing-library/react';
export { renderWithCleanup as render };
```

This makes adoption seamless - change import, get tracking automatically.

---

## Layer 3: Component-Level Cleanup & Linting

**Component Cleanup Audit:**

Systematically review all components for proper cleanup patterns.

**Target Components:**
- Components with timers: Toast (auto-dismiss), animations
- Components with event listeners: Modal/Drawer (ESC key, click outside), SearchCommand, Navigation
- Components with scroll lock: Modal, Drawer
- Components with portals: Portal, Modal, Drawer, Popover, Tooltip
- Components with subscriptions: Any using context or external state

**Required Pattern:**
```typescript
useEffect(() => {
  const listener = (e) => handleEvent(e);
  window.addEventListener('keydown', listener);

  return () => {
    window.removeEventListener('keydown', listener);
  };
}, [deps]);
```

**ESLint Rule Configuration:**

Add to `.eslintrc.cjs`:

```json
{
  "rules": {
    "react-hooks/exhaustive-deps": "error",
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "CallExpression[callee.property.name='addEventListener']",
        "message": "Ensure addEventListener has corresponding removeEventListener in useEffect cleanup"
      }
    ]
  }
}
```

**Documentation:**
- Add cleanup checklist to `CLAUDE.md` under component creation patterns
- Document common leak patterns to avoid
- Create examples of proper cleanup for each resource type

---

## Memory Profiling Integration

**Heap Snapshot Comparison:**

Add optional memory profiling to detect leaks during test runs.

**Memory Profiler Class:**

```typescript
// tests/memory-profiler.ts
class MemoryProfiler {
  private baseline: MemorySnapshot | null = null;
  private testSnapshots = new Map<string, MemorySnapshot>();

  captureBaseline() {
    this.baseline = this.snapshot();
  }

  compareToBaseline(label: string): MemoryDelta {
    const current = this.snapshot();
    const delta = this.calculateDelta(this.baseline, current);

    return {
      heapGrowth: delta.heapUsed,
      detachedNodes: countDetachedNodes(),
      activeListeners: getActiveListenerCount(),
      activeTimers: getActiveTimerCount(),
      label
    };
  }
}
```

**Detailed Leak Detection:**
- Count detached DOM nodes using JSDOM internals
- Track active event listeners from wrapper registry
- Count pending timers/RAF calls
- Identify which object types are growing (V8 heap profiler)

**Automatic Threshold Checking:**
```typescript
const THRESHOLDS = {
  heapGrowth: 10 * 1024 * 1024, // 10MB
  detachedNodes: 5,
  activeListeners: 0,
  activeTimers: 0
};

function checkLeaks(delta: MemoryDelta) {
  const leaks = [];
  if (delta.heapGrowth > THRESHOLDS.heapGrowth)
    leaks.push(`Heap grew ${delta.heapGrowth}MB`);
  if (delta.detachedNodes > THRESHOLDS.detachedNodes)
    leaks.push(`${delta.detachedNodes} detached nodes`);
  if (delta.activeListeners > 0)
    leaks.push(`${delta.activeListeners} leaked listeners`);
  if (delta.activeTimers > 0)
    leaks.push(`${delta.activeTimers} leaked timers`);

  return leaks;
}
```

**Integration in setup.ts:**
```typescript
beforeEach(() => {
  logMemoryUsage('BEFORE_TEST');
});

afterEach(() => {
  // ... all cleanup ...
  logMemoryUsage('AFTER_TEST');
});
```

**V8 Heap Snapshots (opt-in):**
```typescript
import v8 from 'v8';

export function captureHeapSnapshot(filename: string) {
  if (process.env.HEAP_SNAPSHOT === 'true') {
    const snapshot = v8.writeHeapSnapshot(filename);
    console.log(`Heap snapshot written to ${snapshot}`);
  }
}
```

**Usage:**
```bash
# Run tests with memory profiling
MEMORY_PROFILE=true npm test

# Run with heap snapshots
MEMORY_PROFILE=true HEAP_SNAPSHOT=true npm test

# Profile specific file
MEMORY_PROFILE=true npx vitest Button.test.tsx
```

**CI Integration:**
- Add optional memory profiling job to GitHub Actions
- Fail if any test file leaks beyond threshold
- Track memory trends over time

---

## Implementation Strategy

**Phase 1: Foundation (Non-breaking)**
1. Create memory profiler utilities
2. Create timer/event listener tracking wrappers
3. Add enhanced cleanup to `tests/setup.ts`
4. Baseline memory measurements on current tests

**Phase 2: Test Utilities**
1. Create `tests/test-utils.tsx` with `renderWithCleanup()`
2. Migrate 2-3 simple components as proof of concept (Button, Box, Typography)
3. Verify memory improvements on migrated tests
4. Document migration pattern

**Phase 3: Component Audit**
1. Systematically audit all components for cleanup issues
2. Fix identified leaks in components themselves
3. Migrate remaining tests to use test-utils
4. Add ESLint rules

**Phase 4: Validation**
1. Run full test suite with memory profiling
2. Attempt to run all tests in single process (goal!)
3. Compare CI times: isolated script vs single process
4. Document results

---

## Success Criteria

**Primary Goal:**
- All 57 test files pass in single `npm test` run without OOM errors

**Secondary Goals:**
- Heap growth per test file < 10MB
- Zero detached DOM nodes after cleanup
- Zero leaked event listeners
- Zero leaked timers
- CI test time improves by 30%+ (single process vs isolated)

**Rollback Plan:**
- Keep isolated test script as fallback
- Each phase can be reverted independently
- Memory profiling can be disabled via env var

---

## Documentation Updates

**CLAUDE.md additions:**
- Cleanup patterns checklist for new components
- Common memory leak patterns to avoid
- Examples of proper cleanup for each resource type
- Memory profiling usage guide

**New Documentation:**
- `docs/testing/memory-optimization.md` - Detailed guide
- `docs/testing/cleanup-patterns.md` - Component cleanup examples

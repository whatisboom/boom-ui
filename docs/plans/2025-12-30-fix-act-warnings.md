# Fix act() Warnings in Tests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate all act() warnings from test suite by wrapping state-triggering actions in React Testing Library's `act()` function.

**Architecture:** Direct inline wrapping approach - import `act` from `@testing-library/react` and wrap each state-triggering action (DOM events, keyboard interactions, requestAnimationFrame calls) that causes React state updates during tests.

**Tech Stack:** React Testing Library, Vitest, @testing-library/user-event

---

## Task 1: Fix Avatar.test.tsx act() Warnings (2 warnings)

**Files:**
- Modify: `src/components/Avatar/Avatar.test.tsx:2` (import statement)
- Modify: `src/components/Avatar/Avatar.test.tsx:17-30` (error event test)
- Modify: `src/components/Avatar/Avatar.test.tsx:131-143` (load event test)

**Step 1: Add act to imports**

Update line 2 to include `act`:

```typescript
import { render, screen, waitFor, act } from '@testing-library/react';
```

**Step 2: Wrap dispatchEvent in "should render initials when src fails to load" test**

Replace lines 24-25:

```typescript
    // Trigger error
    act(() => {
      img.dispatchEvent(new Event('error'));
    });
```

The `waitFor` on lines 27-29 stays as-is (assertions remain outside act).

**Step 3: Wrap dispatchEvent in "should show image when loaded successfully" test**

Replace lines 136-137:

```typescript
    // Simulate successful load
    act(() => {
      img.dispatchEvent(new Event('load'));
    });
```

The `waitFor` on lines 139-142 stays as-is.

**Step 4: Run Avatar tests to verify warnings are gone**

```bash
npx vitest src/components/Avatar/Avatar.test.tsx
```

Expected: All tests pass, no act() warnings in stderr

**Step 5: Commit**

```bash
git add src/components/Avatar/Avatar.test.tsx
git commit -m "Fix act() warnings in Avatar tests"
```

---

## Task 2: Fix Tree.test.tsx act() Warnings (6 warnings)

**Files:**
- Modify: `src/components/Tree/Tree.test.tsx:2` (import statement)
- Modify: `src/components/Tree/Tree.test.tsx:163-172` (ArrowDown test)
- Modify: `src/components/Tree/Tree.test.tsx:174-183` (ArrowUp test)
- Modify: `src/components/Tree/Tree.test.tsx:185-194` (skip disabled ArrowDown test)
- Modify: `src/components/Tree/Tree.test.tsx:196-205` (skip disabled ArrowUp test)
- Modify: `src/components/Tree/Tree.test.tsx:208-217` (Home key test)
- Modify: `src/components/Tree/Tree.test.tsx:243-253` (ArrowRight test)

**Step 1: Add act to imports**

Update line 2 to include `act`:

```typescript
import { render, screen, act } from '@testing-library/react';
```

**Step 2: Wrap userEvent.keyboard in "should move focus to next item with ArrowDown"**

Replace line 169:

```typescript
    await act(async () => {
      await userEvent.keyboard('{ArrowDown}');
    });
```

**Step 3: Wrap userEvent.keyboard in "should move focus to previous item with ArrowUp"**

Replace line 180:

```typescript
    await act(async () => {
      await userEvent.keyboard('{ArrowUp}');
    });
```

**Step 4: Wrap userEvent.keyboard in "should skip disabled items with ArrowDown"**

Replace line 191:

```typescript
    await act(async () => {
      await userEvent.keyboard('{ArrowDown}');
    });
```

**Step 5: Wrap userEvent.keyboard in "should skip disabled items with ArrowUp"**

Replace line 202:

```typescript
    await act(async () => {
      await userEvent.keyboard('{ArrowUp}');
    });
```

**Step 6: Wrap userEvent.keyboard in "should move focus to first item with Home"**

Replace line 214:

```typescript
    await act(async () => {
      await userEvent.keyboard('{Home}');
    });
```

**Step 7: Wrap userEvent.keyboard in "should not expand item without children with ArrowRight"**

Replace line 250:

```typescript
    await act(async () => {
      await userEvent.keyboard('{ArrowRight}');
    });
```

**Step 8: Run Tree tests to verify warnings are gone**

```bash
npx vitest src/components/Tree/Tree.test.tsx
```

Expected: All tests pass, no act() warnings in stderr

**Step 9: Commit**

```bash
git add src/components/Tree/Tree.test.tsx
git commit -m "Fix act() warnings in Tree tests"
```

---

## Task 3: Fix Popover.test.tsx act() Warnings (4 warnings)

**Files:**
- Modify: `src/components/primitives/Popover/Popover.test.tsx:2` (import statement)
- Modify: `src/components/primitives/Popover/Popover.test.tsx:58-127` (position test)

**Step 1: Add act to imports**

Update line 2 to include `act`:

```typescript
import { render, screen, fireEvent, act } from '@testing-library/react';
```

**Step 2: Wrap first requestAnimationFrame wait (bottom placement)**

Replace lines 84-85:

```typescript
    // Wait for requestAnimationFrame to complete
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
```

**Step 3: Wrap second requestAnimationFrame wait (top placement)**

Replace lines 99-100:

```typescript
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
```

**Step 4: Wrap third requestAnimationFrame wait (left placement)**

Replace lines 110-111:

```typescript
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
```

**Step 5: Wrap fourth requestAnimationFrame wait (right placement)**

Replace lines 121-122:

```typescript
    await act(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    });
```

**Step 6: Run Popover tests to verify warnings are gone**

```bash
npx vitest src/components/primitives/Popover/Popover.test.tsx
```

Expected: All tests pass, no act() warnings in stderr

**Step 7: Commit**

```bash
git add src/components/primitives/Popover/Popover.test.tsx
git commit -m "Fix act() warnings in Popover tests"
```

---

## Task 4: Verify All Warnings Are Fixed

**Step 1: Count act() warnings before verification**

```bash
npm test 2>&1 | grep -i "act()" | wc -l
```

Expected: 0 (no warnings)

**Step 2: Run full test suite**

```bash
npm test
```

Expected: All tests pass with no act() warnings in output

**Step 3: Check test coverage remains unchanged**

```bash
npm run test:coverage
```

Expected: Coverage percentages remain at or above 80% threshold

**Step 4: Final verification - search for any remaining warnings**

```bash
npm test 2>&1 | grep -i "act()"
```

Expected: No output (empty result = no warnings found)

**Step 5: Document completion**

Success criteria met:
- ✅ Zero act() warnings in test output
- ✅ All tests passing
- ✅ Test coverage unchanged
- ✅ No behavioral changes to components

---

## Notes

**Pattern Summary:**
- Synchronous events: `act(() => { /* sync code */ })`
- Async events: `await act(async () => { await /* async code */ })`
- Keep assertions OUTSIDE act() wrappers
- Only wrap state-triggering actions, not the assertions

**Total Changes:**
- 3 files modified
- 12 act() wrappers added
- 3 import statements updated

**Rollback:**
If any test fails after changes, remove the act() wrapper from that specific test and investigate whether there's an underlying component timing issue.

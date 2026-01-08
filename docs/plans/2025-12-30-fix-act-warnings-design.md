# Fix act() Warnings in Tests

**Date:** 2025-12-30
**Status:** Approved for Implementation

## Problem Analysis

React Testing Library shows act() warnings when React state updates occur during tests without the testing library being aware of them. Three components are affected:

### Affected Components

1. **Avatar Component (2 warnings)**
   - Trigger: `dispatchEvent(new Event('error'))` and `dispatchEvent(new Event('load'))`
   - Issue: Image events trigger state changes (switching between image/initials display)
   - Location: Avatar.test.tsx lines 25 and 137

2. **Tree Component (6 warnings)**
   - Trigger: `userEvent.keyboard()` calls
   - Issue: Keyboard navigation updates focus state and expanded/collapsed state
   - Location: Multiple keyboard navigation tests (ArrowUp, ArrowDown, Home, ArrowRight)

3. **Popover Component (4 warnings)**
   - Trigger: `requestAnimationFrame` for positioning calculations
   - Issue: RAF callbacks execute outside React's update cycle, triggering position state updates
   - Location: Popover.test.tsx lines 85, 99, 110, 121

## Solution

Wrap each state-triggering action in `act()` from `@testing-library/react` using direct imports and inline wrapping for maximum clarity.

### Import Changes

Add `act` to existing imports in each affected file:

```typescript
// Avatar.test.tsx & Popover.test.tsx
import { render, screen, waitFor, act } from '@testing-library/react';

// Tree.test.tsx
import { render, screen, act } from '@testing-library/react';
```

### Wrapping Patterns

**Avatar Component:**
```typescript
// Synchronous dispatchEvent
act(() => {
  img.dispatchEvent(new Event('error'));
});

// With waitFor
act(() => {
  img.dispatchEvent(new Event('load'));
});
await waitFor(() => {
  expect(img).toBeVisible();
});
```

**Tree Component:**
```typescript
// Async userEvent calls
await act(async () => {
  await userEvent.keyboard('{ArrowDown}');
});
```

**Popover Component:**
```typescript
// RAF with act wrapping
await act(async () => {
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
});
```

### Test Modifications

**Avatar.test.tsx (2 tests):**
- "should render initials when src fails to load" - wrap line 25
- "should show image when loaded successfully" - wrap line 137

**Tree.test.tsx (6 tests):**
- "should move focus to next item with ArrowDown" - wrap line 169
- "should move focus to previous item with ArrowUp" - wrap line 180
- "should skip disabled items with ArrowDown" - wrap line 191
- "should skip disabled items with ArrowUp" - wrap line 202
- "should move focus to first item with Home" - wrap line 214
- "should not expand item without children with ArrowRight" - wrap line 250

**Popover.test.tsx (4 RAF waits in 1 test):**
- "should position popover correctly based on placement" - wrap lines 85, 99, 110, 121

**Total:** 12 wrapping points across 9 tests

## Verification

1. Run full test suite and capture current warnings:
   ```bash
   npm test 2>&1 | grep -i "act()" | wc -l
   ```

2. Apply fixes to each component test file

3. Run tests again and verify zero warnings:
   ```bash
   npm test 2>&1 | grep -i "act()"
   ```

4. Ensure all tests still pass:
   ```bash
   npm test
   ```

## Success Criteria

- Zero act() warnings in test output
- All tests passing (same count as before)
- No change in test coverage percentage
- No behavioral changes to component logic

## Rollback Plan

If wrapping causes test failures:
- Remove act() wrapper from failing test
- Investigate if component has actual timing issue
- Consider alternative: add `waitFor` around assertions instead

## Edge Cases

- Tests that might become flaky if timing changes
- Tests with multiple async operations in sequence
- Ensure `act()` doesn't mask real component bugs

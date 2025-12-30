# Fix SearchCommand Infinite Loop

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix infinite loop in SearchCommand's WithLoading story caused by unstable callback references triggering useEffect repeatedly.

**Architecture:** The problem has two parts: (1) SearchCommand.tsx includes onSearch in useEffect dependencies, causing re-runs when callback reference changes, and (2) WithLoading story recreates handleSearch function on every render. Fix both for robustness.

**Tech Stack:** React, TypeScript, Vitest, Storybook

---

## Task 1: Fix SearchCommand Component useEffect Dependencies

**Files:**
- Modify: `src/components/SearchCommand/SearchCommand.tsx:28-32`

**Step 1: Remove onSearch from useEffect dependency array**

In `src/components/SearchCommand/SearchCommand.tsx`, change lines 28-32 from:

```typescript
useEffect(() => {
  if (debouncedQuery) {
    onSearch(debouncedQuery);
  }
}, [debouncedQuery, onSearch]);
```

To:

```typescript
useEffect(() => {
  if (debouncedQuery) {
    onSearch(debouncedQuery);
  }
}, [debouncedQuery]);
```

**Rationale:** We only want to trigger search when `debouncedQuery` changes, not when the callback reference changes. The latest `onSearch` will always be called due to closure.

**Step 2: Verify no TypeScript errors**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit the component fix**

```bash
git add src/components/SearchCommand/SearchCommand.tsx
git commit -m "fix: remove onSearch from useEffect deps to prevent infinite loops"
```

---

## Task 2: Fix WithLoading Story with useCallback

**Files:**
- Modify: `src/components/SearchCommand/SearchCommand.stories.tsx:1,174-186`

**Step 1: Add useCallback to imports**

In `src/components/SearchCommand/SearchCommand.stories.tsx`, change line 1 from:

```typescript
import { useState } from 'react';
```

To:

```typescript
import { useState, useCallback } from 'react';
```

**Step 2: Wrap handleSearch in useCallback**

In the `WithLoading` story (around line 174), change:

```typescript
const handleSearch = (query: string) => {
  setIsLoading(true);
  // Simulate API delay
  setTimeout(() => {
    const filtered = sampleResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setIsLoading(false);
  }, 1000);
};
```

To:

```typescript
const handleSearch = useCallback((query: string) => {
  setIsLoading(true);
  // Simulate API delay
  setTimeout(() => {
    const filtered = sampleResults.filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setIsLoading(false);
  }, 1000);
}, []); // Empty deps - sampleResults is a const, setResults/setIsLoading are stable
```

**Step 3: Verify no TypeScript errors**

Run: `npm run typecheck`
Expected: No errors

**Step 4: Commit the story fix**

```bash
git add src/components/SearchCommand/SearchCommand.stories.tsx
git commit -m "fix: use useCallback in WithLoading story to prevent recreation"
```

---

## Task 3: Manual Testing in Storybook

**Step 1: Start Storybook**

Run: `npm run storybook`
Expected: Storybook opens at http://localhost:6006

**Step 2: Navigate to WithLoading story**

Navigate to: SearchCommand > WithLoading

**Step 3: Test for infinite loop**

1. Click "Open Search Command" button
2. Type a search query (e.g., "home")
3. Open browser DevTools console
4. Verify:
   - Loading state appears for 1 second
   - Results appear after delay
   - No repeated console logs indicating re-renders
   - No browser freezing or performance issues

**Step 4: Test keyboard navigation**

1. Use arrow keys to navigate results
2. Press Enter to select
3. Press Esc to close
4. Verify all interactions work smoothly

**Step 5: Close Storybook**

Press Ctrl+C in terminal running Storybook

---

## Task 4: Verify Tests Still Pass

**Step 1: Run component tests**

Run: `npm test SearchCommand`
Expected: All SearchCommand tests pass

**Step 2: Run full test suite**

Run: `npm test`
Expected: All tests pass with ≥80% coverage

---

## Summary

This plan fixes the infinite loop by:
1. Removing `onSearch` from useEffect dependencies in the component (makes it resilient to unstable callbacks)
2. Using `useCallback` in the story (follows React best practices)

Both changes ensure the search only triggers when `debouncedQuery` changes, not when callback references change.

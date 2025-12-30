# PR #1 Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Systematically fix all blocking issues in PR #1 (TypeScript violations, lint errors, ARIA issues, test failures) to make it merge-ready.

**Architecture:** Direct fixes to existing code - replace `any` type assertions with proper generics, update ESLint config, fix imports, diagnose and resolve test environment issues.

**Tech Stack:** TypeScript, React, react-hook-form, Zod, ESLint, Vitest

---

## Task 1: Environment Verification

**Files:**
- Check: `node_modules/` directory existence
- Check: `package-lock.json` status

**Step 1: Verify we're in the worktree**

Run: `pwd`
Expected: `/Users/brandon/projects/boom-ui/.worktrees/storybook-restructure`

**Step 2: Check if node_modules exists**

Run: `ls -la | grep node_modules`
Expected: Directory exists or is symlinked

**Step 3: Check for duplicate React**

Run: `npm ls react react-dom`
Expected: Single version of each package, no duplicates or peer dependency warnings

**Step 4: If node_modules is missing or has issues, reinstall**

Run: `npm install`
Expected: Clean installation with no errors

**Step 5: Verify basic TypeScript compilation works**

Run: `npm run typecheck 2>&1 | head -20`
Expected: May have errors (we'll fix them), but should complete without crashing

---

## Task 2: Fix TypeScript `any` Violations in Form Component

**Files:**
- Modify: `src/components/Form/Form.tsx:27-28,45`

**Context:** The Form component uses `as any` type assertions in three places to bypass type checking between Zod schemas and react-hook-form types. We need to fix these properly.

**Step 1: Fix zodResolver type assertion (line 27)**

Replace line 27:
```typescript
resolver: zodResolver(schema as any) as any,
```

With:
```typescript
resolver: zodResolver(schema),
```

**Why:** `zodResolver` is already typed to accept `z.ZodType`, so the schema doesn't need casting.

**Step 2: Fix defaultValues type assertion (line 28)**

Replace line 28:
```typescript
defaultValues: defaultValues as any,
```

With:
```typescript
defaultValues: defaultValues as Partial<FormValues>,
```

**Why:** `defaultValues` is already typed as `Partial<z.infer<TSchema>>` in FormProps, which matches what useForm expects after we infer FormValues.

**Step 3: Fix FormContext.Provider type assertion (line 45)**

Replace line 45:
```typescript
<FormContext.Provider value={{ form: form as any, isSubmitting: form.formState.isSubmitting }}>
```

With:
```typescript
<FormContext.Provider value={{ form: form as UseFormReturn<FieldValues>, isSubmitting: form.formState.isSubmitting }}>
```

**Why:** The FormContext expects `UseFormReturn<TFieldValues>` where `TFieldValues extends FieldValues`. Since `FormValues` is inferred from Zod and extends `FieldValues`, we cast to the base type that FormContext expects. This is a proper type assertion (not `any`) that maintains type safety.

**Step 4: Add missing import**

Add to the imports at the top of the file (line 2):
```typescript
import { useForm, FieldValues, UseFormReturn } from 'react-hook-form';
```

(Replace the existing line 2 to include `UseFormReturn`)

**Step 5: Verify TypeScript compilation**

Run: `npm run typecheck 2>&1 | grep -A 5 "Form.tsx"`
Expected: No errors related to Form.tsx

---

## Task 3: Remove Redundant ARIA Attribute

**Files:**
- Modify: `src/components/Form/Form.tsx:48`

**Step 1: Remove redundant role attribute**

Replace line 48:
```typescript
role="form"
```

Remove this attribute entirely. The line should become:
```typescript
      <form
        ref={ref}
        onSubmit={handleFormSubmit}
        className={cn(styles.form, className)}
```

**Step 2: Verify ESLint no longer complains**

Run: `npm run lint 2>&1 | grep "no-redundant-roles"`
Expected: No output (error is gone)

**Step 3: Commit Form.tsx fixes**

```bash
git add src/components/Form/Form.tsx
git commit -m "fix: replace TypeScript any types with proper generics and remove redundant ARIA role"
```

---

## Task 4: Disable prop-types ESLint Rule

**Files:**
- Modify: `.eslintrc.cjs:13-20`

**Step 1: Add prop-types disable rule**

In `.eslintrc.cjs`, modify the `rules` section (starting at line 13):

```javascript
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off', // TypeScript provides type checking
    '@typescript-eslint/no-explicit-any': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
```

**Step 2: Verify lint errors are gone**

Run: `npm run lint 2>&1 | grep "prop-types"`
Expected: No output (all prop-types errors gone)

**Step 3: Commit ESLint config**

```bash
git add .eslintrc.cjs
git commit -m "chore: disable prop-types ESLint rule for TypeScript project"
```

---

## Task 5: Fix Storybook Import in EmptyState Stories

**Files:**
- Modify: `src/components/EmptyState/EmptyState.stories.tsx:1`

**Step 1: Update import to use framework package**

Replace line 1:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
```

With:
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
```

**Step 2: Verify no lint errors**

Run: `npm run lint 2>&1 | grep "EmptyState.stories"`
Expected: No output

**Step 3: Commit EmptyState stories fix**

```bash
git add src/components/EmptyState/EmptyState.stories.tsx
git commit -m "fix: update Storybook imports to use framework package in EmptyState"
```

---

## Task 6: Fix Storybook Import in Form Stories

**Files:**
- Modify: `src/components/Form/Form.stories.tsx:1`

**Step 1: Update import to use framework package**

Replace line 1:
```typescript
import type { Meta, StoryObj } from '@storybook/react';
```

With:
```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
```

**Step 2: Verify no lint errors**

Run: `npm run lint 2>&1 | grep "Form.stories"`
Expected: No output

**Step 3: Commit Form stories fix**

```bash
git add src/components/Form/Form.stories.tsx
git commit -m "fix: update Storybook imports to use framework package in Form"
```

---

## Task 7: Verify All Lint Errors Are Fixed

**Files:**
- Verify: All source files

**Step 1: Run full lint check**

Run: `npm run lint`
Expected: No errors (exit code 0)

**Step 2: If any errors remain, document them**

If there are errors:
```bash
npm run lint > lint-errors.txt 2>&1
cat lint-errors.txt
```

Review and determine if additional fixes are needed.

---

## Task 8: Diagnose Test Failures

**Files:**
- Check: Test environment setup
- Check: `vitest.config.ts`
- Check: `package.json` test scripts

**Step 1: Run a single simple test**

Run: `npx vitest src/components/Button/Button.test.tsx --run 2>&1 | tail -30`
Expected: Check if this single test passes or has the same React hooks error

**Step 2: Check if tests are finding React**

Run: `node -e "console.log(require.resolve('react'))"`
Expected: Path to React module

**Step 3: Check for multiple React instances in node_modules**

Run: `find node_modules -name "package.json" -path "*/react/package.json" | wc -l`
Expected: Should be 1 (only one React installation)

**Step 4: If multiple React found, dedupe**

Run: `npm dedupe`
Then: `npm install`

**Step 5: Try running tests again after dedupe**

Run: `npm test 2>&1 | tail -50`
Expected: Check if test failures persist

---

## Task 9: Fix Test Environment If Still Failing

**Files:**
- Potentially: `node_modules/` (reinstall)
- Potentially: `vitest.config.ts` (check React setup)

**Step 1: If tests still fail, check vitest config**

Run: `cat vitest.config.ts | grep -A 10 "resolve"`
Expected: Verify React is properly configured

**Step 2: Nuclear option - clean reinstall**

If tests are still failing with React hooks errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Step 3: Run tests after clean install**

Run: `npm test 2>&1 | tail -50`
Expected: Check results

**Step 4: If still failing, run tests with verbose React error**

Run: `NODE_ENV=development npm test -- --reporter=verbose 2>&1 | grep -A 20 "TypeError.*useRef\|TypeError.*useState" | head -40`

This will show more context about where React is null.

**Step 5: Check if issue is worktree-specific**

Run in main directory:
```bash
cd /Users/brandon/projects/boom-ui
git stash
git checkout feature/storybook-restructure
npm test 2>&1 | tail -50
```

If tests pass in main directory but not worktree, it's a worktree-specific issue.

---

## Task 10: Document Test Findings

**Files:**
- Create: `test-diagnosis.md` (temporary diagnostic file)

**Step 1: Document what we found**

Create a summary of:
- Whether tests pass or fail
- What the specific error is
- Which approach fixed it (dedupe, reinstall, worktree issue, etc.)

**Step 2: If tests are passing, delete diagnostic file**

Run: `rm -f test-diagnosis.md`

**Step 3: If tests pass, run full suite with coverage**

Run: `npm run test:coverage`
Expected: All tests pass, coverage ≥80%

---

## Task 11: Final Verification - TypeScript

**Files:**
- Verify: All TypeScript files

**Step 1: Run full type check**

Run: `npm run typecheck`
Expected: Exit code 0, no errors

**Step 2: Verify Form component specifically**

Run: `npx tsc --noEmit src/components/Form/Form.tsx`
Expected: No errors

---

## Task 12: Final Verification - Lint

**Files:**
- Verify: All source files

**Step 1: Run full lint**

Run: `npm run lint`
Expected: Exit code 0, no errors

**Step 2: Count remaining issues (should be 0)**

Run: `npm run lint 2>&1 | grep "error" | wc -l`
Expected: 0

---

## Task 13: Final Verification - Build

**Files:**
- Verify: Build output

**Step 1: Run production build**

Run: `npm run build`
Expected: Build completes successfully

**Step 2: Check build output exists**

Run: `ls -la dist/`
Expected: dist/ directory with compiled files

**Step 3: Run Storybook build**

Run: `npm run build-storybook`
Expected: Build completes, storybook-static/ directory created

---

## Task 14: Final Verification - All Tests

**Files:**
- Verify: All test files

**Step 1: Run complete test suite**

Run: `npm test`
Expected: All tests pass (1280+ passing, 0 failing)

**Step 2: Verify no test failures**

Run: `npm test 2>&1 | grep "FAIL"`
Expected: No output (no failures)

**Step 3: Confirm test counts**

Run: `npm test 2>&1 | grep "Test Files"`
Expected: Shows passing count, 0 failed

---

## Task 15: Create Summary Commit (If Needed)

**Files:**
- Check: Git status

**Step 1: Check if all changes are committed**

Run: `git status`
Expected: Clean working tree OR only test-diagnosis.md uncommitted

**Step 2: If diagnostic file exists, remove it**

Run: `rm -f test-diagnosis.md`

**Step 3: Verify clean status**

Run: `git status`
Expected: "nothing to commit, working tree clean"

---

## Task 16: Push to PR Branch

**Files:**
- Push: All commits to remote

**Step 1: Review commits to be pushed**

Run: `git log origin/feature/storybook-restructure..HEAD --oneline`
Expected: List of fix commits

**Step 2: Push to remote**

Run: `git push origin feature/storybook-restructure`
Expected: Push successful

**Step 3: Verify PR is updated**

Run: `gh pr view 1`
Expected: PR shows updated status

---

## Success Criteria

After completing all tasks:

- ✅ Zero TypeScript `any` types in Form.tsx
- ✅ Zero ESLint errors
- ✅ All tests passing (0 failures)
- ✅ Type checking passes
- ✅ Lint passes
- ✅ Production build succeeds
- ✅ Storybook build succeeds
- ✅ Test coverage ≥80%
- ✅ PR updated with fix commits

## Notes

- Work is done in `.worktrees/storybook-restructure` directory
- Each logical fix gets its own commit
- If test failures persist after Task 9, may need to investigate specific test files
- The key React hooks error suggests React is null/undefined, typically from version conflicts or bundling issues

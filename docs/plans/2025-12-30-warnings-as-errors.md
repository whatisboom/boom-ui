# Treat All Warnings as Errors Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Configure both CI and prepush hooks to fail on ANY warnings from lint, typecheck, tests, or build.

**Architecture:** Multi-layered enforcement - update package.json scripts to use strict flags, add prepush git hook using Husky, update CI workflows to ensure all jobs treat warnings as errors.

**Tech Stack:** npm scripts, Husky (git hooks), GitHub Actions, ESLint, TypeScript, Vitest

---

## Task 1: Update Lint Script to Fail on Warnings

**Files:**
- Modify: `package.json:36` (lint script)

**Step 1: Update lint script with --max-warnings flag**

Replace line 36 in package.json:

```json
    "lint": "eslint src --ext ts,tsx --max-warnings 0",
```

This changes the default behavior from allowing unlimited warnings (-1) to failing on any warning (0).

**Step 2: Verify lint fails on warnings**

```bash
npm run lint
```

Expected: Exit code 0 (all passing, no warnings currently)

**Step 3: Test that warnings would fail**

Create a temporary warning to verify:

```bash
echo "// eslint-disable-next-line" > /tmp/test-warning.tsx
cat >> /tmp/test-warning.tsx << 'EOF'
const unused = 1;
export {};
EOF
mv /tmp/test-warning.tsx src/test-warning.tsx
npm run lint
```

Expected: Exit code 1 (lint fails due to warning)

**Step 4: Clean up test file**

```bash
rm src/test-warning.tsx
```

**Step 5: Commit**

```bash
git add package.json
git commit -m "Configure lint to fail on any warnings"
```

---

## Task 2: Create Test Warnings Checker Script

**Files:**
- Create: `scripts/test-strict.sh`
- Modify: `package.json:32` (test:ci script)

**Step 1: Create test-strict.sh wrapper script**

Create `scripts/test-strict.sh`:

```bash
#!/bin/bash
set -e

# Run tests and capture both stdout and stderr
output_file=$(mktemp)
exit_code=0

./scripts/run-tests-isolated.sh 2>&1 | tee "$output_file" || exit_code=$?

# Check for common warning patterns
if grep -iE "(warning|act\(\)|console\.(warn|error))" "$output_file" > /dev/null; then
  echo ""
  echo "❌ FAILED: Test warnings detected"
  echo ""
  echo "Found warnings in test output:"
  grep -iE "(warning|act\(\)|console\.(warn|error))" "$output_file" || true
  rm "$output_file"
  exit 1
fi

rm "$output_file"

if [ $exit_code -ne 0 ]; then
  echo "❌ FAILED: Tests failed"
  exit $exit_code
fi

echo "✅ All tests passed with no warnings"
exit 0
```

**Step 2: Make script executable**

```bash
chmod +x scripts/test-strict.sh
```

**Step 3: Update test:ci script in package.json**

Replace line 32 in package.json:

```json
    "test:ci": "./scripts/test-strict.sh",
```

**Step 4: Verify script works**

```bash
npm run test:ci
```

Expected: All tests pass, no warnings detected, exit code 0

**Step 5: Commit**

```bash
git add scripts/test-strict.sh package.json
git commit -m "Add strict test script that fails on warnings"
```

---

## Task 3: Install and Configure Husky for Prepush Hook

**Files:**
- Modify: `package.json` (add husky devDependency and prepare script)
- Create: `.husky/pre-push`

**Step 1: Install Husky**

```bash
npm install --save-dev husky
```

**Step 2: Add prepare script to package.json**

Add after line 26 (before other scripts):

```json
    "prepare": "husky",
```

**Step 3: Initialize Husky**

```bash
npm run prepare
```

This creates `.husky/` directory.

**Step 4: Create pre-push hook**

Create `.husky/pre-push`:

```bash
#!/bin/sh

echo "🔍 Running pre-push checks..."
echo ""

# Exit on first failure
set -e

echo "📝 Type checking..."
npm run typecheck
echo "✅ Type check passed"
echo ""

echo "🎨 Linting (strict mode)..."
npm run lint
echo "✅ Lint passed (no warnings)"
echo ""

echo "🧪 Running tests (strict mode)..."
npm run test:ci
echo "✅ Tests passed (no warnings)"
echo ""

echo "✅ All pre-push checks passed!"
```

**Step 5: Make pre-push hook executable**

```bash
chmod +x .husky/pre-push
```

**Step 6: Test pre-push hook**

```bash
.husky/pre-push
```

Expected: All checks pass, exit code 0

**Step 7: Commit**

```bash
git add package.json package-lock.json .husky/pre-push
git commit -m "Add Husky pre-push hook to enforce zero warnings"
```

---

## Task 4: Update CI Workflows to Enforce Strict Mode

**Files:**
- Modify: `.github/workflows/pr-checks.yml:39` (lint job)
- Modify: `.github/workflows/pr-checks.yml:57` (test job)

**Step 1: Update lint job to use strict script**

The lint job (line 39) already uses `npm run lint`, which now includes `--max-warnings 0` from Task 1. No changes needed.

**Step 2: Update test job to use strict script**

Replace line 57 in `.github/workflows/pr-checks.yml`:

```yaml
      - run: npm run test:ci
```

This was already using `test:ci`, but now it uses the strict wrapper from Task 2.

**Step 3: Add warning check comments to workflow**

Add comment above lint job (after line 27):

```yaml
  # Fails on any ESLint warnings (--max-warnings 0)
  lint:
```

Add comment above test job (after line 41):

```yaml
  # Fails on any test warnings (act(), console.warn, etc.)
  test:
```

**Step 4: Verify CI workflow syntax**

```bash
npm install -g @action/validator 2>/dev/null || echo "Skipping workflow validation"
```

**Step 5: Commit**

```bash
git add .github/workflows/pr-checks.yml
git commit -m "Update CI to enforce strict mode (fail on warnings)"
```

---

## Task 5: Update Build Scripts to Check for Warnings

**Files:**
- Create: `scripts/build-strict.sh`
- Modify: `package.json:29` (build script)

**Step 1: Create build-strict.sh wrapper**

Create `scripts/build-strict.sh`:

```bash
#!/bin/bash
set -e

# Capture build output
output_file=$(mktemp)
exit_code=0

npm run typecheck && (tsc && vite build) 2>&1 | tee "$output_file" || exit_code=$?

# Check for TypeScript warnings
if grep -iE "(warning TS|⚠)" "$output_file" > /dev/null; then
  echo ""
  echo "❌ FAILED: Build warnings detected"
  echo ""
  grep -iE "(warning TS|⚠)" "$output_file" || true
  rm "$output_file"
  exit 1
fi

rm "$output_file"

if [ $exit_code -ne 0 ]; then
  echo "❌ FAILED: Build failed"
  exit $exit_code
fi

echo "✅ Build completed with no warnings"
exit 0
```

**Step 2: Make script executable**

```bash
chmod +x scripts/build-strict.sh
```

**Step 3: Update build script in package.json**

Replace line 29 in package.json:

```json
    "build": "./scripts/build-strict.sh",
```

**Step 4: Verify build script works**

```bash
npm run build
```

Expected: Build succeeds with no warnings

**Step 5: Commit**

```bash
git add scripts/build-strict.sh package.json
git commit -m "Add strict build script that fails on warnings"
```

---

## Task 6: Update Documentation

**Files:**
- Modify: `CLAUDE.md` (add section about warnings policy)

**Step 1: Add warnings policy section to CLAUDE.md**

Add after the "Testing Requirements" section (after line ~50):

```markdown
### Warnings Policy
**Zero tolerance for warnings.** All commands treat warnings as errors:

- **Lint**: `npm run lint` fails on any ESLint warning (`--max-warnings 0`)
- **Tests**: `npm run test:ci` fails on act() warnings, console.warn, console.error
- **Build**: `npm run build` fails on TypeScript warnings
- **Prepush Hook**: Automatically runs all checks before allowing push
- **CI**: All PR checks enforce strict mode (warnings = failure)

**Why:** Warnings are deferred errors. Allowing them leads to warning fatigue and masks real issues.
```

**Step 2: Update development workflow section**

Find the "Development Commands" section and add note:

```markdown
**Note:** All commands run in strict mode - warnings will cause failures.
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Document zero-warnings policy in CLAUDE.md"
```

---

## Task 7: Verify Complete Setup

**Step 1: Run all checks locally**

```bash
npm run typecheck
npm run lint
npm run test:ci
npm run build
```

Expected: All pass with exit code 0, no warnings

**Step 2: Test pre-push hook**

```bash
.husky/pre-push
```

Expected: All checks pass

**Step 3: Verify prepublishOnly still works**

```bash
npm run prepublishOnly
```

Expected: All prepublish checks pass (uses strict scripts now)

**Step 4: Create verification summary**

Document in commit message:

```
Verified strict mode enforcement:
- ✅ Lint fails on warnings (--max-warnings 0)
- ✅ Tests fail on act() warnings
- ✅ Build fails on TS warnings
- ✅ Pre-push hook runs all checks
- ✅ CI workflows enforce strict mode
- ✅ prepublishOnly uses strict scripts
```

---

## Notes

**Changes Summary:**
- 3 new scripts created (`test-strict.sh`, `build-strict.sh`, and pre-push hook)
- 3 package.json scripts updated (lint, test:ci, build)
- 1 new package.json script added (prepare)
- 1 CI workflow updated (pr-checks.yml)
- 1 documentation file updated (CLAUDE.md)
- 1 new dev dependency (husky)

**Warning Detection Patterns:**
- Lint: `--max-warnings 0` (ESLint built-in)
- Tests: Regex for `act()`, `console.warn`, `console.error`, `warning`
- Build: Regex for `warning TS`, `⚠`

**Hook Execution Order:**
1. Pre-push runs: typecheck → lint → test:ci
2. If any fail, push is blocked
3. User sees which check failed and why

**CI Job Order (unchanged):**
- All jobs run in parallel
- PR blocked until all jobs green
- Now "green" means zero warnings, not just zero errors

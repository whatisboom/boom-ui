# Test Suite Memory Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate out-of-memory errors in GitHub Actions by separating Storybook browser tests from unit tests, fixing mock memory leaks, and configuring worker pool limits.

**Architecture:** Split vitest configuration to run two test suites separately (jsdom unit tests vs Chromium Storybook tests) instead of concurrently. Fix mock restoration to prevent memory accumulation. Configure worker pools to limit parallelism in CI environments.

**Tech Stack:** Vitest, jsdom, Playwright/Chromium, GitHub Actions

---

## Task 1: Separate Storybook Tests from Unit Tests

**Problem:** Running jsdom unit tests + Chromium browser tests concurrently consumes 200-500MB+ for Chromium alone, causing OOM in CI.

**Files:**
- Modify: `vitest.config.ts:23-50`
- Modify: `package.json:26-39`
- Modify: `.github/workflows/publish.yml:30-33`

**Step 1: Update vitest config to conditionally load Storybook project**

Modify `vitest.config.ts` - replace lines 23-50:

```typescript
projects: [
  {
    // jsdom unit tests - always enabled
    extends: true,
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/setup.ts',
      // Add worker limits for CI
      maxWorkers: process.env.CI ? 2 : 4,
      minWorkers: 1,
      pool: 'threads',
      poolOptions: {
        threads: {
          singleThread: false,
          isolate: true,
          useAtomics: true,
        }
      },
      maxConcurrency: process.env.CI ? 5 : 10,
    }
  },
  // Only include Storybook project when explicitly enabled
  ...(process.env.RUN_STORYBOOK_TESTS === '1' ? [{
    extends: true,
    plugins: [
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })
    ],
    test: {
      name: 'storybook',
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [{
          browser: 'chromium'
        }]
      },
      setupFiles: ['.storybook/vitest.setup.ts']
    }
  }] : [])
]
```

**Step 2: Update package.json test scripts**

Modify `package.json` - replace lines 31-34:

```json
"test": "vitest",
"test:storybook": "RUN_STORYBOOK_TESTS=1 vitest --project=storybook",
"test:all": "npm test && npm run test:storybook",
"test:ci": "./scripts/run-tests-batched.sh && npm run test:storybook",
```

**Step 3: Verify unit tests run without Chromium**

Run: `npm test`

Expected output:
- Should NOT see "Browser: chromium" messages
- Should see only jsdom unit tests running
- Should complete successfully

**Step 4: Verify Storybook tests run separately**

Run: `npm run test:storybook`

Expected output:
- Should see "Browser: chromium" messages
- Should see Storybook story tests running
- Should complete successfully

**Step 5: Verify both test suites pass**

Run: `npm run test:all`

Expected output:
- Unit tests run first (no Chromium)
- Then Storybook tests run (with Chromium)
- Both complete successfully

**Step 6: Commit the configuration changes**

```bash
git add vitest.config.ts package.json
git commit -m "refactor: separate Storybook tests from unit tests

- Conditionally load Storybook project via RUN_STORYBOOK_TESTS env var
- Add worker pool limits for CI (maxWorkers: 2, maxConcurrency: 5)
- Create separate test:storybook script
- Update test:all to run both sequentially instead of concurrently
- Prevents 200-500MB Chromium overhead during unit tests"
```

---

## Task 2: Fix Mock Memory Leak

**Problem:** `vi.clearAllMocks()` only clears call history but keeps mock implementations in memory. 293 mock functions across test files accumulate.

**Files:**
- Modify: `tests/setup.ts:33`

**Step 1: Change clearAllMocks to restoreAllMocks**

Modify `tests/setup.ts` line 33:

```typescript
// Before:
vi.clearAllMocks();

// After:
vi.restoreAllMocks();
```

Full context (lines 29-34):

```typescript
// Cleanup after each test
afterEach(() => {
  cleanup();
  // Restore all mocks to prevent memory accumulation
  vi.restoreAllMocks();
});
```

**Step 2: Run tests to verify no breakage**

Run: `npm test`

Expected:
- All tests should pass
- Mock cleanup should work correctly

**Step 3: Commit the mock restoration fix**

```bash
git add tests/setup.ts
git commit -m "fix: restore mocks instead of clearing to prevent memory leak

- Change vi.clearAllMocks() to vi.restoreAllMocks()
- restoreAllMocks() restores original implementations, not just call history
- Prevents 293 mock function implementations from accumulating in memory"
```

---

## Task 3: Create Test Batching Script for CI

**Problem:** Running all tests in one process still risks OOM. Batching provides middle ground between full isolation (slow) and single process (risky).

**Files:**
- Create: `scripts/run-tests-batched.sh`
- Modify: `package.json:32`

**Step 1: Create batching script**

Create `scripts/run-tests-batched.sh`:

```bash
#!/bin/bash
set -e

# Run unit tests in batches to prevent memory accumulation
# Each batch runs in a fresh vitest process

echo "Running unit tests in batches..."

# Find all unit test files (exclude Storybook tests)
test_files=$(find src -type f \( -name "*.test.ts" -o -name "*.test.tsx" \) | sort)

if [ -z "$test_files" ]; then
  echo "ERROR: No test files found!"
  exit 1
fi

# Count total test files
total=$(echo "$test_files" | wc -l | tr -d ' ')
echo "Found $total test files"
echo ""

# Batch configuration
batch_size=10
batch=()
batch_num=1
passed=0
failed=0
failed_batches=()

# Process files in batches
for file in $test_files; do
  batch+=("$file")

  # When batch is full, run it
  if [ ${#batch[@]} -eq $batch_size ]; then
    echo "Running batch $batch_num (files $((passed + failed + 1))-$((passed + failed + batch_size)))..."

    if npx vitest run --no-coverage "${batch[@]}" 2>&1; then
      ((passed += batch_size))
      echo "✓ Batch $batch_num passed"
    else
      ((failed += batch_size))
      failed_batches+=("$batch_num")
      echo "✗ Batch $batch_num failed"
    fi

    batch=()
    ((batch_num++))
    echo ""
  fi
done

# Run remaining files
if [ ${#batch[@]} -gt 0 ]; then
  remaining=${#batch[@]}
  echo "Running final batch $batch_num ($remaining files)..."

  if npx vitest run --no-coverage "${batch[@]}" 2>&1; then
    ((passed += remaining))
    echo "✓ Batch $batch_num passed"
  else
    ((failed += remaining))
    failed_batches+=("$batch_num")
    echo "✗ Batch $batch_num failed"
  fi
fi

echo ""
echo "================================"
echo "Unit Test Summary:"
echo "Total files: $total"
echo "Batches run: $batch_num"
echo "Passed: $passed files"
echo "Failed: $failed files"

if [ $failed -gt 0 ]; then
  echo ""
  echo "Failed batches: ${failed_batches[*]}"
  exit 1
fi

echo ""
echo "✓ All unit tests passed!"
```

**Step 2: Make script executable**

Run: `chmod +x scripts/run-tests-batched.sh`

**Step 3: Test the batching script locally**

Run: `./scripts/run-tests-batched.sh`

Expected output:
- Should run tests in batches of 10
- Each batch runs in separate vitest process
- All batches should pass
- Should see summary at end

**Step 4: Update test:ci to use batching**

Modify `package.json` line 32:

```json
"test:ci": "./scripts/run-tests-batched.sh && npm run test:storybook",
```

**Step 5: Commit the batching implementation**

```bash
git add scripts/run-tests-batched.sh package.json
git commit -m "feat: implement test batching for CI memory control

- Run unit tests in batches of 10 files per vitest process
- Process restarts between batches to clean up memory
- Provides middle ground between full isolation (slow) and single process (OOM risk)
- Update test:ci to use batching + Storybook tests sequentially"
```

---

## Task 4: Update CI Workflow

**Problem:** CI workflow needs to use the new test scripts and may need memory configuration.

**Files:**
- Modify: `.github/workflows/publish.yml:30-33`

**Step 1: Review current prepublishOnly hook**

Check `package.json` line 39:

```json
"prepublishOnly": "npm run typecheck && npm run test:ci && npm run build"
```

This already uses `test:ci` which now runs batched tests + Storybook tests.

**Step 2: Verify NODE_OPTIONS memory setting in workflow**

The workflow at `.github/workflows/publish.yml` already has:

```yaml
env:
  NODE_OPTIONS: --max-old-space-size=4096
```

This is good - 4GB memory limit should be sufficient with our optimizations.

**Step 3: Test full CI flow locally**

Run the full prepublish flow:

```bash
npm run typecheck && npm run test:ci && npm run build
```

Expected:
- Typecheck passes
- Batched unit tests pass
- Storybook tests pass
- Build completes successfully
- Total memory usage stays under 4GB

**Step 4: Commit any workflow updates if needed**

If no changes needed:
```bash
# No commit needed - workflow already configured correctly
```

If changes made:
```bash
git add .github/workflows/publish.yml
git commit -m "chore: verify CI workflow uses optimized test scripts"
```

---

## Task 5: Validation and Documentation

**Files:**
- Modify: `CLAUDE.md` (update testing documentation)

**Step 1: Update CLAUDE.md testing section**

Add to the "Running Single Tests" section in `CLAUDE.md` (after line 49):

```markdown
### Test Suite Memory Optimization

The test suite is split into two separate runs to prevent memory issues:

1. **Unit Tests** (`npm test`): Runs all component tests in jsdom environment
   - Uses batching in CI (10 files per process)
   - Worker limits: 2 workers in CI, 4 locally
   - No Chromium browser overhead

2. **Storybook Tests** (`npm run test:storybook`): Runs story tests in Chromium browser
   - Only runs when `RUN_STORYBOOK_TESTS=1` environment variable is set
   - Runs separately to isolate 200-500MB browser memory usage

3. **Full Suite** (`npm run test:all`): Runs both sequentially
   - Used in CI via `test:ci` script
   - Prevents concurrent Chromium + jsdom memory accumulation

**Memory optimizations applied:**
- Mock restoration (not just clearing) prevents mock accumulation
- Worker pool limits prevent excessive parallelism
- Test batching (CI only) provides memory isolation per batch
- Storybook tests separated from unit tests
```

**Step 2: Test the documentation changes**

Verify all commands in documentation work:

```bash
npm test                    # Unit tests only
npm run test:storybook      # Storybook tests only
npm run test:all            # Both sequentially
npm run test:ci             # CI script (batched + storybook)
```

**Step 3: Commit documentation update**

```bash
git add CLAUDE.md
git commit -m "docs: document test suite memory optimization

- Explain split between unit tests and Storybook tests
- Document batching strategy for CI
- List memory optimizations applied
- Update test command reference"
```

---

## Task 6: Create Summary and Test in CI

**Step 1: Create a summary of changes**

Create `docs/test-memory-optimization-summary.md`:

```markdown
# Test Suite Memory Optimization Summary

## Problem
Tests ran out of memory in GitHub Actions due to:
1. Concurrent jsdom unit tests + Chromium Storybook tests (200-500MB+ overhead)
2. Mock memory leaks (293 mocks cleared but not restored)
3. No worker pool limits (max parallelism)

## Solution

### 1. Separated Test Suites
- **Unit tests** (`npm test`): jsdom only, no Chromium
- **Storybook tests** (`npm run test:storybook`): Chromium browser only
- **Sequential execution**: Prevents concurrent memory accumulation

### 2. Fixed Mock Restoration
- Changed `vi.clearAllMocks()` → `vi.restoreAllMocks()`
- Prevents mock implementations from accumulating in memory

### 3. Worker Pool Configuration
- CI: 2 workers max, 5 concurrent tests max
- Local: 4 workers max, 10 concurrent tests max
- Prevents excessive parallelism causing memory spikes

### 4. Test Batching (CI)
- Runs unit tests in batches of 10 files
- Fresh vitest process per batch
- Memory cleanup between batches

## Results

### Expected Memory Reduction
- **60-70% reduction** in unit test memory (no Chromium)
- **Additional 10-15%** from mock restoration and batching
- Peak memory usage: <3GB (down from 4GB+ OOM)

### Expected Performance
- **40-50% faster** unit tests (parallel without Chromium overhead)
- CI runtime: <8 minutes (down from timeout)
- Local development: faster feedback loop

## Validation

### Local Testing
```bash
npm test                    # Unit tests (no Chromium)
npm run test:storybook      # Storybook tests (Chromium)
npm run test:all            # Both sequentially
npm run test:ci             # Batched + Storybook
```

### CI Testing
1. Push to feature branch
2. Monitor GitHub Actions workflow
3. Verify memory usage <4GB
4. Verify no OOM errors
5. Verify all tests pass

## Files Modified
- `vitest.config.ts` - Split projects, worker limits
- `tests/setup.ts` - Mock restoration fix
- `package.json` - Test script reorganization
- `scripts/run-tests-batched.sh` - Batching implementation
- `CLAUDE.md` - Documentation update
```

**Step 2: Commit the summary**

```bash
git add docs/test-memory-optimization-summary.md
git commit -m "docs: add test memory optimization summary"
```

**Step 3: Push to feature branch and test in CI**

```bash
# Create feature branch
git checkout -b test/memory-optimization

# Push to remote
git push -u origin test/memory-optimization
```

**Step 4: Monitor GitHub Actions**

1. Go to repository on GitHub
2. Navigate to Actions tab
3. Find the workflow run for your branch
4. Monitor:
   - Memory usage in logs
   - Test execution time
   - Whether tests complete without OOM
   - All tests pass

**Step 5: Verify success criteria**

Success criteria:
- ✅ CI completes without OOM errors
- ✅ All tests pass (unit + Storybook)
- ✅ Coverage maintains 80%+ threshold
- ✅ Runtime <10 minutes
- ✅ Peak memory <4GB

**Step 6: Merge or iterate**

If successful:
```bash
# Merge to main
gh pr create --title "Optimize test suite memory usage" --body "$(cat docs/test-memory-optimization-summary.md)"
```

If issues found:
- Review CI logs for specific failures
- Adjust batch size, worker limits, or configuration
- Iterate and test again

---

## Rollback Plan

If optimizations cause issues:

**Rollback vitest config:**
```bash
git show HEAD~6:vitest.config.ts > vitest.config.ts
```

**Rollback to isolated tests:**
```json
// package.json
"test:ci": "./scripts/run-tests-isolated.sh"
```

**Verify rollback:**
```bash
npm run test:ci
```

---

## Future Optimizations (Optional)

### 1. Optimize Axe-core Usage
- Create dedicated accessibility test files
- Run 1-2 critical axe tests per component (not every test)
- Saves ~20-30% runtime on accessibility scans

### 2. Refactor Large Test Files
Split files >400 lines:
- `src/components/Slider/Slider.test.tsx` (498 lines) → multiple files
- `src/components/Tree/Tree.test.tsx` (466 lines) → multiple files

Benefits:
- Better test isolation
- Improved parallel execution
- Memory released between files

### 3. Add Memory Profiling
Create `scripts/test-with-memory-profile.sh`:
- Monitor heap usage during tests
- Identify memory-heavy test files
- Target for further optimization

---

## Testing Checklist

Before considering this task complete:

- [ ] Unit tests run without Chromium (`npm test`)
- [ ] Storybook tests run separately (`npm run test:storybook`)
- [ ] Both run sequentially successfully (`npm run test:all`)
- [ ] Batching script works locally (`./scripts/run-tests-batched.sh`)
- [ ] All tests pass with new configuration
- [ ] Coverage threshold maintained (80%+)
- [ ] Documentation updated in CLAUDE.md
- [ ] Summary document created
- [ ] CI workflow tested on feature branch
- [ ] No OOM errors in CI
- [ ] CI completes in reasonable time (<10 min)
- [ ] Peak memory usage <4GB in CI

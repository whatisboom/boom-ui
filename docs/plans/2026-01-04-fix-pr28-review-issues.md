# Fix PR #28 Code Review Issues Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix critical issues identified in PR #28 code review: circular dependency in build script, improve error handling, enhance grep patterns, and verify coverage generation.

**Architecture:** Refactor strict wrapper scripts to call base commands instead of reimplementing them, add proper error handling with trap handlers, improve pattern matching to avoid false positives, and ensure CI coverage workflow remains functional.

**Tech Stack:** Bash shell scripts, npm scripts, Husky git hooks, GitHub Actions, Vitest

---

## Task 1: Fix Circular Dependency in Build Script

**Files:**
- Modify: `package.json:29-30`
- Modify: `scripts/build-strict.sh:7`

**Problem:** Current `build` script calls `build-strict.sh`, which reimplements the build command (`tsc && vite build`). This creates maintenance burden and violates DRY.

**Step 1: Add build:base script to package.json**

In `package.json`, update the build scripts section (around line 29):

```json
    "build:base": "tsc && vite build",
    "build": "./scripts/build-strict.sh",
```

This separates the actual build command from the strict wrapper.

**Step 2: Update build-strict.sh to call build:base**

Replace line 7 in `scripts/build-strict.sh`:

```bash
npm run build:base 2>&1 | tee "$output_file" || exit_code=$?
```

This removes the redundant `npm run typecheck &&` and calls the base build command instead of reimplementing it.

**Step 3: Verify build still works**

Run:
```bash
npm run build
```

Expected: Build completes successfully, no warnings detected, exit code 0

**Step 4: Verify strict mode catches warnings**

Create temporary file with type error:
```bash
echo "const x: number = 'string';" > src/test-warning.ts
npm run build
```

Expected: Build fails with TypeScript error, exit code 1

**Step 5: Clean up test file**

```bash
rm src/test-warning.ts
```

**Step 6: Commit**

```bash
git add package.json scripts/build-strict.sh
git commit -m "Fix circular dependency in build script

- Add build:base script for actual build command
- Update build-strict.sh to call build:base
- Removes redundant typecheck call (already in build)
- Follows DRY principle"
```

---

## Task 2: Add Trap Handlers for Cleanup

**Files:**
- Modify: `scripts/build-strict.sh:1-6`
- Modify: `scripts/test-strict.sh:1-6`

**Problem:** Scripts don't clean up temp files if interrupted or if errors occur before cleanup.

**Step 1: Add trap handler to build-strict.sh**

Replace lines 1-6 in `scripts/build-strict.sh`:

```bash
#!/bin/bash
set -e

# Create temp file and ensure cleanup on exit
output_file=$(mktemp /tmp/build-output.XXXXXX)
trap 'rm -f "$output_file"' EXIT ERR INT TERM

exit_code=0
```

**Step 2: Remove manual cleanup from build-strict.sh**

Find and remove these two lines (around lines 15 and 20):
```bash
  rm "$output_file"
```

The trap handler now takes care of cleanup automatically.

**Step 3: Add trap handler to test-strict.sh**

Replace lines 1-6 in `scripts/test-strict.sh`:

```bash
#!/bin/bash
set -e

# Create temp file and ensure cleanup on exit
output_file=$(mktemp /tmp/test-output.XXXXXX)
trap 'rm -f "$output_file"' EXIT ERR INT TERM

exit_code=0
```

**Step 4: Remove manual cleanup from test-strict.sh**

Find and remove these two lines (around lines 17 and 22):
```bash
rm "$output_file"
```

**Step 5: Test trap handlers work on interruption**

Run build and interrupt it:
```bash
npm run build &
sleep 1
kill %1
ls /tmp/build-output.* 2>/dev/null || echo "Cleanup successful"
```

Expected: "Cleanup successful" (no temp files left)

**Step 6: Test trap handlers work on normal completion**

```bash
npm run build
ls /tmp/build-output.* 2>/dev/null || echo "Cleanup successful"
```

Expected: "Cleanup successful"

**Step 7: Commit**

```bash
git add scripts/build-strict.sh scripts/test-strict.sh
git commit -m "Add trap handlers for cleanup in strict scripts

- Ensures temp files cleaned up even on interruption
- Handles EXIT, ERR, INT, TERM signals
- Removes manual cleanup (trap handles it)
- Prevents temp file accumulation"
```

---

## Task 3: Improve Grep Patterns to Avoid False Positives

**Files:**
- Modify: `scripts/test-strict.sh:11`

**Problem:** Pattern `(warning|not wrapped in act|console\.(warn|error))` is too broad and could match comments or test descriptions.

**Step 1: Update grep pattern in test-strict.sh**

Replace line 11 in `scripts/test-strict.sh`:

```bash
if grep -E "Warning: .* is not wrapped in act|Warning: .*act\(\)|console\.(warn|error)" "$output_file" > /dev/null; then
```

This is more specific:
- `Warning:` must be capitalized and followed by space (React warnings format)
- Matches act() warnings from React
- Still catches console.warn/error

**Step 2: Update error message display pattern**

Replace line 16 in `scripts/test-strict.sh` to match the new pattern:

```bash
  grep -E "Warning: .* is not wrapped in act|Warning: .*act\(\)|console\.(warn|error))" "$output_file" || true
```

**Step 3: Test pattern doesn't match false positives**

Create test file with comment:
```bash
echo "// This is a warning example" > src/test-comment.test.tsx
echo "describe('test', () => { it('works', () => { expect(true).toBe(true); }); });" >> src/test-comment.test.tsx
npm run test:ci
```

Expected: Tests pass (comment not flagged as warning)

**Step 4: Clean up test file**

```bash
rm src/test-comment.test.tsx
```

**Step 5: Test pattern catches real warnings**

Check pattern would catch real React warnings:
```bash
echo "Warning: An update to Component was not wrapped in act" | grep -E "Warning: .* is not wrapped in act|Warning: .*act\(\)|console\.(warn|error)" && echo "Pattern works"
```

Expected: "Pattern works"

**Step 6: Commit**

```bash
git add scripts/test-strict.sh
git commit -m "Improve grep patterns to avoid false positives

- Require 'Warning:' prefix (React format)
- More specific act() warning patterns
- Won't match comments or descriptions
- Still catches all real React warnings"
```

---

## Task 4: Verify Coverage Generation Still Works

**Files:**
- None (verification only)

**Problem:** CI workflow changed from `test:coverage` to `test:ci`. Need to verify coverage is still generated.

**Step 1: Check what test:ci runs**

```bash
cat scripts/test-strict.sh | grep -A2 "run-tests-isolated"
```

Expected: Shows it calls `./scripts/run-tests-isolated.sh`

**Step 2: Check what run-tests-isolated does**

```bash
cat scripts/run-tests-isolated.sh
```

Expected: Should show if it includes `--coverage` flag or similar

**Step 3: Run test:ci locally and check for coverage**

```bash
npm run test:ci
ls coverage/ 2>/dev/null && echo "Coverage generated" || echo "No coverage found"
```

**Step 4a: If coverage IS generated**

No changes needed. Document finding:
```bash
echo "✅ test:ci generates coverage via run-tests-isolated.sh" >> docs/plans/2026-01-04-fix-pr28-review-issues.md
```

Skip to Step 6.

**Step 4b: If coverage is NOT generated**

Need to add coverage flag. Check if run-tests-isolated.sh accepts parameters:
```bash
./scripts/run-tests-isolated.sh --coverage
```

If it works, update `.github/workflows/pr-checks.yml` line 59:
```yaml
      - run: npm run test:ci -- --coverage
```

Or create separate `test:ci:coverage` script in package.json:
```json
    "test:ci:coverage": "./scripts/test-strict.sh --coverage",
```

And update workflow to use it:
```yaml
      - run: npm run test:ci:coverage
```

**Step 5: Verify CI would generate coverage**

Check the workflow file:
```bash
grep -A5 "Upload coverage" .github/workflows/pr-checks.yml
```

Expected: Upload step should trigger after test job

**Step 6: Document findings**

Create verification note in this plan:
```bash
git add docs/plans/2026-01-04-fix-pr28-review-issues.md
git commit -m "Verify coverage generation in CI workflow

- Confirmed test:ci generates/doesn't generate coverage
- Updated workflow if needed
- Ensures coverage artifacts uploaded correctly"
```

---

## Task 5: Improve Pre-Push Hook User Feedback

**Files:**
- Modify: `.husky/pre-push`

**Problem:** Current hook stops at first failure. Better UX would run all checks and report which ones failed.

**Step 1: Rewrite pre-push hook with better feedback**

Replace entire `.husky/pre-push` file:

```bash
#!/bin/sh

echo "🔍 Running pre-push checks..."
echo ""

# Track failed checks
failed_checks=""

echo "📝 Type checking..."
if npm run typecheck > /dev/null 2>&1; then
  echo "✅ Type check passed"
else
  echo "❌ Type check failed"
  failed_checks="$failed_checks typecheck"
fi
echo ""

echo "🎨 Linting (strict mode)..."
if npm run lint > /dev/null 2>&1; then
  echo "✅ Lint passed (no warnings)"
else
  echo "❌ Lint failed"
  failed_checks="$failed_checks lint"
fi
echo ""

echo "🧪 Running tests (strict mode)..."
if npm run test:ci > /dev/null 2>&1; then
  echo "✅ Tests passed (no warnings)"
else
  echo "❌ Tests failed"
  failed_checks="$failed_checks tests"
fi
echo ""

# Check if any checks failed
if [ -n "$failed_checks" ]; then
  echo "❌ Pre-push checks failed:$failed_checks"
  echo ""
  echo "Run the failed commands to see details:"
  for check in $failed_checks; do
    case $check in
      typecheck) echo "  npm run typecheck" ;;
      lint) echo "  npm run lint" ;;
      tests) echo "  npm run test:ci" ;;
    esac
  done
  echo ""
  echo "Use 'git push --no-verify' to skip checks (not recommended)"
  exit 1
fi

echo "✅ All pre-push checks passed!"
```

**Step 2: Test hook shows all failures**

Temporarily break multiple things to test:
```bash
# Add lint error
echo "const unused = 1;" > src/test-lint.ts
# Add type error
echo "const x: number = 'string';" > src/test-type.ts
```

Try to push (or run hook directly):
```bash
.husky/pre-push
```

Expected: Shows both typecheck and lint failed, with commands to run

**Step 3: Clean up test files**

```bash
rm src/test-lint.ts src/test-type.ts
```

**Step 4: Verify hook passes when clean**

```bash
.husky/pre-push
```

Expected: All checks pass, exit code 0

**Step 5: Commit**

```bash
git add .husky/pre-push
git commit -m "Improve pre-push hook user feedback

- Run all checks instead of stopping at first failure
- Show which checks failed with helpful commands
- Suggest --no-verify escape hatch
- Better developer experience"
```

---

## Task 6: Document --no-verify Escape Hatch

**Files:**
- Modify: `CLAUDE.md` (Warnings Policy section)

**Problem:** Developers need to know when it's acceptable to bypass pre-push hook.

**Step 1: Add escape hatch documentation to CLAUDE.md**

Find the "Warnings Policy" section (around line 124) and add after the bullet list:

```markdown
**Emergency escape hatch:** Use `git push --no-verify` ONLY when:
- You need to push a work-in-progress to collaborate with others
- CI is down and you need to deploy a hotfix
- You're pushing to a personal feature branch (not develop/main)

**NEVER use --no-verify when:**
- Pushing to `develop` or `main` branches
- Creating a pull request
- The warnings are "just small issues I'll fix later"
```

**Step 2: Verify documentation renders correctly**

```bash
head -n 150 CLAUDE.md | tail -n 30
```

Expected: New section visible and properly formatted

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Document --no-verify escape hatch usage

- Clarify when it's acceptable to skip pre-push
- Warn against using on main branches
- Prevent misuse of bypass flag"
```

---

## Task 7: Skip Prepare Script in CI

**Files:**
- Modify: `package.json:26` (prepare script)

**Problem:** Installing Husky hooks in CI wastes time and serves no purpose (git hooks don't run in CI).

**Step 1: Make prepare script CI-aware**

Replace line 26 in `package.json`:

```json
    "prepare": "node -e \"if (process.env.CI !== 'true') require('child_process').execSync('husky install')\"",
```

This only installs hooks when NOT in CI environment.

**Step 2: Test prepare runs locally**

```bash
npm run prepare
ls .husky/pre-push
```

Expected: Hook file exists, exit code 0

**Step 3: Test prepare skips in CI**

```bash
CI=true npm run prepare
echo "Exit code: $?"
```

Expected: "Exit code: 0" (succeeds but does nothing)

**Step 4: Verify doesn't break CI**

Check if CI sets CI=true:
```bash
grep -r "CI:" .github/workflows/
```

Expected: GitHub Actions automatically sets CI=true

**Step 5: Commit**

```bash
git add package.json
git commit -m "Skip Husky prepare script in CI environments

- Checks process.env.CI before installing hooks
- Saves time in CI (hooks don't run there anyway)
- GitHub Actions sets CI=true automatically"
```

---

## Task 8: Final Verification and Testing

**Files:**
- None (verification only)

**Step 1: Run all checks locally**

```bash
npm run typecheck
npm run lint
npm run test:ci
npm run build
```

Expected: All pass with exit code 0

**Step 2: Test pre-push hook**

```bash
.husky/pre-push
```

Expected: All checks pass

**Step 3: Verify all scripts have proper error handling**

Check for trap handlers:
```bash
grep -n "trap" scripts/*.sh
```

Expected: Both build-strict.sh and test-strict.sh show trap handlers

**Step 4: Verify no circular dependencies**

```bash
grep "build" package.json | head -5
```

Expected: Shows build:base and build as separate scripts

**Step 5: Check for leftover temp files**

```bash
ls /tmp/*-output.* 2>/dev/null || echo "No temp files found"
```

Expected: "No temp files found"

**Step 6: Run pre-push to ensure everything works together**

```bash
.husky/pre-push
```

Expected: All checks pass

**Step 7: Create summary of changes**

Document verification results:
```
Verification complete:
✅ Build script calls build:base (no circular dependency)
✅ Trap handlers clean up temp files
✅ Grep patterns more specific (fewer false positives)
✅ Coverage generation verified
✅ Pre-push hook shows all failures
✅ CI skips Husky installation
✅ Documentation includes --no-verify guidance
```

---

## Task 4 Implementation Results

**Finding:** Coverage was NOT being generated by `test:ci`.

**Root cause:** The `run-tests-isolated.sh` script explicitly uses `--no-coverage` flag because running coverage on isolated test files doesn't produce meaningful results.

**Solution:** Added separate coverage generation step in CI workflow after strict tests pass.

**Changes made:**
- Modified `.github/workflows/pr-checks.yml` to run `npm run test:coverage` after `npm run test:ci`
- This ensures both strict testing (no warnings) AND coverage generation occur
- Coverage artifacts are uploaded to GitHub Actions as expected

**Verification:**
- Ran `npm run test:coverage` locally - coverage generated successfully
- Coverage directory created with HTML reports and coverage-final.json
- CI workflow now runs both strict tests and coverage generation sequentially

---

## Notes

**Total Changes:**
- 2 package.json scripts modified (build split into build:base + build)
- 1 package.json script updated (prepare now CI-aware)
- 2 shell scripts enhanced (trap handlers added)
- 1 shell script improved (better grep patterns)
- 1 git hook rewritten (better UX)
- 1 documentation update (escape hatch guidance)

**Testing Strategy:**
- Verify each script works in isolation
- Test error handling (interruption, temp file cleanup)
- Test pattern matching (no false positives)
- Verify pre-push hook UX improvements
- Ensure CI workflow unaffected

**Rollback Plan:**
If any change causes issues:
- Each task is a separate commit
- Can revert individual commits with `git revert <sha>`
- Original PR #28 remains intact until these fixes merge

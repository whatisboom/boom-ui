# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**boom-ui** is an accessibility-first React component library built with TypeScript, Vite, and Framer Motion. Components follow a strict design system approach with CSS tokens, theme support, and comprehensive accessibility testing.

## Development Commands

**Note:** All commands run in strict mode - warnings will cause failures.

### Essential Commands
```bash
# Development (watch mode - rebuilds on changes)
npm run dev

# Type checking (no emit)
npm run typecheck

# Linting
npm run lint

# Testing
npm test                    # Run all tests
npm run test:ui             # Interactive test UI
npm run test:coverage       # Coverage report (80% minimum required)

# Building
npm run build              # TypeScript compile + Vite bundle
npm run build:mf           # Module federation build

# Documentation
npm run storybook          # Opens at localhost:6006
npm run build-storybook    # Build static Storybook
```

### Local Development with npm link

To develop boom-ui while using it in another project without publishing:

**In boom-ui repository:**
```bash
# Build the library first
npm run build

# Create global symlink
npm link
```

**In your consumer project:**
```bash
# Link to the local boom-ui
npm link @whatisboom/boom-ui
```

**Development workflow:**
```bash
# In boom-ui: watch mode rebuilds on changes
npm run dev

# Changes automatically available in linked consumer project
# Note: May need to restart consumer's dev server to pick up changes
```

**To unlink:**
```bash
# In consumer project
npm unlink @whatisboom/boom-ui

# In boom-ui (optional - removes global symlink)
npm unlink
```

### Running Single Tests
```bash
# Run tests for specific file
npx vitest src/components/Button/Button.test.tsx

# Run tests matching pattern
npx vitest Button

# Watch mode for specific test
npx vitest src/components/Button/Button.test.tsx --watch
```

## Architecture & Patterns

### Component Structure
Every component follows this exact pattern:
```
ComponentName/
├── ComponentName.tsx           # Implementation with forwardRef
├── ComponentName.types.ts      # TypeScript interfaces/props
├── ComponentName.module.css    # Scoped styles
├── ComponentName.test.tsx      # Unit + accessibility tests
├── ComponentName.stories.tsx   # Storybook documentation
└── index.ts                    # Public exports
```

### Core Principles
1. **Accessibility-First**: Every component must pass vitest-axe accessibility tests
2. **Type Safety**: No `any` types permitted (enforced by ESLint and user preferences)
3. **CSS Modules**: Scoped styles with naming pattern `[name]__[local]___[hash:base64:5]`
4. **Theme System**: Use CSS tokens from `src/styles/tokens/` for colors, spacing, typography
5. **forwardRef Pattern**: All interactive components use `React.forwardRef` for DOM access
6. **Animation**: Use Framer Motion for transitions (already imported, follow existing patterns)
7. **Export All Types**: Every component must export ALL its types (including base props, variants, context types) so consumers have full TypeScript support

### Design Tokens Location
- Colors: `src/styles/tokens/colors.css` & `palettes.css`
- Typography: `src/styles/tokens/typography.css` (Sora font, display/label weight tokens)
- Spacing & Motion: `src/styles/tokens/spacing.css` (timing curves, durations, stagger delay)
- Shadows: `src/styles/tokens/shadows.css` (accent-tinted, vertical presence)
- Theme variables: `src/styles/tokens/theme.css`

### Motion Tokens
Use explicit property transitions with motion tokens instead of `transition: all`:
```css
transition:
  background-color var(--boom-duration-quick) var(--boom-ease-in-out),
  border-color var(--boom-duration-quick) var(--boom-ease-in-out),
  color var(--boom-duration-quick) var(--boom-ease-in-out),
  box-shadow var(--boom-duration-base) var(--boom-ease-out);
```
- **Timing curves**: `--boom-ease-out` (entrances), `--boom-ease-in` (exits), `--boom-ease-in-out` (property changes)
- **Durations**: `--boom-duration-quick` (150ms), `--boom-duration-base` (250ms), `--boom-duration-slow` (400ms)
- **Never use** `transition: all` or hardcoded timing values (e.g., `0.2s ease`)

### Testing Requirements
- **Coverage threshold**: 80% minimum (lines, functions, branches, statements)
- **Accessibility**: Use `axe()` from vitest-axe in every component test
- **Testing Library**: Use @testing-library/react (not enzyme or others)
- **User interactions**: Use @testing-library/user-event for simulating events
- **Setup**: Tests automatically include vitest-axe matchers and jsdom environment

### Warnings Policy
**Zero tolerance for warnings.** All commands treat warnings as errors:

- **Lint**: `npm run lint` fails on any ESLint warning (`--max-warnings 0`)
- **Tests**: `npm run test:ci` fails on act() warnings, console.warn, console.error
- **Build**: `npm run build` fails on TypeScript warnings
- **Prepush Hook**: Automatically runs all checks before allowing push
- **CI**: All PR checks enforce strict mode (warnings = failure)

**Emergency escape hatch:** Use `git push --no-verify` ONLY when:
- You need to push a work-in-progress to collaborate with others
- CI is down and you need to deploy a hotfix
- You're pushing to a personal feature branch (not develop/main)

**NEVER use --no-verify when:**
- Pushing to `develop` or `main` branches
- Creating a pull request
- The warnings are "just small issues I'll fix later"

**Why:** Warnings are deferred errors. Allowing them leads to warning fatigue and masks real issues.

### TypeScript Configuration
- **Strict mode**: enabled
- **Path alias**: `@/*` maps to `src/*`
- **No unused vars**: enforced (no-unused-locals, no-unused-parameters)
- **Target**: ES2020, Module: ESNext
- **JSX**: react-jsx (new transform)

### ESLint Rules (Strictly Enforced)
- `@typescript-eslint/no-explicit-any`: ERROR (never use `any`)
- `react/react-in-jsx-scope`: OFF (modern React)
- Accessibility plugin: jsx-a11y (all rules active)

### Build Output
- **Entry**: `src/index.ts` (explicitly exports all public components)
- **Format**: ES modules only (ESM)
- **Externals**: react, react-dom, react/jsx-runtime (peer dependencies, not bundled)
- **CSS**: Bundled to `dist/styles/index.css`, imported at root level

### Module Federation
- Alternative build config exists: `vite.mf.config.ts`
- Used for micro-frontend architectures
- Run with: `npm run dev:mf` or `npm run build:mf`

## Common Patterns

### Creating New Components
1. Follow the component structure pattern exactly (see above)
2. Use existing components as templates (Button, Checkbox, Switch are good examples)
3. Define props in separate `.types.ts` file
4. Export component and **ALL types** from component's `index.ts` (props, variants, base props, context types)
5. Add component and **ALL its types** to main `src/index.ts` for public API
6. Use shared types from `src/types/index.ts` where appropriate (Size, Variant, PolymorphicProps)
7. Write comprehensive tests including `axe()` accessibility check
8. Create Storybook stories showing all variants
9. **Review [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) before submitting PR**

### Security Guidelines

**CRITICAL: All code must follow security best practices documented in [SECURITY.md](./SECURITY.md).**

**Never use these patterns:**
- ❌ `dangerouslySetInnerHTML` (unless explicitly justified with DOMPurify sanitization)
- ❌ `innerHTML` or `outerHTML` manipulation
- ❌ `eval()` or `Function()` constructor
- ❌ `javascript:` protocol in URLs
- ❌ Arbitrary style objects from untrusted sources

**Always use these patterns:**
- ✅ React's built-in prop escaping for user content
- ✅ Type-safe props (no `any` types)
- ✅ Validated URLs (check protocol)
- ✅ Controlled enums for variants/types

**Before submitting PRs:**
- Run `npm audit` (pre-push hook enforces this)
- Review [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) for XSS, injection, and memory leak patterns
- Justify any new dependencies with security rationale
- Never commit secrets, API keys, or credentials

**For vulnerability reports:**
- Use [GitHub Security Advisories](https://github.com/whatisboom/boom-ui/security/advisories/new)
- Never report security issues via public GitHub issues

See [SECURITY.md](./SECURITY.md) for complete policy.

### Style Implementation
- Use CSS variables from tokens, never hardcode colors/spacing/timing
- Follow BEM-like naming in CSS modules
- Support theme switching via ThemeProvider context
- Prefer CSS Grid/Flexbox with token-based spacing
- Animation: Use Framer Motion `motion` components
- Transitions: Use explicit property lists with motion tokens (see Motion Tokens above)
- Font: Sora (loaded via `src/styles/fonts.css`)

### Layout and Spacing (CRITICAL)

**NEVER use inline styles for layout and spacing.** Use layout components with spacing tokens instead.

#### Spacing Token System

All layout components accept spacing as **numbers** that map to design tokens:

| Token | CSS Variable | Value | Use Case |
|-------|--------------|-------|----------|
| 4 | --boom-spacing-4 | 16px / 1rem | Default spacing |
| 6 | --boom-spacing-6 | 24px / 1.5rem | Medium spacing |
| 8 | --boom-spacing-8 | 32px / 2rem | Large spacing |
| 12 | --boom-spacing-12 | 48px / 3rem | Section spacing |

See `src/styles/tokens/spacing.css` for all available tokens.

#### Use Box for Custom Layouts

Box component provides layout props that use spacing tokens:

```tsx
// ❌ WRONG: Inline styles
<div style={{
  display: 'flex',
  padding: '1.5rem',
  gap: '1rem'
}}>

// ✅ CORRECT: Box with spacing tokens
<Box display="flex" padding={6} gap={4}>
```

**Box props:**
- `padding`, `margin`, `gap` - Spacing tokens (numbers)
- `display`, `flexDirection`, `alignItems`, `justifyContent` - Layout
- `width`, `height` - Dimensions
- `as` - Render as different HTML element

**When to use Box:**
- Custom flex or grid layouts
- Adding padding/margin to elements
- Polymorphic components (different HTML elements)

#### Use Stack for Stacked Layouts

Stack component for vertical/horizontal stacks with equal spacing:

```tsx
// ❌ WRONG: Inline flex column
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
}}>

// ✅ CORRECT: Stack with spacing token
<Stack spacing={4}>
  <Item1 />
  <Item2 />
  <Item3 />
</Stack>
```

**Stack props:**
- `direction` - 'column' (default) or 'row'
- `spacing` - Gap between items (spacing token)
- `align`, `justify` - Alignment

#### Use Grid for Grid Layouts

Grid component for multi-column layouts:

```tsx
// ❌ WRONG: Inline grid styles
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem'
}}>

// ✅ CORRECT: Grid with spacing token
<Grid columns={4} gap={4}>
  <Card />
  <Card />
  <Card />
  <Card />
</Grid>
```

**Grid props:**
- `columns` - Number of columns (fixed)
- `gap` - Space between items (spacing token)
- `minColumnWidth` - Minimum column width (responsive)
- `autoFit` - Use CSS Grid auto-fit

#### Accessing Theme Colors in TypeScript

Use `useTheme()` hook to access theme colors instead of hardcoding hex values:

```tsx
import { useTheme } from '@whatisboom/boom-ui';

function MyComponent() {
  const { colors } = useTheme();

  // ❌ WRONG: Hardcoded colors
  <div style={{ borderColor: '#e0e0e0', color: '#1976d2' }}>

  // ✅ CORRECT: Theme colors
  <Box style={{
    borderColor: colors.border.default,
    color: colors.primary
  }}>
}
```

**Available color groups:**
- `colors.bg.*` - Background colors
- `colors.text.*` - Text colors
- `colors.border.*` - Border colors
- `colors.primary`, `colors.secondary` - Interactive colors
- `colors.success.*`, `colors.error.*`, `colors.warning.*` - Semantic colors

#### Decision Tree

```
Do you need colors from the theme?
├─ YES → Use useTheme().colors
└─ NO  → Do you need a grid layout?
          ├─ YES → Use Grid
          └─ NO  → Do you need stacked items with equal spacing?
                    ├─ YES → Use Stack
                    └─ NO  → Use Box
```

**See [docs/layout-guide.md](./docs/layout-guide.md) for comprehensive examples and patterns.**

### Hooks Location
Custom hooks live in `src/hooks/`:
- `useClickOutside` - Detect outside clicks
- `useFocusTrap` - Trap focus for modals
- `useScrollLock` - Prevent body scroll
- `useKeyboardShortcut` - Keyboard event handling
- `useDebounce` - Debounce values

### Shared Types (`src/types/index.ts`)
Common types used across components:
- `Size` - Standard size variants: 'sm' | 'md' | 'lg'
- `Variant` - Standard color variants: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
- `PolymorphicProps<E>` - Allows components to render as different elements via `as` prop
- `MotionProps` - Animation preferences (includes `disableAnimation` flag)

Use these shared types for consistency. Components can extend or add their own specific variants.

### Accessibility Helpers
- Focus management utils: `src/utils/focus-management.ts`
- Use semantic HTML elements
- ARIA attributes when semantic HTML insufficient
- Keyboard navigation support required for all interactive components

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

## Storybook Setup

- **Framework**: React + Vite
- **Addons**: a11y (accessibility audit), dark-mode switcher, docs
- **Stories location**: `src/**/*.stories.tsx`
- **URL**: http://localhost:6006
- Each story should demonstrate component variants and states

## Git-Flow Workflow

This project uses **git-flow** for branch management and releases.

### Branch Structure

**Long-lived branches:**
- `main` - Production-ready code, only updated via release merges
- `develop` - Default branch for daily development, integration branch

**Short-lived branches:**
- `feature/*` - Feature development (created from `develop`)
- `release/v*` - Release preparation (created from `develop`)
- `hotfix/v*` - Emergency production fixes (created from `main`)

### Branch Management Rules

**NEVER reuse git branches.** Once a branch has been merged to `develop` or `main`, create a new branch for any additional work.

**Why:** Each branch should represent a single, focused unit of work with a clear, descriptive name and commit history. Reusing branches:
- Creates confusing commit history mixing unrelated changes
- Makes code review difficult (reviewers can't distinguish old vs. new changes)
- Complicates cherry-picking or reverting specific features
- Violates the principle that branches are cheap and disposable

**Instead:** Create a new branch with a more accurate description:
```bash
# Wrong - reusing old branch
git checkout old-feature-branch
# ... add more commits ...

# Correct - create new branch for new work
git checkout develop
git pull
git checkout -b feature/descriptive-name-for-new-work
# ... implement new changes ...
```

Git branches are free. Always create a new one for new work.

### Force Push Guidelines

**NEVER use `git push --force` or `git push -f` unless absolutely necessary.** Force pushing is dangerous and should be avoided in nearly all cases.

**Why force push is dangerous:**
- **Overwrites remote history** - Destroys commits that others may have based work on
- **Breaks collaborators' branches** - Anyone who pulled the branch will have divergent history
- **Loses work permanently** - Force-pushed-over commits can be difficult or impossible to recover
- **Breaks CI/CD pipelines** - Automated systems may reference commit SHAs that no longer exist
- **Violates git-flow principles** - Proper workflow should never require rewriting shared history

**When force push is NEVER acceptable:**
- On `main` or `develop` branches (should be protected on GitHub)
- On any branch that has an open pull request with reviews/comments
- On any branch where others have based their work
- To "fix" a merge conflict (use proper merge resolution instead)
- To remove a commit (use `git revert` instead)
- To clean up commit messages on a shared branch (messages are permanent)

**The ONLY acceptable use cases for force push:**
1. **Local history rewrite on unshared feature branch** - You're the only one who has ever pulled this branch, and you need to rebase or squash commits before creating a PR
   ```bash
   # Verify nobody else has this branch
   git checkout feature/my-branch
   git rebase -i develop
   # Only force push if this branch has never been shared
   git push --force-with-lease origin feature/my-branch
   ```

2. **Recovering from accidental push of sensitive data** - Immediately after accidentally pushing secrets/credentials (but notify all team members)
   ```bash
   # Remove sensitive file from history
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch path/to/sensitive/file' HEAD
   # Force push immediately and notify team
   git push --force-with-lease
   # Then rotate the exposed credentials
   ```

**Always use `--force-with-lease` instead of `--force`:**
- `git push --force-with-lease` is safer - it fails if someone else pushed to the branch since your last fetch
- `git push --force` blindly overwrites, even if you're destroying someone else's work

**Safe alternatives to force push:**

- **Instead of rebasing shared branches** - Use merge commits:
  ```bash
  # Wrong
  git rebase develop
  git push --force

  # Correct
  git merge develop
  git push
  ```

- **Instead of fixing a bad commit** - Use `git revert`:
  ```bash
  # Wrong
  git reset --hard HEAD~1
  git push --force

  # Correct
  git revert HEAD
  git push
  ```

- **Instead of cleaning up history** - Accept that commits are permanent, or squash during PR merge (GitHub does this automatically if configured)

**If you think you need to force push, STOP and ask yourself:**
1. Has anyone else ever pulled this branch?
2. Is there a safer way to achieve the same result?
3. Am I about to destroy someone's work?

If you answer "yes" to #1 or #3, or "unsure" to #2, **DO NOT force push.**

### Working with Git Worktrees

This project uses git worktrees (`.worktrees/` directory) for isolated development environments.

**CRITICAL: Always update branches before creating new worktrees:**

```bash
# WRONG - creating worktree without updating
git worktree add .worktrees/my-feature -b feature/my-feature

# CORRECT - update first, then create worktree
git checkout develop
git pull origin develop
git worktree add .worktrees/my-feature -b feature/my-feature
cd .worktrees/my-feature
npm install
```

**Why this matters:**
- Ensures your new branch starts from the latest code
- Prevents merge conflicts from working off stale code
- Avoids duplicating work that's already been merged
- Ensures all team changes are incorporated from the start

**Worktree best practices:**
- Always pull latest `develop` before creating feature branch worktrees
- Always pull latest `main` before creating hotfix branch worktrees
- Run `npm install` in new worktrees to install dependencies
- Delete worktrees when done: `git worktree remove .worktrees/my-feature`
- The `.worktrees/` directory is in `.gitignore` and should never be committed

### Daily Development Workflow

```bash
# Create feature branch (without worktrees)
git checkout develop
git pull
git checkout -b feature/my-feature

# Develop and commit changes
# ...

# Push and create PR targeting develop
git push -u origin feature/my-feature
# Create PR: feature/my-feature → develop
```

**CI/CD Build Times:**
- After pushing changes, expect CI checks to take approximately **5 minutes** to complete
- This includes: typecheck, lint, test, build, and build-storybook jobs
- PRs with auto-merge enabled will merge automatically once all checks pass

### Release Process

```bash
# 1. Determine version (semver):
#    - Breaking changes → Major (v1.0.0)
#    - New features → Minor (v0.5.0)
#    - Bug fixes only → Patch (v0.4.1)

# 2. Create release branch from develop
git checkout develop
git pull
git checkout -b release/v0.5.0

# 3. Bump version in package.json
# Edit package.json: "version": "0.5.0"

# 4. Commit and push
git add package.json
git commit -m "Bump version to 0.5.0"
git push -u origin release/v0.5.0

# 5. Create PR: release/v0.5.0 → main
# Wait for CI checks to pass, then merge
# GitHub Actions will automatically:
#    - Detect the version change
#    - Create tag v0.5.0
#    - Publish to npm
#    - Create GitHub release with notes
#    - Merge main to develop (bringing release changes back)
#    - Delete the release branch
#
# If merge to develop has conflicts:
#    - Auto-creates a PR for manual conflict resolution
#
# That's it! Fully automated after PR merge.
```

### Hotfix Process (Emergency Fixes)

```bash
# 1. Create hotfix from main
git checkout main
git pull
git checkout -b hotfix/v0.4.1

# 2. Fix bug and bump version
# Edit package.json: "version": "0.4.1"
git add .
git commit -m "Fix critical bug and bump to v0.4.1"

# 3. Create PR: hotfix/v0.4.1 → main
# Merge after review
# GitHub Actions will automatically:
#    - Create tag and publish to npm
#    - Merge main to develop (bringing hotfix changes back)
#    - Delete the hotfix branch
#
# If merge to develop has conflicts:
#    - Auto-creates a PR for manual conflict resolution
#
# That's it! Fully automated after PR merge.
```

### Publishing Details

**Fully Automated via GitHub Actions:**

When a release or hotfix branch is merged to `main`, the workflow automatically:
1. Detects version change in `package.json`
2. Creates a git tag (e.g., `v0.5.0`)
3. Runs pre-publish checks (via `prepublishOnly` hook)
4. Publishes to npm with provenance
5. Creates GitHub release with auto-generated notes
6. Merges the release/hotfix branch back to `develop`
7. Deletes the release/hotfix branch
8. Posts a summary comment on the original PR

**Conflict Handling:**
- If the merge to `develop` has conflicts, a PR is automatically created for manual resolution
- The release branch is preserved until conflicts are resolved

**Pre-publish checks** (enforced by `prepublishOnly` hook):
- Type checking passes (`npm run typecheck`)
- All tests pass (`npm run test:ci`)
- Build succeeds (`npm run build`)

**Security:**
- Uses npm OIDC for secure publishing (no long-lived tokens)
- Publishes with provenance (`--provenance` flag) for supply chain security

## Important Notes

- **NO** commit messages mentioning "Claude" or AI assistance (per user preferences)
- Never use TypeScript `as` type assertions to bypass type issues - fix the types properly
- Make frequent small commits between working steps
- Always test changes before committing
- Check official documentation before assumptions (CRITICAL per user preferences)
- **Use standard tools instead of manual file manipulation** - Always prefer using established CLI tools and commands over manually parsing or editing configuration files:
  - Use `npm version [major|minor|patch]` to bump versions, not manual package.json edits
  - Use `jq` for JSON manipulation instead of regex/sed on JSON files
  - Use package manager commands (`npm install`, `npm uninstall`) instead of editing package.json dependencies
  - Use git commands for repository information instead of parsing `.git/` files
  - Standard tools handle edge cases, validation, and formatting that manual edits miss

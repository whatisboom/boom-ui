# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**boom-ui** is an accessibility-first React component library built with TypeScript, Vite, and Framer Motion. Components follow a strict design system approach with CSS tokens, theme support, and comprehensive accessibility testing.

## Development Commands

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
- Typography: `src/styles/tokens/typography.css`
- Spacing: `src/styles/tokens/spacing.css`
- Shadows: `src/styles/tokens/shadows.css`
- Theme variables: `src/styles/tokens/theme.css`

### Testing Requirements
- **Coverage threshold**: 80% minimum (lines, functions, branches, statements)
- **Accessibility**: Use `axe()` from vitest-axe in every component test
- **Testing Library**: Use @testing-library/react (not enzyme or others)
- **User interactions**: Use @testing-library/user-event for simulating events
- **Setup**: Tests automatically include vitest-axe matchers and jsdom environment

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

### Style Implementation
- Use CSS variables from tokens, never hardcode colors/spacing
- Follow BEM-like naming in CSS modules
- Support theme switching via ThemeProvider context
- Prefer CSS Grid/Flexbox with token-based spacing
- Animation: Use Framer Motion `motion` components

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

### Daily Development Workflow

```bash
# Create feature branch
git checkout develop
git pull
git checkout -b feature/my-feature

# Develop and commit changes
# ...

# Push and create PR targeting develop
git push -u origin feature/my-feature
# Create PR: feature/my-feature → develop
```

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
#    - Merge release branch back to develop
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
#    - Merge hotfix branch back to develop
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

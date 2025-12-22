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
4. Export component and types from `index.ts`
5. Add to main `src/index.ts` for public API
6. Write comprehensive tests including `axe()` accessibility check
7. Create Storybook stories showing all variants

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

## Pre-publish Checks

Before publishing (enforced by `prepublishOnly` hook):
1. Type checking passes (`npm run typecheck`)
2. All tests pass (`npm test`)
3. Build succeeds (`npm run build`)

## Important Notes

- **NO** commit messages mentioning "Claude" or AI assistance (per user preferences)
- Never use TypeScript `as` type assertions to bypass type issues - fix the types properly
- Make frequent small commits between working steps
- Always test changes before committing
- Check official documentation before assumptions (CRITICAL per user preferences)

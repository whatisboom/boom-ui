# Architecture Reference

## Design Tokens

All design tokens live in `src/styles/tokens/`:

| File | Purpose |
|------|---------|
| `colors.css` | Base color definitions |
| `palettes.css` | Color palettes and schemes |
| `typography.css` | Font families, sizes, weights |
| `spacing.css` | Spacing scale (4px increments) |
| `shadows.css` | Box shadow definitions |
| `theme.css` | CSS custom properties for theming |

### Spacing Token System

Layout components accept spacing as **numbers** that map to design tokens:

| Token | CSS Variable | Value | Use Case |
|-------|--------------|-------|----------|
| 4 | --boom-spacing-4 | 16px / 1rem | Default spacing |
| 6 | --boom-spacing-6 | 24px / 1.5rem | Medium spacing |
| 8 | --boom-spacing-8 | 32px / 2rem | Large spacing |
| 12 | --boom-spacing-12 | 48px / 3rem | Section spacing |

## TypeScript Configuration

- **Strict mode**: enabled
- **Path alias**: `@/*` maps to `src/*`
- **No unused vars**: enforced (no-unused-locals, no-unused-parameters)
- **Target**: ES2020, Module: ESNext
- **JSX**: react-jsx (new transform)

## ESLint Rules (Strictly Enforced)

- `@typescript-eslint/no-explicit-any`: ERROR (never use `any`)
- `react/react-in-jsx-scope`: OFF (modern React)
- Accessibility plugin: jsx-a11y (all rules active)

## Build Output

- **Entry**: `src/index.ts` (explicitly exports all public components)
- **Format**: ES modules only (ESM)
- **Externals**: react, react-dom, react/jsx-runtime (peer dependencies, not bundled)
- **CSS**: Bundled to `dist/styles/index.css`, imported at root level

## Module Federation

For micro-frontend architectures:

- Config: `vite.mf.config.ts`
- Dev: `npm run dev:mf`
- Build: `npm run build:mf`

## Shared Types (`src/types/index.ts`)

Common types used across components:

- `Size` - Standard size variants: 'sm' | 'md' | 'lg'
- `Variant` - Standard color variants: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
- `PolymorphicProps<E>` - Allows components to render as different elements via `as` prop
- `MotionProps` - Animation preferences (includes `disableAnimation` flag)

## Storybook Setup

- **Framework**: React + Vite
- **Addons**: a11y (accessibility audit), dark-mode switcher, docs
- **Stories location**: `src/**/*.stories.tsx`
- **URL**: http://localhost:6006

## Warnings Policy

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

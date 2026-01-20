# Codebase Structure

**Analysis Date:** 2026-01-19

## Directory Layout

```
boom-ui/
├── .github/                    # GitHub workflows and templates
├── .husky/                     # Git hooks (pre-push checks)
├── .planning/                  # GSD codebase analysis documents
├── .storybook/                 # Storybook configuration
├── coverage/                   # Test coverage reports (gitignored)
├── dist/                       # Build output (gitignored)
├── docs/                       # Documentation (layout-guide.md, etc.)
├── node_modules/               # Dependencies (gitignored)
├── scripts/                    # Build scripts (build-strict.sh, test-strict.sh)
├── src/                        # Source code (see detailed breakdown below)
├── storybook-static/           # Storybook build output
├── tests/                      # Global test setup and utilities
├── package.json                # Package manifest and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── vitest.config.ts            # Vitest test configuration
├── eslint.config.js            # ESLint configuration
├── CLAUDE.md                   # Project instructions for Claude Code
├── README.md                   # Public documentation
├── SECURITY.md                 # Security policy
└── SECURITY_CHECKLIST.md       # Security review checklist
```

## Source Directory Structure

```
src/
├── components/                 # All UI components
│   ├── Alert/                  # Component-specific directory
│   │   ├── Alert.tsx           # Implementation
│   │   ├── Alert.types.ts      # TypeScript types
│   │   ├── Alert.module.css    # Scoped styles
│   │   ├── Alert.test.tsx      # Tests
│   │   ├── Alert.stories.tsx   # Storybook stories
│   │   └── index.ts            # Public exports
│   ├── primitives/             # Low-level overlay components
│   │   ├── Drawer/
│   │   ├── Modal/
│   │   ├── Overlay/
│   │   ├── Popover/
│   │   ├── Portal/
│   │   └── types.ts            # Shared primitive types
│   └── ... (40+ components)
├── hooks/                      # Custom React hooks
│   ├── useClickOutside.ts
│   ├── useClickOutside.test.ts
│   ├── useFocusTrap.ts
│   ├── useScrollLock.ts
│   ├── useKeyboardShortcut.ts
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   ├── usePopoverPosition.ts
│   ├── useStableCallback.ts
│   └── index.ts                # Hook exports
├── styles/                     # Global styles and tokens
│   ├── tokens/                 # CSS custom properties
│   │   ├── colors.css          # Semantic color tokens
│   │   ├── palettes.css        # Full color palettes
│   │   ├── spacing.css         # Spacing scale
│   │   ├── typography.css      # Font tokens
│   │   ├── shadows.css         # Shadow tokens
│   │   ├── theme.css           # Theme-specific variables
│   │   └── index.css           # Token exports
│   ├── fonts.css               # Font face declarations
│   ├── reset.css               # CSS reset
│   └── index.css               # Global style entry
├── types/                      # Shared TypeScript types
│   ├── index.ts                # Size, Variant, PolymorphicProps, MotionProps
│   └── vitest-axe.d.ts         # vitest-axe type declarations
├── utils/                      # Utility functions
│   ├── classnames.ts           # CSS class merging (cn utility)
│   ├── classnames.test.ts
│   ├── focus-management.ts     # Keyboard navigation helpers
│   └── focus-management.test.ts
├── index.ts                    # Main package entry point
├── form.ts                     # Form subpath export entry
├── vite-env.d.ts               # Vite environment types
└── vitest.d.ts                 # Vitest type augmentations
```

## Directory Purposes

**src/components/**
- Purpose: All user-facing UI components
- Contains: Atomic components (Button, Input), layout (Box, Stack, Grid), data display (Table, Card), overlays (Modal, Drawer), feedback (Toast, Alert), navigation (Nav, Breadcrumbs, Sidebar)
- Key files: Each component follows strict structure (see "Component Structure" below)

**src/components/primitives/**
- Purpose: Low-level overlay and portal components
- Contains: Portal (React portal wrapper), Overlay (backdrop + event handlers), Modal, Drawer, Popover
- Key files: `types.ts` defines shared primitive interfaces

**src/hooks/**
- Purpose: Reusable React hooks for component behaviors
- Contains: Focus management, click detection, scroll locking, keyboard shortcuts, debouncing, media queries
- Key files: `index.ts` exports all hooks

**src/styles/**
- Purpose: Global CSS and design token system
- Contains: CSS reset, font declarations, design tokens
- Key files: `index.css` (global entry), `tokens/index.css` (token entry)

**src/styles/tokens/**
- Purpose: CSS custom properties for design system
- Contains: Color palettes, spacing scale, typography tokens, shadows, theme variables
- Key files: `theme.css` (theme-specific tokens), `palettes.css` (full color system)

**src/types/**
- Purpose: Shared TypeScript types and interfaces
- Contains: Common prop types used across components
- Key files: `index.ts` (Size, Variant, PolymorphicProps)

**src/utils/**
- Purpose: Pure utility functions
- Contains: Class name merging, focus management helpers
- Key files: `classnames.ts` (cn utility for conditional classes)

## Component Structure Pattern

Every component follows this exact structure:

```
ComponentName/
├── ComponentName.tsx           # Implementation with forwardRef
├── ComponentName.types.ts      # TypeScript interfaces/props
├── ComponentName.module.css    # Scoped styles
├── ComponentName.test.tsx      # Unit + accessibility tests
├── ComponentName.stories.tsx   # Storybook documentation
└── index.ts                    # Public exports (component + types)
```

**Example:** `src/components/Button/`
- `Button.tsx` - React component with forwardRef
- `Button.types.ts` - ButtonProps interface
- `Button.module.css` - Button styles with variants
- `Button.test.tsx` - Tests including axe() accessibility check
- `Button.stories.tsx` - Interactive documentation
- `index.ts` - Exports Button component and ButtonProps type

## Key File Locations

**Entry Points:**
- `src/index.ts`: Main package entry, exports all public components/types/hooks
- `src/form.ts`: Form subpath entry for tree-shaking (`@whatisboom/boom-ui/form`)
- `package.json`: Defines exports map (. → index, ./form → form, ./styles → CSS)

**Configuration:**
- `tsconfig.json`: TypeScript strict mode, path alias `@/*` → `src/*`
- `vite.config.ts`: Library build config, CSS module naming, externals
- `vitest.config.ts`: Test configuration with jsdom environment
- `eslint.config.js`: Linting rules (no-explicit-any, jsx-a11y)
- `.storybook/main.ts`: Storybook addons and framework config

**Core Logic:**
- `src/components/ThemeProvider/ThemeProvider.tsx`: Theme context and color resolution
- `src/components/Toast/ToastProvider.tsx`: Global toast queue management
- `src/components/Form/Form.tsx`: Form validation with react-hook-form + Zod

**Testing:**
- `tests/setup.ts`: Global test setup (vitest-axe matchers)
- `{Component}/{Component}.test.tsx`: Component-specific tests
- `vitest.config.ts`: Coverage thresholds (80% minimum)

**Documentation:**
- `CLAUDE.md`: Development guidelines for Claude Code
- `README.md`: Public package documentation
- `docs/layout-guide.md`: Layout component usage guide
- `SECURITY.md`: Security policy and vulnerability reporting

## Naming Conventions

**Files:**
- Components: PascalCase (Button.tsx, ThemeProvider.tsx)
- Types: PascalCase.types.ts (Button.types.ts)
- Tests: PascalCase.test.tsx (Button.test.tsx)
- Stories: PascalCase.stories.tsx (Button.stories.tsx)
- Styles: PascalCase.module.css (Button.module.css)
- Hooks: camelCase with "use" prefix (useClickOutside.ts)
- Utils: camelCase (classnames.ts, focus-management.ts)

**Directories:**
- Components: PascalCase (Button/, ThemeProvider/)
- Utilities: lowercase (hooks/, utils/, types/, styles/)

**CSS Classes:**
- Module pattern: `[name]__[local]___[hash:base64:5]`
- Example: `Button__button___a1b2c` for `.button` in Button.module.css

**Exports:**
- Components: Named exports (export { Button })
- Types: Named type exports (export type { ButtonProps })
- Default exports: Not used (named exports only for tree-shaking)

## Where to Add New Code

**New UI Component:**
- Primary code: `src/components/ComponentName/ComponentName.tsx`
- Types: `src/components/ComponentName/ComponentName.types.ts`
- Styles: `src/components/ComponentName/ComponentName.module.css`
- Tests: `src/components/ComponentName/ComponentName.test.tsx`
- Stories: `src/components/ComponentName/ComponentName.stories.tsx`
- Index: `src/components/ComponentName/index.ts`
- Then add exports to `src/index.ts`

**New Primitive Component:**
- Implementation: `src/components/primitives/ComponentName/ComponentName.tsx`
- Shared types: Add to `src/components/primitives/types.ts` if reusable
- Export from `src/index.ts`

**New Hook:**
- Implementation: `src/hooks/useHookName.ts`
- Tests: `src/hooks/useHookName.test.ts`
- Export from `src/hooks/index.ts`
- Do NOT export from `src/index.ts` unless hook is part of public API

**New Utility:**
- Implementation: `src/utils/utilName.ts`
- Tests: `src/utils/utilName.test.ts`
- Import directly where needed (utils are not publicly exported)

**New Shared Type:**
- Add to `src/types/index.ts`
- Export from `src/index.ts` if part of public API

**New Design Token:**
- Colors: Add to `src/styles/tokens/colors.css` or `palettes.css`
- Spacing: Add to `src/styles/tokens/spacing.css`
- Typography: Add to `src/styles/tokens/typography.css`
- Shadows: Add to `src/styles/tokens/shadows.css`
- Theme-specific: Add to `src/styles/tokens/theme.css`

**New Form Component:**
- Same pattern as regular component, but in `src/components/Form/`
- Export from `src/form.ts` (not `src/index.ts`) for tree-shaking

## Special Directories

**.planning/**
- Purpose: GSD codebase analysis documents
- Generated: Yes (by /gsd:map-codebase command)
- Committed: Yes

**coverage/**
- Purpose: Test coverage HTML reports
- Generated: Yes (by npm run test:coverage)
- Committed: No (gitignored)

**dist/**
- Purpose: Build output (compiled JS, CSS, type definitions)
- Generated: Yes (by npm run build)
- Committed: No (gitignored)

**storybook-static/**
- Purpose: Static Storybook build for deployment
- Generated: Yes (by npm run build-storybook)
- Committed: No (gitignored)

**node_modules/**
- Purpose: Installed dependencies
- Generated: Yes (by npm install)
- Committed: No (gitignored)

**.github/**
- Purpose: GitHub Actions workflows and PR templates
- Generated: No (manually created)
- Committed: Yes

**.husky/**
- Purpose: Git hooks for pre-push checks
- Generated: Yes (by husky install)
- Committed: Yes

**scripts/**
- Purpose: Build and test wrapper scripts
- Generated: No (manually created)
- Committed: Yes

**tests/**
- Purpose: Global test setup and shared test utilities
- Generated: No (manually created)
- Committed: Yes

---

*Structure analysis: 2026-01-19*

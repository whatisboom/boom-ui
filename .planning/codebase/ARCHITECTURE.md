# Architecture

**Analysis Date:** 2026-01-19

## Pattern Overview

**Overall:** Component Library with Design System Architecture

**Key Characteristics:**
- Isolated, composable React components following strict accessibility-first patterns
- CSS-in-JS via CSS Modules with design token system for theming
- Context-based providers for cross-cutting concerns (Theme, Toast, Forms)
- Primitive components as foundation for complex UI patterns
- forwardRef pattern for DOM access and ref composition

## Layers

**Presentation Layer (Components):**
- Purpose: User-facing UI components with complete styling and behavior
- Location: `src/components/`
- Contains: Interactive components (Button, Input, Select), layout components (Box, Stack, Grid), data display (Table, Card), feedback (Toast, Alert), navigation (Nav, Breadcrumbs, Sidebar)
- Depends on: Primitives, hooks, utils, design tokens
- Used by: Consumer applications

**Primitive Layer:**
- Purpose: Foundational low-level components for overlay patterns
- Location: `src/components/primitives/`
- Contains: Portal (DOM portals), Overlay (backdrop), Modal, Drawer, Popover
- Depends on: Hooks (focus trap, scroll lock, click outside), Framer Motion
- Used by: Higher-level components (Toast, Select dropdowns, Tooltips)

**Context Layer:**
- Purpose: Global state and configuration providers
- Location: Component-specific (e.g., `src/components/ThemeProvider/`, `src/components/Toast/`, `src/components/Form/`)
- Contains: ThemeProvider (theme switching), ToastProvider (notification queue), Form context (validation state), Table context (sorting/selection)
- Depends on: React Context API
- Used by: Consumer applications (wrap app root), child components via hooks

**Hooks Layer:**
- Purpose: Reusable stateful logic and side effects
- Location: `src/hooks/`
- Contains: useClickOutside, useFocusTrap, useScrollLock, useKeyboardShortcut, useDebounce, useMediaQuery, usePopoverPosition, useStableCallback
- Depends on: React hooks API
- Used by: All components needing these behaviors

**Utilities Layer:**
- Purpose: Pure functions for common operations
- Location: `src/utils/`
- Contains: classnames (CSS class merging), focus-management (keyboard navigation helpers)
- Depends on: Nothing
- Used by: All components

**Design Token Layer:**
- Purpose: CSS custom properties for consistent design system
- Location: `src/styles/tokens/`
- Contains: colors.css, palettes.css, spacing.css, typography.css, shadows.css, theme.css
- Depends on: Nothing
- Used by: All component CSS modules via var() references

**Shared Types Layer:**
- Purpose: Common TypeScript interfaces and types
- Location: `src/types/`
- Contains: Size, Variant, PolymorphicProps, MotionProps, TextAlign
- Depends on: React types
- Used by: All components requiring standard prop types

## Data Flow

**Component Initialization:**

1. Consumer imports component from `@whatisboom/boom-ui`
2. Component renders with forwardRef wrapping
3. Props merged with defaults (variant, size, etc.)
4. CSS classes computed via classnames utility
5. Design tokens applied via CSS Modules
6. Component returns JSX with motion.div wrapper (if animated)

**Theme Flow:**

1. ThemeProvider wraps app root with theme context
2. Reads system preference via matchMedia API
3. Applies theme attribute to document root
4. CSS custom properties switch based on data-theme attribute
5. useTheme() hook provides programmatic access to theme colors
6. Components reference theme via CSS vars or useTheme()

**State Management:**
- Local state via useState for component-specific state (open/closed, value, validation)
- Context state for shared concerns (theme, toast queue, form validation)
- No global state library - pure React patterns

## Key Abstractions

**Polymorphic Components:**
- Purpose: Allow components to render as different HTML elements
- Examples: `src/components/Box/Box.tsx`, `src/components/Typography/Typography.tsx`
- Pattern: Generic `as` prop with ElementType constraint, spreads ComponentPropsWithoutRef

**forwardRef Pattern:**
- Purpose: Expose DOM refs to consumers for imperative operations
- Examples: `src/components/Button/Button.tsx`, `src/components/Input/Input.tsx`
- Pattern: React.forwardRef wrapper, ref passed to underlying DOM element

**Design Token Mapping:**
- Purpose: Abstract spacing/colors into semantic tokens
- Examples: Box component maps `gap={4}` → `var(--boom-spacing-4)` → `1rem`
- Pattern: Numeric props map to CSS custom properties

**Compound Components:**
- Purpose: Related components that share context
- Examples: Table (Table, TableHead, TableBody, TableRow, TableCell), Tabs (Tabs, TabList, Tab, TabPanel), Breadcrumbs (Breadcrumbs, BreadcrumbItem)
- Pattern: Parent provides context, children consume via useContext hooks

**Render Props Pattern:**
- Purpose: Flexible rendering with access to internal state
- Examples: Form component provides form methods to children function
- Pattern: children as function receiving context values

## Entry Points

**Main Export:**
- Location: `src/index.ts`
- Triggers: Consumer imports from `@whatisboom/boom-ui`
- Responsibilities: Exports all public components, types, and hooks; imports global CSS

**Form Subpath Export:**
- Location: `src/form.ts`
- Triggers: Consumer imports from `@whatisboom/boom-ui/form`
- Responsibilities: Tree-shakeable form components (opt-in for apps not using forms)

**Build Entry:**
- Location: `vite.config.ts` defines entry points
- Triggers: `npm run build` command
- Responsibilities: Bundles to ESM format, externalizes peer dependencies, generates TypeScript definitions

## Error Handling

**Strategy:** Defensive programming with ErrorBoundary fallback

**Patterns:**
- ErrorBoundary component catches React errors and displays fallback UI
- Console warnings for invalid prop combinations (e.g., Grid with both columns and minColumnWidth)
- Type safety prevents many errors at compile time (strict TypeScript)
- Accessibility errors caught by vitest-axe in tests

## Cross-Cutting Concerns

**Logging:** Console warnings for development-time issues (misused props, accessibility violations in tests)

**Validation:**
- Form components use Zod schemas with react-hook-form integration
- Props validated via TypeScript strict mode
- Accessibility validated via vitest-axe in every component test

**Authentication:** Not applicable (component library, no auth layer)

**Animation:**
- Framer Motion for all animations
- Respects prefers-reduced-motion
- disableAnimation prop available on motion-enabled components
- Consistent animation durations (0.2s for modals, 3s default for toasts)

**Focus Management:**
- useFocusTrap hook for modals/drawers
- Keyboard navigation support (Arrow keys, Tab, Enter, Escape)
- Focus visible styles via :focus-visible pseudo-class
- Focus ring colors from design tokens

**Scroll Management:**
- useScrollLock hook prevents body scroll when overlays open
- Automatic cleanup on unmount

**Memory Management:**
- All event listeners cleaned up in useEffect return functions
- Timers/intervals cleared on unmount
- AnimatePresence handles exit animations before unmount

---

*Architecture analysis: 2026-01-19*

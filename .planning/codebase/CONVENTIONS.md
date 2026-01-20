# Coding Conventions

**Analysis Date:** 2026-01-19

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Button.tsx`, `RadioGroup.tsx`)
- Types: PascalCase with `.types.ts` suffix (e.g., `Button.types.ts`)
- Tests: Match source name with `.test.tsx` or `.test.ts` (e.g., `Button.test.tsx`)
- Stories: Match source name with `.stories.tsx` (e.g., `Button.stories.tsx`)
- CSS Modules: Match source name with `.module.css` (e.g., `Button.module.css`)
- Utilities: camelCase (e.g., `classnames.ts`, `focus-management.ts`)
- Index files: `index.ts` for barrel exports

**Functions:**
- Components: PascalCase (e.g., `Button`, `ThemeProvider`)
- Utilities: camelCase (e.g., `cn`, `getFocusableElements`, `createFocusTrap`)
- Hooks: camelCase with `use` prefix (e.g., `useTheme`, `useClickOutside`, `useFocusTrap`)
- Event handlers: camelCase with `handle` prefix (e.g., `handleClick`, `handleSubmit`)

**Variables:**
- camelCase for all variables (e.g., `buttonClassName`, `autoId`, `disabled`)
- SCREAMING_SNAKE_CASE for constants (e.g., `GRID_BREAKPOINTS`)

**Types:**
- Interfaces and types: PascalCase (e.g., `ButtonProps`, `TooltipPlacement`)
- Component props: ComponentName + `Props` (e.g., `ButtonProps`, `InputProps`)
- Type unions: PascalCase (e.g., `Size`, `Variant`, `MotionProps`)

## Code Style

**Formatting:**
- No Prettier config detected - formatting handled by ESLint
- Indentation: 2 spaces
- Semicolons: Required
- Quotes: Single quotes for strings
- Trailing commas: Used in multi-line objects/arrays
- Line length: No strict limit, but kept readable

**Linting:**
- Tool: ESLint 9 with flat config (`eslint.config.js`)
- Key rules enforced:
  - `@typescript-eslint/no-explicit-any`: ERROR - Never use `any` type
  - `@typescript-eslint/no-unused-vars`: ERROR
  - `@typescript-eslint/consistent-type-imports`: ERROR - Use `type` imports
  - `prefer-const`: ERROR
  - `no-var`: ERROR
  - `eqeqeq`: ERROR (smart mode)
  - `curly`: ERROR (all blocks require braces)
  - `react/react-in-jsx-scope`: OFF (modern React)
  - `react/prop-types`: OFF (TypeScript provides type checking)
  - `react/no-unstable-nested-components`: ERROR
  - `react/jsx-no-useless-fragment`: ERROR
  - `react/self-closing-comp`: ERROR
  - `react/jsx-curly-brace-presence`: ERROR (never for props/children)
- Plugins: TypeScript ESLint, React, React Hooks, JSX A11y, Storybook, React Refresh
- Zero tolerance: `--max-warnings 0` enforced

## Import Organization

**Order:**
1. Type imports from React
2. Value imports from React
3. Third-party libraries (Framer Motion, etc.)
4. Internal imports with `@/` alias
5. Type imports from internal
6. CSS modules (always last)

**Example:**
```typescript
import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef, useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/classnames';
import type { ButtonProps } from './Button.types';
import styles from './Button.module.css';
```

**Path Aliases:**
- `@/*` maps to `src/*` (configured in `tsconfig.json` and `vite.config.ts`)
- Used for all internal imports: `@/utils/classnames`, `@/components/Button`, `@/types`

**Type Imports:**
- Use `import type` for type-only imports (enforced by ESLint)
- Separate type and value imports

## Error Handling

**Patterns:**
- Use `try-catch` for error boundaries and async operations
- Return early for validation failures
- Use `ErrorBoundary` component for React error boundaries
- Log errors to console in development (no production error logging detected)

**Example from `tests/setup.ts`:**
```typescript
try {
  cleanup();
} catch (e) {
  errors.push(new Error(`React cleanup failed: ${e}`));
}
```

## Logging

**Framework:** Console methods (no external logging library)

**Patterns:**
- Use `console.warn` for warnings (detected in test cleanup)
- Use `console.error` for errors
- Use `console.log` for debugging (mostly in tests)
- Tests fail on `console.warn` and `console.error` in strict mode

## Comments

**When to Comment:**
- Complex algorithms or non-obvious logic
- Accessibility considerations (e.g., `aria-hidden="true"`)
- TODO/FIXME for known issues (minimal usage - only 1 TODO found)
- Why code exists, not what it does

**JSDoc/TSDoc:**
- Used for component props in `.types.ts` files
- Example from `Button.types.ts`:
```typescript
export interface ButtonProps extends ButtonHTMLProps, MotionProps {
  /**
   * Visual variant
   */
  variant?: Variant;
  /**
   * Size variant
   */
  size?: Size;
  /**
   * Loading state
   */
  loading?: boolean;
}
```
- Not used for implementation files
- Not used for internal functions

## Function Design

**Size:** Functions kept small and focused - most under 50 lines

**Parameters:**
- Props destructured in function signature
- Default values provided in destructuring: `size = 'md'`, `disabled = false`
- Rest props collected with `...props` and spread to underlying elements

**Return Values:**
- Components: JSX elements
- Utilities: Typed return values (never `any`)
- Hooks: Tuples, objects, or single values depending on hook purpose

**Example pattern from `Button.tsx`:**
```typescript
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      ...props
    },
    ref
  ) => {
    // Implementation
  }
);
```

## Module Design

**Exports:**
- Named exports only (no default exports)
- All public components and types exported from component's `index.ts`
- Main `src/index.ts` re-exports all public API

**Example from `src/components/Button/index.ts`:**
```typescript
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

**Barrel Files:**
- Used extensively - every component has `index.ts`
- Main `src/index.ts` exports all public components and types
- Separate entry point for form utilities: `src/form.ts`

## Component Patterns

**forwardRef:**
- All interactive components use `React.forwardRef`
- Generic type parameters specify ref type and props type
- `displayName` always set for debugging

**Example:**
```typescript
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    // Implementation
  }
);

Input.displayName = 'Input';
```

**Conditional Rendering:**
- Use boolean conditions with `&&` for simple cases
- Use ternary for either/or cases
- Use conditional classNames with `cn` utility

**Class Name Construction:**
- Use `cn` utility from `@/utils/classnames`
- Combines CSS module classes with conditional logic
- Pattern: `cn(styles.base, condition && styles.modifier, className)`

**Example from `Button.tsx`:**
```typescript
const buttonClassName = cn(
  styles.button,
  styles[variant],
  styles[size],
  loading && styles.loading,
  className
);
```

## TypeScript Conventions

**Strict Mode:** Enabled in `tsconfig.json`
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitAny: true`

**Type Definitions:**
- Separate `.types.ts` files for each component
- Shared types in `src/types/index.ts`
- Export all types from main `src/index.ts`

**Type Construction:**
- Use `type` for unions and aliases
- Use `interface` for object shapes
- Extend with `extends` keyword
- Omit conflicting types with `Omit<>` utility type

**Example from `Button.types.ts`:**
```typescript
type ButtonHTMLProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onAnimationStart'
  | 'onDrag'
  | 'onDragEnd'
  | 'onDragStart'
>;

export interface ButtonProps extends ButtonHTMLProps, MotionProps {
  variant?: Variant;
  size?: Size;
}
```

## CSS Conventions

**Modules:**
- Scoped CSS modules for all components
- Naming pattern: `[name]__[local]___[hash:base64:5]`
- Import as `styles` object

**Class Naming:**
- Use semantic names: `.button`, `.input`, `.wrapper`
- Use modifiers: `.primary`, `.disabled`, `.loading`
- Use size variants: `.sm`, `.md`, `.lg`
- Use state classes: `.checked`, `.error`, `.hasError`

**Design Tokens:**
- All values from CSS variables in `src/styles/tokens/`
- Never hardcode colors, spacing, typography
- Use `var(--boom-spacing-4)`, `var(--boom-theme-primary)`, etc.

**Example from `Button.module.css`:**
```css
.button {
  display: inline-flex;
  align-items: center;
  gap: var(--boom-spacing-2);
  font-family: var(--boom-font-sans);
  transition: all var(--boom-transition-base);
}

.md {
  height: 2.5rem;
  padding: 0 var(--boom-spacing-4);
  font-size: var(--boom-font-size-base);
}
```

## Accessibility Conventions

**ARIA Attributes:**
- Use `aria-label` for icon-only elements
- Use `aria-labelledby` for complex labels
- Use `aria-describedby` for helper text and errors
- Use `aria-invalid` for form errors
- Use `aria-busy` for loading states
- Use `aria-hidden="true"` for decorative elements

**Semantic HTML:**
- Prefer semantic elements: `<button>`, `<input>`, `<label>`
- Use `role` when semantic HTML insufficient
- Use `role="alert"` for error messages

**ID Generation:**
- Use `useId()` hook for unique IDs
- Pattern: `id`, `${id}-error`, `${id}-helper`

**Example from `Input.tsx`:**
```typescript
const autoId = useId();
const id = providedId || autoId;
const errorId = `${id}-error`;

<input
  aria-invalid={error ? 'true' : 'false'}
  aria-describedby={error ? errorId : helperText ? helperTextId : undefined}
/>
```

## Animation Conventions

**Framer Motion:**
- Use `motion` components from `framer-motion`
- Support `disableAnimation` prop (from `MotionProps` type)
- Respect `prefers-reduced-motion` media query
- Keep animations subtle and fast (0.1s - 0.3s)

**Pattern from `Button.tsx`:**
```typescript
if (disableAnimation) {
  return <button {...commonProps}>{content}</button>;
}

return (
  <motion.button
    {...commonProps}
    whileTap={disabled || loading ? undefined : { scale: 0.98 }}
    transition={{ duration: 0.1 }}
  >
    {content}
  </motion.button>
);
```

## Memory Management

**Cleanup Required:**
- Event listeners must be cleaned up in `useEffect` return
- Timers must be cleared in `useEffect` return
- Animation frames must be canceled
- Use `useScrollLock` hook for scroll locking (auto cleanup)

**Pattern:**
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

---

*Convention analysis: 2026-01-19*

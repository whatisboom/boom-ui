# Testing Patterns

**Analysis Date:** 2026-01-19

## Test Framework

**Runner:**
- Vitest 4.0.17
- Config: `vitest.config.ts`

**Assertion Library:**
- Vitest built-in assertions (Chai-compatible)
- `@testing-library/jest-dom` matchers (e.g., `toBeInTheDocument`, `toBeDisabled`)

**Run Commands:**
```bash
npm test                    # Run all tests in watch mode
npm run test:ci             # Run tests in strict mode (no warnings allowed)
npm run test:ui             # Interactive test UI
npm run test:coverage       # Coverage report with 80% threshold
npx vitest Button           # Run tests matching pattern
npx vitest src/components/Button/Button.test.tsx  # Run specific file
```

## Test File Organization

**Location:**
- Co-located with source files (same directory as component)
- Pattern: `ComponentName.test.tsx` next to `ComponentName.tsx`
- Utility tests: `utils/*.test.ts`
- Hook tests: `hooks/*.test.ts`

**Naming:**
- Match source file name exactly with `.test.tsx` or `.test.ts` suffix
- Examples: `Button.test.tsx`, `classnames.test.ts`, `useDebounce.test.ts`

**Structure:**
```
src/components/Button/
├── Button.tsx
├── Button.types.ts
├── Button.module.css
├── Button.test.tsx         ← Co-located
├── Button.stories.tsx
└── index.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Button } from './Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Patterns:**
- One `describe` block per component/module
- `it` for individual test cases
- Descriptive test names: "should [expected behavior]"
- Group related tests with comments or nested `describe` blocks
- Always include accessibility test with `axe()`

## Test Setup

**Global Setup:** `tests/setup.ts`
- Imports `@testing-library/jest-dom` matchers
- Extends Vitest with `vitest-axe` matchers
- Mocks Framer Motion to skip animations
- Mocks `HTMLCanvasElement.getContext` for axe-core color contrast
- Mocks `window.getComputedStyle` for pseudo-elements
- Installs timer and event listener tracking
- Configures `matchMedia` to return `prefers-reduced-motion: true`
- Enhanced cleanup after each test (timers, listeners, DOM, React)

**Test Utils:** `tests/test-utils.tsx`
- Custom `render` function with automatic cleanup tracking
- Registers cleanup callbacks for portals
- Re-exports all `@testing-library/react` utilities
- Example: `render(<Component />)` tracks and cleans up portals

**Environment:**
- jsdom (configured in `vitest.config.ts`)
- Globals: `true` (no need to import `describe`, `it`, `expect`)

## Mocking

**Framework:** Vitest built-in mocking (`vi.fn()`, `vi.mock()`)

**Patterns:**

**Function mocking:**
```typescript
import { vi } from 'vitest';

const handleSubmit = vi.fn();
render(<Form onSubmit={handleSubmit}>...</Form>);
expect(handleSubmit).toHaveBeenCalledWith(expectedData);
```

**Event handler tracking (without mocking):**
```typescript
let clicked = false;
const handleClick = () => { clicked = true; };
render(<Button onClick={handleClick}>Click me</Button>);
await userEvent.click(screen.getByRole('button'));
expect(clicked).toBe(true);
```

**Module mocking (Framer Motion):**
```typescript
// In tests/setup.ts
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');

  return {
    ...actual,
    motion: motionProxy,  // Proxy that renders plain elements
    AnimatePresence: ({ children }) => children ? createElement(Fragment, null, children) : null,
  };
});
```

**What to Mock:**
- External animations (Framer Motion - mocked globally)
- Browser APIs not available in jsdom (`matchMedia`, `requestAnimationFrame`)
- Canvas rendering (`HTMLCanvasElement.getContext`)

**What NOT to Mock:**
- Component internals
- React hooks (test real behavior)
- DOM interactions (use jsdom)
- User events (use `@testing-library/user-event`)

## User Interactions

**Library:** `@testing-library/user-event` v14.5.1

**Setup:**
```typescript
import userEvent from '@testing-library/user-event';

// In test
const user = userEvent.setup({ delay: null });  // No delay for faster tests
```

**Patterns:**

**Clicking:**
```typescript
await userEvent.click(screen.getByRole('button'));
```

**Typing:**
```typescript
await user.type(screen.getByLabelText('Email'), 'test@example.com');
```

**Hovering:**
```typescript
await user.hover(screen.getByText('Hover me'));
await user.unhover(screen.getByText('Hover me'));
```

**Keyboard navigation:**
```typescript
await user.tab();  // Focus next element
```

**Always use `await`** - User interactions are async

## Querying Elements

**Preferred Query Order:**
1. `getByRole` - Most accessible and robust
2. `getByLabelText` - For form elements
3. `getByText` - For text content
4. `getByTestId` - Last resort for non-semantic elements

**Examples:**
```typescript
// Best - by role
screen.getByRole('button', { name: /click me/i })

// Good - by label
screen.getByLabelText('Email')

// Good - by text
screen.getByText('Submit')

// Last resort - by test ID
screen.getByTestId('custom-input')
```

**Query Variants:**
- `getBy*` - Throws if not found
- `queryBy*` - Returns `null` if not found (for asserting absence)
- `findBy*` - Async, waits for element to appear

## Async Testing

**Pattern with `waitFor`:**
```typescript
import { waitFor } from '@testing-library/react';

await user.click(screen.getByText('Submit'));

await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

**Pattern with `findBy*`:**
```typescript
const element = await screen.findByText('Delayed content');
expect(element).toBeInTheDocument();
```

**Timeouts:**
- Default: 1000ms
- Custom: `waitFor(() => {...}, { timeout: 2000 })`

## Accessibility Testing

**Library:** `vitest-axe` v0.1.0

**Required:** Every component test must include accessibility test

**Pattern:**
```typescript
import { axe } from 'vitest-axe';

it('should have no accessibility violations', async () => {
  const { container } = render(<Button>Accessible Button</Button>);
  expect(await axe(container)).toHaveNoViolations();
});
```

**Test Multiple States:**
```typescript
it('should have no accessibility violations when disabled', async () => {
  const { container } = render(<Button disabled>Disabled Button</Button>);
  expect(await axe(container)).toHaveNoViolations();
});
```

**Mocked for Performance:**
- Canvas rendering mocked in `tests/setup.ts` (color contrast checks)
- Pseudo-element styles mocked (axe-core compatibility)

## Coverage

**Requirements:** 80% minimum (enforced)

**Thresholds:** (from `vitest.config.ts`)
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80
  }
}
```

**Excluded from Coverage:**
- `node_modules/`
- `.worktrees/`
- `tests/`
- `**/*.stories.tsx`
- `**/*.config.ts`
- `**/index.ts`

**View Coverage:**
```bash
npm run test:coverage
# Opens HTML report in coverage/index.html
```

## Test Types

**Unit Tests:**
- Scope: Individual components/functions in isolation
- Location: Co-located with source
- Example: `Button.test.tsx` tests `Button` component props, states, interactions

**Integration Tests:**
- Scope: Multiple components working together
- Example: `Form.test.tsx` tests Form with Field components and validation
- Pattern: Same as unit tests but render parent component

**E2E Tests:**
- Not used (Storybook tests disabled in vitest.config.ts)
- Comment indicates they require running Storybook server
- Can be re-enabled by setting `STORYBOOK_TESTS=true`

## Common Patterns

**Async Testing with User Events:**
```typescript
it('should show tooltip on hover', async () => {
  const user = userEvent.setup({ delay: null });

  render(
    <Tooltip content="Tooltip text">
      <button>Hover me</button>
    </Tooltip>
  );

  await user.hover(screen.getByText('Hover me'));

  await waitFor(() => {
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });
});
```

**Error Testing (Form Validation):**
```typescript
it('should validate on submit and show errors', async () => {
  const handleSubmit = vi.fn();
  const user = userEvent.setup();

  render(
    <Form schema={loginSchema} onSubmit={handleSubmit}>
      {(form) => (
        <>
          <form.Field name="email" label="Email" component="input" />
          <Button type="submit">Submit</Button>
        </>
      )}
    </Form>
  );

  await user.type(screen.getByLabelText('Email'), 'invalid-email');
  await user.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  expect(handleSubmit).not.toHaveBeenCalled();
});
```

**Imperative Control with Refs:**
```typescript
import { useRef } from 'react';
import type { FormHandle } from './Form.types';

it('should support imperative control via ref', async () => {
  function TestComponent() {
    const formRef = useRef<FormHandle<typeof schema>>(null);

    return (
      <>
        <Form ref={formRef} schema={schema} onSubmit={handleSubmit}>
          {(form) => <form.Field name="email" label="Email" component="input" />}
        </Form>
        <Button onClick={() => formRef.current?.reset()}>External Reset</Button>
      </>
    );
  }

  render(<TestComponent />);

  const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
  await user.type(emailInput, 'test@example.com');
  expect(emailInput.value).toBe('test@example.com');

  await user.click(screen.getByText('External Reset'));
  await waitFor(() => {
    expect(emailInput.value).toBe('');
  });
});
```

**Testing Delayed Behavior:**
```typescript
it('should respect delay prop', async () => {
  const user = userEvent.setup({ delay: null });

  render(
    <Tooltip content="Delayed tooltip" delay={100}>
      <button>Hover me</button>
    </Tooltip>
  );

  await user.hover(screen.getByText('Hover me'));

  // Should not appear immediately
  expect(screen.queryByText('Delayed tooltip')).not.toBeInTheDocument();

  // Wait for delay + animation
  await waitFor(
    () => {
      expect(screen.getByText('Delayed tooltip')).toBeInTheDocument();
    },
    { timeout: 500 }
  );
});
```

**Testing Component Variants:**
```typescript
it('should render with different variants', () => {
  const { rerender } = render(<Button variant="primary">Primary</Button>);
  expect(screen.getByRole('button')).toHaveClass(styles.primary);

  rerender(<Button variant="secondary">Secondary</Button>);
  expect(screen.getByRole('button')).toHaveClass(styles.secondary);
});
```

## Strict Mode Testing

**Zero Warnings Policy:** Tests fail on any warnings

**Enforced by:** `scripts/test-strict.sh`
- Captures test output
- Fails on: `Warning:.*act()`, `console.warn`, `console.error`
- Used in CI and pre-push hook

**Pre-push Hook:** `.husky/pre-push`
- Runs: `typecheck`, `lint`, `test:ci`, `npm audit`
- All must pass before push allowed
- Escape hatch: `git push --no-verify` (not recommended)

## Memory Profiling

**Optional:** Set `MEMORY_PROFILE=true` for leak detection

```bash
MEMORY_PROFILE=true npm test -- src/components/MyComponent/MyComponent.test.tsx
```

**Features:**
- Tracks active timers and event listeners
- Logs memory usage before/after tests
- Captures heap snapshots (with `HEAP_SNAPSHOT=true`)
- Snapshots saved to `.heap-snapshots/` (gitignored)

**Cleanup Tracking:**
- Timer tracking: `installTimerTracking()`, `clearAllTrackedTimers()`
- Listener tracking: `installListenerTracking()`, `removeAllTrackedListeners()`
- Portal cleanup: `cleanupPortals()`
- Framer Motion cleanup: `cleanupFramerMotion()`

## Test Best Practices

**Do:**
- Test user-visible behavior, not implementation details
- Use `userEvent` for interactions, not `fireEvent`
- Always `await` async operations
- Test accessibility with `axe()` in every component test
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test edge cases (disabled, loading, error states)
- Keep tests focused and independent

**Don't:**
- Test internal state or private methods
- Mock component internals
- Use `fireEvent` (use `userEvent` instead)
- Forget to `await` user interactions
- Skip accessibility tests
- Use `getByTestId` unless necessary
- Share state between tests

---

*Testing analysis: 2026-01-19*

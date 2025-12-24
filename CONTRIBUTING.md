# Contributing to @whatisboom/boom-ui

Thank you for your interest in contributing to @whatisboom/boom-ui! This guide will help you get started with development, testing, and submitting changes.

## Development Setup

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boom-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development mode**
   ```bash
   npm run dev
   ```

4. **Run Storybook** (for component development)
   ```bash
   npm run storybook
   ```
   Opens at http://localhost:6006

## Component Structure

Every component must follow this exact structure:

```
ComponentName/
├── ComponentName.tsx           # Implementation with forwardRef
├── ComponentName.types.ts      # TypeScript interfaces/props
├── ComponentName.module.css    # Scoped styles
├── ComponentName.test.tsx      # Unit + accessibility tests
├── ComponentName.stories.tsx   # Storybook documentation
└── index.ts                    # Public exports
```

## Creating a New Component

### 1. Component Implementation

Use `React.forwardRef` for all interactive components:

```tsx
import { forwardRef } from 'react';
import { MyComponentProps } from './MyComponent.types';
import styles from './MyComponent.module.css';

export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} className={styles.container} {...props}>
        {children}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

### 2. Type Definitions

Define props in a separate `.types.ts` file:

```tsx
import { ComponentPropsWithoutRef } from 'react';

export interface MyComponentProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}
```

### 3. Styles

Use CSS Modules with design tokens:

```css
.container {
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
}
```

**Design Tokens Location:**
- Colors: `src/styles/tokens/colors.css` & `palettes.css`
- Typography: `src/styles/tokens/typography.css`
- Spacing: `src/styles/tokens/spacing.css`
- Shadows: `src/styles/tokens/shadows.css`
- Theme variables: `src/styles/tokens/theme.css`

**Never hardcode values** - always use CSS tokens.

### 4. Tests

Every component requires comprehensive tests including accessibility checks:

```tsx
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders children correctly', () => {
    render(<MyComponent>Hello</MyComponent>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<MyComponent>Content</MyComponent>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Testing Requirements:**
- 80% minimum code coverage (lines, functions, branches, statements)
- All components must pass `vitest-axe` accessibility tests
- Use `@testing-library/react` for rendering
- Use `@testing-library/user-event` for user interactions

### 5. Storybook Stories

Create stories to document all component variants:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    children: 'Hello World',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary variant',
  },
};
```

### 6. Public API Export

Add your component to `src/index.ts`:

```tsx
export { MyComponent } from './components/MyComponent';
export type { MyComponentProps } from './components/MyComponent';
```

## Core Principles

### Accessibility-First

Every component **must**:
- Pass vitest-axe automated accessibility audits
- Support full keyboard navigation
- Work with screen readers
- Use semantic HTML elements
- Include proper ARIA attributes when semantic HTML is insufficient
- Have clear focus indicators
- Respect user preferences (prefers-reduced-motion, prefers-color-scheme)

### Type Safety

- **No `any` types permitted** (enforced by ESLint)
- Use strict TypeScript configuration
- Never use `as` type assertions to bypass type issues - fix the types properly
- Prefer explicit types over inference for public APIs

### CSS Best Practices

- Use CSS Modules for scoping
- Reference design tokens via CSS variables
- Support theme switching (light/dark modes)
- Use Framer Motion for animations
- Follow BEM-like naming conventions

## Development Commands

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
npm run test:coverage       # Coverage report

# Building
npm run build              # TypeScript compile + Vite bundle

# Documentation
npm run storybook          # Interactive component gallery
npm run build-storybook    # Build static Storybook
```

### Running Specific Tests

```bash
# Run tests for a specific file
npx vitest src/components/Button/Button.test.tsx

# Run tests matching a pattern
npx vitest Button

# Watch mode for specific test
npx vitest src/components/Button/Button.test.tsx --watch
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-new-component
   ```

2. **Make your changes**
   - Follow the component structure pattern
   - Write tests (80%+ coverage required)
   - Ensure accessibility compliance
   - Update Storybook stories

3. **Verify your changes**
   ```bash
   npm run typecheck  # Type checking must pass
   npm test           # All tests must pass
   npm run build      # Build must succeed
   ```

4. **Commit your changes**
   - Write clear, descriptive commit messages
   - Make frequent small commits
   - Test changes before committing

5. **Push and create a PR**
   ```bash
   git push origin feature/my-new-component
   ```
   - Provide a clear description of your changes
   - Reference any related issues
   - Include screenshots for UI changes

## Code Standards

### ESLint Configuration

The following rules are strictly enforced:
- `@typescript-eslint/no-explicit-any`: ERROR
- `react/react-in-jsx-scope`: OFF (React 19+ JSX transform)
- All jsx-a11y accessibility rules: ACTIVE

### Pre-publish Checks

Before publishing (enforced by `prepublishOnly` hook):
1. Type checking passes (`npm run typecheck`)
2. All tests pass (`npm test`)
3. Build succeeds (`npm run build`)

## Useful Hooks and Utilities

Custom hooks are available in `src/hooks/`:
- `useClickOutside` - Detect clicks outside an element
- `useFocusTrap` - Trap focus within a container (for modals)
- `useScrollLock` - Prevent body scroll
- `useKeyboardShortcut` - Handle keyboard shortcuts
- `useDebounce` - Debounce values

Focus management utilities: `src/utils/focus-management.ts`

## Getting Help

- Check existing components for examples (Button, Input, Checkbox are well-documented)
- Review [Storybook](http://localhost:6006) for component APIs
- Read the [theming documentation](./docs/theming.md)
- Open an issue for questions or bugs

## Publishing & Releases

### Automated Publishing

This package automatically publishes to npm when a version tag is pushed to GitHub.

**To release a new version:**

1. **Update the version** in `package.json`
   ```bash
   npm version patch  # or minor, or major
   ```

2. **Push the tag to GitHub**
   ```bash
   git push origin main --tags
   ```

3. **GitHub Actions will automatically:**
   - Run type checking
   - Run all tests
   - Build the package
   - Publish to npm registry

### Setting up NPM_TOKEN (maintainers only)

For automated publishing to work, maintainers must configure an npm access token:

1. **Generate an npm token**
   - Go to https://www.npmjs.com
   - Settings → Access Tokens → Generate New Token
   - Choose "Automation" token type

2. **Add to GitHub Secrets**
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token

### Manual Publishing

To publish manually (requires npm login):
```bash
npm publish --access public
```

## Questions?

Feel free to open an issue for questions, bug reports, or feature requests. We appreciate your contributions!

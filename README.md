# @whatisboom/boom-ui

**Accessibility-First React Component Library**

Production-ready React components built from the ground up for accessibility, with comprehensive WCAG 2.1 AA compliance and beautiful theming.

[![npm version](https://img.shields.io/npm/v/@whatisboom/boom-ui.svg)](https://www.npmjs.com/package/@whatisboom/boom-ui)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why @whatisboom/boom-ui?

- ♿ **Accessibility-First**: Every component tested with vitest-axe, keyboard navigable, and screen reader optimized
- 🎨 **Theme System**: Built on CSS design tokens with light/dark mode support
- 📘 **TypeScript Native**: Fully typed with strict mode enabled
- 🧪 **Thoroughly Tested**: 80%+ code coverage with accessibility regression tests
- ⚡ **Modern Stack**: React 19, Framer Motion animations, tree-shakeable exports

## Installation

```bash
npm install @whatisboom/boom-ui
```

```bash
yarn add @whatisboom/boom-ui
```

```bash
pnpm add @whatisboom/boom-ui
```

## Quick Start

Wrap your application with `ThemeProvider` and import the styles:

```tsx
import { ThemeProvider, Button } from '@whatisboom/boom-ui';
import '@whatisboom/boom-ui/styles';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Button variant="primary">Get Started</Button>
    </ThemeProvider>
  );
}
```

## Accessibility Highlights

Every component in @whatisboom/boom-ui is built with accessibility as a core requirement, not an afterthought:

### Automated Testing
- **vitest-axe integration**: All components pass automated accessibility audits in CI/CD
- **WCAG 2.1 AA compliance**: Components meet Level AA success criteria
- **Regression prevention**: Accessibility tests run on every commit

### Keyboard Navigation
- Full keyboard support for all interactive components
- Logical tab order and focus management
- Custom keyboard shortcuts where appropriate (e.g., Cmd+K for search)

### Screen Reader Support
- Semantic HTML elements used by default
- ARIA attributes for complex interactions
- Live regions for dynamic content updates
- Clear focus indicators for all interactive elements

### Design Tokens
- Color contrast ratios exceed WCAG AA requirements
- Configurable focus indicators
- Respects user preferences (reduced motion, color schemes)

## Components

### Forms

```tsx
import { Input, Checkbox, Switch, Select, Textarea } from '@whatisboom/boom-ui';

// Input with validation
<Input
  label="Email"
  type="email"
  required
  error={errors.email}
  helperText="We'll never share your email"
/>

// Checkbox with label
<Checkbox
  label="I agree to the terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>

// Switch with accessible states
<Switch
  label="Enable notifications"
  checked={enabled}
  onChange={setEnabled}
/>

// Select with options
<Select
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
  ]}
  value={country}
  onChange={(e) => setCountry(e.target.value)}
/>
```

### Buttons

```tsx
import { Button } from '@whatisboom/boom-ui';

// Primary action button
<Button variant="primary" size="md">
  Save Changes
</Button>

// Loading state with accessible label
<Button variant="primary" loading>
  Submitting...
</Button>

// With icons
<Button variant="secondary" leftIcon={<SaveIcon />}>
  Save Draft
</Button>
```

### Feedback

```tsx
import { Alert, Toast, ToastProvider, useToast, Progress } from '@whatisboom/boom-ui';

// Alert with variants
<Alert variant="success">
  Your changes have been saved!
</Alert>

// Toast notifications
function MyComponent() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast.success('Profile updated!')}>
      Update Profile
    </Button>
  );
}

// Wrap your app with ToastProvider
<ToastProvider position="top-right">
  <App />
</ToastProvider>

// Progress indicator
<Progress value={75} variant="primary" />
```

### Modals & Overlays

```tsx
import { Modal, Drawer, Popover, Tooltip } from '@whatisboom/boom-ui';

// Modal with focus trap
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to continue?</p>
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>

// Drawer for side panels
<Drawer
  isOpen={isDrawerOpen}
  onClose={() => setIsDrawerOpen(false)}
  position="right"
>
  <Navigation />
</Drawer>

// Tooltip for additional context
<Tooltip content="This action cannot be undone">
  <Button variant="danger">Delete</Button>
</Tooltip>
```

### Layout

```tsx
import { Box, Stack, Card } from '@whatisboom/boom-ui';

// Flexible box primitive
<Box padding="lg" backgroundColor="surface">
  <Typography variant="h2">Welcome</Typography>
</Box>

// Stack for vertical/horizontal layouts
<Stack direction="vertical" spacing="md">
  <Card>Content 1</Card>
  <Card>Content 2</Card>
</Stack>
```

## Theming

@whatisboom/boom-ui uses CSS design tokens for consistent theming:

```tsx
import { ThemeProvider, useTheme } from '@whatisboom/boom-ui';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="my-app-theme">
      <YourApp />
    </ThemeProvider>
  );
}

// Toggle theme programmatically
function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </Button>
  );
}
```

### Design Tokens

Customize the look and feel by overriding CSS variables:

```css
:root {
  --color-primary: hsl(220, 90%, 56%);
  --color-primary-hover: hsl(220, 90%, 48%);
  --spacing-md: 1rem;
  --border-radius-md: 0.375rem;
}
```

See the [theming documentation](./docs/theming.md) for all available tokens.

## TypeScript Support

All components are fully typed with TypeScript:

```tsx
import type { ButtonProps, InputProps, SelectOption } from '@whatisboom/boom-ui';

const options: SelectOption[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

const buttonProps: ButtonProps = {
  variant: 'primary',
  size: 'md',
  onClick: () => console.log('clicked'),
};
```

## Documentation

- **[Storybook](http://localhost:6006)**: Interactive component gallery with live examples
- **[Theming Guide](./docs/theming.md)**: Customize colors, spacing, and typography
- **[Contributing](./CONTRIBUTING.md)**: Guidelines for contributors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security

Security is a top priority for @whatisboom/boom-ui. We follow industry best practices for:

- **XSS Prevention**: All components use React's built-in escaping, no `dangerouslySetInnerHTML`
- **Dependency Security**: Automated Dependabot scans, pre-push vulnerability checks
- **Supply Chain**: npm provenance attestations, OIDC authentication
- **Type Safety**: Strict TypeScript mode with no `any` types

For security vulnerabilities, please use [GitHub Security Advisories](https://github.com/whatisboom/boom-ui/security/advisories/new).

See [SECURITY.md](./SECURITY.md) for our complete security policy.

## License

MIT

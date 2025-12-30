# Storybook Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize Storybook sidebar from component-type to use-case-based categories with compositional examples.

**Architecture:** Update story file `title` metadata to new category structure, add primitive warnings to low-level components, create Introduction and Example story files showing real-world compositional patterns.

**Tech Stack:** Storybook 10, React 19, TypeScript, existing boom-ui components

---

## Task 1: Update Forms & Validation Category Stories

**Files:**
- Modify: `src/components/Button/Button.stories.tsx:5`
- Modify: `src/components/Checkbox/Checkbox.stories.tsx:5`
- Modify: `src/components/Input/Input.stories.tsx:5`
- Modify: `src/components/RadioGroup/RadioGroup.stories.tsx:5`
- Modify: `src/components/Select/Select.stories.tsx:5`
- Modify: `src/components/Slider/Slider.stories.tsx:5`
- Modify: `src/components/Switch/Switch.stories.tsx:5`
- Modify: `src/components/Textarea/Textarea.stories.tsx:5`

**Step 1: Update Button story title**

In `src/components/Button/Button.stories.tsx`, change line 5:

```typescript
// Before
  title: 'Components/Inputs/Button',

// After
  title: 'Forms & Validation/Button',
```

**Step 2: Update remaining form control story titles**

Apply same pattern to all files listed above. Change `title` field to:
- Checkbox: `'Forms & Validation/Checkbox'`
- Input: `'Forms & Validation/Input'`
- RadioGroup: `'Forms & Validation/Radio Group'`
- Select: `'Forms & Validation/Select'`
- Slider: `'Forms & Validation/Slider'`
- Switch: `'Forms & Validation/Switch'`
- Textarea: `'Forms & Validation/Textarea'`

**Step 3: Verify changes in Storybook**

Run: `npm run storybook`

Expected: Sidebar shows "Forms & Validation" category with Button, Checkbox, Input, Radio Group, Select, Slider, Switch, Textarea

**Step 4: Commit**

```bash
git add src/components/Button/Button.stories.tsx \
  src/components/Checkbox/Checkbox.stories.tsx \
  src/components/Input/Input.stories.tsx \
  src/components/RadioGroup/RadioGroup.stories.tsx \
  src/components/Select/Select.stories.tsx \
  src/components/Slider/Slider.stories.tsx \
  src/components/Switch/Switch.stories.tsx \
  src/components/Textarea/Textarea.stories.tsx
git commit -m "refactor(storybook): organize form controls under Forms & Validation"
```

---

## Task 2: Update Form Component Story

**Files:**
- Modify: `src/components/Form/Form.stories.tsx:14`

**Step 1: Update Form story title**

In `src/components/Form/Form.stories.tsx`, change line 14:

```typescript
// Before
  title: 'Components/Form',

// After
  title: 'Forms & Validation/Form',
```

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Expected: Form appears in "Forms & Validation" category with all its examples (LoginForm, MultiStepRegistration, etc.)

**Step 3: Commit**

```bash
git add src/components/Form/Form.stories.tsx
git commit -m "refactor(storybook): move Form to Forms & Validation category"
```

---

## Task 3: Update Data & Content Category Stories

**Files:**
- Modify: `src/components/Avatar/Avatar.stories.tsx:5`
- Modify: `src/components/Badge/Badge.stories.tsx:5`
- Modify: `src/components/Card/Card.stories.tsx:5`
- Modify: `src/components/Skeleton/Skeleton.stories.tsx:5`
- Modify: `src/components/Table/Table.stories.tsx:5`
- Modify: `src/components/Tree/Tree.stories.tsx:5`
- Modify: `src/components/Typography/Typography.stories.tsx:5`

**Step 1: Update all Data & Content story titles**

Change `title` field in each file:
- Avatar: `'Data & Content/Avatar'`
- Badge: `'Data & Content/Badge'`
- Card: `'Data & Content/Card'`
- Skeleton: `'Data & Content/Skeleton'`
- Table: `'Data & Content/Table'`
- Tree: `'Data & Content/Tree'`
- Typography: `'Data & Content/Typography'`

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Expected: Sidebar shows "Data & Content" category with all 7 components

**Step 3: Commit**

```bash
git add src/components/Avatar/Avatar.stories.tsx \
  src/components/Badge/Badge.stories.tsx \
  src/components/Card/Card.stories.tsx \
  src/components/Skeleton/Skeleton.stories.tsx \
  src/components/Table/Table.stories.tsx \
  src/components/Tree/Tree.stories.tsx \
  src/components/Typography/Typography.stories.tsx
git commit -m "refactor(storybook): organize data display under Data & Content"
```

---

## Task 4: Update Navigation & Menus Category Stories

**Files:**
- Modify: `src/components/Header/Header.stories.tsx:5`
- Modify: `src/components/Navigation/Navigation.stories.tsx:5`
- Modify: `src/components/NotificationMenu/NotificationMenu.stories.tsx:5`
- Modify: `src/components/SearchCommand/SearchCommand.stories.tsx:5`
- Modify: `src/components/Tabs/Tabs.stories.tsx:5`

**Step 1: Update all Navigation & Menus story titles**

Change `title` field in each file:
- Header: `'Navigation & Menus/Header'`
- Navigation: `'Navigation & Menus/Navigation'`
- NotificationMenu: `'Navigation & Menus/Notification Menu'`
- SearchCommand: `'Navigation & Menus/Search Command'`
- Tabs: `'Navigation & Menus/Tabs'`

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Expected: Sidebar shows "Navigation & Menus" category with all 5 components

**Step 3: Commit**

```bash
git add src/components/Header/Header.stories.tsx \
  src/components/Navigation/Navigation.stories.tsx \
  src/components/NotificationMenu/NotificationMenu.stories.tsx \
  src/components/SearchCommand/SearchCommand.stories.tsx \
  src/components/Tabs/Tabs.stories.tsx
git commit -m "refactor(storybook): organize navigation under Navigation & Menus"
```

---

## Task 5: Update Feedback & Alerts Category Stories

**Files:**
- Modify: `src/components/Alert/Alert.stories.tsx:5`
- Modify: `src/components/EmptyState/EmptyState.stories.tsx:5`
- Modify: `src/components/Progress/Progress.stories.tsx:5`
- Modify: `src/components/Spinner/Spinner.stories.tsx:5`
- Modify: `src/components/Toast/Toast.stories.tsx:5`

**Step 1: Update all Feedback & Alerts story titles**

Change `title` field in each file:
- Alert: `'Feedback & Alerts/Alert'`
- EmptyState: `'Feedback & Alerts/Empty State'`
- Progress: `'Feedback & Alerts/Progress'`
- Spinner: `'Feedback & Alerts/Spinner'`
- Toast: `'Feedback & Alerts/Toast'`

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Expected: Sidebar shows "Feedback & Alerts" category with all 5 components

**Step 3: Commit**

```bash
git add src/components/Alert/Alert.stories.tsx \
  src/components/EmptyState/EmptyState.stories.tsx \
  src/components/Progress/Progress.stories.tsx \
  src/components/Spinner/Spinner.stories.tsx \
  src/components/Toast/Toast.stories.tsx
git commit -m "refactor(storybook): organize feedback under Feedback & Alerts"
```

---

## Task 6: Update Overlays & Dialogs Category Stories

**Files:**
- Modify: `src/components/primitives/Drawer/Drawer.stories.tsx:7`
- Modify: `src/components/primitives/Modal/Modal.stories.tsx:7`
- Modify: `src/components/primitives/Popover/Popover.stories.tsx:7`
- Modify: `src/components/Tooltip/Tooltip.stories.tsx:5`

**Step 1: Update all Overlays & Dialogs story titles**

Change `title` field in each file:
- Drawer: `'Overlays & Dialogs/Drawer'`
- Modal: `'Overlays & Dialogs/Modal'`
- Popover: `'Overlays & Dialogs/Popover'`
- Tooltip: `'Overlays & Dialogs/Tooltip'`

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Expected: Sidebar shows "Overlays & Dialogs" category with Drawer, Modal, Popover, Tooltip

**Step 3: Commit**

```bash
git add src/components/primitives/Drawer/Drawer.stories.tsx \
  src/components/primitives/Modal/Modal.stories.tsx \
  src/components/primitives/Popover/Popover.stories.tsx \
  src/components/Tooltip/Tooltip.stories.tsx
git commit -m "refactor(storybook): organize overlays under Overlays & Dialogs"
```

---

## Task 7: Add Primitive Warnings to Portal and Overlay

**Files:**
- Modify: `src/components/primitives/Portal/Portal.stories.tsx:6-9`
- Modify: `src/components/primitives/Overlay/Overlay.stories.tsx:6-9`

**Step 1: Update Portal story with warning**

In `src/components/primitives/Portal/Portal.stories.tsx`, update the meta object:

```typescript
const meta: Meta<typeof Portal> = {
  title: 'Overlays & Dialogs/Portal',
  component: Portal,
  parameters: {
    docs: {
      description: {
        component: '⚠️ Low-level primitive component. Most developers should use Modal, Drawer, or Popover instead.'
      }
    }
  },
  tags: ['autodocs'],
};
```

**Step 2: Update Overlay story with warning**

In `src/components/primitives/Overlay/Overlay.stories.tsx`, update the meta object:

```typescript
const meta: Meta<typeof Overlay> = {
  title: 'Overlays & Dialogs/Overlay',
  component: Overlay,
  parameters: {
    docs: {
      description: {
        component: '⚠️ Low-level primitive component. Most developers should use Modal, Drawer, or Popover instead.'
      }
    }
  },
  tags: ['autodocs'],
};
```

**Step 3: Verify in Storybook**

Run: `npm run storybook`

Navigate to "Overlays & Dialogs" → "Portal" and "Overlay"

Expected: Warning message appears at top of documentation

**Step 4: Commit**

```bash
git add src/components/primitives/Portal/Portal.stories.tsx \
  src/components/primitives/Overlay/Overlay.stories.tsx
git commit -m "docs(storybook): add primitive warnings to Portal and Overlay"
```

---

## Task 8: Update Page Layouts Category Stories

**Files:**
- Modify: `src/components/Hero/Hero.stories.tsx:5`
- Modify: `src/components/ErrorBoundary/ErrorBoundary.stories.tsx:5`

**Step 1: Update Hero and ErrorBoundary story titles**

Change `title` field in each file:
- Hero: `'Page Layouts/Hero'`
- ErrorBoundary: `'Page Layouts/Error Boundary'`

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Expected: Sidebar shows "Page Layouts" category with Hero and Error Boundary

**Step 3: Commit**

```bash
git add src/components/Hero/Hero.stories.tsx \
  src/components/ErrorBoundary/ErrorBoundary.stories.tsx
git commit -m "refactor(storybook): organize page components under Page Layouts"
```

---

## Task 9: Add Primitive Warnings to Box and Stack

**Files:**
- Modify: `src/components/Box/Box.stories.tsx:5-15`
- Modify: `src/components/Stack/Stack.stories.tsx:5-15`

**Step 1: Update Box story with warning**

In `src/components/Box/Box.stories.tsx`, update the meta object:

```typescript
const meta = {
  title: 'Page Layouts/Box',
  component: Box,
  parameters: {
    docs: {
      description: {
        component: 'Low-level layout primitive. Use for custom layouts and spacing control.'
      }
    }
  },
  tags: ['autodocs'],
  // ... rest of existing argTypes
```

**Step 2: Update Stack story with warning**

In `src/components/Stack/Stack.stories.tsx`, update the meta object:

```typescript
const meta = {
  title: 'Page Layouts/Stack',
  component: Stack,
  parameters: {
    docs: {
      description: {
        component: 'Low-level layout primitive. Use for custom layouts and spacing control.'
      }
    }
  },
  tags: ['autodocs'],
  // ... rest of existing argTypes
```

**Step 3: Verify in Storybook**

Run: `npm run storybook`

Navigate to "Page Layouts" → "Box" and "Stack"

Expected: Documentation shows primitive description

**Step 4: Commit**

```bash
git add src/components/Box/Box.stories.tsx \
  src/components/Stack/Stack.stories.tsx
git commit -m "docs(storybook): add primitive descriptions to Box and Stack"
```

---

## Task 10: Update Getting Started Category Stories

**Files:**
- Modify: `src/components/ThemeProvider/Theme.stories.tsx:126`
- Modify: `src/components/Layout.stories.tsx:5`

**Step 1: Update Theme story title**

In `src/components/ThemeProvider/Theme.stories.tsx`, change line 126:

```typescript
// Before
  title: 'Theme/Showcase',

// After
  title: 'Getting Started/Theme System',
```

**Step 2: Update Layout story title**

In `src/components/Layout.stories.tsx`, change the title to:

```typescript
  title: 'Getting Started/Layout Basics',
```

**Step 3: Verify in Storybook**

Run: `npm run storybook`

Expected: Sidebar shows "Getting Started" category with Theme System and Layout Basics

**Step 4: Commit**

```bash
git add src/components/ThemeProvider/Theme.stories.tsx \
  src/components/Layout.stories.tsx
git commit -m "refactor(storybook): move theme and layout to Getting Started"
```

---

## Task 11: Create Introduction Story

**Files:**
- Create: `src/components/Introduction.stories.tsx`

**Step 1: Create Introduction story file**

Create `src/components/Introduction.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';

function Introduction() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Welcome to boom-ui
      </h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: 'var(--boom-theme-text-secondary)' }}>
        An accessibility-first React component library built with TypeScript, Vite, and Framer Motion.
      </p>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Installation
      </h2>
      <pre style={{
        background: 'var(--boom-theme-bg-secondary)',
        padding: '1rem',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <code>npm install @whatisboom/boom-ui</code>
      </pre>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Quick Start
      </h2>
      <pre style={{
        background: 'var(--boom-theme-bg-secondary)',
        padding: '1rem',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
        <code>{`import { Button, ThemeProvider } from '@whatisboom/boom-ui';
import '@whatisboom/boom-ui/styles';

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Click me</Button>
    </ThemeProvider>
  );
}`}</code>
      </pre>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Features
      </h2>
      <ul style={{ fontSize: '1rem', lineHeight: '1.8' }}>
        <li>🎯 <strong>Accessibility-First</strong> - WCAG compliant with comprehensive keyboard navigation</li>
        <li>🎨 <strong>Themeable</strong> - Built-in light/dark themes with customizable design tokens</li>
        <li>⚡ <strong>TypeScript</strong> - Full type safety with exported types for all components</li>
        <li>📦 <strong>Tree-Shakeable</strong> - Optimized bundle size with ES modules</li>
        <li>🎬 <strong>Animated</strong> - Smooth transitions powered by Framer Motion</li>
        <li>✅ <strong>Form Support</strong> - Integrated with React Hook Form and Zod validation</li>
      </ul>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Resources
      </h2>
      <ul style={{ fontSize: '1rem', lineHeight: '1.8' }}>
        <li>
          <a
            href="https://github.com/whatisboom/boom-ui"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--boom-palette-accent-600)' }}
          >
            GitHub Repository
          </a>
        </li>
        <li>
          <a
            href="https://www.npmjs.com/package/@whatisboom/boom-ui"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--boom-palette-accent-600)' }}
          >
            npm Package
          </a>
        </li>
      </ul>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '2rem' }}>
        Next Steps
      </h2>
      <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
        Explore the sidebar to find components organized by use case:
      </p>
      <ul style={{ fontSize: '1rem', lineHeight: '1.8' }}>
        <li><strong>Getting Started</strong> - Theme system and layout basics</li>
        <li><strong>Forms & Validation</strong> - Form controls and validation patterns</li>
        <li><strong>Data & Content</strong> - Tables, cards, typography, and more</li>
        <li><strong>Navigation & Menus</strong> - Headers, tabs, and navigation components</li>
        <li><strong>Feedback & Alerts</strong> - Alerts, toasts, and progress indicators</li>
        <li><strong>Overlays & Dialogs</strong> - Modals, drawers, tooltips, and popovers</li>
        <li><strong>Page Layouts</strong> - Hero sections and layout primitives</li>
        <li><strong>Examples</strong> - Real-world compositional patterns</li>
      </ul>
    </div>
  );
}

const meta: Meta<typeof Introduction> = {
  title: 'Getting Started/Introduction',
  component: Introduction,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Introduction>;

export const Default: Story = {};
```

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Navigate to "Getting Started" → "Introduction"

Expected: Welcome page displays with installation, features, and navigation guide

**Step 3: Commit**

```bash
git add src/components/Introduction.stories.tsx
git commit -m "feat(storybook): add Introduction story with quick start guide"
```

---

## Task 12: Create Authentication Flow Example

**Files:**
- Create: `src/examples/AuthenticationFlow.stories.tsx`

**Step 1: Create examples directory**

Run: `mkdir -p src/examples`

**Step 2: Create AuthenticationFlow story file**

Create `src/examples/AuthenticationFlow.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { z } from 'zod';
import { Form } from '../components/Form/Form';
import { Field } from '../components/Form/Field';
import { FormActions } from '../components/Form/FormActions';
import { FormMessage } from '../components/Form/FormMessage';
import { FormStepper } from '../components/Form/FormStepper';
import { FormStep } from '../components/Form/FormStep';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Alert } from '../components/Alert';

const meta: Meta = {
  title: 'Examples/Authentication Flow',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Real-world authentication patterns using Form, Input, Button, Card, and Alert components.'
      }
    }
  },
};

export default meta;

type Story = StoryObj;

// Login Form
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const LoginForm: Story = {
  render: () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
      setError(null);
      setSuccess(false);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (data.email === 'demo@example.com' && data.password === 'password123') {
        setSuccess(true);
      } else {
        setError('Invalid email or password');
      }
    };

    return (
      <Card style={{ width: '400px', padding: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Sign In</h2>

        <Form schema={loginSchema} onSubmit={handleSubmit} mode="onBlur">
          {error && <FormMessage type="error">{error}</FormMessage>}
          {success && <FormMessage type="success">Login successful!</FormMessage>}

          <Field name="email" label="Email" type="email" placeholder="demo@example.com" />
          <Field name="password" label="Password" type="password" />
          <Field name="rememberMe" label="Remember me" component="checkbox" />

          <FormActions>
            <Button type="submit" style={{ width: '100%' }}>Sign In</Button>
          </FormActions>
        </Form>

        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--boom-theme-text-secondary)' }}>
          Demo credentials: demo@example.com / password123
        </p>
      </Card>
    );
  },
};

// Multi-Step Signup
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const SignupFlow: Story = {
  render: () => {
    const [step, setStep] = useState(0);
    const [completed, setCompleted] = useState(false);

    const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
      console.log('Signup data:', data);
      setCompleted(true);
    };

    if (completed) {
      return (
        <Card style={{ width: '500px', padding: '2rem', textAlign: 'center' }}>
          <Alert variant="success" style={{ marginBottom: '1rem' }}>
            Account created successfully!
          </Alert>
          <p>Check your email to verify your account.</p>
          <Button onClick={() => { setCompleted(false); setStep(0); }} style={{ marginTop: '1rem' }}>
            Sign Up Another Account
          </Button>
        </Card>
      );
    }

    return (
      <Card style={{ width: '500px', padding: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Create Account</h2>

        <Form schema={signupSchema} onSubmit={handleSubmit} mode="onBlur">
          <FormStepper currentStep={step} onStepChange={setStep} showProgress>
            <FormStep title="Account">
              <Field name="email" label="Email" type="email" />
              <Field name="password" label="Password" type="password" />
              <Field name="confirmPassword" label="Confirm Password" type="password" />
            </FormStep>

            <FormStep title="Profile">
              <Field name="firstName" label="First Name" />
              <Field name="lastName" label="Last Name" />
            </FormStep>

            <FormStep title="Terms">
              <Field name="agreeToTerms" label="I agree to the Terms of Service and Privacy Policy" component="checkbox" />
            </FormStep>
          </FormStepper>

          <FormActions align="space-between">
            <Button onClick={() => setStep(s => s - 1)} disabled={step === 0} variant="secondary">
              Back
            </Button>
            <Button type={step === 2 ? 'submit' : 'button'} onClick={() => step < 2 && setStep(s => s + 1)}>
              {step === 2 ? 'Create Account' : 'Next'}
            </Button>
          </FormActions>
        </Form>
      </Card>
    );
  },
};

// Password Reset
const resetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const PasswordReset: Story = {
  render: () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (data: z.infer<typeof resetSchema>) => {
      console.log('Password reset for:', data.email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    };

    if (submitted) {
      return (
        <Card style={{ width: '400px', padding: '2rem', textAlign: 'center' }}>
          <Alert variant="success" style={{ marginBottom: '1rem' }}>
            Reset link sent!
          </Alert>
          <p>Check your email for instructions to reset your password.</p>
          <Button onClick={() => setSubmitted(false)} variant="outline" style={{ marginTop: '1rem' }}>
            Send Another
          </Button>
        </Card>
      );
    }

    return (
      <Card style={{ width: '400px', padding: '2rem' }}>
        <h2 style={{ marginTop: 0 }}>Reset Password</h2>
        <p style={{ color: 'var(--boom-theme-text-secondary)' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <Form schema={resetSchema} onSubmit={handleSubmit} mode="onBlur">
          <Field name="email" label="Email" type="email" placeholder="you@example.com" />

          <FormActions>
            <Button type="submit" style={{ width: '100%' }}>Send Reset Link</Button>
          </FormActions>
        </Form>
      </Card>
    );
  },
};
```

**Step 3: Verify in Storybook**

Run: `npm run storybook`

Navigate to "Examples" → "Authentication Flow"

Expected: Three stories showing Login, Signup, and Password Reset patterns

**Step 4: Commit**

```bash
git add src/examples/AuthenticationFlow.stories.tsx
git commit -m "feat(storybook): add Authentication Flow examples"
```

---

## Task 13: Create Data Management Example

**Files:**
- Create: `src/examples/DataManagement.stories.tsx`

**Step 1: Create DataManagement story file**

Create `src/examples/DataManagement.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Table } from '../components/Table/Table';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Popover } from '../components/primitives/Popover';

const meta: Meta = {
  title: 'Examples/Data Management',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Data management patterns using Table, Input, Select, Button, Badge, and Popover components.'
      }
    }
  },
};

export default meta;

type Story = StoryObj;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Editor', status: 'inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'pending' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'active' },
];

export const FilterableTable: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredUsers = mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });

    return (
      <div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Input
            label="Search"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: '1 1 300px' }}
          />
          <Select
            label="Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'Admin', label: 'Admin' },
              { value: 'Editor', label: 'Editor' },
              { value: 'User', label: 'User' },
            ]}
            style={{ flex: '0 1 150px' }}
          />
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' },
            ]}
            style={{ flex: '0 1 150px' }}
          />
        </div>

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Badge
                    variant={
                      user.status === 'active' ? 'success' :
                      user.status === 'inactive' ? 'error' :
                      'warning'
                    }
                  >
                    {user.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <p style={{ marginTop: '1rem', color: 'var(--boom-theme-text-secondary)' }}>
          Showing {filteredUsers.length} of {mockUsers.length} users
        </p>
      </div>
    );
  },
};

export const SortableTable: Story = {
  render: () => {
    const [users, setUsers] = useState(mockUsers);
    const [sortField, setSortField] = useState<keyof User>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (field: keyof User) => {
      const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      setSortField(field);

      const sorted = [...users].sort((a, b) => {
        if (a[field] < b[field]) return newDirection === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return newDirection === 'asc' ? 1 : -1;
        return 0;
      });
      setUsers(sorted);
    };

    const SortButton = ({ field, label }: { field: keyof User; label: string }) => (
      <button
        onClick={() => handleSort(field)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        {label}
        {sortField === field && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
      </button>
    );

    return (
      <Table>
        <thead>
          <tr>
            <th><SortButton field="name" label="Name" /></th>
            <th><SortButton field="email" label="Email" /></th>
            <th><SortButton field="role" label="Role" /></th>
            <th><SortButton field="status" label="Status" /></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Badge
                  variant={
                    user.status === 'active' ? 'success' :
                    user.status === 'inactive' ? 'error' :
                    'warning'
                  }
                >
                  {user.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  },
};

export const RowActions: Story = {
  render: () => {
    const [users, setUsers] = useState(mockUsers);
    const [openPopover, setOpenPopover] = useState<number | null>(null);

    const handleEdit = (id: number) => {
      console.log('Edit user:', id);
      setOpenPopover(null);
    };

    const handleDelete = (id: number) => {
      setUsers(users.filter(u => u.id !== id));
      setOpenPopover(null);
    };

    return (
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th style={{ width: '100px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Badge
                  variant={
                    user.status === 'active' ? 'success' :
                    user.status === 'inactive' ? 'error' :
                    'warning'
                  }
                >
                  {user.status}
                </Badge>
              </td>
              <td>
                <Popover
                  isOpen={openPopover === user.id}
                  onClose={() => setOpenPopover(null)}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setOpenPopover(openPopover === user.id ? null : user.id)}
                    >
                      ⋮
                    </Button>
                  }
                  placement="bottom-end"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' }}>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user.id)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
                      Delete
                    </Button>
                  </div>
                </Popover>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  },
};
```

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Navigate to "Examples" → "Data Management"

Expected: Three stories showing filterable, sortable, and actionable table patterns

**Step 3: Commit**

```bash
git add src/examples/DataManagement.stories.tsx
git commit -m "feat(storybook): add Data Management examples"
```

---

## Task 14: Create Settings Panel Example

**Files:**
- Create: `src/examples/SettingsPanel.stories.tsx`

**Step 1: Create SettingsPanel story file**

Create `src/examples/SettingsPanel.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { z } from 'zod';
import { Tabs } from '../components/Tabs';
import { Form } from '../components/Form/Form';
import { Field } from '../components/Form/Field';
import { FormActions } from '../components/Form/FormActions';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';

const meta: Meta = {
  title: 'Examples/Settings Panel',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Settings panel patterns using Tabs, Form, Input, Switch, Checkbox, Button, and Toast components.'
      }
    }
  },
};

export default meta;

type Story = StoryObj;

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  productUpdates: z.boolean(),
});

const privacySchema = z.object({
  profileVisibility: z.enum(['public', 'friends', 'private']),
  showEmail: z.boolean(),
  showActivity: z.boolean(),
});

export const TabbedSettings: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleSave = (data: unknown, section: string) => {
      console.log(`Saving ${section}:`, data);
      setToastMessage(`${section} settings saved successfully!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    };

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Settings</h1>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value={0}>Profile</Tabs.Tab>
            <Tabs.Tab value={1}>Notifications</Tabs.Tab>
            <Tabs.Tab value={2}>Privacy</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={0}>
            <Form
              schema={profileSchema}
              onSubmit={(data) => handleSave(data, 'Profile')}
              defaultValues={{
                displayName: 'John Doe',
                email: 'john@example.com',
                bio: 'Software developer and design enthusiast.',
              }}
            >
              <Field name="displayName" label="Display Name" />
              <Field name="email" label="Email" type="email" />
              <Field name="bio" label="Bio" component="textarea" />

              <FormActions>
                <Button type="submit">Save Profile</Button>
              </FormActions>
            </Form>
          </Tabs.Panel>

          <Tabs.Panel value={1}>
            <Form
              schema={notificationSchema}
              onSubmit={(data) => handleSave(data, 'Notification')}
              defaultValues={{
                emailNotifications: true,
                pushNotifications: false,
                weeklyDigest: true,
                productUpdates: false,
              }}
            >
              <Field name="emailNotifications" label="Email notifications" component="switch" />
              <Field name="pushNotifications" label="Push notifications" component="switch" />
              <Field name="weeklyDigest" label="Weekly digest" component="checkbox" />
              <Field name="productUpdates" label="Product updates" component="checkbox" />

              <FormActions>
                <Button type="submit">Save Notifications</Button>
              </FormActions>
            </Form>
          </Tabs.Panel>

          <Tabs.Panel value={2}>
            <Form
              schema={privacySchema}
              onSubmit={(data) => handleSave(data, 'Privacy')}
              defaultValues={{
                profileVisibility: 'public' as const,
                showEmail: false,
                showActivity: true,
              }}
            >
              <Field
                name="profileVisibility"
                label="Profile Visibility"
                component="select"
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'friends', label: 'Friends Only' },
                  { value: 'private', label: 'Private' },
                ]}
              />
              <Field name="showEmail" label="Show email on profile" component="switch" />
              <Field name="showActivity" label="Show activity status" component="switch" />

              <FormActions>
                <Button type="submit">Save Privacy</Button>
              </FormActions>
            </Form>
          </Tabs.Panel>
        </Tabs>

        {showToast && (
          <Toast variant="success" onClose={() => setShowToast(false)}>
            {toastMessage}
          </Toast>
        )}
      </div>
    );
  },
};
```

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Navigate to "Examples" → "Settings Panel"

Expected: Tabbed settings interface with Profile, Notifications, and Privacy sections

**Step 3: Commit**

```bash
git add src/examples/SettingsPanel.stories.tsx
git commit -m "feat(storybook): add Settings Panel example"
```

---

## Task 15: Create Admin Tools Example

**Files:**
- Create: `src/examples/AdminTools.stories.tsx`

**Step 1: Create AdminTools story file**

Create `src/examples/AdminTools.stories.tsx`:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Header } from '../components/Header';
import { SearchCommand } from '../components/SearchCommand';
import { NotificationMenu } from '../components/NotificationMenu';
import { Modal } from '../components/primitives/Modal';
import { Button } from '../components/Button';
import { Table } from '../components/Table';

const meta: Meta = {
  title: 'Examples/Admin Tools',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Admin interface patterns using Header, SearchCommand, NotificationMenu, Modal, Button, and Table components.'
      }
    }
  },
};

export default meta;

type Story = StoryObj;

const mockNotifications = [
  { id: 1, title: 'New user registered', message: 'John Doe just signed up', time: '2 min ago', unread: true },
  { id: 2, title: 'Server alert', message: 'High CPU usage detected', time: '15 min ago', unread: true },
  { id: 3, title: 'Payment received', message: 'Invoice #1234 paid', time: '1 hour ago', unread: false },
];

const mockCommands = [
  { id: 1, label: 'Create New User', category: 'Users' },
  { id: 2, label: 'View Analytics', category: 'Reports' },
  { id: 3, label: 'Export Data', category: 'Data' },
  { id: 4, label: 'System Settings', category: 'Settings' },
  { id: 5, label: 'View Logs', category: 'System' },
];

export const AdminHeader: Story = {
  render: () => {
    const [searchOpen, setSearchOpen] = useState(false);

    const handleSearch = (query: string) => {
      console.log('Searching for:', query);
    };

    const handleCommandSelect = (command: typeof mockCommands[0]) => {
      console.log('Selected command:', command.label);
      setSearchOpen(false);
    };

    return (
      <>
        <Header
          logo={<strong style={{ fontSize: '1.25rem' }}>Admin Panel</strong>}
          actions={
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)}>
                ⌘K Search
              </Button>
              <NotificationMenu
                notifications={mockNotifications}
                onNotificationClick={(notif) => console.log('Clicked:', notif.title)}
                onClearAll={() => console.log('Clear all')}
              />
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          }
        />

        <SearchCommand
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={handleSearch}
          placeholder="Search or run a command..."
          commands={mockCommands.map(cmd => ({
            ...cmd,
            onSelect: () => handleCommandSelect(cmd),
          }))}
        />
      </>
    );
  },
};

export const QuickActions: Story = {
  render: () => {
    const [searchOpen, setSearchOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');

    const handleCommandSelect = (command: typeof mockCommands[0]) => {
      setSelectedAction(command.label);
      setSearchOpen(false);
      setModalOpen(true);
    };

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Quick Actions</h1>
          <p style={{ color: 'var(--boom-theme-text-secondary)' }}>
            Press <kbd>⌘K</kbd> or click the button to open command palette
          </p>
          <Button onClick={() => setSearchOpen(true)} style={{ marginTop: '1rem' }}>
            Open Command Palette
          </Button>
        </div>

        <SearchCommand
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSearch={(q) => console.log('Search:', q)}
          placeholder="Search or run a command..."
          commands={mockCommands.map(cmd => ({
            ...cmd,
            onSelect: () => handleCommandSelect(cmd),
          }))}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={selectedAction}
          description="This is where you'd implement the selected action"
        >
          <p>You selected: <strong>{selectedAction}</strong></p>
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      </div>
    );
  },
};

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Editor' },
];

export const BulkOperations: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [operation, setOperation] = useState('');

    const toggleSelect = (id: number) => {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    };

    const toggleSelectAll = () => {
      setSelectedIds(prev =>
        prev.length === mockUsers.length ? [] : mockUsers.map(u => u.id)
      );
    };

    const handleBulkAction = (action: string) => {
      setOperation(action);
      setModalOpen(true);
    };

    const executeBulkAction = () => {
      console.log(`${operation} users:`, selectedIds);
      setModalOpen(false);
      setSelectedIds([]);
    };

    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Users ({selectedIds.length} selected)</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              onClick={() => handleBulkAction('Delete')}
              disabled={selectedIds.length === 0}
              variant="outline"
              size="sm"
            >
              Delete Selected
            </Button>
            <Button
              onClick={() => handleBulkAction('Export')}
              disabled={selectedIds.length === 0}
              variant="outline"
              size="sm"
            >
              Export Selected
            </Button>
          </div>
        </div>

        <Table>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === mockUsers.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`${operation} Users`}
          description={`Are you sure you want to ${operation.toLowerCase()} ${selectedIds.length} user(s)?`}
        >
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <Button onClick={executeBulkAction} variant="primary">
              Confirm {operation}
            </Button>
            <Button onClick={() => setModalOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    );
  },
};
```

**Step 2: Verify in Storybook**

Run: `npm run storybook`

Navigate to "Examples" → "Admin Tools"

Expected: Three stories showing admin header, quick actions, and bulk operations

**Step 3: Commit**

```bash
git add src/examples/AdminTools.stories.tsx
git commit -m "feat(storybook): add Admin Tools examples"
```

---

## Task 16: Final Verification and Testing

**Files:**
- Verify: All story files updated correctly
- Test: Storybook builds without errors

**Step 1: Run type checking**

Run: `npm run typecheck`

Expected: No TypeScript errors

**Step 2: Run tests**

Run: `npm run test:ci`

Expected: All tests pass (559 tests)

**Step 3: Build Storybook**

Run: `npm run build-storybook`

Expected: Storybook builds successfully

**Step 4: Start Storybook and verify organization**

Run: `npm run storybook`

Manually verify sidebar structure:
- ✅ Getting Started (Introduction, Theme System, Layout Basics)
- ✅ Forms & Validation (9 components)
- ✅ Data & Content (7 components)
- ✅ Navigation & Menus (5 components)
- ✅ Feedback & Alerts (5 components)
- ✅ Overlays & Dialogs (6 components, primitives marked)
- ✅ Page Layouts (4 components, primitives marked)
- ✅ Examples (4 compositional patterns)

**Step 5: Verify primitive warnings**

Navigate to:
- Overlays & Dialogs → Portal (check warning)
- Overlays & Dialogs → Overlay (check warning)
- Page Layouts → Box (check description)
- Page Layouts → Stack (check description)

Expected: All primitive warnings/descriptions display correctly

**Step 6: Commit if any fixes needed**

If any issues found and fixed:
```bash
git add <fixed-files>
git commit -m "fix(storybook): correct restructure issues"
```

---

## Task 17: Final Build and Push

**Files:**
- N/A

**Step 1: Run final build**

Run: `npm run build`

Expected: Build succeeds without errors

**Step 2: Push branch to remote**

```bash
git push -u origin feature/storybook-restructure
```

Expected: Branch pushed successfully

**Step 3: Document completion**

Implementation complete! All 38 existing stories reorganized, 4 primitives marked, 5 new story files created (Introduction + 4 Examples).

Ready for pull request and merge.

---

## Summary

**Total Tasks:** 17
**Files Modified:** 38 existing story files + 4 primitives
**Files Created:** 5 new story files (Introduction + 4 Examples)

**Categories Implemented:**
- Getting Started (3 stories)
- Forms & Validation (9 components)
- Data & Content (7 components)
- Navigation & Menus (5 components)
- Feedback & Alerts (5 components)
- Overlays & Dialogs (6 components)
- Page Layouts (4 components)
- Examples (4 patterns)

**Verification Steps:**
- TypeScript type checking passes
- All tests pass (559 tests)
- Storybook builds successfully
- Sidebar organization verified
- Primitive warnings verified

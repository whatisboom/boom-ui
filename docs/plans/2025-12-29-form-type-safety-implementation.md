# Form Type Safety Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all type assertions from Form components by replacing Context-based architecture with render prop pattern.

**Architecture:** Form component uses render prop to pass Field component through closure, preserving generic types. Field factory function creates component bound to form instance, eliminating need for Context.

**Tech Stack:** React, TypeScript, react-hook-form, Zod, vitest, @testing-library/react

---

## Task 1: Update Type Definitions

**Files:**
- Modify: `src/components/Form/Form.types.ts` (complete rewrite)

**Step 1: Write failing test for new Form types**

Create test file to verify type safety:

```bash
# Create temporary type test file
cat > src/components/Form/Form.types.test.ts << 'EOF'
import { z } from 'zod';
import type { FormProps, FormHandle, FieldProps } from './Form.types';

// This file tests type compilation, not runtime behavior
// If it compiles, types are correct

const testSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type TestFormProps = FormProps<typeof testSchema>;
type TestFormHandle = FormHandle<typeof testSchema>;

// Test that children is a render function
const validProps: TestFormProps = {
  schema: testSchema,
  onSubmit: (data) => {
    // data should be typed as output
    const email: string = data.email;
  },
  children: (form) => {
    // form.Field should exist
    return form.Field({ name: 'email' });
  },
};

// Test that FormHandle has correct methods
const testHandle: TestFormHandle = {
  reset: () => {},
  setError: () => {},
  clearErrors: () => {},
  trigger: async () => true,
  getValues: () => ({ email: '', password: '' }),
  setValue: () => {},
};

export {};
EOF
```

**Step 2: Run type test to verify it fails**

Run: `npm run typecheck`

Expected: Compilation errors - FormProps doesn't have children function, FormHandle doesn't exist

**Step 3: Rewrite Form.types.ts**

Replace entire file contents:

```typescript
import { ReactNode } from 'react';
import { z } from 'zod';
import {
  UseFormReturn,
  DefaultValues,
  Path,
  ControllerRenderProps,
  FieldError
} from 'react-hook-form';

/**
 * Form component props with generic schema
 */
export interface FormProps<TSchema extends z.ZodObject<z.ZodRawShape>> {
  /**
   * Zod validation schema
   */
  schema: TSchema;

  /**
   * Submit handler - receives validated data
   */
  onSubmit: (data: z.output<TSchema>) => void | Promise<void>;

  /**
   * Default form values
   */
  defaultValues?: DefaultValues<z.input<TSchema>>;

  /**
   * Reset form after successful submission
   * @default false
   */
  resetOnSubmit?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Render function that receives form instance with Field component
   */
  children: (form: FormRenderProps<TSchema>) => ReactNode;
}

/**
 * Form render props - passed to children function
 */
export interface FormRenderProps<TSchema extends z.ZodObject<z.ZodRawShape>>
  extends UseFormReturn<z.input<TSchema>, unknown, z.output<TSchema>> {
  /**
   * Type-safe Field component bound to this form
   */
  Field: FieldComponent<TSchema>;
}

/**
 * Form handle for imperative control via ref
 */
export type FormHandle<TSchema extends z.ZodObject<z.ZodRawShape>> = {
  reset: UseFormReturn<z.input<TSchema>>['reset'];
  setError: UseFormReturn<z.input<TSchema>>['setError'];
  clearErrors: UseFormReturn<z.input<TSchema>>['clearErrors'];
  trigger: UseFormReturn<z.input<TSchema>>['trigger'];
  getValues: UseFormReturn<z.input<TSchema>>['getValues'];
  setValue: UseFormReturn<z.input<TSchema>>['setValue'];
};

/**
 * Field component type created by factory
 */
export type FieldComponent<TSchema extends z.ZodObject<z.ZodRawShape>> = <
  TName extends Path<z.input<TSchema>>
>(
  props: FieldProps<TSchema, TName>
) => React.ReactElement;

/**
 * Field component props
 */
export interface FieldProps<
  TSchema extends z.ZodObject<z.ZodRawShape>,
  TName extends Path<z.input<TSchema>>
> {
  /**
   * Field name - must match schema key (autocompletes!)
   */
  name: TName;

  /**
   * Field label
   */
  label?: string;

  /**
   * Component type to render
   * @default 'input'
   */
  component?: 'input' | 'textarea' | 'select' | 'checkbox' | 'switch';

  /**
   * Input type (for component='input')
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Helper text below field
   */
  helperText?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Select options (for component='select')
   */
  options?: Array<{ value: string; label: string }>;

  /**
   * Custom render function for special cases
   */
  render?: (params: {
    field: ControllerRenderProps<z.input<TSchema>, TName>;
    error: FieldError | undefined;
  }) => ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;
}
```

**Step 4: Run type test to verify it passes**

Run: `npm run typecheck`

Expected: No compilation errors - all types properly defined

**Step 5: Clean up and commit**

```bash
rm src/components/Form/Form.types.test.ts
git add src/components/Form/Form.types.ts
git commit -m "refactor(form): update types for render prop pattern"
```

---

## Task 2: Create Field Factory Function

**Files:**
- Create: `src/components/Form/createFieldComponent.tsx`

**Step 1: Create the field factory file**

```typescript
import { useMemo } from 'react';
import { Controller, UseFormReturn, Path } from 'react-hook-form';
import { z } from 'zod';
import { FieldProps, FieldComponent } from './Form.types';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { Select } from '../Select';
import { Switch } from '../Switch';
import { cn } from '@/utils/classnames';
import styles from './Form.module.css';

/**
 * Creates a Field component bound to a specific form instance
 * This preserves the generic schema type through closure
 */
export function createFieldComponent<TSchema extends z.ZodObject<z.ZodRawShape>>(
  form: UseFormReturn<z.input<TSchema>, unknown, z.output<TSchema>>
): FieldComponent<TSchema> {
  type FieldName = Path<z.input<TSchema>>;

  return function Field<TName extends FieldName>(
    props: FieldProps<TSchema, TName>
  ): React.ReactElement {
    const {
      name,
      component = 'input',
      render,
      label,
      type,
      placeholder,
      helperText,
      disabled,
      options,
      className,
    } = props;

    return (
      <div className={cn(styles.fieldGroup, className)}>
        <Controller
          name={name}
          control={form.control}
          render={({ field, fieldState }) => {
            // Custom render prop takes precedence
            if (render) {
              return render({ field, error: fieldState.error });
            }

            // Common props for all field types
            const commonProps = {
              label,
              error: fieldState.error?.message,
              helperText,
              disabled,
            };

            // Render standard component based on type
            switch (component) {
              case 'textarea':
                return (
                  <Textarea
                    {...field}
                    {...commonProps}
                    placeholder={placeholder}
                  />
                );

              case 'checkbox':
                return (
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    {...commonProps}
                  />
                );

              case 'switch':
                return (
                  <Switch
                    {...field}
                    checked={!!field.value}
                    {...commonProps}
                  />
                );

              case 'select':
                return (
                  <Select
                    {...field}
                    {...commonProps}
                    options={options || []}
                  />
                );

              default:
                return (
                  <Input
                    {...field}
                    {...commonProps}
                    type={type}
                    placeholder={placeholder}
                  />
                );
            }
          }}
        />
      </div>
    );
  };
}
```

**Step 2: Verify it compiles**

Run: `npm run typecheck`

Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Form/createFieldComponent.tsx
git commit -m "feat(form): add field factory function with closure-based typing"
```

---

## Task 3: Rewrite Form Component

**Files:**
- Modify: `src/components/Form/Form.tsx` (complete rewrite)

**Step 1: Rewrite Form.tsx**

Replace entire file contents:

```typescript
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { cn } from '@/utils/classnames';
import { FormProps, FormHandle } from './Form.types';
import { createFieldComponent } from './createFieldComponent';
import styles from './Form.module.css';

function FormComponent<TSchema extends z.ZodObject<z.ZodRawShape>>(
  {
    schema,
    onSubmit,
    defaultValues,
    resetOnSubmit = false,
    className,
    children,
    ...props
  }: FormProps<TSchema>,
  ref: React.ForwardedRef<FormHandle<TSchema>>
) {
  type FormInput = z.input<TSchema>;
  type FormOutput = z.output<TSchema>;

  // Create react-hook-form instance
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: standardSchemaResolver(schema),
    defaultValues,
  });

  // Create Field component bound to this form instance
  // Memoized to maintain referential equality
  const Field = useMemo(
    () => createFieldComponent<TSchema>(form),
    [form]
  );

  // Expose imperative handle for ref-based control
  useImperativeHandle(
    ref,
    () => ({
      reset: form.reset,
      setError: form.setError,
      clearErrors: form.clearErrors,
      trigger: form.trigger,
      getValues: form.getValues,
      setValue: form.setValue,
    }),
    [form]
  );

  // Handle form submission
  const handleSubmit = async (data: FormOutput) => {
    await onSubmit(data);
    if (resetOnSubmit) {
      form.reset();
    }
  };

  return (
    <form
      ref={ref as React.ForwardedRef<HTMLFormElement>}
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn(styles.form, className)}
      noValidate
      {...props}
    >
      {children({ Field, ...form })}
    </form>
  );
}

// Export with forwardRef while preserving generics
export const Form = forwardRef(FormComponent) as <
  TSchema extends z.ZodObject<z.ZodRawShape>
>(
  props: FormProps<TSchema> & {
    ref?: React.ForwardedRef<FormHandle<TSchema>>;
  }
) => React.ReactElement;

Form.displayName = 'Form';
```

**Step 2: Verify it compiles**

Run: `npm run typecheck`

Expected: No errors, no type assertions

**Step 3: Search for type assertions**

Run: `grep -n " as " src/components/Form/Form.tsx`

Expected: Only the forwardRef cast at the end (acceptable pattern for generic components)

**Step 4: Commit**

```bash
git add src/components/Form/Form.tsx
git commit -m "refactor(form): rewrite with render prop pattern, zero type assertions"
```

---

## Task 4: Delete Obsolete Files

**Files:**
- Delete: `src/components/Form/FormContext.tsx`
- Delete: `src/components/Form/Field.tsx`
- Delete: `src/components/Form/Field.types.ts`

**Step 1: Remove FormContext**

```bash
git rm src/components/Form/FormContext.tsx
git commit -m "refactor(form): remove FormContext (replaced by render prop)"
```

**Step 2: Remove old Field component**

```bash
git rm src/components/Form/Field.tsx src/components/Form/Field.types.ts
git commit -m "refactor(form): remove Field component (replaced by factory)"
```

**Step 3: Verify build still works**

Run: `npm run build`

Expected: Build errors due to missing exports and tests (will fix next)

---

## Task 5: Update Form Index Exports

**Files:**
- Modify: `src/components/Form/index.ts`

**Step 1: Update exports**

Replace file contents:

```typescript
export { Form } from './Form';
export { FormActions } from './FormActions';
export { FormMessage } from './FormMessage';

// Export types
export type {
  FormProps,
  FormHandle,
  FormRenderProps,
  FieldComponent,
  FieldProps,
} from './Form.types';
export type { FormActionsProps } from './FormActions.types';
export type { FormMessageProps } from './FormMessage.types';
```

**Step 2: Verify exports compile**

Run: `npm run typecheck`

Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Form/index.ts
git commit -m "refactor(form): update exports for new API"
```

---

## Task 6: Update Form Tests

**Files:**
- Modify: `src/components/Form/Form.test.tsx`

**Step 1: Rewrite Form.test.tsx**

Replace test file with new API:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { z } from 'zod';
import { Form } from './Form';
import { Button } from '../Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

describe('Form', () => {
  it('should render form element', () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
          </>
        )}
      </Form>
    );

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should render fields from render prop', () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
          </>
        )}
      </Form>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should validate on submit and show errors', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
            <Button type="submit">Submit</Button>
          </>
        )}
      </Form>
    );

    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with validated data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
            <Button type="submit">Submit</Button>
          </>
        )}
      </Form>
    );

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should reset form when resetOnSubmit is true', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit} resetOnSubmit>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
            <Button type="submit">Submit</Button>
          </>
        )}
      </Form>
    );

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });

  it('should support imperative control via ref', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();
    const formRef = { current: null };

    render(
      <>
        <Form ref={formRef} schema={loginSchema} onSubmit={handleSubmit}>
          {(form) => (
            <>
              <form.Field name="email" label="Email" component="input" />
              <form.Field name="password" label="Password" component="input" type="password" />
            </>
          )}
        </Form>
        <Button onClick={() => formRef.current?.reset()}>External Reset</Button>
      </>
    );

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    await user.type(emailInput, 'test@example.com');

    expect(emailInput.value).toBe('test@example.com');

    await user.click(screen.getByText('External Reset'));

    expect(emailInput.value).toBe('');
  });

  it('should support custom field rendering', () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <form.Field
            name="email"
            render={({ field, error }) => (
              <div>
                <input {...field} data-testid="custom-input" />
                {error && <span>{error.message}</span>}
              </div>
            )}
          />
        )}
      </Form>
    );

    expect(screen.getByTestId('custom-input')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const handleSubmit = vi.fn();

    const { container } = render(
      <Form schema={loginSchema} onSubmit={handleSubmit}>
        {(form) => (
          <>
            <form.Field name="email" label="Email" component="input" />
            <form.Field name="password" label="Password" component="input" type="password" />
          </>
        )}
      </Form>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Step 2: Run tests**

Run: `npm test Form.test.tsx`

Expected: All tests pass

**Step 3: Commit**

```bash
git add src/components/Form/Form.test.tsx
git commit -m "test(form): update tests for render prop API"
```

---

## Task 7: Update Form Stories

**Files:**
- Modify: `src/components/Form/Form.stories.tsx`

**Step 1: Update Form.stories.tsx**

Update all stories to use render prop pattern. Replace the story implementations (keep meta and story structure):

```typescript
export const BasicForm: Story = {
  args: {
    schema: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
    onSubmit: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(JSON.stringify(data, null, 2));
    },
    children: (form) => (
      <>
        <form.Field
          name="email"
          label="Email"
          component="input"
          type="email"
          placeholder="you@example.com"
        />
        <form.Field
          name="password"
          label="Password"
          component="input"
          type="password"
          placeholder="••••••••"
        />
        <FormActions>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </FormActions>
      </>
    ),
  },
};
```

Update all other stories following the same pattern, wrapping field content in `children: (form) => (...)`.

**Step 2: Run Storybook**

Run: `npm run storybook`

Expected: All Form stories render correctly

**Step 3: Commit**

```bash
git add src/components/Form/Form.stories.tsx
git commit -m "docs(form): update stories for render prop API"
```

---

## Task 8: Final Verification

**Files:**
- All Form component files

**Step 1: Run full type check**

Run: `npm run typecheck`

Expected: Zero errors

**Step 2: Search for type assertions in Form directory**

Run: `grep -r " as " src/components/Form/ --include="*.tsx" --include="*.ts"`

Expected: Only the forwardRef cast in Form.tsx (acceptable)

**Step 3: Run all tests**

Run: `npm test`

Expected: All tests pass, 80%+ coverage maintained

**Step 4: Run build**

Run: `npm run build`

Expected: Clean build with no errors

**Step 5: Final commit**

```bash
git add -A
git commit -m "refactor(form): complete render prop migration, remove all type assertions"
```

---

## Success Criteria

- ✅ Zero type assertions (except forwardRef cast)
- ✅ All tests pass
- ✅ Type checking passes
- ✅ Build succeeds
- ✅ Storybook stories work
- ✅ Form field names autocomplete from schema
- ✅ FormHandle ref API works
- ✅ Custom render prop works

---

## Rollback Plan

If issues arise:

```bash
git log --oneline -10  # Find commit before Task 1
git reset --hard <commit-hash>
```

All changes are in atomic commits and can be reverted individually.

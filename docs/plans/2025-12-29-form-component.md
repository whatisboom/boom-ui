# Form Component Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a comprehensive Form component system with React Hook Form integration, Zod validation, multi-step support, and field arrays for authentication flows.

**Architecture:** Compound component pattern with FormContext providing react-hook-form instance and Zod schema. Field components auto-register via context. Controlled FormStepper for multi-step wizards. All components follow boom-ui patterns (forwardRef, CSS modules, vitest-axe).

**Tech Stack:** React 19, TypeScript (strict), react-hook-form, @hookform/resolvers/zod, zod, CSS Modules, vitest + @testing-library/react + vitest-axe

---

## Prerequisites

**Check Dependencies:**

Before starting, verify react-hook-form and zod are installed:

```bash
npm list react-hook-form zod @hookform/resolvers
```

If missing, install:

```bash
npm install zod @hookform/resolvers
```

---

## Phase 1: Foundation (Form Context & Basic Form)

### Task 1: Create TypeScript Types

**Files:**
- Create: `src/components/Form/Form.types.ts`

**Step 1: Create types file with core interfaces**

```typescript
import { ReactNode } from 'react';
import { z } from 'zod';
import { UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form';

/**
 * Form component props
 */
export interface FormProps<TSchema extends z.ZodType> {
  /**
   * Zod validation schema
   */
  schema: TSchema;

  /**
   * Submit handler - receives validated data
   */
  onSubmit: SubmitHandler<z.infer<TSchema>>;

  /**
   * Default form values
   */
  defaultValues?: Partial<z.infer<TSchema>>;

  /**
   * Validation mode
   * @default 'onSubmit'
   */
  mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';

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
   * Form children
   */
  children: ReactNode;
}

/**
 * Form context value
 */
export interface FormContextValue<TFieldValues extends FieldValues = FieldValues> {
  /**
   * React Hook Form instance
   */
  form: UseFormReturn<TFieldValues>;

  /**
   * Is form currently submitting
   */
  isSubmitting: boolean;
}
```

**Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit types**

```bash
git add src/components/Form/Form.types.ts
git commit -m "feat(form): add TypeScript types for Form component"
```

---

### Task 2: Create Form Context

**Files:**
- Create: `src/components/Form/FormContext.tsx`

**Step 1: Create context with validation hook**

```typescript
import { createContext, useContext } from 'react';
import { FieldValues } from 'react-hook-form';
import { FormContextValue } from './Form.types';

export const FormContext = createContext<FormContextValue | undefined>(undefined);

export const useFormContext = <TFieldValues extends FieldValues = FieldValues>() => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('Form components must be used within a Form component');
  }
  return context as FormContextValue<TFieldValues>;
};
```

**Step 2: Write failing test**

Create: `src/components/Form/FormContext.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormContext } from './FormContext';

describe('useFormContext', () => {
  it('should throw error when used outside Form', () => {
    expect(() => {
      renderHook(() => useFormContext());
    }).toThrow('Form components must be used within a Form component');
  });
});
```

**Step 3: Run test to verify it passes**

Run: `npx vitest src/components/Form/FormContext.test.tsx`
Expected: PASS

**Step 4: Commit context**

```bash
git add src/components/Form/FormContext.tsx src/components/Form/FormContext.test.tsx
git commit -m "feat(form): add Form context with validation hook"
```

---

### Task 3: Create CSS Module

**Files:**
- Create: `src/components/Form/Form.module.css`

**Step 1: Write base styles with design tokens**

```css
/* Form container */
.form {
  width: 100%;
}

/* Field spacing */
.fieldGroup {
  margin-bottom: var(--boom-spacing-4);
}

.fieldGroup:last-child {
  margin-bottom: 0;
}

/* Form message */
.formMessage {
  padding: var(--boom-spacing-3) var(--boom-spacing-4);
  border-radius: var(--boom-border-radius-md);
  margin-bottom: var(--boom-spacing-4);
  font-size: var(--boom-font-size-sm);
}

.formMessageSuccess {
  background-color: var(--boom-color-success-bg);
  color: var(--boom-color-success-text);
  border: 1px solid var(--boom-color-success-border);
}

.formMessageError {
  background-color: var(--boom-color-error-bg);
  color: var(--boom-color-error-text);
  border: 1px solid var(--boom-color-error-border);
}

.formMessageWarning {
  background-color: var(--boom-color-warning-bg);
  color: var(--boom-color-warning-text);
  border: 1px solid var(--boom-color-warning-border);
}

.formMessageInfo {
  background-color: var(--boom-theme-bg-secondary);
  color: var(--boom-theme-text-primary);
  border: 1px solid var(--boom-theme-border-default);
}

/* Form actions */
.formActions {
  display: flex;
  gap: var(--boom-spacing-3);
  margin-top: var(--boom-spacing-6);
}

.formActionsRight {
  justify-content: flex-end;
}

.formActionsLeft {
  justify-content: flex-start;
}

.formActionsCenter {
  justify-content: center;
}

.formActionsSpaceBetween {
  justify-content: space-between;
}

/* Stepper */
.stepper {
  margin-bottom: var(--boom-spacing-6);
}

.stepperProgress {
  display: flex;
  gap: var(--boom-spacing-2);
  margin-bottom: var(--boom-spacing-4);
}

.step {
  flex: 1;
  height: 4px;
  background-color: var(--boom-theme-bg-tertiary);
  border-radius: var(--boom-border-radius-sm);
  transition: background-color var(--boom-transition-fast);
}

.stepActive {
  background-color: var(--boom-color-primary);
}

.stepCompleted {
  background-color: var(--boom-color-success);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .step {
    transition: none;
  }
}
```

**Step 2: Verify no CSS syntax errors**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit styles**

```bash
git add src/components/Form/Form.module.css
git commit -m "feat(form): add CSS module with design tokens"
```

---

### Task 4: Create Form Component (TDD)

**Files:**
- Create: `src/components/Form/Form.tsx`
- Create: `src/components/Form/Form.test.tsx`

**Step 1: Write failing tests**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { z } from 'zod';
import { Form } from './Form';

const testSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

describe('Form', () => {
  it('should render form element', () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <div>Form content</div>
      </Form>
    );

    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('should call onSubmit with validated data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <input name="email" type="email" />
        <input name="password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    );

    await user.type(screen.getByRole('textbox'), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should provide form context to children', () => {
    const handleSubmit = vi.fn();

    function TestChild() {
      const { form } = useFormContext();
      return <div>Has form: {form ? 'yes' : 'no'}</div>;
    }

    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <TestChild />
      </Form>
    );

    expect(screen.getByText('Has form: yes')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <input name="email" aria-label="Email" />
      </Form>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest src/components/Form/Form.test.tsx`
Expected: FAIL - "Form is not defined"

**Step 3: Write minimal implementation**

```typescript
import { forwardRef, FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/utils/classnames';
import { FormContext } from './FormContext';
import { FormProps } from './Form.types';
import styles from './Form.module.css';

// Generic component type helper
const FormImpl = forwardRef<HTMLFormElement, FormProps<any>>(
  <TSchema extends z.ZodType>(
    {
      schema,
      onSubmit,
      defaultValues,
      mode = 'onSubmit',
      resetOnSubmit = false,
      className,
      children,
      ...props
    }: FormProps<TSchema>,
    ref: React.ForwardedRef<HTMLFormElement>
  ) => {
    const form = useForm<z.infer<TSchema>>({
      resolver: zodResolver(schema),
      defaultValues,
      mode,
    });

    const handleSubmit = async (data: z.infer<TSchema>) => {
      await onSubmit(data);
      if (resetOnSubmit) {
        form.reset();
      }
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      form.handleSubmit(handleSubmit)(e);
    };

    return (
      <FormContext.Provider value={{ form, isSubmitting: form.formState.isSubmitting }}>
        <form
          ref={ref}
          role="form"
          onSubmit={handleFormSubmit}
          className={cn(styles.form, className)}
          noValidate
          {...props}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  }
);

// Cast to support generics with forwardRef
export const Form = FormImpl as <TSchema extends z.ZodType>(
  props: FormProps<TSchema> & React.RefAttributes<HTMLFormElement>
) => React.ReactElement;

Form.displayName = 'Form';
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest src/components/Form/Form.test.tsx`
Expected: PASS - All tests pass

**Step 5: Run full test suite**

Run: `npm test`
Expected: All tests pass

**Step 6: Commit**

```bash
git add src/components/Form/Form.tsx src/components/Form/Form.test.tsx
git commit -m "feat(form): add Form component with react-hook-form and Zod integration"
```

---

## Phase 2: Field Component (Auto-Registration)

### Task 5: Create Field Types

**Files:**
- Create: `src/components/Form/Field.types.ts`

**Step 1: Create Field types**

```typescript
import { InputProps } from '../Input/Input.types';
import { TextareaProps } from '../Textarea/Textarea.types';
import { CheckboxProps } from '../Checkbox/Checkbox.types';
import { SelectProps } from '../Select/Select.types';
import { SwitchProps } from '../Switch/Switch.types';

/**
 * Field component type
 */
export type FieldComponent = 'input' | 'textarea' | 'select' | 'checkbox' | 'switch';

/**
 * Field component props
 */
export interface FieldProps {
  /**
   * Field name - must match schema key
   */
  name: string;

  /**
   * Field label
   */
  label: string;

  /**
   * Component type to render
   * @default 'input'
   */
  component?: FieldComponent;

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
   * Additional CSS class
   */
  className?: string;
}
```

**Step 2: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/components/Form/Field.types.ts
git commit -m "feat(form): add Field component types"
```

---

### Task 6: Create Field Component (TDD)

**Files:**
- Create: `src/components/Form/Field.tsx`
- Create: `src/components/Form/Field.test.tsx`

**Step 1: Write failing tests**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { z } from 'zod';
import { Form } from './Form';
import { Field } from './Field';

const testSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be 8+ characters'),
  bio: z.string().optional(),
  subscribe: z.boolean(),
});

describe('Field', () => {
  it('should render input field', () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <Field name="email" label="Email" />
      </Form>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should render textarea when component="textarea"', () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <Field name="bio" label="Bio" component="textarea" />
      </Form>
    );

    expect(screen.getByLabelText('Bio')).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('should render checkbox when component="checkbox"', () => {
    const handleSubmit = vi.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <Field name="subscribe" label="Subscribe" component="checkbox" />
      </Form>
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should display validation error from Zod', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={testSchema} onSubmit={handleSubmit} mode="onBlur">
        <Field name="email" label="Email" type="email" />
        <button type="submit">Submit</button>
      </Form>
    );

    const input = screen.getByLabelText('Email');
    await user.type(input, 'invalid-email');
    await user.tab(); // Trigger onBlur

    expect(await screen.findByText('Invalid email')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const handleSubmit = vi.fn();
    const { container } = render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <Field name="email" label="Email" type="email" />
      </Form>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest src/components/Form/Field.test.tsx`
Expected: FAIL - "Field is not defined"

**Step 3: Write minimal implementation**

```typescript
import { Controller } from 'react-hook-form';
import { useFormContext } from './FormContext';
import { FieldProps } from './Field.types';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { Select } from '../Select';
import { Switch } from '../Switch';
import styles from './Form.module.css';

export const Field: React.FC<FieldProps> = ({
  name,
  label,
  component = 'input',
  type = 'text',
  placeholder,
  helperText,
  disabled,
  options,
  className,
}) => {
  const { form } = useFormContext();
  const error = form.formState.errors[name];

  return (
    <div className={className}>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => {
          const commonProps = {
            label,
            error: error?.message as string | undefined,
            helperText,
            disabled,
          };

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
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label={label}
                  disabled={disabled}
                />
              );

            case 'switch':
              return (
                <Switch
                  {...field}
                  checked={field.value || false}
                  onChange={field.onChange}
                  label={label}
                  disabled={disabled}
                />
              );

            case 'select':
              return (
                <Select
                  {...field}
                  {...commonProps}
                  options={options || []}
                  placeholder={placeholder}
                />
              );

            case 'input':
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

Field.displayName = 'Field';
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest src/components/Form/Field.test.tsx`
Expected: PASS

**Step 5: Run full test suite**

Run: `npm test`
Expected: All tests pass

**Step 6: Commit**

```bash
git add src/components/Form/Field.tsx src/components/Form/Field.test.tsx
git commit -m "feat(form): add Field component with auto-registration"
```

---

## Phase 3: Form Actions & Messages

### Task 7: Create FormActions Component (TDD)

**Files:**
- Create: `src/components/Form/FormActions.tsx`
- Create: `src/components/Form/FormActions.types.ts`
- Create: `src/components/Form/FormActions.test.tsx`

**Step 1: Create types**

```typescript
import { ReactNode } from 'react';

export type FormActionsAlignment = 'left' | 'right' | 'center' | 'space-between';

export interface FormActionsProps {
  /**
   * Button alignment
   * @default 'right'
   */
  align?: FormActionsAlignment;

  /**
   * Action buttons
   */
  children: ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;
}
```

**Step 2: Write failing tests**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormActions } from './FormActions';

describe('FormActions', () => {
  it('should render children', () => {
    render(
      <FormActions>
        <button>Submit</button>
        <button>Cancel</button>
      </FormActions>
    );

    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should apply alignment class', () => {
    const { container } = render(
      <FormActions align="left">
        <button>Submit</button>
      </FormActions>
    );

    const actions = container.firstChild;
    expect(actions).toHaveClass('formActionsLeft');
  });
});
```

**Step 3: Run tests to verify they fail**

Run: `npx vitest src/components/Form/FormActions.test.tsx`
Expected: FAIL

**Step 4: Implement**

```typescript
import { cn } from '@/utils/classnames';
import { FormActionsProps } from './FormActions.types';
import styles from './Form.module.css';

export const FormActions: React.FC<FormActionsProps> = ({
  align = 'right',
  children,
  className,
}) => {
  const alignmentClass = {
    left: styles.formActionsLeft,
    right: styles.formActionsRight,
    center: styles.formActionsCenter,
    'space-between': styles.formActionsSpaceBetween,
  }[align];

  return (
    <div className={cn(styles.formActions, alignmentClass, className)}>
      {children}
    </div>
  );
};

FormActions.displayName = 'FormActions';
```

**Step 5: Run tests to verify they pass**

Run: `npx vitest src/components/Form/FormActions.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/Form/FormActions.*
git commit -m "feat(form): add FormActions component"
```

---

### Task 8: Create FormMessage Component (TDD)

**Files:**
- Create: `src/components/Form/FormMessage.tsx`
- Create: `src/components/Form/FormMessage.types.ts`
- Create: `src/components/Form/FormMessage.test.tsx`

**Step 1: Create types**

```typescript
import { ReactNode } from 'react';

export type FormMessageType = 'success' | 'error' | 'warning' | 'info';

export interface FormMessageProps {
  /**
   * Message type
   */
  type: FormMessageType;

  /**
   * Message content
   */
  children: ReactNode;

  /**
   * Dismiss callback
   */
  onDismiss?: () => void;

  /**
   * Additional CSS class
   */
  className?: string;
}
```

**Step 2: Write failing tests**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormMessage } from './FormMessage';

describe('FormMessage', () => {
  it('should render message content', () => {
    render(<FormMessage type="success">Success message</FormMessage>);
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should apply type class', () => {
    const { container } = render(<FormMessage type="error">Error</FormMessage>);
    expect(container.firstChild).toHaveClass('formMessageError');
  });

  it('should call onDismiss when dismiss button clicked', async () => {
    const handleDismiss = vi.fn();
    const user = userEvent.setup();

    render(
      <FormMessage type="info" onDismiss={handleDismiss}>
        Info message
      </FormMessage>
    );

    await user.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(handleDismiss).toHaveBeenCalled();
  });
});
```

**Step 3: Run tests to verify they fail**

Run: `npx vitest src/components/Form/FormMessage.test.tsx`
Expected: FAIL

**Step 4: Implement**

```typescript
import { cn } from '@/utils/classnames';
import { FormMessageProps } from './FormMessage.types';
import styles from './Form.module.css';

export const FormMessage: React.FC<FormMessageProps> = ({
  type,
  children,
  onDismiss,
  className,
}) => {
  const typeClass = {
    success: styles.formMessageSuccess,
    error: styles.formMessageError,
    warning: styles.formMessageWarning,
    info: styles.formMessageInfo,
  }[type];

  return (
    <div
      className={cn(styles.formMessage, typeClass, className)}
      role="alert"
      aria-live="polite"
    >
      <div>{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ×
        </button>
      )}
    </div>
  );
};

FormMessage.displayName = 'FormMessage';
```

**Step 5: Run tests to verify they pass**

Run: `npx vitest src/components/Form/FormMessage.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/Form/FormMessage.*
git commit -m "feat(form): add FormMessage component"
```

---

## Phase 4: Multi-Step Forms (Stepper)

### Task 9: Create FormStep & FormStepper Types

**Files:**
- Create: `src/components/Form/FormStepper.types.ts`
- Create: `src/components/Form/FormStep.types.ts`

**Step 1: Create FormStep types**

```typescript
import { ReactNode } from 'react';

export interface FormStepProps {
  /**
   * Step title
   */
  title: string;

  /**
   * Step description (optional)
   */
  description?: string;

  /**
   * Step content
   */
  children: ReactNode;
}
```

**Step 2: Create FormStepper types**

```typescript
import { ReactNode } from 'react';

export interface FormStepperProps {
  /**
   * Current step index (0-based)
   */
  currentStep: number;

  /**
   * Step change callback
   */
  onStepChange: (step: number) => void;

  /**
   * Show progress indicator
   * @default true
   */
  showProgress?: boolean;

  /**
   * FormStep children
   */
  children: ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Stepper context value
 */
export interface FormStepperContextValue {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}
```

**Step 3: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

**Step 4: Commit**

```bash
git add src/components/Form/FormStepper.types.ts src/components/Form/FormStep.types.ts
git commit -m "feat(form): add FormStepper and FormStep types"
```

---

### Task 10: Create Stepper Context Hook

**Files:**
- Create: `src/components/Form/hooks/useFormStep.tsx`
- Create: `src/components/Form/hooks/useFormStep.test.ts`

**Step 1: Create stepper context**

```typescript
import { createContext, useContext } from 'react';
import { FormStepperContextValue } from '../FormStepper.types';

export const FormStepperContext = createContext<FormStepperContextValue | undefined>(undefined);

export const useFormStep = () => {
  const context = useContext(FormStepperContext);
  if (!context) {
    throw new Error('useFormStep must be used within a FormStepper');
  }
  return context;
};
```

**Step 2: Write test**

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormStep } from './useFormStep';

describe('useFormStep', () => {
  it('should throw error when used outside FormStepper', () => {
    expect(() => {
      renderHook(() => useFormStep());
    }).toThrow('useFormStep must be used within a FormStepper');
  });
});
```

**Step 3: Run test**

Run: `npx vitest src/components/Form/hooks/useFormStep.test.ts`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/Form/hooks/useFormStep.*
git commit -m "feat(form): add useFormStep hook"
```

---

### Task 11: Create FormStep Component (TDD)

**Files:**
- Create: `src/components/Form/FormStep.tsx`
- Create: `src/components/Form/FormStep.test.tsx`

**Step 1: Write failing tests**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormStep } from './FormStep';
import { FormStepperContext } from './hooks/useFormStep';

const mockStepperContext = {
  currentStep: 0,
  totalSteps: 2,
  goToStep: vi.fn(),
  nextStep: vi.fn(),
  prevStep: vi.fn(),
  isFirstStep: true,
  isLastStep: false,
};

describe('FormStep', () => {
  it('should render children when active', () => {
    render(
      <FormStepperContext.Provider value={mockStepperContext}>
        <FormStep title="Step 1">
          <div>Step content</div>
        </FormStep>
      </FormStepperContext.Provider>
    );

    expect(screen.getByText('Step content')).toBeInTheDocument();
  });

  it('should not render children when inactive', () => {
    const inactiveContext = { ...mockStepperContext, currentStep: 1 };
    render(
      <FormStepperContext.Provider value={inactiveContext}>
        <FormStep title="Step 1">
          <div>Step content</div>
        </FormStep>
      </FormStepperContext.Provider>
    );

    expect(screen.queryByText('Step content')).not.toBeInTheDocument();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest src/components/Form/FormStep.test.tsx`
Expected: FAIL

**Step 3: Implement**

```typescript
import { useFormStep } from './hooks/useFormStep';
import { FormStepProps } from './FormStep.types';

let stepIndex = -1;

export const FormStep: React.FC<FormStepProps> = ({ children }) => {
  stepIndex++;
  const { currentStep } = useFormStep();

  const isActive = stepIndex === currentStep;

  // Reset counter after rendering
  if (stepIndex >= currentStep) {
    stepIndex = -1;
  }

  if (!isActive) {
    return null;
  }

  return <>{children}</>;
};

FormStep.displayName = 'FormStep';
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest src/components/Form/FormStep.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Form/FormStep.*
git commit -m "feat(form): add FormStep component"
```

---

### Task 12: Create FormStepper Component (TDD)

**Files:**
- Create: `src/components/Form/FormStepper.tsx`
- Create: `src/components/Form/FormStepper.test.tsx`

**Step 1: Write failing tests**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormStepper } from './FormStepper';
import { FormStep } from './FormStep';

describe('FormStepper', () => {
  it('should render current step', () => {
    const handleStepChange = vi.fn();

    render(
      <FormStepper currentStep={0} onStepChange={handleStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('should render progress indicator when showProgress=true', () => {
    const handleStepChange = vi.fn();

    const { container } = render(
      <FormStepper currentStep={0} onStepChange={handleStepChange} showProgress>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    expect(container.querySelector('.stepperProgress')).toBeInTheDocument();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx vitest src/components/Form/FormStepper.test.tsx`
Expected: FAIL

**Step 3: Implement**

```typescript
import { Children, useMemo } from 'react';
import { cn } from '@/utils/classnames';
import { FormStepperContext } from './hooks/useFormStep';
import { FormStepperProps } from './FormStepper.types';
import styles from './Form.module.css';

export const FormStepper: React.FC<FormStepperProps> = ({
  currentStep,
  onStepChange,
  showProgress = true,
  children,
  className,
}) => {
  const totalSteps = Children.count(children);

  const contextValue = useMemo(() => ({
    currentStep,
    totalSteps,
    goToStep: onStepChange,
    nextStep: () => onStepChange(Math.min(currentStep + 1, totalSteps - 1)),
    prevStep: () => onStepChange(Math.max(currentStep - 1, 0)),
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  }), [currentStep, totalSteps, onStepChange]);

  return (
    <FormStepperContext.Provider value={contextValue}>
      <div className={cn(styles.stepper, className)}>
        {showProgress && (
          <div className={styles.stepperProgress} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  styles.step,
                  index === currentStep && styles.stepActive,
                  index < currentStep && styles.stepCompleted
                )}
              />
            ))}
          </div>
        )}
        {children}
      </div>
    </FormStepperContext.Provider>
  );
};

FormStepper.displayName = 'FormStepper';
```

**Step 4: Run tests to verify they pass**

Run: `npx vitest src/components/Form/FormStepper.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Form/FormStepper.*
git commit -m "feat(form): add FormStepper component with controlled state"
```

---

## Phase 5: Field Arrays (Dynamic Fields)

### Task 13: Create FieldArray Component (TDD)

**Files:**
- Create: `src/components/Form/FieldArray.tsx`
- Create: `src/components/Form/FieldArray.types.ts`
- Create: `src/components/Form/FieldArray.test.tsx`

**Step 1: Create types**

```typescript
import { ReactNode } from 'react';

export interface FieldArrayProps {
  /**
   * Array field name from schema
   */
  name: string;

  /**
   * Render function for each field
   */
  children: (field: any, index: number, actions: {
    remove: () => void;
  }) => ReactNode;

  /**
   * Text for add button
   * @default 'Add'
   */
  addButtonText?: string;

  /**
   * Additional CSS class
   */
  className?: string;
}
```

**Step 2: Write failing tests**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { Form } from './Form';
import { Field } from './Field';
import { FieldArray } from './FieldArray';

const arraySchema = z.object({
  items: z.array(z.object({
    name: z.string(),
  })),
});

describe('FieldArray', () => {
  it('should render add button', () => {
    const handleSubmit = vi.fn();

    render(
      <Form schema={arraySchema} onSubmit={handleSubmit} defaultValues={{ items: [] }}>
        <FieldArray name="items">
          {(field, index) => (
            <Field name={`items.${index}.name`} label="Name" />
          )}
        </FieldArray>
      </Form>
    );

    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should add new field when add button clicked', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={arraySchema} onSubmit={handleSubmit} defaultValues={{ items: [] }}>
        <FieldArray name="items">
          {(field, index) => (
            <Field name={`items.${index}.name`} label={`Name ${index + 1}`} />
          )}
        </FieldArray>
      </Form>
    );

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(screen.getByLabelText('Name 1')).toBeInTheDocument();
  });

  it('should remove field when remove clicked', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form schema={arraySchema} onSubmit={handleSubmit} defaultValues={{ items: [{ name: 'Item 1' }] }}>
        <FieldArray name="items">
          {(field, index, actions) => (
            <div>
              <Field name={`items.${index}.name`} label="Name" />
              <button type="button" onClick={actions.remove}>Remove</button>
            </div>
          )}
        </FieldArray>
      </Form>
    );

    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
  });
});
```

**Step 3: Run tests to verify they fail**

Run: `npx vitest src/components/Form/FieldArray.test.tsx`
Expected: FAIL

**Step 4: Implement**

```typescript
import { useFieldArray } from 'react-hook-form';
import { useFormContext } from './FormContext';
import { FieldArrayProps } from './FieldArray.types';
import { Button } from '../Button';

export const FieldArray: React.FC<FieldArrayProps> = ({
  name,
  children,
  addButtonText = 'Add',
  className,
}) => {
  const { form } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });

  return (
    <div className={className}>
      {fields.map((field, index) => (
        <div key={field.id}>
          {children(field, index, { remove: () => remove(index) })}
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append({})}
        variant="secondary"
      >
        {addButtonText}
      </Button>
    </div>
  );
};

FieldArray.displayName = 'FieldArray';
```

**Step 5: Run tests to verify they pass**

Run: `npx vitest src/components/Form/FieldArray.test.tsx`
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/Form/FieldArray.*
git commit -m "feat(form): add FieldArray component for dynamic fields"
```

---

## Phase 6: Exports & Storybook

### Task 14: Create Component Index and Exports

**Files:**
- Create: `src/components/Form/index.ts`
- Modify: `src/index.ts`

**Step 1: Create component index**

```typescript
export { Form } from './Form';
export { Field } from './Field';
export { FieldArray } from './FieldArray';
export { FormActions } from './FormActions';
export { FormMessage } from './FormMessage';
export { FormStepper } from './FormStepper';
export { FormStep } from './FormStep';
export { useFormContext } from './FormContext';
export { useFormStep } from './hooks/useFormStep';

export type {
  FormProps,
  FormContextValue,
} from './Form.types';

export type {
  FieldProps,
  FieldComponent,
} from './Field.types';

export type {
  FieldArrayProps,
} from './FieldArray.types';

export type {
  FormActionsProps,
  FormActionsAlignment,
} from './FormActions.types';

export type {
  FormMessageProps,
  FormMessageType,
} from './FormMessage.types';

export type {
  FormStepperProps,
  FormStepperContextValue,
} from './FormStepper.types';

export type {
  FormStepProps,
} from './FormStep.types';
```

**Step 2: Add to main exports**

In `src/index.ts`, add:

```typescript
// Form components
export {
  Form,
  Field,
  FieldArray,
  FormActions,
  FormMessage,
  FormStepper,
  FormStep,
  useFormContext,
  useFormStep,
} from './components/Form';

export type {
  FormProps,
  FormContextValue,
  FieldProps,
  FieldComponent,
  FieldArrayProps,
  FormActionsProps,
  FormActionsAlignment,
  FormMessageProps,
  FormMessageType,
  FormStepperProps,
  FormStepperContextValue,
  FormStepProps,
} from './components/Form';
```

**Step 3: Verify TypeScript compilation**

Run: `npm run typecheck`
Expected: No errors

**Step 4: Verify build succeeds**

Run: `npm run build`
Expected: Build completes successfully

**Step 5: Commit**

```bash
git add src/components/Form/index.ts src/index.ts
git commit -m "feat(form): export all Form components and types"
```

---

### Task 15: Create Storybook Stories

**Files:**
- Create: `src/components/Form/Form.stories.tsx`

**Step 1: Create comprehensive stories**

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { z } from 'zod';
import { Form } from './Form';
import { Field } from './Field';
import { FieldArray } from './FieldArray';
import { FormActions } from './FormActions';
import { FormMessage } from './FormMessage';
import { FormStepper } from './FormStepper';
import { FormStep } from './FormStep';
import { Button } from '../Button';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    docs: {
      description: {
        component:
          'Comprehensive Form component with React Hook Form integration, Zod validation, multi-step support, and field arrays. Perfect for authentication flows and complex forms.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Form>;

// Login Form Example
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const LoginForm: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Simple login form with email, password, and remember me checkbox. Shows validation errors from Zod schema.',
      },
    },
  },
  render: () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
      setError(null);
      setSuccess(false);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (data.email === 'test@example.com' && data.password === 'password123') {
        setSuccess(true);
      } else {
        setError('Invalid credentials');
      }
    };

    return (
      <Form schema={loginSchema} onSubmit={handleSubmit} mode="onBlur">
        {error && <FormMessage type="error">{error}</FormMessage>}
        {success && <FormMessage type="success">Login successful!</FormMessage>}

        <Field name="email" label="Email" type="email" placeholder="you@example.com" />
        <Field name="password" label="Password" type="password" />
        <Field name="rememberMe" label="Remember me" component="checkbox" />

        <FormActions>
          <Button type="submit">Sign In</Button>
        </FormActions>
      </Form>
    );
  },
};

// Registration Form (Multi-Step)
const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().optional(),
  newsletter: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const MultiStepRegistration: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Multi-step registration form with progress indicator. Navigate between steps with Back/Next buttons.',
      },
    },
  },
  render: () => {
    const [step, setStep] = useState(0);

    const handleSubmit = async (data: z.infer<typeof registrationSchema>) => {
      console.log('Registration data:', data);
      alert('Registration complete!');
    };

    return (
      <Form schema={registrationSchema} onSubmit={handleSubmit} mode="onBlur">
        <FormStepper currentStep={step} onStepChange={setStep} showProgress>
          <FormStep title="Account">
            <Field name="email" label="Email" type="email" />
            <Field name="password" label="Password" type="password" />
            <Field name="confirmPassword" label="Confirm Password" type="password" />
          </FormStep>

          <FormStep title="Profile">
            <Field name="firstName" label="First Name" />
            <Field name="lastName" label="Last Name" />
            <Field name="bio" label="Bio" component="textarea" />
          </FormStep>

          <FormStep title="Preferences">
            <Field name="newsletter" label="Subscribe to newsletter" component="checkbox" />
          </FormStep>
        </FormStepper>

        <FormActions align="space-between">
          <Button onClick={() => setStep(s => s - 1)} disabled={step === 0} variant="secondary">
            Back
          </Button>
          <Button type={step === 2 ? 'submit' : 'button'} onClick={() => step < 2 && setStep(s => s + 1)}>
            {step === 2 ? 'Complete Registration' : 'Next'}
          </Button>
        </FormActions>
      </Form>
    );
  },
};

// Dynamic Fields (Field Array)
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumbers: z.array(z.object({
    number: z.string(),
    type: z.enum(['mobile', 'home', 'work']),
  })).min(1, 'At least one phone number is required'),
});

export const DynamicFields: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Form with dynamic field array. Add or remove phone numbers on the fly.',
      },
    },
  },
  render: () => {
    const handleSubmit = (data: z.infer<typeof contactSchema>) => {
      console.log('Contact data:', data);
      alert('Saved!');
    };

    return (
      <Form
        schema={contactSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          name: '',
          phoneNumbers: [{ number: '', type: 'mobile' as const }]
        }}
      >
        <Field name="name" label="Name" />

        <FieldArray name="phoneNumbers" addButtonText="Add Phone Number">
          {(field, index, actions) => (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <Field
                name={`phoneNumbers.${index}.number`}
                label={`Phone ${index + 1}`}
                placeholder="555-1234"
              />
              <Field
                name={`phoneNumbers.${index}.type`}
                label="Type"
                component="select"
                options={[
                  { value: 'mobile', label: 'Mobile' },
                  { value: 'home', label: 'Home' },
                  { value: 'work', label: 'Work' },
                ]}
              />
              <Button
                type="button"
                onClick={actions.remove}
                variant="danger"
                style={{ marginTop: '1.5rem' }}
              >
                Remove
              </Button>
            </div>
          )}
        </FieldArray>

        <FormActions>
          <Button type="submit">Save Contact</Button>
        </FormActions>
      </Form>
    );
  },
};

// All Field Types
const allFieldsSchema = z.object({
  textInput: z.string(),
  emailInput: z.string().email(),
  numberInput: z.number(),
  textareaInput: z.string(),
  selectInput: z.string(),
  checkboxInput: z.boolean(),
  switchInput: z.boolean(),
});

export const AllFieldTypes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates all available field component types.',
      },
    },
  },
  render: () => {
    return (
      <Form schema={allFieldsSchema} onSubmit={(data) => console.log(data)}>
        <Field name="textInput" label="Text Input" type="text" placeholder="Enter text" />
        <Field name="emailInput" label="Email Input" type="email" placeholder="you@example.com" />
        <Field name="numberInput" label="Number Input" type="number" placeholder="42" />
        <Field name="textareaInput" label="Textarea" component="textarea" placeholder="Long text..." />
        <Field
          name="selectInput"
          label="Select"
          component="select"
          options={[
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ]}
        />
        <Field name="checkboxInput" label="Checkbox" component="checkbox" />
        <Field name="switchInput" label="Switch" component="switch" />

        <FormActions>
          <Button type="submit">Submit</Button>
        </FormActions>
      </Form>
    );
  },
};
```

**Step 2: Verify Storybook builds**

Run: `npm run build-storybook`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/components/Form/Form.stories.tsx
git commit -m "feat(form): add comprehensive Storybook stories"
```

---

## Testing & Final Verification

### Task 16: Run Full Test Suite

**Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass (should be 1000+ tests now)

**Step 2: Check coverage**

Run: `npm run test:coverage`
Expected: Form components have 80%+ coverage

**Step 3: Verify TypeScript**

Run: `npm run typecheck`
Expected: No errors

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Verify Storybook**

Run: `npm run storybook`
Expected: Storybook runs, Form stories work

---

## Implementation Complete!

**What was built:**
- ✅ Form wrapper with React Hook Form + Zod
- ✅ Field component with auto-registration
- ✅ FieldArray for dynamic fields
- ✅ FormActions for button groups
- ✅ FormMessage for alerts
- ✅ FormStepper for multi-step wizards
- ✅ FormStep for individual steps
- ✅ Hooks: useFormContext, useFormStep
- ✅ Full TypeScript support
- ✅ Comprehensive tests (80%+ coverage)
- ✅ Accessibility compliance (vitest-axe)
- ✅ Storybook documentation

**Ready for use in authentication flows!**

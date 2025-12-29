# Form Component Design

## Overview

Comprehensive Form component system for boom-ui with React Hook Form integration, Zod validation, multi-step support, and field arrays.

## Goals

- **Clean API**: Simple auth forms without boilerplate
- **Type Safety**: Full TypeScript inference from Zod schemas
- **Accessible**: WCAG 2.1 AA compliant with ARIA attributes
- **Flexible**: Supports simple forms, multi-step wizards, dynamic fields
- **Consistent**: Follows boom-ui compound component patterns (like Table)

## Architecture

### Component Structure

```
Form/
├── Form.tsx                 # Main wrapper, provides FormContext
├── Field.tsx                # Smart field with auto-registration
├── FieldArray.tsx           # Dynamic field lists (add/remove)
├── FormStepper.tsx          # Multi-step wizard container
├── FormStep.tsx             # Individual step in wizard
├── FormActions.tsx          # Submit/cancel/reset button group
├── FormMessage.tsx          # Form-level success/error messages
└── hooks/
    ├── useFormContext.tsx   # Access form from children
    └── useFormStep.tsx      # Step navigation helpers
```

### Key Design Decisions

1. **Context-Based**: Form creates context with react-hook-form instance, Zod schema, and step state
2. **Compound Components**: Composable like Table - `<Form>` + `<Field>` + `<FormActions>`
3. **Type Safety**: Generic `Form<TSchema>` gives full autocomplete for field names
4. **Controlled Pattern**: FormStepper uses controlled state (consistent with Table)
5. **Auto-Registration**: Field component auto-registers with react-hook-form via context

## Component APIs

### Form Component

```tsx
interface FormProps<TSchema extends z.ZodType> {
  schema: TSchema;
  onSubmit: (data: z.infer<TSchema>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<TSchema>>;
  mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'all';
  children: ReactNode;
  className?: string;
}

// Usage
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

<Form schema={loginSchema} onSubmit={handleLogin} mode="onBlur">
  <Field name="email" label="Email" type="email" />
  <Field name="password" label="Password" type="password" />
  <FormActions>
    <Button type="submit">Login</Button>
  </FormActions>
</Form>
```

### Field Component

```tsx
interface FieldProps {
  name: string; // Typed from schema
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  component?: 'input' | 'textarea' | 'select' | 'checkbox' | 'switch' | 'radio';
  options?: SelectOption[]; // For select/radio
}

// Usage - auto-registers and shows validation errors
<Field name="email" label="Email" type="email" />
<Field name="bio" label="Bio" component="textarea" />
<Field name="country" label="Country" component="select" options={countries} />
<Field name="subscribe" label="Subscribe" component="checkbox" />
```

### FormStepper (Controlled)

```tsx
interface FormStepperProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  children: ReactNode; // FormStep children
  showProgress?: boolean; // Show step indicator
}

// Usage
const [step, setStep] = useState(0);

<Form schema={registrationSchema} onSubmit={handleRegister}>
  <FormStepper currentStep={step} onStepChange={setStep} showProgress>
    <FormStep title="Account">
      <Field name="email" label="Email" />
      <Field name="password" label="Password" />
    </FormStep>
    <FormStep title="Profile">
      <Field name="name" label="Name" />
      <Field name="bio" label="Bio" />
    </FormStep>
  </FormStepper>
  <FormActions>
    <Button onClick={() => setStep(s => s - 1)} disabled={step === 0}>
      Back
    </Button>
    <Button type="submit">
      {step === 1 ? 'Submit' : 'Next'}
    </Button>
  </FormActions>
</Form>
```

### FieldArray Component

```tsx
interface FieldArrayProps {
  name: string; // Array field name from schema
  children: (field: any, index: number) => ReactNode;
  addButtonText?: string;
  removeButtonText?: string;
}

// Usage
const schema = z.object({
  phoneNumbers: z.array(z.object({
    number: z.string(),
    type: z.enum(['mobile', 'home', 'work']),
  })),
});

<FieldArray name="phoneNumbers">
  {(field, index) => (
    <>
      <Field name={`phoneNumbers.${index}.number`} label="Number" />
      <Field name={`phoneNumbers.${index}.type`} label="Type" component="select" />
    </>
  )}
</FieldArray>
```

### FormMessage Component

```tsx
interface FormMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  onDismiss?: () => void;
}

// Usage
<FormMessage type="error">Login failed. Please try again.</FormMessage>
<FormMessage type="success">Account created successfully!</FormMessage>
```

## Validation

### Zod Schema Integration

```tsx
const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be 8+ characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

### Async Validation

```tsx
const emailSchema = z.object({
  email: z.string().email()
    .refine(async (email) => {
      const exists = await checkEmailExists(email);
      return !exists;
    }, 'Email already taken'),
});
```

### Field-Level Errors

- Field component automatically displays Zod error messages
- Uses existing Input/Checkbox/etc. `error` prop
- Shows error below field (from existing component styling)

### Form-Level Errors

- FormMessage component for success/error/warning messages
- Positioned at top or bottom of form
- Can be dismissed

## Testing Strategy

- **Unit Tests**: Each component with vitest + @testing-library/react
- **Accessibility**: vitest-axe for all components
- **Integration Tests**: Full form submission flows
- **Validation Tests**: Zod schema validation edge cases
- **Multi-Step Tests**: Step navigation, validation per step
- **Field Array Tests**: Add/remove dynamic fields

## File Structure

```
src/components/Form/
├── Form.tsx
├── Form.types.ts
├── Form.test.tsx
├── Form.module.css
├── Form.stories.tsx
├── Field.tsx
├── Field.types.ts
├── Field.test.tsx
├── FieldArray.tsx
├── FieldArray.types.ts
├── FieldArray.test.tsx
├── FormStepper.tsx
├── FormStepper.types.ts
├── FormStepper.test.tsx
├── FormStep.tsx
├── FormStep.types.ts
├── FormStep.test.tsx
├── FormActions.tsx
├── FormActions.types.ts
├── FormActions.test.tsx
├── FormMessage.tsx
├── FormMessage.types.ts
├── FormMessage.test.tsx
├── FormContext.tsx
├── hooks/
│   ├── useFormContext.tsx
│   ├── useFormContext.test.ts
│   ├── useFormStep.tsx
│   └── useFormStep.test.ts
└── index.ts
```

## Example: Login Form

```tsx
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginData = z.infer<typeof loginSchema>;

function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      await login(data);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form schema={loginSchema} onSubmit={handleSubmit} mode="onBlur">
      {error && <FormMessage type="error">{error}</FormMessage>}

      <Field name="email" label="Email" type="email" placeholder="you@example.com" />
      <Field name="password" label="Password" type="password" />
      <Field name="rememberMe" label="Remember me" component="checkbox" />

      <FormActions>
        <Button type="submit" loading={loading} fullWidth>
          Sign In
        </Button>
      </FormActions>
    </Form>
  );
}
```

## Example: Multi-Step Registration

```tsx
const registrationSchema = z.object({
  // Step 1: Account
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),

  // Step 2: Profile
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  bio: z.string().optional(),

  // Step 3: Preferences
  newsletter: z.boolean(),
  notifications: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

function RegistrationForm() {
  const [step, setStep] = useState(0);

  return (
    <Form schema={registrationSchema} onSubmit={handleRegister}>
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
          <Field name="notifications" label="Enable notifications" component="checkbox" />
        </FormStep>
      </FormStepper>

      <FormActions>
        <Button onClick={() => setStep(s => s - 1)} disabled={step === 0}>
          Back
        </Button>
        <Button type="submit">
          {step === 2 ? 'Complete Registration' : 'Next'}
        </Button>
      </FormActions>
    </Form>
  );
}
```

## Implementation Notes

- Use react-hook-form's `useForm`, `Controller`, `useFieldArray` hooks
- Use @hookform/resolvers/zod for Zod schema integration
- Follow boom-ui patterns: forwardRef, CSS modules, compound components
- All components must pass vitest-axe accessibility tests
- Minimum 80% test coverage
- TypeScript strict mode
- Export all types for consumers

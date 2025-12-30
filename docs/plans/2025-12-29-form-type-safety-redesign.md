# Form Type Safety Redesign

**Date:** 2025-12-29
**Status:** Design Complete
**Target:** Remove type assertions from Form components while improving type safety

## Problem Statement

The current Form implementation uses type assertions (`as` casts) in multiple places:
- `Form.tsx:46` - `form as unknown as UseFormReturn<FieldValues>`
- `Form.tsx:61` - `forwardRef(FormComponent) as <TSchema...>`
- `FormContext.tsx:12` - `context as FormContextValue<TFieldValues>`
- `Field.tsx:34` - `error?.message as string | undefined`

These violate the project's coding standards which explicitly prohibit using `as` to bypass type mismatches.

**Root Cause:** React Context cannot preserve generic types across Provider/Consumer boundaries. The schema type (`TSchema`) is lost when passing through Context.

## Solution: Render Prop Pattern

Replace Context-based architecture with render prop pattern. The generic type flows through the function parameter closure, eliminating the need for Context entirely.

### API Design

**New API (render prop):**
```tsx
<Form schema={loginSchema} onSubmit={handleSubmit}>
  {(form) => (
    <>
      <form.Field name="email" component="input" />
      <form.Field name="password" component="input" type="password" />
      <Button onClick={() => form.reset()}>Reset</Button>
    </>
  )}
</Form>
```

**With ref for external control:**
```tsx
const formRef = useRef<FormHandle<typeof schema>>(null);

<Form ref={formRef} schema={schema} onSubmit={handleSubmit}>
  {(form) => <form.Field name="email" />}
</Form>

<Button onClick={() => formRef.current?.reset()}>Reset</Button>
```

**Custom field rendering:**
```tsx
<form.Field
  name="custom"
  render={({field, error}) => (
    <MyCustomInput {...field} error={error?.message} />
  )}
/>
```

### Type Safety Features

1. **Autocomplete field names** - `name` prop constrained to schema keys
2. **Type-safe field values** - Field component knows the value type from schema
3. **Escape hatch for dynamic names** - Cast to `Path<typeof schema>` when needed
4. **No type assertions** - Full type safety without `as` casts

## Architecture

### Component Structure

```
Form (generic wrapper)
  ├─ Creates react-hook-form instance with Zod schema
  ├─ Creates Field component bound to form instance (via closure)
  ├─ Passes { Field, ...formMethods } to render function
  └─ Exposes FormHandle via ref for imperative control

Field (created by factory function)
  ├─ Knows schema type through generic parameter
  ├─ Uses Controller from react-hook-form
  ├─ Supports standard components (input/textarea/select/checkbox/switch)
  └─ Supports custom render prop for special cases
```

### Type Flow

```tsx
Form<TSchema extends z.ZodObject<z.ZodRawShape>>
  → createFieldComponent<TSchema>(form)
  → Field<TName extends Path<z.input<TSchema>>>
  → name: TName (autocompletes!)
```

**The Magic:** The Field component is created inside Form's render with access to the form instance through closure. TypeScript preserves the generic type through the function parameter, so Field knows the schema without needing Context.

## Implementation Details

### Form Component

```tsx
function FormComponent<TSchema extends z.ZodObject<z.ZodRawShape>>(
  {
    schema,
    onSubmit,
    defaultValues,
    children,
    ...props
  }: FormProps<TSchema>,
  ref: React.ForwardedRef<FormHandle<TSchema>>
) {
  type FormInput = z.input<TSchema>;
  type FormOutput = z.output<TSchema>;

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: standardSchemaResolver(schema),
    defaultValues,
  });

  // Create Field component with schema type
  const Field = useMemo(
    () => createFieldComponent<TSchema>(form),
    [form]
  );

  // Expose imperative handle
  useImperativeHandle(ref, () => ({
    reset: form.reset,
    setError: form.setError,
    clearErrors: form.clearErrors,
    trigger: form.trigger,
    getValues: form.getValues,
    setValue: form.setValue,
  }));

  const handleSubmit = async (data: FormOutput) => {
    await onSubmit(data);
    if (resetOnSubmit) {
      form.reset();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} {...props}>
      {children({ Field, ...form })}
    </form>
  );
}
```

### Field Factory

```tsx
function createFieldComponent<TSchema extends z.ZodObject<z.ZodRawShape>>(
  form: UseFormReturn<z.input<TSchema>, unknown, z.output<TSchema>>
) {
  type FieldName = Path<z.input<TSchema>>;

  return function Field<TName extends FieldName>(
    props: FieldProps<TSchema, TName>
  ) {
    const { name, component = 'input', render, ...rest } = props;

    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => {
          if (render) {
            return render({ field, error: fieldState.error });
          }

          const commonProps = {
            label: props.label,
            error: fieldState.error?.message,
            helperText: props.helperText,
            disabled: props.disabled,
          };

          switch (component) {
            case 'textarea':
              return <Textarea {...field} {...commonProps} {...rest} />;
            case 'checkbox':
              return <Checkbox {...field} checked={field.value} {...commonProps} />;
            case 'switch':
              return <Switch {...field} checked={field.value} {...commonProps} />;
            case 'select':
              return <Select {...field} {...commonProps} options={props.options} />;
            default:
              return <Input {...field} {...commonProps} type={props.type} {...rest} />;
          }
        }}
      />
    );
  };
}
```

### Type Definitions

```tsx
export interface FormProps<TSchema extends z.ZodObject<z.ZodRawShape>> {
  schema: TSchema;
  onSubmit: (data: z.output<TSchema>) => void | Promise<void>;
  defaultValues?: DefaultValues<z.input<TSchema>>;
  resetOnSubmit?: boolean;
  children: (form: FormRenderProps<TSchema>) => ReactNode;
  className?: string;
}

export interface FormRenderProps<TSchema extends z.ZodObject<z.ZodRawShape>>
  extends UseFormReturn<z.input<TSchema>, unknown, z.output<TSchema>> {
  Field: FieldComponent<TSchema>;
}

export type FormHandle<TSchema extends z.ZodObject<z.ZodRawShape>> = {
  reset: UseFormReturn<z.input<TSchema>>['reset'];
  setError: UseFormReturn<z.input<TSchema>>['setError'];
  clearErrors: UseFormReturn<z.input<TSchema>>['clearErrors'];
  trigger: UseFormReturn<z.input<TSchema>>['trigger'];
  getValues: UseFormReturn<z.input<TSchema>>['getValues'];
  setValue: UseFormReturn<z.input<TSchema>>['setValue'];
};

export interface FieldProps<
  TSchema extends z.ZodObject<z.ZodRawShape>,
  TName extends Path<z.input<TSchema>>
> {
  name: TName;
  label?: string;
  component?: 'input' | 'textarea' | 'select' | 'checkbox' | 'switch';
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  render?: (params: {
    field: ControllerRenderProps<z.input<TSchema>, TName>;
    error: FieldError | undefined;
  }) => ReactNode;
  className?: string;
}
```

## Breaking Changes

### Removed
- `FormContext.tsx` - No longer needed
- `useFormContext` hook - No longer needed
- Old `Field` component export - Replaced with render prop

### Updated
- `Form.tsx` - Complete rewrite with render prop pattern
- `Form.types.ts` - New generic types
- All Form stories - Updated to use new API
- All Form tests - Updated to use new API

### Unchanged
- `FormActions` - Still works as-is
- `FormMessage` - Still works as-is
- Public exports from `src/index.ts` - Same component name, new API

## Migration Guide

**Before:**
```tsx
<Form schema={schema} onSubmit={handleSubmit}>
  <Field name="email" component="input" />
  <Field name="password" component="input" type="password" />
</Form>
```

**After:**
```tsx
<Form schema={schema} onSubmit={handleSubmit}>
  {(form) => (
    <>
      <form.Field name="email" component="input" />
      <form.Field name="password" component="input" type="password" />
    </>
  )}
</Form>
```

**Imperative control before:**
```tsx
const { form } = useFormContext();
form.reset();
```

**Imperative control after:**
```tsx
// Option 1: Use render prop
<Form schema={schema}>
  {(form) => (
    <>
      <form.Field name="email" />
      <Button onClick={() => form.reset()}>Reset</Button>
    </>
  )}
</Form>

// Option 2: Use ref
const formRef = useRef<FormHandle<typeof schema>>(null);
<Form ref={formRef} schema={schema}>
  {(form) => <form.Field name="email" />}
</Form>
<Button onClick={() => formRef.current?.reset()}>Reset</Button>
```

## Benefits

1. **Zero type assertions** - No `as` casts anywhere
2. **Better autocomplete** - Field names autocomplete from schema
3. **Simpler architecture** - No Context, fewer moving parts
4. **More flexible** - Render prop gives full control
5. **Standards compliant** - Follows project coding standards

## Trade-offs

1. **API change** - Breaking change requiring migration
2. **Slightly more verbose** - Render prop adds nesting
3. **Different pattern** - Developers need to learn new API

For a personal library with full control over usage, these trade-offs are acceptable.

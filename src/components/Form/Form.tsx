import { forwardRef, useImperativeHandle, useMemo } from 'react';
import type { DefaultValues } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import type { z } from 'zod';
import { cn } from '@/utils/classnames';
import type { FormProps, FormHandle } from './Form.types';
import { createFieldComponent } from './createFieldComponent';
import styles from './Form.module.css';

function FormComponent<TSchema extends z.ZodObject<z.ZodRawShape>>(
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
  ref: React.ForwardedRef<FormHandle<TSchema>>
) {
  type FormInput = z.input<TSchema>;
  type FormOutput = z.output<TSchema>;

  // Extract field names from schema and create type-appropriate defaults
  const getDefaultValues = (): DefaultValues<FormInput> => {
    if (defaultValues) {
      return defaultValues as DefaultValues<FormInput>;
    }

    // Generate type-appropriate default values for schema fields
    const defaults: Record<string, unknown> = {};
    const shape = schema.shape;

    Object.keys(shape).forEach(key => {
      const field = shape[key] as z.ZodTypeAny;
      defaults[key] = getDefaultValueForField(field);
    });

    return defaults as DefaultValues<FormInput>;
  };

  // Helper to determine appropriate default value based on Zod field type
  const getDefaultValueForField = (field: z.ZodTypeAny): unknown => {
    // Type guard for accessing Zod internals
    type ZodInternalDef = {
      typeName?: string;
      innerType?: z.ZodTypeAny;
      schema?: z.ZodTypeAny;
    };

    // Access internal type definition (Zod internals are not part of public API)
    const def = (field as unknown as { _def: ZodInternalDef })._def;

    // Unwrap optional/nullable/default schemas to get the inner type
    let innerType = field as unknown as { _def: ZodInternalDef };
    let typeName = def.typeName;

    while (typeName === 'ZodOptional' ||
           typeName === 'ZodNullable' ||
           typeName === 'ZodDefault') {
      const nextType = innerType._def.innerType || innerType._def.schema;
      if (!nextType) {
        break;
      }
      innerType = nextType as unknown as { _def: ZodInternalDef };
      typeName = innerType._def.typeName;
    }

    // Return undefined for optional/nullable fields
    if (def.typeName === 'ZodOptional' || def.typeName === 'ZodNullable') {
      return undefined;
    }

    // Return type-specific defaults based on the inner type
    const innerTypeName = innerType._def.typeName;
    switch (innerTypeName) {
      case 'ZodString':
        return '';
      case 'ZodNumber':
        return 0;
      case 'ZodBoolean':
        return false;
      case 'ZodArray':
        return [];
      case 'ZodObject':
        return {};
      case 'ZodDate':
        return new Date();
      default:
        // For unknown types, default to undefined
        return undefined;
    }
  };

  // Create react-hook-form instance
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: standardSchemaResolver(schema),
    defaultValues: getDefaultValues(),
    mode,
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
      onSubmit={(e) => {
        void form.handleSubmit(handleSubmit)(e);
      }}
      className={cn(styles.form, className)}
      noValidate
      {...props}
    >
      {children({ Field, ...form })}
    </form>
  );
}

// Export with forwardRef while preserving generics
const FormWithRef = forwardRef(FormComponent) as <
  TSchema extends z.ZodObject<z.ZodRawShape>
>(
  props: FormProps<TSchema> & {
    ref?: React.ForwardedRef<FormHandle<TSchema>>;
  }
) => React.ReactElement;

export const Form = Object.assign(FormWithRef, { displayName: 'Form' });

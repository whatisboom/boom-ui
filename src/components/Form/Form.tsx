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

  // Create react-hook-form instance
  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: standardSchemaResolver(schema),
    defaultValues,
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
const FormWithRef = forwardRef(FormComponent) as <
  TSchema extends z.ZodObject<z.ZodRawShape>
>(
  props: FormProps<TSchema> & {
    ref?: React.ForwardedRef<FormHandle<TSchema>>;
  }
) => React.ReactElement;

export const Form = Object.assign(FormWithRef, { displayName: 'Form' });

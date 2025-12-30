import { forwardRef, FormEvent } from 'react';
import { useForm, FieldValues, UseFormReturn } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { cn } from '@/utils/classnames';
import { FormContext } from './FormContext';
import { FormProps } from './Form.types';
import styles from './Form.module.css';

// Generic component type helper - properly typed implementation
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
  ref: React.ForwardedRef<HTMLFormElement>
) {
  type FormValues = z.output<TSchema>;
  type FormInput = z.input<TSchema>;

  const form = useForm<FormInput, unknown, FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues,
    mode,
  });

  const handleSubmit = async (data: FormValues) => {
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
    <FormContext.Provider value={{ form: form as unknown as UseFormReturn<FieldValues>, isSubmitting: form.formState.isSubmitting }}>
      <form
        ref={ref}
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

// Cast to support generics with forwardRef
const FormWithRef = forwardRef(FormComponent) as <TSchema extends z.ZodObject<z.ZodRawShape>>(
  props: FormProps<TSchema> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement;

export const Form = Object.assign(FormWithRef, { displayName: 'Form' });

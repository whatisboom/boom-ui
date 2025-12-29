import { forwardRef, FormEvent } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/utils/classnames';
import { FormContext } from './FormContext';
import { FormProps } from './Form.types';
import styles from './Form.module.css';

// Generic component type helper - properly typed implementation
function FormComponent<TSchema extends z.ZodType>(
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
  type FormValues = z.infer<TSchema> extends FieldValues ? z.infer<TSchema> : never;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: defaultValues as any,
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
    <FormContext.Provider value={{ form: form as any, isSubmitting: form.formState.isSubmitting }}>
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

// Cast to support generics with forwardRef
const FormWithRef = forwardRef(FormComponent) as <TSchema extends z.ZodType>(
  props: FormProps<TSchema> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement;

export const Form = Object.assign(FormWithRef, { displayName: 'Form' });

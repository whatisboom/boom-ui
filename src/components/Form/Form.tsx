import { forwardRef, FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/utils/classnames';
import { FormContext } from './FormContext';
import { FormProps } from './Form.types';
import styles from './Form.module.css';

// Generic component type helper
const FormImpl = forwardRef<HTMLFormElement, FormProps<z.ZodType>>(
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

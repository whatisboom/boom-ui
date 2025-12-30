import { ReactNode } from 'react';
import { z } from 'zod';
import { UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';

/**
 * Form component props
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

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

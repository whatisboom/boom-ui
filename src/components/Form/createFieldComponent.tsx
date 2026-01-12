import type { UseFormReturn, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import type { z } from 'zod';
import type { FieldProps, FieldComponent } from './Form.types';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { Select } from '../Select';
import { Switch } from '../Switch';
import { cn } from '@/utils/classnames';
import styles from './Form.module.css';

/**
 * Creates a Field component bound to a specific form instance
 * This preserves the generic schema type through closure
 */
export function createFieldComponent<TSchema extends z.ZodObject<z.ZodRawShape>>(
  form: UseFormReturn<z.input<TSchema>, unknown, z.output<TSchema>>
): FieldComponent<TSchema> {
  type FieldName = Path<z.input<TSchema>>;

  return function Field<TName extends FieldName>(
    props: FieldProps<TSchema, TName>
  ): React.ReactElement {
    const {
      name,
      component = 'input',
      render,
      label,
      type,
      placeholder,
      helperText,
      disabled,
      options,
      className,
    } = props;

    return (
      <div className={cn(styles.fieldGroup, className)}>
        <Controller
          name={name}
          control={form.control}
          render={({ field, fieldState }) => {
            // Custom render prop takes precedence
            if (render) {
              // Fragment ensures ReactElement type (Controller requires ReactElement, not ReactNode)
              return <>{render({ field, error: fieldState.error })}</>;
            }

            // Common props for all field types
            const commonProps = {
              label,
              error: fieldState.error?.message,
              helperText,
              disabled,
            };

            // Render standard component based on type
            // Note: field.value uses PathValueImpl generic type which TypeScript
            // cannot narrow to specific component value types. Type assertions
            // are necessary here as this is a controlled type transformation.
            switch (component) {
              case 'textarea':
                return (
                  <Textarea
                    name={field.name}
                    value={(field.value as string) || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    {...commonProps}
                    placeholder={placeholder}
                  />
                );

              case 'checkbox':
                return (
                  <Checkbox
                    name={field.name}
                    checked={Boolean(field.value)}
                    onChange={(checked: boolean) => field.onChange(checked)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    {...commonProps}
                  />
                );

              case 'switch':
                return (
                  <Switch
                    name={field.name}
                    checked={Boolean(field.value)}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    {...commonProps}
                  />
                );

              case 'select':
                return (
                  <Select
                    name={field.name}
                    value={(field.value as string) || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    {...commonProps}
                    options={options || []}
                  />
                );

              default:
                return (
                  <Input
                    name={field.name}
                    value={(field.value as string) || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
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
}

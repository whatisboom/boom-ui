import { Controller } from 'react-hook-form';
import { useFormContext } from './FormContext';
import { FieldProps } from './Field.types';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Checkbox } from '../Checkbox';
import { Select } from '../Select';
import { Switch } from '../Switch';

export const Field: React.FC<FieldProps> = ({
  name,
  label,
  component = 'input',
  type = 'text',
  placeholder,
  helperText,
  disabled,
  options,
  className,
}) => {
  const { form } = useFormContext();
  const error = form.formState.errors[name];

  return (
    <div className={className}>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => {
          const commonProps = {
            label,
            error: error?.message as string | undefined,
            helperText,
            disabled,
          };

          switch (component) {
            case 'textarea':
              return (
                <Textarea
                  {...field}
                  {...commonProps}
                  placeholder={placeholder}
                />
              );

            case 'checkbox':
              return (
                <Checkbox
                  {...field}
                  checked={field.value || false}
                  onChange={(checked: boolean) => field.onChange(checked)}
                  label={label}
                  disabled={disabled}
                />
              );

            case 'switch':
              return (
                <Switch
                  {...field}
                  checked={field.value || false}
                  onChange={field.onChange}
                  label={label}
                  disabled={disabled}
                />
              );

            case 'select':
              return (
                <Select
                  {...field}
                  {...commonProps}
                  options={options || []}
                  placeholder={placeholder}
                />
              );

            case 'input':
            default:
              return (
                <Input
                  {...field}
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

Field.displayName = 'Field';

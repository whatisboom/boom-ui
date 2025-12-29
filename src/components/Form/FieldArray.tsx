import { useFieldArray } from 'react-hook-form';
import { useFormContext } from './FormContext';
import { FieldArrayProps } from './FieldArray.types';
import { Button } from '../Button';

export const FieldArray: React.FC<FieldArrayProps> = ({
  name,
  children,
  addButtonText = 'Add',
  className,
}) => {
  const { form } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });

  return (
    <div className={className}>
      {fields.map((field, index) => (
        <div key={field.id}>
          {children(field, index, { remove: () => remove(index) })}
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append({})}
        variant="secondary"
      >
        {addButtonText}
      </Button>
    </div>
  );
};

FieldArray.displayName = 'FieldArray';

import { createContext, useContext } from 'react';
import { FieldValues } from 'react-hook-form';
import { FormContextValue } from './Form.types';

export const FormContext = createContext<FormContextValue | undefined>(undefined);

export const useFormContext = <TFieldValues extends FieldValues = FieldValues>() => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('Form components must be used within a Form component');
  }
  return context as FormContextValue<TFieldValues>;
};

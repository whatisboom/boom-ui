import { createContext, useContext } from 'react';
import { FormStepperContextValue } from '../FormStepper.types';

export const FormStepperContext = createContext<FormStepperContextValue | undefined>(undefined);

export const useFormStep = () => {
  const context = useContext(FormStepperContext);
  if (!context) {
    throw new Error('useFormStep must be used within a FormStepper');
  }
  return context;
};

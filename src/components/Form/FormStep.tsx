import type { FormStepProps } from './FormStep.types';

/**
 * FormStep component - represents a single step in a FormStepper.
 * This is a passive component that only provides structure.
 * Visibility and state management is handled by FormStepper.
 */
export const FormStep: React.FC<FormStepProps> = ({ children }) => {
  return <div role="tabpanel">{children}</div>;
};

FormStep.displayName = 'FormStep';

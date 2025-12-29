import { useState, useEffect } from 'react';
import { useFormStep } from './hooks/useFormStep';
import { FormStepProps } from './FormStep.types';

// Module-level index to track steps
let moduleStepIndex = -1;

export const FormStep: React.FC<FormStepProps> = ({ children }) => {
  const [stepIndex] = useState(() => ++moduleStepIndex);
  const { currentStep } = useFormStep();

  // Reset module index when unmounting if we're past current step
  useEffect(() => {
    return () => {
      if (stepIndex >= currentStep) {
        moduleStepIndex = -1;
      }
    };
  }, [stepIndex, currentStep]);

  const isActive = stepIndex === currentStep;

  if (!isActive) {
    return null;
  }

  return <>{children}</>;
};

FormStep.displayName = 'FormStep';

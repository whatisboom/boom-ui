import { Children, useMemo } from 'react';
import { cn } from '@/utils/classnames';
import { FormStepperContext } from './hooks/useFormStep';
import { FormStepperProps } from './FormStepper.types';
import styles from './Form.module.css';

export const FormStepper: React.FC<FormStepperProps> = ({
  currentStep,
  onStepChange,
  showProgress = true,
  children,
  className,
}) => {
  const totalSteps = Children.count(children);

  const contextValue = useMemo(() => ({
    currentStep,
    totalSteps,
    goToStep: onStepChange,
    nextStep: () => onStepChange(Math.min(currentStep + 1, totalSteps - 1)),
    prevStep: () => onStepChange(Math.max(currentStep - 1, 0)),
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
  }), [currentStep, totalSteps, onStepChange]);

  return (
    <FormStepperContext.Provider value={contextValue}>
      <div className={cn(styles.stepper, className)}>
        {showProgress && (
          <div className={styles.stepperProgress} role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={totalSteps}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  styles.step,
                  index === currentStep && styles.stepActive,
                  index < currentStep && styles.stepCompleted
                )}
              />
            ))}
          </div>
        )}
        {children}
      </div>
    </FormStepperContext.Provider>
  );
};

FormStepper.displayName = 'FormStepper';

import { Children, useMemo, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/utils/classnames';
import type { FormStepperProps } from './FormStepper.types';
import { FormStepperContext } from './hooks/useFormStep';
import styles from './FormStepper.module.css';

/**
 * FormStepper - Multi-step form container with progress tracking.
 *
 * Provides context-based state management for building wizard-style forms.
 * Manages step navigation, progress indication, and accessibility features.
 */
export const FormStepper: React.FC<FormStepperProps> = ({
  currentStep,
  onStepChange,
  showProgress = true,
  children,
  className,
}) => {
  const stepContentRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Extract step information from children
  const steps = useMemo(() => {
    return Children.toArray(children).filter((child) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (typeof child === 'object' && child !== null && 'type' in child) {
        const element = child as React.ReactElement;
        return typeof element.type === 'function' && element.type.name === 'FormStep';
      }
      return false;
    });
  }, [children]);

  const totalSteps = steps.length;

  // Validate currentStep
  const validatedStep = Math.max(0, Math.min(currentStep, totalSteps - 1));

  // Context value
  const contextValue = useMemo(
    () => ({
      currentStep: validatedStep,
      totalSteps,
      goToStep: (step: number) => {
        const newStep = Math.max(0, Math.min(step, totalSteps - 1));
        if (newStep !== validatedStep) {
          onStepChange(newStep);
        }
      },
      nextStep: () => {
        if (validatedStep < totalSteps - 1) {
          onStepChange(validatedStep + 1);
        }
      },
      prevStep: () => {
        if (validatedStep > 0) {
          onStepChange(validatedStep - 1);
        }
      },
      isFirstStep: validatedStep === 0,
      isLastStep: validatedStep === totalSteps - 1,
    }),
    [validatedStep, totalSteps, onStepChange]
  );

  // Get step information from children props
  const stepInfo = useMemo(() => {
    return steps.map((step) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (typeof step === 'object' && step !== null && 'props' in step) {
        const element = step as React.ReactElement;
        return {
          title: (element.props.title as string) || '',
          description: (element.props.description as string) || '',
        };
      }
      return { title: '', description: '' };
    });
  }, [steps]);

  // Announce step change to screen readers
  useEffect(() => {
    if (liveRegionRef.current && stepInfo[validatedStep]) {
      const { title, description } = stepInfo[validatedStep];
      const announcement = `Step ${validatedStep + 1} of ${totalSteps}: ${title}${
        description ? `. ${description}` : ''
      }`;
      liveRegionRef.current.textContent = announcement;
    }
  }, [validatedStep, totalSteps, stepInfo]);

  // Handle keyboard navigation on individual tab buttons
  const handleTabKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      if (event.key === 'ArrowLeft' && currentIndex > 0) {
        event.preventDefault();
        contextValue.goToStep(currentIndex - 1);
      } else if (event.key === 'ArrowRight' && currentIndex < totalSteps - 1) {
        event.preventDefault();
        contextValue.goToStep(currentIndex + 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        contextValue.goToStep(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        contextValue.goToStep(totalSteps - 1);
      }
    },
    [totalSteps, contextValue]
  );

  return (
    <FormStepperContext.Provider value={contextValue}>
      <div className={cn(styles.stepper, className)}>
        {/* Screen reader announcements */}
        <div
          ref={liveRegionRef}
          className={styles.liveRegion}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        />

        {/* Progress indicator */}
        {showProgress && (
          <div
            className={styles.progressContainer}
            role="tablist"
            aria-label="Form steps"
          >
            {stepInfo.map((step, index) => {
              const status =
                index < validatedStep
                  ? 'completed'
                  : index === validatedStep
                  ? 'current'
                  : 'pending';

              return (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === validatedStep}
                  aria-current={index === validatedStep ? 'step' : undefined}
                  aria-label={`${step.title}${
                    step.description ? `: ${step.description}` : ''
                  }`}
                  className={cn(
                    styles.progressStep,
                    styles[`progressStep--${status}`]
                  )}
                  onClick={() => contextValue.goToStep(index)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  tabIndex={index === validatedStep ? 0 : -1}
                >
                  <span className={styles.progressStepNumber}>{index + 1}</span>
                  <div className={styles.progressStepContent}>
                    <span className={styles.progressStepTitle}>{step.title}</span>
                    {step.description && (
                      <span className={styles.progressStepDescription}>
                        {step.description}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step content */}
        <div ref={stepContentRef} className={styles.stepContent}>
          {steps[validatedStep]}
        </div>
      </div>
    </FormStepperContext.Provider>
  );
};

FormStepper.displayName = 'FormStepper';

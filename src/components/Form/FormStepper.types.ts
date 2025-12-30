import { ReactNode } from 'react';

export interface FormStepperProps {
  /**
   * Current step index (0-based)
   */
  currentStep: number;

  /**
   * Step change callback
   */
  onStepChange: (step: number) => void;

  /**
   * Show progress indicator
   * @default true
   */
  showProgress?: boolean;

  /**
   * FormStep children
   */
  children: ReactNode;

  /**
   * Additional CSS class
   */
  className?: string;
}

/**
 * Stepper context value
 */
export interface FormStepperContextValue {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

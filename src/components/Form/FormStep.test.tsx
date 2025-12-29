import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormStep } from './FormStep';
import { FormStepperContext } from './hooks/useFormStep';

const mockStepperContext = {
  currentStep: 0,
  totalSteps: 2,
  goToStep: vi.fn(),
  nextStep: vi.fn(),
  prevStep: vi.fn(),
  isFirstStep: true,
  isLastStep: false,
};

describe('FormStep', () => {
  it('should render children when active', () => {
    render(
      <FormStepperContext.Provider value={mockStepperContext}>
        <FormStep title="Step 1">
          <div>Step content</div>
        </FormStep>
      </FormStepperContext.Provider>
    );

    expect(screen.getByText('Step content')).toBeInTheDocument();
  });

  it('should not render children when inactive', () => {
    const inactiveContext = { ...mockStepperContext, currentStep: 1 };
    render(
      <FormStepperContext.Provider value={inactiveContext}>
        <FormStep title="Step 1">
          <div>Step content</div>
        </FormStep>
      </FormStepperContext.Provider>
    );

    expect(screen.queryByText('Step content')).not.toBeInTheDocument();
  });
});

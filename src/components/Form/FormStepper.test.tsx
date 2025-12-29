import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormStepper } from './FormStepper';
import { FormStep } from './FormStep';

describe('FormStepper', () => {
  it('should render current step', () => {
    const handleStepChange = vi.fn();

    render(
      <FormStepper currentStep={0} onStepChange={handleStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('should render progress indicator when showProgress=true', () => {
    const handleStepChange = vi.fn();

    const { container } = render(
      <FormStepper currentStep={0} onStepChange={handleStepChange} showProgress>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });
});

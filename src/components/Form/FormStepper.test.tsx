import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { FormStepper } from './FormStepper';
import { FormStep } from './FormStep';
import { useFormStep } from './hooks/useFormStep';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

// Test component that uses the useFormStep hook
function StepNavigation() {
  const { currentStep, totalSteps, nextStep, prevStep, isFirstStep, isLastStep } =
    useFormStep();

  return (
    <div>
      <div data-testid="step-info">
        Step {currentStep + 1} of {totalSteps}
      </div>
      <button onClick={prevStep} disabled={isFirstStep}>
        Previous
      </button>
      <button onClick={nextStep} disabled={isLastStep}>
        Next
      </button>
    </div>
  );
}

describe('FormStepper', () => {
  const mockOnStepChange = vi.fn();

  afterEach(() => {
    mockOnStepChange.mockClear();
  });

  it('should render without crashing', () => {
    render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('should pass accessibility tests', async () => {
    const { container } = render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Personal Info" description="Enter your details">
          <input aria-label="Name" />
        </FormStep>
        <FormStep title="Contact Info" description="How to reach you">
          <input aria-label="Email" />
        </FormStep>
      </FormStepper>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should display progress indicator by default', () => {
    render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    expect(screen.getByRole('tablist', { name: /form steps/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /step 1/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /step 2/i })).toBeInTheDocument();
  });

  it('should hide progress indicator when showProgress is false', () => {
    render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange} showProgress={false}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('should render current step content', () => {
    render(
      <FormStepper currentStep={1} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
        <FormStep title="Step 3">Content 3</FormStep>
      </FormStepper>
    );

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('should display step titles and descriptions in progress indicator', () => {
    render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Personal Info" description="Enter your name">
          Content 1
        </FormStep>
        <FormStep title="Contact Details" description="Email and phone">
          Content 2
        </FormStep>
      </FormStepper>
    );

    expect(screen.getByText('Personal Info')).toBeInTheDocument();
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
    expect(screen.getByText('Contact Details')).toBeInTheDocument();
    expect(screen.getByText('Email and phone')).toBeInTheDocument();
  });

  it('should call onStepChange when clicking on progress step', async () => {
    const user = userEvent.setup();

    render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
        <FormStep title="Step 3">Content 3</FormStep>
      </FormStepper>
    );

    const step2Button = screen.getByRole('tab', { name: /step 2/i });
    await user.click(step2Button);

    expect(mockOnStepChange).toHaveBeenCalledWith(1);
  });

  it('should handle keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup();

    render(
      <FormStepper currentStep={1} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
        <FormStep title="Step 3">Content 3</FormStep>
      </FormStepper>
    );

    const currentTab = screen.getByRole('tab', { selected: true });

    // Arrow left - go to previous step
    await user.click(currentTab);
    await user.keyboard('{ArrowLeft}');
    expect(mockOnStepChange).toHaveBeenCalledWith(0);

    mockOnStepChange.mockClear();

    // Arrow right - go to next step
    await user.keyboard('{ArrowRight}');
    expect(mockOnStepChange).toHaveBeenCalledWith(2);
  });

  it('should handle Home and End keys for navigation', async () => {
    const user = userEvent.setup();

    render(
      <FormStepper currentStep={1} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
        <FormStep title="Step 3">Content 3</FormStep>
      </FormStepper>
    );

    const currentTab = screen.getByRole('tab', { selected: true });
    await user.click(currentTab);

    // Home - go to first step
    await user.keyboard('{Home}');
    expect(mockOnStepChange).toHaveBeenCalledWith(0);

    mockOnStepChange.mockClear();

    // End - go to last step
    await user.keyboard('{End}');
    expect(mockOnStepChange).toHaveBeenCalledWith(2);
  });

  it('should not navigate beyond boundaries with arrow keys', async () => {
    const user = userEvent.setup();

    render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    const currentTab = screen.getByRole('tab', { selected: true });
    await user.click(currentTab);

    // Try to go left from first step
    await user.keyboard('{ArrowLeft}');
    expect(mockOnStepChange).not.toHaveBeenCalled();
  });

  it('should mark steps as completed, current, or pending', () => {
    render(
      <FormStepper currentStep={1} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
        <FormStep title="Step 3">Content 3</FormStep>
      </FormStepper>
    );

    const tabs = screen.getAllByRole('tab');

    // Step 1 should be completed (index 0 < currentStep 1)
    expect(tabs[0].className).toContain('completed');

    // Step 2 should be current (index 1 === currentStep 1)
    expect(tabs[1].className).toContain('current');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-current', 'step');

    // Step 3 should be pending (index 2 > currentStep 1)
    expect(tabs[2].className).toContain('pending');
  });

  it('should set correct tabIndex for keyboard navigation', () => {
    render(
      <FormStepper currentStep={1} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
        <FormStep title="Step 3">Content 3</FormStep>
      </FormStepper>
    );

    const tabs = screen.getAllByRole('tab');

    // Only current step should be tabbable
    expect(tabs[0]).toHaveAttribute('tabindex', '-1');
    expect(tabs[1]).toHaveAttribute('tabindex', '0');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
  });

  it('should provide context values via useFormStep hook', () => {
    render(
      <FormStepper currentStep={1} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">
          <StepNavigation />
        </FormStep>
        <FormStep title="Step 2">
          <StepNavigation />
        </FormStep>
        <FormStep title="Step 3">
          <StepNavigation />
        </FormStep>
      </FormStepper>
    );

    expect(screen.getByTestId('step-info')).toHaveTextContent('Step 2 of 3');
  });

  it('should navigate using context methods', async () => {
    const user = userEvent.setup();

    render(
      <FormStepper currentStep={1} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">
          <StepNavigation />
        </FormStep>
        <FormStep title="Step 2">
          <StepNavigation />
        </FormStep>
        <FormStep title="Step 3">
          <StepNavigation />
        </FormStep>
      </FormStepper>
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(mockOnStepChange).toHaveBeenCalledWith(2);
  });

  it('should disable navigation at boundaries using context', () => {
    render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">
          <StepNavigation />
        </FormStep>
        <FormStep title="Step 2">
          <StepNavigation />
        </FormStep>
      </FormStepper>
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    const nextButton = screen.getByRole('button', { name: /next/i });

    expect(prevButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('should validate currentStep to stay within bounds', () => {
    const { rerender } = render(
      <FormStepper currentStep={-1} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    // Should render first step despite negative index
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    // Test upper bound
    rerender(
      <FormStepper currentStep={10} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    // Should render last step despite out-of-bounds index
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <FormStepper
        currentStep={0}
        onStepChange={mockOnStepChange}
        className="custom-class"
      >
        <FormStep title="Step 1">Content 1</FormStep>
      </FormStepper>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have live region for screen reader announcements', () => {
    render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Personal Info" description="Enter your details">
          Content 1
        </FormStep>
      </FormStepper>
    );

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  it('should announce step changes to screen readers', () => {
    const { rerender } = render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Personal Info" description="Enter your details">
          Content 1
        </FormStep>
        <FormStep title="Contact Details" description="Email and phone">
          Content 2
        </FormStep>
      </FormStepper>
    );

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveTextContent(
      'Step 1 of 2: Personal Info. Enter your details'
    );

    // Change step
    rerender(
      <FormStepper currentStep={1} onStepChange={mockOnStepChange}>
        <FormStep title="Personal Info" description="Enter your details">
          Content 1
        </FormStep>
        <FormStep title="Contact Details" description="Email and phone">
          Content 2
        </FormStep>
      </FormStepper>
    );

    expect(liveRegion).toHaveTextContent(
      'Step 2 of 2: Contact Details. Email and phone'
    );
  });

  it('should throw error when useFormStep is used outside FormStepper', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<StepNavigation />);
    }).toThrow('useFormStep must be used within a FormStepper');

    console.error = originalError;
  });

  it('should filter out non-FormStep children', () => {
    render(
      <FormStepper currentStep={0} onStepChange={mockOnStepChange}>
        <FormStep title="Step 1">Content 1</FormStep>
        <div>Not a FormStep</div>
        <FormStep title="Step 2">Content 2</FormStep>
      </FormStepper>
    );

    const tabs = screen.getAllByRole('tab');
    // Should only have 2 tabs for the 2 FormStep children
    expect(tabs).toHaveLength(2);
  });
});

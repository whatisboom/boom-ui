import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  // Basic Rendering
  it('should render all radio options', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} />);

    expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Option 3')).toBeInTheDocument();
  });

  it('should render with group label', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} label="Choose an option" />);

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('should check the selected radio', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="option2" onChange={handleChange} options={mockOptions} />);

    expect(screen.getByLabelText('Option 2')).toBeChecked();
    expect(screen.getByLabelText('Option 1')).not.toBeChecked();
  });

  it('should render radiogroup role', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} />);

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  // Orientation
  it('should render vertical by default', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} />);

    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup.className).toContain('vertical');
  });

  it('should render horizontal when specified', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} orientation="horizontal" />);

    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup.className).toContain('horizontal');
  });

  // Sizes
  it('should render different sizes', () => {
    const handleChange = vi.fn();
    const { rerender } = render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} size="sm" />);
    const parent1 = screen.getByLabelText('Option 1').parentElement;
    expect(parent1?.className).toContain('sm');

    rerender(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} size="lg" />);
    const parent2 = screen.getByLabelText('Option 1').parentElement;
    expect(parent2?.className).toContain('lg');
  });

  // User Interaction
  it('should call onChange with selected value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} />);

    await user.click(screen.getByLabelText('Option 2'));

    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} disabled />);

    await user.click(screen.getByLabelText('Option 2'));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should not select disabled option', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const optionsWithDisabled = [
      ...mockOptions,
      { value: 'option4', label: 'Option 4 (disabled)', disabled: true },
    ];
    render(<RadioGroup value="option1" onChange={handleChange} options={optionsWithDisabled} />);

    await user.click(screen.getByLabelText('Option 4 (disabled)'));

    expect(handleChange).not.toHaveBeenCalled();
  });

  // Error states
  it('should render error message', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="" onChange={handleChange} options={mockOptions} error="Please select an option" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Please select an option');
  });

  it('should set aria-invalid when error present', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="" onChange={handleChange} options={mockOptions} error="Required" />);

    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toHaveAttribute('aria-invalid', 'true');
  });

  it('should link error message with aria-describedby', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="" onChange={handleChange} options={mockOptions} id="group" error="Required" />);

    const radiogroup = screen.getByRole('radiogroup');
    const errorMessage = screen.getByRole('alert');
    expect(radiogroup).toHaveAttribute('aria-describedby', 'group-error');
    expect(errorMessage.id).toBe('group-error');
  });

  // Helper text
  it('should render helper text', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="" onChange={handleChange} options={mockOptions} helperText="Choose wisely" />);

    expect(screen.getByText('Choose wisely')).toBeInTheDocument();
  });

  it('should hide helper text when error present', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="" onChange={handleChange} options={mockOptions} helperText="Helper" error="Error" />);

    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  // Required
  it('should render required indicator', () => {
    const handleChange = vi.fn();
    render(<RadioGroup value="" onChange={handleChange} options={mockOptions} label="Choose" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  // Accessibility
  it('should have no accessibility violations (default)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} label="Choose option" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with error)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<RadioGroup value="" onChange={handleChange} options={mockOptions} label="Choose option" error="Required" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (disabled)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} disabled />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (horizontal)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<RadioGroup value="option1" onChange={handleChange} options={mockOptions} orientation="horizontal" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});

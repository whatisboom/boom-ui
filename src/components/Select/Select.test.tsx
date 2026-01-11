import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Select } from './Select';

describe('Select', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  // Basic Rendering
  it('should render select element', () => {
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} label="Choose option" />);

    expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
  });

  it('should render all options', () => {
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} />);

    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeInTheDocument();
  });

  it('should display selected value', () => {
    const handleChange = vi.fn();
    render(<Select value="option2" onChange={handleChange} options={mockOptions} />);

    expect(screen.getByRole('combobox')).toHaveValue('option2');
  });

  // Placeholder
  it('should render placeholder option', () => {
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} placeholder="Select an option" />);

    expect(screen.getByRole('option', { name: 'Select an option' })).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  // User Interaction
  it('should call onChange with selected value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} label="Select" />);

    await user.selectOptions(screen.getByLabelText('Select'), 'option2');

    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Select value="option1" onChange={handleChange} options={mockOptions} disabled label="Select" />);

    await user.selectOptions(screen.getByLabelText('Select'), 'option2');

    expect(handleChange).not.toHaveBeenCalled();
  });

  // Disabled options
  it('should render disabled options', () => {
    const handleChange = vi.fn();
    const optionsWithDisabled = [
      ...mockOptions,
      { value: 'option4', label: 'Option 4 (disabled)', disabled: true },
    ];
    render(<Select value="" onChange={handleChange} options={optionsWithDisabled} />);

    const option4 = screen.getByRole('option', { name: 'Option 4 (disabled)' });
    expect(option4).toBeDisabled();
  });

  // Sizes
  it('should render different sizes', () => {
    const handleChange = vi.fn();
    const { rerender } = render(<Select value="" onChange={handleChange} options={mockOptions} size="sm" />);
    expect(screen.getByRole('combobox').className).toContain('sm');

    rerender(<Select value="" onChange={handleChange} options={mockOptions} size="lg" />);
    expect(screen.getByRole('combobox').className).toContain('lg');
  });

  // Error states
  it('should render error message', () => {
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} error="Please select an option" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Please select an option');
  });

  it('should set aria-invalid when error present', () => {
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} error="Required" label="Select" />);

    expect(screen.getByLabelText('Select')).toHaveAttribute('aria-invalid', 'true');
  });

  // Helper text
  it('should render helper text', () => {
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} helperText="Choose wisely" />);

    expect(screen.getByText('Choose wisely')).toBeInTheDocument();
  });

  it('should hide helper text when error present', () => {
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} helperText="Helper" error="Error" />);

    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  // Required
  it('should render required indicator', () => {
    const handleChange = vi.fn();
    render(<Select value="" onChange={handleChange} options={mockOptions} label="Select" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  // Accessibility
  it('should have no accessibility violations (default)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Select value="option1" onChange={handleChange} options={mockOptions} label="Select" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with error)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Select value="" onChange={handleChange} options={mockOptions} label="Select" error="Required" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (disabled)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Select value="option1" onChange={handleChange} options={mockOptions} label="Select" disabled />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with placeholder)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Select value="" onChange={handleChange} options={mockOptions} label="Select" placeholder="Choose" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});

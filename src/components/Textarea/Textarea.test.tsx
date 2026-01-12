import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  // Basic Rendering
  it('should render textarea element', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} label="Description" />);

    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('should display value', () => {
    const handleChange = vi.fn();
    render(<Textarea value="Hello world" onChange={handleChange} />);

    expect(screen.getByRole('textbox')).toHaveValue('Hello world');
  });

  // User Interaction
  it('should call onChange with new value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} label="Comment" />);

    await user.type(screen.getByLabelText('Comment'), 'Test');

    expect(handleChange).toHaveBeenCalledWith('T');
  });

  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} disabled label="Comment" />);

    await user.type(screen.getByLabelText('Comment'), 'Test');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should not call onChange when readOnly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Textarea value="Read only" onChange={handleChange} readOnly label="Comment" />);

    await user.type(screen.getByLabelText('Comment'), 'Test');

    expect(handleChange).not.toHaveBeenCalled();
  });

  // Size variants
  it('should render different sizes', () => {
    const handleChange = vi.fn();
    const { rerender } = render(<Textarea value="" onChange={handleChange} size="sm" />);
    expect(screen.getByRole('textbox').className).toContain('sm');

    rerender(<Textarea value="" onChange={handleChange} size="lg" />);
    expect(screen.getByRole('textbox').className).toContain('lg');
  });

  // Error states
  it('should render error message', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} error="This field is required" />);

    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('should set aria-invalid when error present', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} error="Required" label="Comment" />);

    expect(screen.getByLabelText('Comment')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should link error message with aria-describedby', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} id="comment" error="Required" label="Comment" />);

    const textarea = screen.getByLabelText('Comment');
    const errorMessage = screen.getByRole('alert');
    expect(textarea).toHaveAttribute('aria-describedby', errorMessage.id);
    expect(errorMessage.id).toBe('comment-error');
  });

  // Helper text
  it('should render helper text', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} helperText="Max 500 characters" />);

    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });

  it('should hide helper text when error present', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} helperText="Helper" error="Error" />);

    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  // Required
  it('should render required indicator', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} label="Comment" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  // Placeholder
  it('should render placeholder', () => {
    const handleChange = vi.fn();
    render(<Textarea value="" onChange={handleChange} placeholder="Enter your comment" />);

    expect(screen.getByPlaceholderText('Enter your comment')).toBeInTheDocument();
  });

  // Resize
  it('should apply resize classes', () => {
    const handleChange = vi.fn();
    const { rerender } = render(<Textarea value="" onChange={handleChange} resize="none" />);
    expect(screen.getByRole('textbox').className).toContain('resizeNone');

    rerender(<Textarea value="" onChange={handleChange} resize="vertical" />);
    expect(screen.getByRole('textbox').className).toContain('resizeVertical');
  });

  // Accessibility
  it('should have no accessibility violations (default)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Textarea value="" onChange={handleChange} label="Comment" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with error)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Textarea value="" onChange={handleChange} label="Comment" error="Required" />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (disabled)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Textarea value="" onChange={handleChange} label="Comment" disabled />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (with helper text)', async () => {
    const handleChange = vi.fn();
    const { container } = render(<Textarea value="" onChange={handleChange} label="Comment" helperText="Helper" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});

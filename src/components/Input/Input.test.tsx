import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Input } from './Input';
import styles from './Input.module.css';

describe('Input', () => {
  // Basic Rendering Tests
  it('should render input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    render(<Input placeholder="Enter your name" />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('should associate label with input using htmlFor/id', () => {
    render(<Input label="Email" id="email-input" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('should auto-generate id when not provided', () => {
    render(<Input label="Username" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('id');
    expect(input.getAttribute('id')).toBeTruthy();
  });

  // Size Variants
  it('should render with different sizes', () => {
    const { rerender } = render(<Input size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass(styles.sm);

    rerender(<Input size="md" />);
    expect(screen.getByRole('textbox')).toHaveClass(styles.md);

    rerender(<Input size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass(styles.lg);
  });

  it('should default to md size', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveClass(styles.md);
  });

  // State Props
  it('should render disabled state', () => {
    render(<Input disabled label="Disabled Input" />);
    expect(screen.getByLabelText('Disabled Input')).toBeDisabled();
  });

  it('should render readonly state', () => {
    render(<Input readOnly label="Readonly Input" />);
    const input = screen.getByLabelText('Readonly Input');
    expect(input).toHaveAttribute('readonly');
  });

  it('should render required indicator', () => {
    render(<Input label="Required Field" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render with error message', () => {
    render(<Input label="Email" error="Invalid email address" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address');
  });

  it('should set aria-invalid when error is present', () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should link error message with aria-describedby', () => {
    render(<Input label="Email" id="email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    const errorMessage = screen.getByRole('alert');
    expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
  });

  it('should render helper text', () => {
    render(<Input label="Password" helperText="Must be at least 8 characters" />);
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument();
  });

  it('should hide helper text when error is present', () => {
    render(
      <Input
        label="Email"
        helperText="Enter your email"
        error="Invalid email"
      />
    );
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  // Icons
  it('should render left icon', () => {
    render(<Input leftIcon={<span data-testid="left-icon">@</span>} />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('should render right icon', () => {
    render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  // Events
  it('should handle onChange events', async () => {
    const user = userEvent.setup();
    let value = '';
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value;
    };

    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'test');
    expect(value).toBe('test');
  });

  it('should handle onBlur events', async () => {
    const user = userEvent.setup();
    let blurred = false;
    const handleBlur = () => { blurred = true; };

    render(<Input onBlur={handleBlur} />);
    const input = screen.getByRole('textbox');

    await user.click(input);
    await user.tab();
    expect(blurred).toBe(true);
  });

  it('should handle onFocus events', async () => {
    const user = userEvent.setup();
    let focused = false;
    const handleFocus = () => { focused = true; };

    render(<Input onFocus={handleFocus} />);
    const input = screen.getByRole('textbox');

    await user.click(input);
    expect(focused).toBe(true);
  });

  it('should not trigger onChange when disabled', async () => {
    const user = userEvent.setup();
    let changed = false;
    const handleChange = () => { changed = true; };

    render(<Input disabled onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'test');
    expect(changed).toBe(false);
  });

  // Layout
  it('should render full width', () => {
    const { container } = render(<Input fullWidth />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(styles.fullWidth);
  });

  // Input Types
  it('should support different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();

    rerender(<Input type="number" />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  // Accessibility
  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Input label="Username" helperText="Enter your username" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with error', async () => {
    const { container } = render(
      <Input label="Email" error="Invalid email address" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const { container } = render(
      <Input label="Disabled Field" disabled />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations when required', async () => {
    const { container } = render(
      <Input label="Required Field" required />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('should work with controlled value', () => {
    const { rerender } = render(<Input value="initial" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('initial');

    rerender(<Input value="updated" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('updated');
  });

  it('should forward ref to input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.tagName).toBe('INPUT');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Switch } from './Switch';
import styles from './Switch.module.css';

describe('Switch', () => {
  // Basic Rendering Tests
  it('should render switch element with role', () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);

    const switchEl = screen.getByRole('switch');
    expect(switchEl).toBeInTheDocument();
    expect(switchEl).toHaveAttribute('type', 'checkbox');
  });

  it('should render with label', () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} label="Enable notifications" />);

    expect(screen.getByLabelText('Enable notifications')).toBeInTheDocument();
  });

  it('should render checked state', () => {
    const handleChange = vi.fn();
    render(<Switch checked={true} onChange={handleChange} />);

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('should render unchecked state', () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} />);

    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('should auto-generate id for aria-describedby when not provided', () => {
    const handleChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Dark mode"
        helperText="Switch between light and dark themes"
      />
    );

    const switchEl = screen.getByRole('switch');
    const helperText = screen.getByText('Switch between light and dark themes');
    expect(switchEl).toHaveAttribute('aria-describedby', helperText.id);
    expect(helperText.id).toBeTruthy();
  });

  it('should use provided id for error and helper text ids', () => {
    const handleChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Accept"
        id="terms"
        error="Required field"
      />
    );

    const switchEl = screen.getByRole('switch');
    const errorMessage = screen.getByRole('alert');
    expect(errorMessage.id).toBe('terms-error');
    expect(switchEl).toHaveAttribute('aria-describedby', 'terms-error');
  });

  // Size Variants
  it('should render with different sizes', () => {
    const handleChange = vi.fn();
    const { rerender, container } = render(
      <Switch checked={false} onChange={handleChange} size="sm" />
    );
    expect(container.querySelector(`.${styles.sm}`)).toBeInTheDocument();

    rerender(<Switch checked={false} onChange={handleChange} size="md" />);
    expect(container.querySelector(`.${styles.md}`)).toBeInTheDocument();

    rerender(<Switch checked={false} onChange={handleChange} size="lg" />);
    expect(container.querySelector(`.${styles.lg}`)).toBeInTheDocument();
  });

  it('should default to md size', () => {
    const handleChange = vi.fn();
    const { container } = render(<Switch checked={false} onChange={handleChange} />);

    expect(container.querySelector(`.${styles.md}`)).toBeInTheDocument();
  });

  // Label Position
  it('should render label on the right by default', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Switch checked={false} onChange={handleChange} label="Right label" />
    );

    expect(container.querySelector(`.${styles.labelLeft}`)).not.toBeInTheDocument();
  });

  it('should render label on the left when specified', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Left label"
        labelPosition="left"
      />
    );

    expect(container.querySelector(`.${styles.labelLeft}`)).toBeInTheDocument();
  });

  // State Props
  it('should render disabled state', () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} disabled label="Disabled" />);

    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('should render required indicator', () => {
    const handleChange = vi.fn();
    render(<Switch checked={false} onChange={handleChange} label="Required" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render with error message', () => {
    const handleChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Terms"
        error="You must accept the terms"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('You must accept the terms');
  });

  it('should set aria-invalid when error is present', () => {
    const handleChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Terms"
        error="Required"
      />
    );

    const switchEl = screen.getByLabelText('Terms');
    expect(switchEl).toHaveAttribute('aria-invalid', 'true');
  });

  it('should link error message with aria-describedby', () => {
    const handleChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Terms"
        id="terms"
        error="Required"
      />
    );

    const switchEl = screen.getByLabelText('Terms');
    const errorMessage = screen.getByRole('alert');
    expect(switchEl).toHaveAttribute('aria-describedby', errorMessage.id);
  });

  it('should render helper text', () => {
    const handleChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Notifications"
        helperText="Receive push notifications"
      />
    );

    expect(screen.getByText('Receive push notifications')).toBeInTheDocument();
  });

  it('should hide helper text when error is present', () => {
    const handleChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Terms"
        helperText="Please accept"
        error="Required field"
      />
    );

    expect(screen.queryByText('Please accept')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  // Layout
  it('should render full width', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Switch checked={false} onChange={handleChange} fullWidth />
    );

    expect(container.querySelector(`.${styles.fullWidth}`)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Switch checked={false} onChange={handleChange} className="custom-switch" />
    );

    expect(container.querySelector('.custom-switch')).toBeInTheDocument();
  });

  // User Interaction
  it('should call onChange with true when clicked to turn on', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch checked={false} onChange={handleChange} label="Click me" />);

    await user.click(screen.getByLabelText('Click me'));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should call onChange with false when clicked to turn off', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch checked={true} onChange={handleChange} label="Click me" />);

    await user.click(screen.getByLabelText('Click me'));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch checked={false} onChange={handleChange} disabled label="Disabled" />);

    await user.click(screen.getByLabelText('Disabled'));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should toggle with keyboard space key', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch checked={false} onChange={handleChange} label="Press space" />);

    const switchEl = screen.getByRole('switch');
    switchEl.focus();

    await user.keyboard(' ');

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should not respond to keyboard when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Switch checked={false} onChange={handleChange} disabled label="Disabled" />);

    const switchEl = screen.getByRole('switch');
    switchEl.focus();

    await user.keyboard(' ');

    expect(handleChange).not.toHaveBeenCalled();
  });

  // Accessibility Tests
  it('should have no accessibility violations (unchecked)', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Enable dark mode"
        helperText="Switch between light and dark themes"
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations (checked)', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Switch
        checked={true}
        onChange={handleChange}
        label="Notifications enabled"
        helperText="You will receive push notifications"
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations when disabled', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Disabled option"
        disabled
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('should have no accessibility violations with error', async () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Switch
        checked={false}
        onChange={handleChange}
        label="Accept terms"
        error="You must accept to continue"
      />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
